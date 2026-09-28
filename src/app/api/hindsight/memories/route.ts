import { NextRequest, NextResponse } from 'next/server';
import { getStoredMemories } from '@/lib/db';
import { getBankIdForDeal, getHindsightClient } from '@/lib/hindsight';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get('dealId') || undefined;
    const memories = getStoredMemories(dealId);
    const bankId = dealId ? getBankIdForDeal(dealId) : 'all-banks';
    const isCloudConnected = getHindsightClient() !== null;

    return NextResponse.json({
      success: true,
      bankId,
      isCloudConnected,
      count: memories.length,
      memories,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
