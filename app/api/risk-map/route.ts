import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';

export async function GET() {
  try {
    const alerts = await db.getRiskAlerts();
    return NextResponse.json({
      sector: "Satara & Pune Rural Health Circle",
      updatedAt: new Date().toLocaleTimeString(),
      alerts,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch risk map data' }, { status: 500 });
  }
}
