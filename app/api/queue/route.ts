import { NextRequest, NextResponse } from 'next/server';
import { getTokenQueue, createTokenTicket, findTokenByNumber, updateTokenStatus, TokenTicket } from '@/lib/token-queue';

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

// POST /api/queue -> Generates new unique Patient Token Ticket
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newToken = createTokenTicket(body);
    return NextResponse.json({ success: true, message: 'Token Ticket generated', ticket: newToken }, { status: 201 });
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
    if (updated) {
      return NextResponse.json({ success: true, message: 'Token updated', ticket: updated }, { status: 200 });
    }
    return NextResponse.json({ success: false, error: 'Token not found' }, { status: 404 });
  } catch (error) {
    console.error('Update Token API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update token' }, { status: 500 });
  }
}
