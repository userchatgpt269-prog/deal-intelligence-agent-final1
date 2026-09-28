import { NextRequest, NextResponse } from 'next/server';
import { chatWithDealAgent } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId || !body.question) {
      return NextResponse.json(
        { success: false, error: 'dealId and question are required' },
        { status: 400 }
      );
    }

    const result = await chatWithDealAgent(body.dealId, body.question, body.chatHistory || []);
    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
