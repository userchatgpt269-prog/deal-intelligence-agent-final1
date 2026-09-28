import { NextRequest, NextResponse } from 'next/server';
import { generateMeetingPrepBrief } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId) {
      return NextResponse.json({ success: false, error: 'dealId is required' }, { status: 400 });
    }

    const brief = await generateMeetingPrepBrief(body.dealId);
    return NextResponse.json({ success: true, brief });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
