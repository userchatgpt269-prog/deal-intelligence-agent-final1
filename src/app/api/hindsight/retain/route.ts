import { NextRequest, NextResponse } from 'next/server';
import { retainMemory } from '@/lib/hindsight';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId || !body.content) {
      return NextResponse.json(
        { success: false, error: 'dealId and content are required' },
        { status: 400 }
      );
    }

    const result = await retainMemory(
      body.dealId,
      body.content,
      body.type || 'Observation',
      body.sourceInteractionId,
      body.metadata
    );

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
