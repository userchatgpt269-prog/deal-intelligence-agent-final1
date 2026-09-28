'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  User, 
  ArrowLeft, 
  Sparkles, 
  Database, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  MessageSquare, 
  FileText, 
  Send, 
  Search, 
  CheckSquare, 
  Square, 
  Edit3, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { Deal, Stakeholder, Interaction, Task, DealEvent, HindsightMemory, GroundedIntelligence, MeetingPrepBrief } from '@/types';
import { formatINR } from '@/lib/format';

interface DealDetailWorkspaceProps {
  deal: Deal;
  onBack: () => void;
  onOpenAddInteraction: () => void;
  onOpenAddStakeholder: () => void;
  onOpenAddTask: () => void;
  onDeleteDeal: (dealId: string) => void;
  onRefreshDeal: () => void;
}

export const DealDetailWorkspace: React.FC<DealDetailWorkspaceProps> = ({
  deal,
  onBack,
  onOpenAddInteraction,
  onOpenAddStakeholder,
  onOpenAddTask,
  onDeleteDeal,
  onRefreshDeal,
}) => {
  const [activeTab, setActiveTab] = useState<
    'intelligence' | 'timeline' | 'stakeholders' | 'tasks' | 'interactions' | 'memory-bank' | 'meeting-prep' | 'ai-chat'
  >('intelligence');

  const [intelligence, setIntelligence] = useState<GroundedIntelligence | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<DealEvent[]>([]);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memories, setMemories] = useState<HindsightMemory[]>([]);
  const [meetingBrief, setMeetingBrief] = useState<MeetingPrepBrief | null>(null);

  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  const [isLoadingBrief, setIsLoadingBrief] = useState(false);

  // Live Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    recalledMemories?: HindsightMemory[];
  }>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Memory sandbox test state
  const [customMemoryText, setCustomMemoryText] = useState('');
  const [customMemoryType, setCustomMemoryType] = useState<'World' | 'Experience' | 'Observation'>('Observation');
  const [isRetainingMemory, setIsRetainingMemory] = useState(false);
  const [recallSearchQuery, setRecallSearchQuery] = useState('');
  const [recallSearchResults, setRecallSearchResults] = useState<HindsightMemory[] | null>(null);
  const [isRecalling, setIsRecalling] = useState(false);

  // Fetch all deal context
  const loadDealData = async () => {
    try {
      // 1. Timeline
      const tRes = await fetch(`/api/timeline/${deal.id}`);
      const tData = await tRes.json();
      if (tData.success) setTimelineEvents(tData.events);

      // 2. Stakeholders
      const sRes = await fetch(`/api/stakeholders?dealId=${deal.id}`);
      const sData = await sRes.json();
      if (sData.success) setStakeholders(sData.stakeholders);

      // 3. Interactions
      const iRes = await fetch(`/api/interactions?dealId=${deal.id}`);
      const iData = await iRes.json();
      if (iData.success) setInteractions(iData.interactions);

      // 4. Tasks
      const kRes = await fetch(`/api/tasks?dealId=${deal.id}`);
      const kData = await kRes.json();
      if (kData.success) setTasks(kData.tasks);

      // 5. Memories
      const mRes = await fetch(`/api/hindsight/memories?dealId=${deal.id}`);
      const mData = await mRes.json();
      if (mData.success) setMemories(mData.memories);
    } catch (err) {
      console.error('Error loading deal workspace data:', err);
    }
  };

  // Generate Intelligence
  const fetchIntelligence = async () => {
    setIsLoadingIntelligence(true);
    try {
      const res = await fetch('/api/ai/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id }),
      });
      const data = await res.json();
      if (data.success) {
        setIntelligence(data.intelligence);
      }
    } catch (err) {
      console.error('Failed to generate intelligence:', err);
    } finally {
      setIsLoadingIntelligence(false);
    }
  };

  // Generate Meeting Prep Brief
  const fetchMeetingBrief = async () => {
    setIsLoadingBrief(true);
    try {
      const res = await fetch('/api/ai/meeting-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id }),
      });
      const data = await res.json();
      if (data.success) {
        setMeetingBrief(data.brief);
      }
    } catch (err) {
      console.error('Failed to generate meeting brief:', err);
    } finally {
      setIsLoadingBrief(false);
    }
  };

  useEffect(() => {
    loadDealData();
    fetchIntelligence();
  }, [deal.id]);

  // Handle Deal Copilot Chat
  const handleSendChat = async (preset?: string) => {
    const question = preset || chatInput;
    if (!question.trim()) return;

    const newMsgs = [
      ...chatMessages,
      { sender: 'user' as const, text: question }
    ];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id, question }),
      });
      const data = await res.json();
      if (data.success) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.text,
            recalledMemories: data.recalledMemories,
          }
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Retain custom memory directly
  const handleRetainCustomMemory = async () => {
    if (!customMemoryText.trim()) return;
    setIsRetainingMemory(true);
    try {
      const res = await fetch('/api/hindsight/retain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          content: customMemoryText.trim(),
          type: customMemoryType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomMemoryText('');
        loadDealData();
      }
    } catch (err) {
      console.error('Retain error:', err);
    } finally {
      setIsRetainingMemory(false);
    }
  };

  // Recall search testing
  const handleRecallSearch = async () => {
    if (!recallSearchQuery.trim()) return;
    setIsRecalling(true);
    try {
      const res = await fetch('/api/hindsight/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dealId: deal.id, query: recallSearchQuery }),
      });
      const data = await res.json();
      if (data.success) {
        setRecallSearchResults(data.memories);
      }
    } catch (err) {
      console.error('Recall search error:', err);
    } finally {
      setIsRecalling(false);
    }
  };

  // Toggle task status
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      loadDealData();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HERO DEAL HEADER */}
      <div className="nexus-card p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Deals</span>
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                {deal.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {deal.stage}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                deal.risk === 'High Risk' ? 'bg-red-50 text-red-700 border-red-200' :
                deal.risk === 'Silence' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                deal.risk === 'Weak Engagement' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {deal.risk}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700">{deal.company}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Close Date: {new Date(deal.closeDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Owner: {deal.owner}</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <span>Pipeline: {deal.pipeline}</span>
              </div>
            </div>
          </div>

          {/* Value in INR & Quick Actions */}
          <div className="flex flex-col md:items-end gap-2.5">
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-400">Deal Value (INR)</div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {formatINR(deal.value)}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('meeting-prep');
                  fetchMeetingBrief();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Prepare for Meeting</span>
              </button>

              <button
                onClick={onOpenAddInteraction}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Interaction</span>
              </button>

              <button
                onClick={() => onDeleteDeal(deal.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 border border-slate-200 transition-colors"
                title="Delete Deal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* PERSISTENT MEMORY BANK HERO BADGE */}
        <div className="p-3 bg-gradient-to-r from-orange-50 via-slate-50 to-indigo-50 border border-orange-200/80 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] shadow-sm">
              <Database className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-slate-900">Hindsight Memory Bank: </span>
              <code className="bg-white/80 px-2 py-0.5 rounded text-orange-700 font-mono text-[11px] font-semibold border border-orange-200">
                deal-bank-{deal.id}
              </code>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span><strong className="text-slate-900">{memories.length}</strong> Memories Persisted</span>
            <span>•</span>
            <span><strong className="text-slate-900">{interactions.length}</strong> Interactions Indexed</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('memory-bank')}
              className="text-orange-600 hover:text-orange-700 font-bold underline"
            >
              Inspect Bank →
            </button>
          </div>
        </div>

        {/* WORKSPACE SUB-TABS */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 pt-2 no-scrollbar">
          {[
            { id: 'intelligence', label: 'Deal Intelligence', icon: Cpu },
            { id: 'timeline', label: 'Timeline & History', icon: Clock },
            { id: 'stakeholders', label: `Stakeholders (${stakeholders.length})`, icon: User },
            { id: 'tasks', label: `Tasks (${tasks.length})`, icon: CheckSquare },
            { id: 'interactions', label: `Interactions (${interactions.length})`, icon: FileText },
            { id: 'memory-bank', label: `Hindsight Bank (${memories.length})`, icon: Database },
            { id: 'meeting-prep', label: 'Meeting Prep', icon: Sparkles },
            { id: 'ai-chat', label: 'Deal AI Copilot', icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'meeting-prep' && !meetingBrief) fetchMeetingBrief();
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[1px] ${
                  isActive
                    ? 'border-orange-500 text-orange-600 bg-orange-50/30'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. DEAL INTELLIGENCE TAB */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          {isLoadingIntelligence ? (
            <div className="nexus-card p-12 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
              <div className="text-sm font-semibold text-slate-700">Synthesizing Deal Intelligence from Hindsight Memory...</div>
              <div className="text-xs text-slate-400">Grounding facts, indexing commitments, and evaluating risks.</div>
            </div>
          ) : intelligence ? (
            <div className="space-y-6">
              {/* Grounding Status Header (Hallucination Control) */}
              <div className="nexus-card p-5 bg-gradient-to-r from-emerald-50/50 via-blue-50/30 to-slate-50 border border-emerald-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                      Hallucination-Controlled Intelligence Grounding
                    </h3>
                  </div>
                  <button
                    onClick={fetchIntelligence}
                    className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-900"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-evaluate</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Confirmed */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      Confirmed Facts ({intelligence.grounding.confirmed.length})
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {intelligence.grounding.confirmed.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Inferred */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      Inferred Insights ({intelligence.grounding.inferred.length})
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {intelligence.grounding.inferred.map((inf, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{inf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Unknown */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      Unknown / Information Gaps ({intelligence.grounding.unknown.length})
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {intelligence.grounding.unknown.map((u, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{u}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2 Column Executive Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 8 Cols */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Executive Summary */}
                  <div className="nexus-card p-5 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Executive Summary
                    </h3>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {intelligence.executiveSummary}
                    </p>
                    <div className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <strong>Current Situation: </strong>
                      {intelligence.currentSituation}
                    </div>
                  </div>

                  {/* Customer Priorities */}
                  <div className="nexus-card p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Customer Priorities & Requirements
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {intelligence.customerPriorities.map((p, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Known Objections */}
                  <div className="nexus-card p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Known Objections
                    </h3>
                    <div className="space-y-2">
                      {intelligence.knownObjections.map((obj, i) => (
                        <div key={i} className="p-3 bg-red-50/50 border border-red-100 rounded-lg flex items-start justify-between gap-3 text-xs">
                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900">{obj.text}</div>
                            <div className="text-[10px] text-slate-400">Source: {obj.source}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            obj.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                            obj.status === 'escalating' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {obj.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Next Actions */}
                  <div className="nexus-card p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Recommended Next Actions
                    </h3>
                    <div className="space-y-2">
                      {intelligence.recommendedNextActions.map((act, i) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              act.urgency === 'Immediate' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {act.urgency}
                            </span>
                            <span className="font-semibold text-slate-900">{act.action}</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">Owner: {act.owner}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right 4 Cols */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Deal Risks */}
                  <div className="nexus-card p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Deal Risks & Mitigation
                    </h3>
                    <div className="space-y-3">
                      {intelligence.dealRisks.map((r, i) => (
                        <div key={i} className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-red-900">{r.risk}</span>
                            <span className="text-[10px] font-bold bg-red-200 text-red-800 px-1.5 py-0.5 rounded">
                              {r.severity}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-red-100">
                            <strong>Mitigation: </strong>{r.mitigation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Competitor Mentions */}
                  <div className="nexus-card p-5 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Competitive Mentions
                    </h3>
                    <div className="space-y-2">
                      {intelligence.competitiveMentions.map((comp, i) => (
                        <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{comp.name}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              comp.threatLevel === 'High' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {comp.threatLevel} Threat
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">{comp.context}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Commercial Context */}
                  <div className="nexus-card p-5 space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Pricing & Commercial Context
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {intelligence.pricingContext}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="nexus-card p-8 text-center">
              <button
                onClick={fetchIntelligence}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-xs font-bold"
              >
                Generate Deal Intelligence
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. TIMELINE TAB */}
      {activeTab === 'timeline' && (
        <div className="nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Chronological Deal Timeline</h3>
              <p className="text-xs text-slate-400">Meetings, calls, objections, stage changes, and Hindsight memory events</p>
            </div>
            <button
              onClick={onOpenAddInteraction}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative flex items-start gap-4 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center -ml-[31px] ring-4 ring-white ${
                  evt.type === 'memory_event' ? 'bg-orange-500 text-white' :
                  evt.type === 'objection' ? 'bg-red-500 text-white' :
                  evt.type === 'risk_alert' ? 'bg-amber-500 text-white' :
                  'bg-blue-600 text-white'
                }`}>
                  {evt.type === 'memory_event' ? <Database className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                </div>

                <div className="flex-1 bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{evt.title}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(evt.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{evt.description}</p>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 pt-1">
                    Event Type: {evt.type.replace('_', ' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. STAKEHOLDERS TAB */}
      {activeTab === 'stakeholders' && (
        <div className="nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stakeholder Map</h3>
              <p className="text-xs text-slate-400">Key decision makers, champions, blockers, and influence hierarchy</p>
            </div>
            <button
              onClick={onOpenAddStakeholder}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Stakeholder</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stakeholders.map((sh) => (
              <div key={sh.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{sh.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{sh.title}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sh.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-800' :
                    sh.sentiment === 'Hostile' ? 'bg-red-100 text-red-800' :
                    sh.sentiment === 'Skeptical' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {sh.sentiment}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400">Role: </span>
                    <strong className="text-slate-700">{sh.role}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Influence: </span>
                    <strong className="text-slate-700">{sh.influence}</strong>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/80">
                  <strong>Notes: </strong>{sh.notes}
                </div>

                <div className="text-[10px] text-slate-400 pt-1 flex items-center justify-between">
                  <span>{sh.email} {sh.phone ? `• ${sh.phone}` : ''}</span>
                  <span className="font-semibold text-slate-600">{sh.relationshipStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TASKS TAB */}
      {activeTab === 'tasks' && (
        <div className="nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tasks & Next Actions</h3>
              <p className="text-xs text-slate-400">Action items, follow-ups, and commitments required to advance this deal</p>
            </div>
            <button
              onClick={onOpenAddTask}
              className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Task</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tasks.map((t) => {
              const isDone = t.status === 'completed';
              return (
                <div key={t.id} className="py-3 flex items-start justify-between gap-4 text-xs group">
                  <div className="flex items-start gap-3 flex-1">
                    <button
                      onClick={() => handleToggleTask(t.id, t.status)}
                      className="mt-0.5 text-slate-400 hover:text-slate-700"
                    >
                      {isDone ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <div className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {t.task}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Owner: {t.owner} • Due: {new Date(t.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {t.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. INTERACTIONS TAB */}
      {activeTab === 'interactions' && (
        <div className="nexus-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Interaction History</h3>
              <p className="text-xs text-slate-400">All customer conversations, meetings, and demos automatically retained in Hindsight</p>
            </div>
            <button
              onClick={onOpenAddInteraction}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Interaction</span>
            </button>
          </div>

          <div className="space-y-4">
            {interactions.map((int) => (
              <div key={int.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{int.type}: {int.summary}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Indexed in Hindsight
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    {new Date(int.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                <div className="text-slate-600">
                  <strong>Participants: </strong>{int.participants.join(', ')}
                </div>

                {int.keyPoints.length > 0 && (
                  <div className="space-y-1">
                    <strong className="text-slate-700">Key Points:</strong>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {int.keyPoints.map((kp, i) => (
                        <li key={i}>{kp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {int.objections.length > 0 && (
                  <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg text-red-900">
                    <strong>Customer Objections: </strong>{int.objections.join('; ')}
                  </div>
                )}

                {int.commitments.length > 0 && (
                  <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-900">
                    <strong>Our Commitments: </strong>{int.commitments.join('; ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. HINDSIGHT MEMORY BANK TAB (HERO DEMO OF PERSISTENT MEMORY) */}
      {activeTab === 'memory-bank' && (
        <div className="space-y-6">
          {/* Bank Status Banner */}
          <div className="nexus-card p-6 bg-slate-900 text-white space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Hindsight Persistent Memory Bank</h3>
                  <p className="text-xs text-slate-400">
                    Bank ID: <code className="text-orange-400 font-mono font-bold">deal-bank-{deal.id}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  TEMPR Retrieval Active
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-semibold">
                  {memories.length} Persisted Records
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800">
              <div className="bg-slate-800/60 p-3 rounded-lg">
                <div className="text-slate-400 text-[11px]">World Memories</div>
                <div className="text-lg font-bold text-white">
                  {memories.filter(m => m.type === 'World').length}
                </div>
                <div className="text-[10px] text-slate-500">Market facts & company architecture</div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg">
                <div className="text-slate-400 text-[11px]">Experience Memories</div>
                <div className="text-lg font-bold text-white">
                  {memories.filter(m => m.type === 'Experience').length}
                </div>
                <div className="text-[10px] text-slate-500">Past promises, commitments & tactics</div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-lg">
                <div className="text-slate-400 text-[11px]">Observation Memories</div>
                <div className="text-lg font-bold text-white">
                  {memories.filter(m => m.type === 'Observation').length}
                </div>
                <div className="text-[10px] text-slate-500">Stakeholder objections & sentiment</div>
              </div>
            </div>
          </div>

          {/* TWO COLUMN: RETAIN TESTER + RECALL TESTER */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Retain Sandbox */}
            <div className="nexus-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-orange-500" />
                  <span>Test Retain Operation</span>
                </h4>
                <select
                  value={customMemoryType}
                  onChange={(e) => setCustomMemoryType(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-700"
                >
                  <option value="Observation">Observation</option>
                  <option value="Experience">Experience</option>
                  <option value="World">World</option>
                </select>
              </div>

              <textarea
                placeholder="Enter new observation to store in Hindsight memory (e.g. 'Customer confirmed CISO will approve if KMS latency stays under 40ms in Mumbai region')..."
                value={customMemoryText}
                onChange={(e) => setCustomMemoryText(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500"
              />

              <button
                onClick={handleRetainCustomMemory}
                disabled={isRetainingMemory || !customMemoryText.trim()}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {isRetainingMemory ? 'Retaining to Hindsight Bank...' : 'Retain to Bank'}
              </button>
            </div>

            {/* Recall Sandbox */}
            <div className="nexus-card p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-500" />
                <span>Test Recall Operation</span>
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Query memory bank (e.g. 'pricing discount', 'competitor', 'security')..."
                  value={recallSearchQuery}
                  onChange={(e) => setRecallSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRecallSearch()}
                  className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
                />
                <button
                  onClick={handleRecallSearch}
                  disabled={isRecalling || !recallSearchQuery.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
                >
                  {isRecalling ? 'Searching...' : 'Recall'}
                </button>
              </div>

              {recallSearchResults && (
                <div className="space-y-2 pt-2 border-t border-slate-100 max-h-48 overflow-y-auto">
                  <div className="text-[11px] font-semibold text-slate-500">
                    Results ({recallSearchResults.length}):
                  </div>
                  {recallSearchResults.map((r, i) => (
                    <div key={i} className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-blue-800 uppercase">{r.type}</span>
                        <span className="font-mono text-blue-600 font-bold">Confidence: {(r.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-slate-800">{r.content}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Persisted Memories Table */}
          <div className="nexus-card p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              All Indexed Memories in Memory Bank
            </h4>
            <div className="space-y-3">
              {memories.map((m) => (
                <div key={m.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      m.type === 'World' ? 'bg-purple-100 text-purple-800' :
                      m.type === 'Experience' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {m.type} Memory
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(m.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-800 leading-relaxed font-medium">
                    {m.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                    <span>Source: {m.sourceInteractionId ? `Interaction ${m.sourceInteractionId}` : 'Direct Retain'}</span>
                    <span className="font-mono font-semibold text-emerald-600">Score: {(m.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. MEETING PREP TAB */}
      {activeTab === 'meeting-prep' && (
        <div className="nexus-card p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Executive Meeting Preparation Brief</h3>
              <p className="text-xs text-slate-400">Grounded in deal timeline, past commitments, objections, and Hindsight persistent memories</p>
            </div>
            <button
              onClick={fetchMeetingBrief}
              disabled={isLoadingBrief}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBrief ? 'animate-spin' : ''}`} />
              <span>Regenerate Brief</span>
            </button>
          </div>

          {isLoadingBrief ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 text-orange-500 animate-spin mx-auto" />
              <div className="text-xs font-semibold">Generating grounded meeting brief...</div>
            </div>
          ) : meetingBrief ? (
            <div className="space-y-6 text-xs text-slate-800">
              {/* Top Summary Banner */}
              <div className="p-4 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2">
                <div className="font-bold text-orange-900 text-sm">Deal Summary</div>
                <p className="leading-relaxed">{meetingBrief.dealSummary}</p>
                <div className="text-[11px] text-orange-800 pt-1">
                  <strong>Last Recorded Interaction: </strong>{meetingBrief.lastInteractionSummary}
                </div>
              </div>

              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Open Commitments */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="font-bold text-slate-900">Open Commitments (What We Promised)</div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                    {meetingBrief.openCommitments.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Objections to Anticipate */}
                <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl space-y-2">
                  <div className="font-bold text-red-900">Objections to Anticipate</div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                    {meetingBrief.objectionsToAnticipate.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Questions */}
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                  <div className="font-bold text-blue-900">Suggested Questions to Ask</div>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-700">
                    {meetingBrief.suggestedQuestions.map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Agenda */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2">
                  <div className="font-bold text-emerald-900">Recommended Agenda (45 mins)</div>
                  <ul className="space-y-1.5 text-slate-700">
                    {meetingBrief.recommendedAgenda.map((ag, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{ag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Competitive Positioning */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-bold text-slate-900">Competitive Defense Strategy</div>
                <p className="leading-relaxed">{meetingBrief.competitivePositioning}</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* 8. DEAL AI COPILOT CHAT TAB */}
      {activeTab === 'ai-chat' && (
        <div className="nexus-card flex flex-col h-[560px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-orange-500 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Deal Intelligence Assistant</h3>
                <p className="text-[10px] text-slate-400">Grounded in deal records and persistent Hindsight bank</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
              Hindsight Grounded
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {chatMessages.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-3">
                <Sparkles className="w-8 h-8 text-orange-400 mx-auto" />
                <div className="text-xs font-bold text-slate-700">Ask anything about this deal's history</div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  The agent queries the persistent memory bank to recall past objections, competitor mentions, pricing discussions, and commitments.
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {[
                    'What did they say about pricing and discounts?',
                    'Which competitors were mentioned?',
                    'Who is blocking this deal?',
                    'What did we promise them in previous meetings?',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendChat(preset)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-orange-300 text-slate-700 text-xs font-medium shadow-sm transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-slate-900 text-white font-medium rounded-br-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-sm'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                    </div>

                    {/* Cited Source Memories */}
                    {msg.recalledMemories && msg.recalledMemories.length > 0 && (
                      <div className="p-2.5 bg-orange-50/60 border border-orange-200/80 rounded-lg text-[11px] space-y-1">
                        <div className="font-bold text-orange-900 flex items-center gap-1">
                          <Database className="w-3 h-3 text-orange-600" />
                          <span>Hindsight Memories Recalled ({msg.recalledMemories.length})</span>
                        </div>
                        <div className="space-y-1">
                          {msg.recalledMemories.slice(0, 3).map((m, mi) => (
                            <div key={mi} className="text-slate-700">
                              • <span className="font-semibold text-orange-800">[{m.type}]</span> {m.content}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 text-slate-500 rounded-xl px-4 py-2 text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-orange-500 animate-spin" />
                  <span>Searching memory bank & synthesizing grounded response...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about previous interactions, objections, or commitments..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
              className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 rounded-lg focus:outline-none transition-colors"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={isChatLoading || !chatInput.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
