import { NextRequest, NextResponse } from 'next/server';
import { recallMemories } from '@/lib/hindsight';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId || !body.query) {
      return NextResponse.json(
        { success: false, error: 'dealId and query are required' },
        { status: 400 }
      );
    }

    const result = await recallMemories(body.dealId, body.query, {
      limit: body.limit || 8,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
