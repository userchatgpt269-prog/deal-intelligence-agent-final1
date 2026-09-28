import { HindsightClient } from '@vectorize-io/hindsight-client';
import { HindsightMemory, MemoryType } from '@/types';
import { getStoredMemories, storeMemory, getSettings, addDealEvent } from './db';

// Format bank ID per deal / account as required by Section 6
export function getBankIdForDeal(dealId: string): string {
  return `deal-bank-${dealId}`;
}

export function getHindsightClient(): HindsightClient | null {
  const settings = getSettings();
  let apiKey = process.env.HINDSIGHT_API_KEY || settings.hindsightApiKey;
  const baseUrl = process.env.HINDSIGHT_BASE_URL || settings.hindsightBaseUrl || 'https://api.hindsight.vectorize.io';

  // Auto-detect if user swapped keys (Groq key starts with gsk_, Hindsight with hsk_)
  if (apiKey && apiKey.startsWith('gsk_')) {
    const groqEnv = process.env.GROQ_API_KEY || settings.groqApiKey;
    if (groqEnv && groqEnv.startsWith('hsk_')) {
      apiKey = groqEnv;
    }
  }

  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  try {
    return new HindsightClient({
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
    });
  } catch (err) {
    console.error('Failed to instantiate HindsightClient:', err);
    return null;
  }
}

export interface RetainMemoryResult {
  success: boolean;
  isCloudHindsight: boolean;
  bankId: string;
  memory: HindsightMemory;
  operationId?: string;
  message: string;
}

export interface RecallResult {
  bankId: string;
  isCloudHindsight: boolean;
  query: string;
  memories: HindsightMemory[];
  summary?: string;
}

/**
 * Retains information into Hindsight memory bank.
 * Uses real Hindsight Cloud when API key is set; seamlessly uses local bank persistence otherwise.
 */
export async function retainMemory(
  dealId: string,
  content: string,
  type: MemoryType = 'Experience',
  sourceInteractionId?: string,
  metadata?: Record<string, any>
): Promise<RetainMemoryResult> {
  const bankId = getBankIdForDeal(dealId);
  const client = getHindsightClient();
  const timestamp = new Date().toISOString();

  // If Hindsight Cloud client is configured
  if (client) {
    try {
      console.log(`[Hindsight Cloud] Retaining into bank: ${bankId}`);
      const retainResp = await client.retain(bankId, content, {
        context: 'Track B2B enterprise deal dynamics, stakeholder sentiment, objections, pricing, and commitments.',
        tags: [type],
        timestamp,
      });

      // Save reference in local DB as well for instant UI rendering
      const memory = storeMemory({
        bankId,
        dealId,
        type,
        content,
        sourceInteractionId,
        confidence: 0.95,
        timestamp,
        metadata: {
          cloudRetained: true,
          hindsightResponse: retainResp,
          ...metadata,
        },
      });

      addDealEvent({
        dealId,
        type: 'memory_event',
        title: `Hindsight Memory Retained [Cloud]`,
        description: `Retained: "${content.slice(0, 60)}..."`,
        timestamp,
      });

      return {
        success: true,
        isCloudHindsight: true,
        bankId,
        memory,
        message: 'Retained in Hindsight Cloud successfully.',
      };
    } catch (err: any) {
      console.warn('[Hindsight Cloud Retain Error, falling back to local store]:', err?.message || err);
    }
  }

  // Fallback: Local persistent Hindsight Store
  const memory = storeMemory({
    bankId,
    dealId,
    type,
    content,
    sourceInteractionId,
    confidence: 0.92,
    timestamp,
    metadata: {
      cloudRetained: false,
      mode: 'embedded_hindsight_engine',
      ...metadata,
    },
  });

  addDealEvent({
    dealId,
    type: 'memory_event',
    title: `Hindsight Memory Retained [Bank: ${bankId}]`,
    description: `Retained: "${content.slice(0, 60)}..."`,
    timestamp,
  });

  return {
    success: true,
    isCloudHindsight: false,
    bankId,
    memory,
    message: 'Retained in local Hindsight memory bank (Cloud API key ready to plug in).',
  };
}

/**
 * Recalls memories relevant to a query.
 */
export async function recallMemories(
  dealId: string,
  query: string,
  options?: { limit?: number; threshold?: number }
): Promise<RecallResult> {
  const bankId = getBankIdForDeal(dealId);
  const client = getHindsightClient();
  const limit = options?.limit || 6;

  // Real Hindsight Cloud Recall
  if (client) {
    try {
      console.log(`[Hindsight Cloud] Recalling from bank: ${bankId}, query: "${query}"`);
      const recallResp: any = await client.recall(bankId, query, {
        maxTokens: limit * 250,
      });

      // Map Cloud response items
      const rawResults = (recallResp?.results || recallResp?.memories || []).slice(0, limit);
      const cloudMemories: HindsightMemory[] = rawResults.map((r: any, idx: number) => ({
        id: `cloud-mem-${idx}-${Date.now()}`,
        bankId,
        dealId,
        type: (r.type as MemoryType) || 'Experience',
        content: r.content || r.text || String(r),
        confidence: r.score || r.confidence || 0.95,
        timestamp: r.timestamp || new Date().toISOString(),
      }));

      if (cloudMemories.length > 0) {
        return {
          bankId,
          isCloudHindsight: true,
          query,
          memories: cloudMemories,
          summary: recallResp?.summary,
        };
      }
    } catch (err: any) {
      console.warn('[Hindsight Cloud Recall Error, falling back to local store]:', err?.message || err);
    }
  }

  // Local semantic & keyword recall engine
  const stored = getStoredMemories(dealId);
  if (stored.length === 0) {
    return {
      bankId,
      isCloudHindsight: false,
      query,
      memories: [],
    };
  }

  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  // Score stored memories
  const scored = stored.map(mem => {
    const text = (mem.content + ' ' + (mem.type || '')).toLowerCase();
    let score = 0;
    
    // Exact phrase match
    if (text.includes(query.toLowerCase())) {
      score += 0.6;
    }

    // Token match
    queryTerms.forEach(term => {
      if (text.includes(term)) {
        score += 0.25;
      }
    });

    // Recency bonus
    const ageDays = (Date.now() - new Date(mem.timestamp).getTime()) / (1000 * 3600 * 24);
    if (ageDays < 7) score += 0.15;
    else if (ageDays < 30) score += 0.05;

    return {
      memory: mem,
      score: Math.min(0.99, mem.confidence * (score > 0 ? score : 0.4)),
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const matched = scored.slice(0, limit).map(s => ({
    ...s.memory,
    confidence: Number(s.score.toFixed(2)),
  }));

  return {
    bankId,
    isCloudHindsight: false,
    query,
    memories: matched,
  };
}

/**
 * Reflects over memories using Hindsight reflect or internal synthesis.
 */
export async function reflectOnMemories(dealId: string, query: string): Promise<string> {
  const bankId = getBankIdForDeal(dealId);
  const client = getHindsightClient();

  if (client) {
    try {
      console.log(`[Hindsight Cloud] Reflecting in bank: ${bankId}`);
      const reflectResp = await client.reflect(bankId, query);
      if (typeof reflectResp === 'string') return reflectResp;
      if ((reflectResp as any)?.answer) return (reflectResp as any).answer;
      if ((reflectResp as any)?.content) return (reflectResp as any).content;
    } catch (err: any) {
      console.warn('[Hindsight Cloud Reflect Error]:', err?.message || err);
    }
  }

  // Synthesized fallback
  const recallRes = await recallMemories(dealId, query, { limit: 5 });
  if (recallRes.memories.length === 0) {
    return 'No historical memories stored yet for this deal context.';
  }

  const memoryBullets = recallRes.memories.map(m => `• [${m.type}] ${m.content}`).join('\n');
  return `Synthesized from ${recallRes.memories.length} historical memories in bank "${bankId}":\n${memoryBullets}`;
}
