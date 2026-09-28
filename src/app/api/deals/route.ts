import { NextRequest, NextResponse } from 'next/server';
import { getDeals, createDeal } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const stage = searchParams.get('stage');
    const risk = searchParams.get('risk');
    const pipeline = searchParams.get('pipeline');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let deals = getDeals();

    if (search) {
      deals = deals.filter(
        d =>
          d.name.toLowerCase().includes(search) ||
          d.company.toLowerCase().includes(search) ||
          d.owner.toLowerCase().includes(search) ||
          d.industry.toLowerCase().includes(search)
      );
    }

    if (stage && stage !== 'all') {
      deals = deals.filter(d => d.stage === stage);
    }

    if (risk && risk !== 'all') {
      deals = deals.filter(d => d.risk === risk);
    }

    if (pipeline && pipeline !== 'all') {
      deals = deals.filter(d => d.pipeline === pipeline);
    }

    // Sort
    deals.sort((a: any, b: any) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortOrder === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      }
      return sortOrder === 'asc'
        ? String(fieldA).localeCompare(String(fieldB))
        : String(fieldB).localeCompare(String(fieldA));
    });

    return NextResponse.json({ success: true, count: deals.length, deals });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.company || body.value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Deal name, company, and value in INR are required.' },
        { status: 400 }
      );
    }

    const newDeal = createDeal({
      name: body.name,
      company: body.company,
      value: Number(body.value),
      currency: 'INR',
      stage: body.stage || 'Qualification',
      probability: Number(body.probability ?? 30),
      owner: body.owner || 'Alex Morgan',
      closeDate: body.closeDate || new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
      priority: body.priority || 'Medium',
      health: Number(body.health ?? 75),
      risk: body.risk || 'Low Risk',
      industry: body.industry || 'Enterprise Technology',
      description: body.description || '',
      pipeline: body.pipeline || 'Enterprise Pipeline',
      lastContactDaysAgo: 0,
      daysInStage: 1,
    });

    return NextResponse.json({ success: true, deal: newDeal }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
