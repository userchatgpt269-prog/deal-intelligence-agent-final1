import { NextRequest, NextResponse } from 'next/server';
import { getStakeholders, createStakeholder } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get('dealId') || undefined;
    const stakeholders = getStakeholders(dealId);
    return NextResponse.json({ success: true, count: stakeholders.length, stakeholders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId || !body.name || !body.role) {
      return NextResponse.json(
        { success: false, error: 'dealId, name, and role are required' },
        { status: 400 }
      );
    }

    const stakeholder = createStakeholder({
      dealId: body.dealId,
      name: body.name,
      role: body.role,
      title: body.title || '',
      influence: body.influence || 'Medium',
      sentiment: body.sentiment || 'Neutral',
      decisionRole: body.decisionRole || '',
      email: body.email || '',
      phone: body.phone || '',
      notes: body.notes || '',
      relationshipStatus: body.relationshipStatus || 'Engaged',
    });

    return NextResponse.json({ success: true, stakeholder }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
