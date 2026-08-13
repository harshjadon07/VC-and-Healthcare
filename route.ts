import { NextRequest, NextResponse } from 'next/server';
import { saveAppointmentToSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const serverUrlInput = (formData.get('serverUrl') as string) || process.env.LOCAL_XRAY_SERVER_URL || 'https://a8b73a4ba7d3b4910a.gradio.live/';
    const patientName = (formData.get('patientName') as string) || 'Rural Resident';

    if (!file) {
      return NextResponse.json({ error: 'No X-Ray image file provided.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';

    // Send file POST request to Gradio Live / Local LLM Server (https://a8b73a4ba7d3b4910a.gradio.live/)
    const localFormData = new FormData();
    const fileBlob = new Blob([buffer], { type: mimeType });
    localFormData.append('file', fileBlob, file.name);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    try {
      const localRes = await fetch(serverUrlInput, {
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
          serverSource: `AI Diagnostic Server (${serverUrlInput})`,
          isLocalServer: true
        };

        // Save X-Ray Diagnosis to Supabase Backend
        await saveAppointmentToSupabase({
          patient_name: patientName,
          chief_complaint: `Chest X-Ray Analysis (${resultPayload.classification})`,
          triage_level: resultPayload.risk_level === 'HIGH' || resultPayload.risk_level === 'EMERGENCY' ? 'EMERGENCY' : 
                        resultPayload.risk_level === 'MODERATE' || resultPayload.risk_level === 'URGENT' ? 'URGENT' : 'ROUTINE',
          ai_summary: `X-Ray Result: ${resultPayload.classification} (Confidence: ${Math.round(resultPayload.confidence * 100)}%). ${resultPayload.recommendation}`,
          symptoms: [resultPayload.classification, `Confidence: ${Math.round(resultPayload.confidence * 100)}%`],
          patient_advice: resultPayload.recommendation,
          recommended_actions: [
            `Server Source: ${resultPayload.serverSource}`,
            `Risk Level: ${resultPayload.risk_level}`,
            `Recommended Action: ${resultPayload.recommendation}`
          ]
        });

        return NextResponse.json(resultPayload, { status: 200 });
      } else {
        return NextResponse.json({
          error: `AI Diagnostic Server (${serverUrlInput}) returned HTTP status ${localRes.status}.`
        }, { status: localRes.status });
      }
    } catch (localErr: any) {
      clearTimeout(timeoutId);
      console.error(`X-Ray server (${serverUrlInput}) connection error:`, localErr);
      return NextResponse.json({
        error: `AI Diagnostic Server (${serverUrlInput}) is offline or unreachable.`
      }, { status: 503 });
    }
  } catch (error) {
    console.error('X-Ray Predict API Error:', error);
    return NextResponse.json({ error: 'Failed to process Chest X-Ray image upload' }, { status: 500 });
  }
}
