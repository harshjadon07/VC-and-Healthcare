import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const appointments = await db.getAppointments();
    return NextResponse.json(appointments, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await db.addAppointment(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
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
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update prescription' }, { status: 500 });
  }
}
