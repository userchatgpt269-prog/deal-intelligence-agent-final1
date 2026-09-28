import { NextRequest, NextResponse } from 'next/server';
import { getDealById, updateDeal, deleteDeal } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deal = getDealById(params.id);
    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deal });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = updateDeal(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deal: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteDeal(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deal deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
