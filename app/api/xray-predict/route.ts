import { NextRequest, NextResponse } from 'next/server';
import { saveAppointmentToSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

const DEFAULT_GRADIO_URL = 'https://623a7d62937c60c507.gradio.live/';

function parseGradioReport(rawText: string) {
  const conditionMatch = rawText.match(/Condition:\s*([^\n]+)/i);
  const confidenceMatch = rawText.match(/Confidence:\s*([0-9.]+)%/i);
  const noteMatch = rawText.match(/Preliminary Note:\s*([\s\S]*?)(?=⚠️|$)/i);

  const classification = conditionMatch
    ? conditionMatch[1].trim()
    : rawText.toLowerCase().includes('pneumonia')
    ? 'PNEUMONIA'
    : 'NORMAL';

  let confidence = 0.95;
  if (confidenceMatch) {
    confidence = parseFloat(confidenceMatch[1]) / 100;
  }

  const note = noteMatch ? noteMatch[1].trim() : rawText.trim();

  let riskLevel = 'ROUTINE';
  if (classification.toUpperCase().includes('PNEUMONIA')) {
    riskLevel = confidence > 0.7 ? 'HIGH' : 'URGENT';
  } else if (classification.toUpperCase().includes('NORMAL')) {
    riskLevel = 'ROUTINE';
  } else {
    riskLevel = 'URGENT';
  }

  return {
    classification: classification.toUpperCase(),
    confidence,
    risk_level: riskLevel,
    recommendation: note || `Screening result: ${classification}. Please consult with a physician for clinical correlation.`,
    rawReport: rawText,
  };
}

async function callGradioServer(gradioBaseUrl: string, buffer: Buffer, fileName: string, mimeType: string) {
  const baseUrl = gradioBaseUrl.replace(/\/+$/, '').replace(/\/gradio_api.*$/, '').replace(/\/predict.*$/, '');

  // 1. Upload image to /gradio_api/upload
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  const uploadFormData = new FormData();
  uploadFormData.append('files', blob, fileName || 'xray_scan.png');

  const uploadRes = await fetch(`${baseUrl}/gradio_api/upload`, {
    method: 'POST',
    body: uploadFormData,
  });

  if (!uploadRes.ok) {
    throw new Error(`Gradio upload failed with HTTP status ${uploadRes.status}`);
  }

  const uploadData = await uploadRes.json();
  const filePath = Array.isArray(uploadData) ? uploadData[0] : (uploadData?.path || uploadData);

  // 2. Discover endpoint name or fallback to 'predict_xray'
  let endpointName = 'predict_xray';
  try {
    const infoRes = await fetch(`${baseUrl}/gradio_api/info`);
    if (infoRes.ok) {
      const infoData = await infoRes.json();
      if (infoData.named_endpoints) {
        const keys = Object.keys(infoData.named_endpoints);
        if (keys.length > 0) {
          endpointName = keys[0].replace(/^\//, '');
        }
      }
    }
  } catch {
    // fallback
  }

  // 3. Post job to /gradio_api/call/{endpointName}
  const callRes = await fetch(`${baseUrl}/gradio_api/call/${endpointName}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      data: [{ path: filePath, meta: { _type: 'gradio.FileData' } }]
    })
  });

  if (!callRes.ok) {
    throw new Error(`Gradio prediction call failed with HTTP status ${callRes.status}`);
  }

  const callData = await callRes.json();
  const eventId = callData.event_id;
  if (!eventId) {
    throw new Error('No event_id received from Gradio backend');
  }

  // 4. Listen for completion stream
  const streamRes = await fetch(`${baseUrl}/gradio_api/call/${endpointName}/${eventId}`);
  const streamText = await streamRes.text();

  const dataLines = streamText.split('\n').filter(line => line.startsWith('data:'));
  if (dataLines.length === 0) {
    throw new Error('No data output returned from Gradio event stream');
  }

  const lastLine = dataLines[dataLines.length - 1].replace(/^data:\s*/, '').trim();
  const parsedData = JSON.parse(lastLine);
  const rawOutput = Array.isArray(parsedData) ? parsedData[0] : parsedData;
  return typeof rawOutput === 'string' ? rawOutput : JSON.stringify(rawOutput);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const serverUrlInput =
      (formData.get('serverUrl') as string) ||
      process.env.LOCAL_XRAY_SERVER_URL ||
      DEFAULT_GRADIO_URL;
    const patientName = (formData.get('patientName') as string) || 'Rural Resident';

    if (!file) {
      return NextResponse.json({ error: 'No X-Ray image file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const cleanServerUrl = serverUrlInput.trim();

    // Check if target is Gradio server
    const isGradioUrl =
      cleanServerUrl.includes('gradio.live') ||
      cleanServerUrl.includes('hf.space') ||
      cleanServerUrl.includes('7860') ||
      cleanServerUrl.includes('7862') ||
      cleanServerUrl.includes('gradio');

    if (isGradioUrl) {
      try {
        const rawOutput = await callGradioServer(cleanServerUrl, buffer, file.name, mimeType);
        const parsedReport = parseGradioReport(rawOutput);

        const resultPayload = {
          classification: parsedReport.classification,
          confidence: parsedReport.confidence,
          risk_level: parsedReport.risk_level,
          recommendation: parsedReport.recommendation,
          serverSource: `Gradio AI Server (${cleanServerUrl})`,
          isLocalServer: true,
          rawReport: parsedReport.rawReport,
        };

        // Save diagnosis to Supabase
        await saveAppointmentToSupabase({
          patient_name: patientName,
          chief_complaint: `Chest X-Ray Analysis (${resultPayload.classification})`,
          triage_level:
            resultPayload.risk_level === 'HIGH' || resultPayload.risk_level === 'EMERGENCY'
              ? 'EMERGENCY'
              : resultPayload.risk_level === 'MODERATE' || resultPayload.risk_level === 'URGENT'
              ? 'URGENT'
              : 'ROUTINE',
          ai_summary: `X-Ray Result: ${resultPayload.classification} (Confidence: ${Math.round(
            resultPayload.confidence * 100
          )}%). ${resultPayload.recommendation}`,
          symptoms: [resultPayload.classification, `Confidence: ${Math.round(resultPayload.confidence * 100)}%`],
          patient_advice: resultPayload.recommendation,
          recommended_actions: [
            `Server Source: ${resultPayload.serverSource}`,
            `Risk Level: ${resultPayload.risk_level}`,
            `Recommended Action: ${resultPayload.recommendation}`,
          ],
        });

        return NextResponse.json(resultPayload, { status: 200 });
      } catch (gradioErr: any) {
        console.error('Gradio Server error:', gradioErr);
        return NextResponse.json(
          {
            error: `Gradio Server (${cleanServerUrl}) error: ${gradioErr.message || 'Server unreachable'}.`,
          },
          { status: 502 }
        );
      }
    }

    // Direct Flask / FastAPI REST Server Endpoint
    const localFormData = new FormData();
    const fileBlob = new Blob([new Uint8Array(buffer)], { type: mimeType });
    localFormData.append('file', fileBlob, file.name);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      const localRes = await fetch(cleanServerUrl, {
        method: 'POST',
        body: localFormData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (localRes.ok) {
        const localJson = await localRes.json();
        const resultPayload = {
          classification: localJson.classification || 'PNEUMONIA',
          confidence: typeof localJson.confidence === 'number' ? localJson.confidence : 0.95,
          risk_level: localJson.risk_level || 'HIGH',
          recommendation: localJson.recommendation || 'Immediate medical attention recommended',
          serverSource: `Local LLM Server (${cleanServerUrl})`,
          isLocalServer: true,
        };

        await saveAppointmentToSupabase({
          patient_name: patientName,
          chief_complaint: `Chest X-Ray Analysis (${resultPayload.classification})`,
          triage_level:
            resultPayload.risk_level === 'HIGH' || resultPayload.risk_level === 'EMERGENCY'
              ? 'EMERGENCY'
              : resultPayload.risk_level === 'MODERATE' || resultPayload.risk_level === 'URGENT'
              ? 'URGENT'
              : 'ROUTINE',
          ai_summary: `X-Ray Result: ${resultPayload.classification} (Confidence: ${Math.round(
            resultPayload.confidence * 100
          )}%). ${resultPayload.recommendation}`,
          symptoms: [resultPayload.classification, `Confidence: ${Math.round(resultPayload.confidence * 100)}%`],
          patient_advice: resultPayload.recommendation,
          recommended_actions: [
            `Server Source: ${resultPayload.serverSource}`,
            `Risk Level: ${resultPayload.risk_level}`,
            `Recommended Action: ${resultPayload.recommendation}`,
          ],
        });

        return NextResponse.json(resultPayload, { status: 200 });
      } else {
        return NextResponse.json(
          {
            error: `Local LLM Server (${cleanServerUrl}) returned HTTP status ${localRes.status}.`,
          },
          { status: localRes.status }
        );
      }
    } catch (localErr: any) {
      clearTimeout(timeoutId);
      console.error(`Local X-Ray server (${cleanServerUrl}) connection error:`, localErr);
      return NextResponse.json(
        {
          error: `Server (${cleanServerUrl}) is unreachable. Please verify server URL or start your Python model.`,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('X-Ray Predict API Error:', error);
    return NextResponse.json({ error: 'Failed to process Chest X-Ray image upload' }, { status: 500 });
  }
}

