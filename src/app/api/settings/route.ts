import { NextRequest, NextResponse } from 'next/server';
import { getSettings, updateSettings } from '@/lib/db';
import { getHindsightClient } from '@/lib/hindsight';
import { getGroqClient } from '@/lib/ai';

export async function GET() {
  try {
    const settings = getSettings();
    const hasHindsightEnv = Boolean(process.env.HINDSIGHT_API_KEY);
    const hasGroqEnv = Boolean(process.env.GROQ_API_KEY);
    const hindsightActive = getHindsightClient() !== null;
    const groqActive = getGroqClient() !== null;

    // Mask secret keys for safe UI presentation (Rule 20: NEVER expose raw keys)
    const maskKey = (key: string) => {
      if (!key || key.length < 8) return key ? '••••••••' : '';
      return `${key.slice(0, 4)}••••${key.slice(-4)}`;
    };

    return NextResponse.json({
      success: true,
      settings: {
        currency: 'INR',
        hindsightBaseUrl: settings.hindsightBaseUrl,
        groqModel: settings.groqModel,
        activeWorkspace: settings.activeWorkspace,
        hindsightConfigured: Boolean(settings.hindsightApiKey || hasHindsightEnv),
        groqConfigured: Boolean(settings.groqApiKey || hasGroqEnv),
        hindsightKeyMasked: maskKey(settings.hindsightApiKey || process.env.HINDSIGHT_API_KEY || ''),
        groqKeyMasked: maskKey(settings.groqApiKey || process.env.GROQ_API_KEY || ''),
        status: {
          hindsightCloudActive: hindsightActive,
          groqActive: groqActive,
          mode: hindsightActive ? 'Hindsight Cloud Live' : 'Resilient Local Bank (Ready for Cloud Key)',
        }
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updates: any = {};

    if (body.hindsightApiKey !== undefined) updates.hindsightApiKey = body.hindsightApiKey.trim();
    if (body.hindsightBaseUrl !== undefined) updates.hindsightBaseUrl = body.hindsightBaseUrl.trim();
    if (body.groqApiKey !== undefined) updates.groqApiKey = body.groqApiKey.trim();
    if (body.groqModel !== undefined) updates.groqModel = body.groqModel.trim();
    if (body.activeWorkspace !== undefined) updates.activeWorkspace = body.activeWorkspace;

    // Currency must always stay INR
    updates.currency = 'INR';

    const saved = updateSettings(updates);

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully. Currency locked to INR.',
      hindsightCloudActive: getHindsightClient() !== null,
      groqActive: getGroqClient() !== null,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
