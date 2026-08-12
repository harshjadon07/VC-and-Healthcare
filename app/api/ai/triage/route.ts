import { NextRequest, NextResponse } from 'next/server';
import { evaluateClinicalSafety } from '@/lib/safety-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptoms, language = 'en' } = body;

    if (!symptoms || typeof symptoms !== 'string') {
      return NextResponse.json({ error: 'Symptoms description is required.' }, { status: 400 });
    }

    // Run Safety Engine (Deterministic Red-Flag Triggers + Clinical Assessment)
    const result = evaluateClinicalSafety(symptoms, language);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in AI Triage API:', error);
    return NextResponse.json({ error: 'Internal AI Triage Service Error' }, { status: 500 });
  }
}
