import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

export async function POST() {
  try {
    const freshDb = resetDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database reset to initial enterprise demo state.',
      dealCount: freshDb.deals.length,
      memoryCount: freshDb.memories.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
