import { NextRequest, NextResponse } from 'next/server';
import { getTasks, createTask } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get('dealId') || undefined;
    const tasks = getTasks(dealId);
    return NextResponse.json({ success: true, count: tasks.length, tasks });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId || !body.task) {
      return NextResponse.json(
        { success: false, error: 'dealId and task description are required' },
        { status: 400 }
      );
    }

    const task = createTask({
      dealId: body.dealId,
      stakeholderId: body.stakeholderId || undefined,
      task: body.task,
      owner: body.owner || 'Alex Morgan',
      dueDate: body.dueDate || new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
      priority: body.priority || 'Medium',
      status: body.status || 'pending',
    });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
