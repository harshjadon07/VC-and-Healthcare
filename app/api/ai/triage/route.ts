import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGemini } from '@/lib/gemini';
import { createTokenTicket } from '@/lib/token-queue';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptoms, language = 'en', attachmentName, attachmentData, mimeType, patientName, age, gender, village, phone } = body;

    if (!symptoms || typeof symptoms !== 'string') {
      return NextResponse.json({ error: 'Symptoms description is required.' }, { status: 400 });
    }

    // Call Gemini AI Model with multimodal support (or Safety Engine fallback)
    const result = await analyzeWithGemini(symptoms, language, {
      name: attachmentName,
      base64Data: attachmentData,
      mimeType,
    });

    // Automatically generate Unique Patient Token Ticket
    const ticket = createTokenTicket({
      patientName: patientName || 'Rural Patient',
      age: age || 42,
      gender: gender || 'Female',
      village: village || 'Khed Shivapur',
      phone: phone || '+91 98223 45678',
      chiefComplaint: symptoms,
      triageLevel: result.triageLevel,
      aiSummary: result.summary,
      symptoms: result.symptomsDetected || [symptoms],
      patientAdvice: result.patientAdvice,
      recommendedActions: result.recommendedActions || []
    });

    return NextResponse.json({
      ...result,
      tokenNumber: ticket.tokenNumber,
      ticket
    }, { status: 200 });
  } catch (error) {
    console.error('Error in AI Triage API:', error);
    return NextResponse.json({ error: 'Internal AI Triage Service Error' }, { status: 500 });
  }
}
