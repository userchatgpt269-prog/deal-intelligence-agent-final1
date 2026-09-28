'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Mail, 
  Send, 
  Calendar, 
  Sliders, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight,
  Database,
  Cpu,
  RotateCcw
} from 'lucide-react';

interface SettingsViewProps {
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [settings, setSettings] = useState<any>(null);
  const [hindsightKeyInput, setHindsightKeyInput] = useState('');
  const [groqKeyInput, setGroqKeyInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveKeys = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const payload: any = {};
      if (hindsightKeyInput.trim()) payload.hindsightApiKey = hindsightKeyInput.trim();
      if (groqKeyInput.trim()) payload.groqApiKey = groqKeyInput.trim();

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMessage('Credentials updated successfully. Connection tested.');
        setHindsightKeyInput('');
        setGroqKeyInput('');
        fetchSettings();
      }
    } catch (err: any) {
      setSaveMessage('Error updating credentials: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const cards = [
    {
      title: 'Preferences',
      desc: 'Update your account preferences, including location and currency (Active Currency: INR ₹ Indian Rupee)',
      icon: SettingsIcon,
      color: 'bg-amber-500 text-white',
    },
    {
      title: 'Password and Security',
      desc: 'Control all aspects of the security of your NexusAI account',
      icon: Shield,
      color: 'bg-orange-500 text-white',
    },
    {
      title: 'Notifications',
      desc: 'Manage your notifications for deal assignments, risk alerts, and summaries',
      icon: Bell,
      color: 'bg-teal-500 text-white',
    },
    {
      title: 'Mail Drop Box',
      desc: 'The mail drop box lets you attach inbound customer emails directly to deal memory',
      icon: Mail,
      color: 'bg-rose-500 text-white',
    },
    {
      title: 'My Mailbox Connections',
      desc: 'Connect Google / Outlook mailboxes to NexusAI to index meeting transcripts',
      icon: Send,
      color: 'bg-cyan-500 text-white',
    },
    {
      title: 'Calendar and Feeds',
      desc: 'Subscribe to your deal follow-ups and tasks in your preferred Calendar application',
      icon: Calendar,
      color: 'bg-red-500 text-white',
    },
    {
      title: 'Authorised Applications',
      desc: 'Keep track of which external services and CRMs have been approved to connect',
      icon: Sliders,
      color: 'bg-yellow-500 text-white',
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Settings & Integrations</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure application preferences, Hindsight Cloud memory credentials, and Groq LLM integration.
        </p>
      </div>

      {/* 7 CARDS GRID FAITHFULLY MATCHING IMAGE 4 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="nexus-card p-5 hover:border-slate-300 transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-1 font-bold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
                  <span>{c.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* API AUTHENTICATION TOKENS SECTION (FOR USER TO PLUG HINDSIGHT & GROQ KEYS) */}
      <div className="nexus-card p-6 space-y-6 border-2 border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">API Authentication Tokens & Cloud Keys</h3>
              <p className="text-xs text-slate-500">
                Plug in your Hindsight Cloud and Groq Cloud keys anytime. Keys are stored securely in environment / server state and never exposed in client bundles.
              </p>
            </div>
          </div>

          <button
            onClick={fetchSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Check Status</span>
          </button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hindsight Status */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-orange-500" />
                <span>Hindsight Cloud Memory</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                settings?.status?.hindsightCloudActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {settings?.status?.hindsightCloudActive ? 'Live Cloud Connected' : 'Resilient Local Bank (Ready)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              Active Key: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{settings?.hindsightKeyMasked || 'None configured yet'}</code>
            </div>
            <div className="text-[11px] text-slate-400">
              Base URL: {settings?.hindsightBaseUrl || 'https://api.hindsight.vectorize.io'}
            </div>
          </div>

          {/* Groq Status */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span>Groq Cloud LLM Provider</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                settings?.status?.groqActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {settings?.status?.groqActive ? 'Live Groq API Connected' : 'Deterministic Grounding Engine'}
              </span>
            </div>
            <div className="text-[11px] text-slate-600">
              Active Key: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">{settings?.groqKeyMasked || 'None configured yet'}</code>
            </div>
            <div className="text-[11px] text-slate-400">
              Model: {settings?.groqModel || 'llama-3.3-70b-versatile'}
            </div>
          </div>
        </div>

        {/* Input Form for Keys */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Update Hindsight API Key</label>
              <input
                type="password"
                placeholder="Enter Hindsight Cloud API Key..."
                value={hindsightKeyInput}
                onChange={(e) => setHindsightKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Update Groq API Key</label>
              <input
                type="password"
                placeholder="Enter Groq API Key (gsk_...)..."
                value={groqKeyInput}
                onChange={(e) => setGroqKeyInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-purple-500"
              />
            </div>
          </div>

          {saveMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{saveMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleSaveKeys}
              disabled={isSaving || (!hindsightKeyInput.trim() && !groqKeyInput.trim())}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              {isSaving ? 'Testing & Saving Keys...' : 'Save & Connect Cloud APIs'}
            </button>

            <button
              onClick={onResetData}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Seed Demo State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
