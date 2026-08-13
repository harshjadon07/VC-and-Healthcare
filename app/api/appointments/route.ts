import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { saveAppointmentToSupabase, getAppointmentsFromSupabase, updateAppointmentInSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseAppointments = await getAppointmentsFromSupabase();
    if (supabaseAppointments && supabaseAppointments.length > 0) {
      // Map Supabase column names to frontend interface format
      const formatted = supabaseAppointments.map((item: any) => ({
        id: item.token_number || item.id,
        name: item.patient_name,
        age: item.age,
        gender: item.gender,
        village: item.village,
        district: item.district,
        phone: item.phone,
        chiefComplaint: item.chief_complaint,
        triageLevel: item.triage_level,
        status: item.status,
        vitals: item.vitals || { bp: '120/80 mmHg', temp: '98.6 °F', heartRate: '75 bpm', spo2: '98%' },
        aiSummary: item.ai_summary,
        symptoms: item.symptoms || [item.chief_complaint],
        patientAdvice: item.patient_advice,
        recommendedActions: item.recommended_actions || [],
        prescription: item.prescription,
        emergencyAlertTriggered: item.triage_level === 'EMERGENCY',
        history: ['Hypertension', 'No known allergies'],
        time: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'
      }));
      return NextResponse.json(formatted, { status: 200 });
    }

    const appointments = await db.getAppointments();
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Create local token appointment
    const created = await db.addAppointment(body);

    // 2. Save appointment record into user's Supabase backend tables
    const supabaseResult = await saveAppointmentToSupabase({
      patient_name: body.name || body.patientName || 'Rural Patient',
      age: body.age || 40,
      gender: body.gender || 'Female',
      village: body.village || 'Khed Shivapur',
      district: body.district || 'Lucknow',
      phone: body.phone || '+91 98223 45678',
      chief_complaint: body.chiefComplaint || body.symptoms || 'General Health Consultation',
      triage_level: body.triageLevel || 'ROUTINE',
      status: 'SCHEDULED',
      vitals: body.vitals,
      ai_summary: body.aiSummary || '',
      symptoms: body.symptoms || [body.chiefComplaint],
      patient_advice: body.patientAdvice || '',
      recommended_actions: body.recommendedActions || [],
      token_number: created.id
    });

    return NextResponse.json({
      success: true,
      appointment: created,
      supabaseStatus: supabaseResult
    }, { status: 201 });
  } catch (error) {
    console.error('Appointment POST Error:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, prescription } = body;

    if (!id || !prescription) {
      return NextResponse.json({ error: 'ID and prescription text are required.' }, { status: 400 });
    }

    const updated = await db.updateAppointmentPrescription(id, prescription);
    
    // Also update in Supabase backend
    await updateAppointmentInSupabase(id, { prescription, status: 'COMPLETED' });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 });
  }
}

