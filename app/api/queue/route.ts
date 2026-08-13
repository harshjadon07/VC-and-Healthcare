import { NextRequest, NextResponse } from 'next/server';
import { getTokenQueue, createTokenTicket, findTokenByNumber, updateTokenStatus } from '@/lib/token-queue';
import { saveAppointmentToSupabase, updateAppointmentInSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/queue -> Returns all tickets or specific ticket by ?token=SEVA-TK-XXXXXX
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tokenParam = searchParams.get('token');

    if (tokenParam) {
      const ticket = findTokenByNumber(tokenParam);
      if (ticket) {
        return NextResponse.json({ success: true, ticket }, { status: 200 });
      }
      return NextResponse.json({ success: false, error: 'Invalid or expired Token Number' }, { status: 404 });
    }

    const queue = getTokenQueue();
    return NextResponse.json({ success: true, count: queue.length, queue }, { status: 200 });
  } catch (error) {
    console.error('Queue API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch queue' }, { status: 500 });
  }
}

// POST /api/queue -> Generates new unique Patient Token Ticket & saves to Supabase
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newToken = createTokenTicket(body);

    // Save to Supabase Backend
    await saveAppointmentToSupabase({
      patient_name: newToken.patientName,
      age: newToken.age,
      gender: newToken.gender,
      village: newToken.village,
      district: newToken.district,
      phone: newToken.phone,
      chief_complaint: newToken.chiefComplaint,
      triage_level: newToken.triageLevel,
      status: newToken.status,
      vitals: newToken.vitals,
      ai_summary: newToken.aiSummary,
      symptoms: newToken.symptoms,
      patient_advice: newToken.patientAdvice,
      recommended_actions: newToken.recommendedActions,
      token_number: newToken.tokenNumber
    });

    return NextResponse.json({ success: true, message: 'Token Ticket generated & saved to Supabase', ticket: newToken }, { status: 201 });
  } catch (error) {
    console.error('Create Token API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate token' }, { status: 500 });
  }
}

// PATCH /api/queue -> Updates status or prescription for a token
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { tokenNumber, status, prescription } = body;

    if (!tokenNumber) {
      return NextResponse.json({ success: false, error: 'Token Number required' }, { status: 400 });
    }

    const updated = updateTokenStatus(tokenNumber, status, prescription);
    
    // Also update in Supabase backend
    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (prescription) updates.prescription = prescription;
    await updateAppointmentInSupabase(tokenNumber, updates);

    if (updated) {
      return NextResponse.json({ success: true, message: 'Token updated & synced to Supabase', ticket: updated }, { status: 200 });
    }
    return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
  } catch (error) {
    console.error('Update Token API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update token' }, { status: 500 });
  }
}

