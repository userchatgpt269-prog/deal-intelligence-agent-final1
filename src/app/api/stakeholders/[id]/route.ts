import { NextRequest, NextResponse } from 'next/server';
import { updateStakeholder, deleteStakeholder } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = updateStakeholder(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Stakeholder not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, stakeholder: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteStakeholder(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Stakeholder not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Stakeholder deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
