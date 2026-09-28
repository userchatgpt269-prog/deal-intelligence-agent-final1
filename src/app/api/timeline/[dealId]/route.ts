import { NextRequest, NextResponse } from 'next/server';
import { getDealEvents } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { dealId: string } }) {
  try {
    const events = getDealEvents(params.dealId);
    return NextResponse.json({ success: true, count: events.length, events });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
