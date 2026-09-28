import { NextRequest, NextResponse } from 'next/server';
import { getInteractions, createInteraction } from '@/lib/db';
import { retainMemory, getBankIdForDeal } from '@/lib/hindsight';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dealId = searchParams.get('dealId') || undefined;
    const interactions = getInteractions(dealId);
    return NextResponse.json({ success: true, count: interactions.length, interactions });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.dealId || !body.summary) {
      return NextResponse.json(
        { success: false, error: 'dealId and summary are required' },
        { status: 400 }
      );
    }

    const bankId = getBankIdForDeal(body.dealId);

    // 1. Create interaction in database
    const interaction = createInteraction({
      dealId: body.dealId,
      date: body.date || new Date().toISOString(),
      type: body.type || 'Meeting',
      participants: Array.isArray(body.participants) 
        ? body.participants 
        : typeof body.participants === 'string' 
          ? body.participants.split(',').map((p: string) => p.trim()) 
          : ['Sales Lead'],
      summary: body.summary,
      keyPoints: Array.isArray(body.keyPoints) ? body.keyPoints : (body.keyPoints ? [body.keyPoints] : []),
      objections: Array.isArray(body.objections) ? body.objections : (body.objections ? [body.objections] : []),
      competitors: Array.isArray(body.competitors) ? body.competitors : (body.competitors ? [body.competitors] : []),
      pricingDiscussion: body.pricingDiscussion || '',
      customerRequirements: Array.isArray(body.customerRequirements) ? body.customerRequirements : (body.customerRequirements ? [body.customerRequirements] : []),
      commitments: Array.isArray(body.commitments) ? body.commitments : (body.commitments ? [body.commitments] : []),
      nextSteps: Array.isArray(body.nextSteps) ? body.nextSteps : (body.nextSteps ? [body.nextSteps] : []),
      memoryRetained: true,
      memoryBankId: bankId,
    });

    // 2. Synthesize structured memory content for Hindsight Retain
    const memoryNarrative = [
      `Interaction [${interaction.type}]: ${interaction.summary}`,
      interaction.keyPoints.length ? `Key Points: ${interaction.keyPoints.join('; ')}` : '',
      interaction.objections.length ? `Customer Objections: ${interaction.objections.join('; ')}` : '',
      interaction.competitors.length ? `Competitors Evaluated: ${interaction.competitors.join('; ')}` : '',
      interaction.pricingDiscussion ? `Pricing/Commercial Context: ${interaction.pricingDiscussion}` : '',
      interaction.commitments.length ? `Our Commitments: ${interaction.commitments.join('; ')}` : '',
      interaction.customerRequirements.length ? `Customer Requirements: ${interaction.customerRequirements.join('; ')}` : '',
    ].filter(Boolean).join('\n');

    // 3. Retain into Hindsight Memory Bank
    const memoryResult = await retainMemory(
      body.dealId,
      memoryNarrative,
      interaction.objections.length > 0 ? 'Observation' : 'Experience',
      interaction.id,
      {
        interactionType: interaction.type,
        participants: interaction.participants,
        interactionDate: interaction.date,
      }
    );

    return NextResponse.json(
      {
        success: true,
        interaction,
        hindsightMemory: memoryResult,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
