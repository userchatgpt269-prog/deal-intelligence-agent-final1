import { NextRequest, NextResponse } from 'next/server';
import { deleteInteraction } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = deleteInteraction(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Interaction not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Interaction deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
