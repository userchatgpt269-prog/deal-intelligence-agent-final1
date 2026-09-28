'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Layers, 
  CheckCircle, 
  Target, 
  AlertTriangle, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Send, 
  Mail, 
  FileText, 
  Calendar, 
  Activity, 
  ArrowUpRight,
  Maximize2,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { Deal, DealStage } from '@/types';
import { formatINR } from '@/lib/format';
import { KpiDetailModal, KpiModalType } from './modals/KpiDetailModal';

interface DashboardViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onViewAllDeals: () => void;
  onOpenRiskAgent: () => void;
  onOpenPipeline?: () => void;
  onOpenEmailComposer?: (dealId?: string) => void;
  onOpenProposal?: (dealId?: string) => void;
  onOpenScheduleMeeting?: (dealId?: string) => void;
  onOpenPredictOutcome?: (dealId?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  deals,
  onSelectDeal,
  onViewAllDeals,
  onOpenRiskAgent,
  onOpenPipeline,
  onOpenEmailComposer,
  onOpenProposal,
  onOpenScheduleMeeting,
  onOpenPredictOutcome,
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [activeKpiModal, setActiveKpiModal] = useState<KpiModalType>(null);
  const [selectedFlowStage, setSelectedFlowStage] = useState<DealStage | null>(null);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'user',
      text: "Forecast next quarter's revenue for me"
    },
    {
      sender: 'assistant',
      text: "You're on track for ₹2.60 Cr next quarter — up 12.6%, with 96.8% confidence. Growth is driven mainly by enterprise upgrades and a 41% jump in pipeline velocity. I've also flagged 23 at-risk accounts worth protecting — want me to set up an automated follow-up workflow?"
    }
  ]);
  const [isCopilotTyping, setIsCopilotTyping] = useState(false);

  // Total Pipeline calculation in INR
  const totalPipeline = deals.reduce((acc, d) => acc + d.value, 0);
  const activeDeals = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const atRiskDeals = deals.filter(d => d.risk === 'High Risk' || d.risk === 'Silence' || d.risk === 'Stalled');

  const handleSendChat = (textToSend?: string) => {
    const q = textToSend || chatInput;
    if (!q.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user' as const, text: q }];
    setChatMessages(newMsgs);
    setChatInput('');
    setIsCopilotTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();
      if (lower.includes('risk') || lower.includes('at-risk')) {
        reply = `I've analyzed the pipeline: ${atRiskDeals.length} deals are currently flagged as at-risk totaling ${formatINR(atRiskDeals.reduce((a, b) => a + b.value, 0))}. Top priority is Aurora Solutions (₹2.50 Cr, 14 days silence, active BYOK InfoSec objection).`;
      } else if (lower.includes('meeting') || lower.includes('agenda')) {
        reply = `Next priority meeting is with Aurora Solutions CITO Rajesh Subramanian & Vikram Merchant. Suggested focus: Bring-Your-Own-KMS architecture proof to clear InfoSec blocker before the Oct 15 budget lock.`;
      } else if (lower.includes('proposal') || lower.includes('pricing') || lower.includes('flexion')) {
        reply = `For Flexion Enterprises, the customer budget is capped at ₹1.80 Cr against our quoted ₹2.00 Cr. Recommend offering a complimentary Technical Account Manager rather than discounting license fees.`;
      } else if (lower.includes('byok') || lower.includes('kms') || lower.includes('security')) {
        reply = `BYOK Spec defense synthesized: AWS KMS/Azure Key Vault with client-held keys, sub-42ms latency SLA verified in Tier-1 private bank deployments, RBI data localization compliance certified.`;
      } else if (lower.includes('forecast') || lower.includes('quarter')) {
        reply = `Q4 Forecast Model: ₹2.60 Cr projected with 96.8% confidence interval. Pipeline velocity is highest in BFSI, with Globex Corporation contract (₹2.10 Cr) successfully recognized.`;
      } else if (lower.includes('promise') || lower.includes('commitments')) {
        reply = `Hindsight memory bank recalls 2 open commitments for Aurora Solutions: 1) Deliver BYOK specification within 5 days. 2) Provide sub-50ms latency benchmark proof.`;
      } else {
        reply = `Synthesized from deal records and persistent Hindsight memory: Pipeline value stands at ${formatINR(totalPipeline)} with ${deals.length} tracked enterprise accounts. All memories and commitments are actively indexed in Indian Rupee (₹).`;
      }

      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsCopilotTyping(false);
    }, 600);
  };

  // Timeframe chart configurations
  const chartConfigs = {
    week: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      pathPurple: "M 50 140 C 130 110, 200 40, 310 70 C 400 110, 480 60, 600 50",
      areaPurple: "M 50 140 C 130 110, 200 40, 310 70 C 400 110, 480 60, 600 50 L 600 180 L 50 180 Z",
      pathOrange: "M 50 160 C 120 150, 220 80, 310 90 C 420 100, 500 130, 600 95",
      areaOrange: "M 50 160 C 120 150, 220 80, 310 90 C 420 100, 500 130, 600 95 L 600 180 L 50 180 Z",
      anchorX: 310,
      anchorY: 70,
      tooltipDate: 'Thu, Feb 3, 2026',
      forecastVal: '₹1,48,200',
      pipelineVal: '₹5,48,300',
      totalVal: '₹68.5 L',
      subtitle: 'Weekly deal velocity & daily commitments in INR'
    },
    month: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      pathPurple: "M 50 160 C 180 120, 300 50, 420 80 C 480 100, 540 60, 600 55",
      areaPurple: "M 50 160 C 180 120, 300 50, 420 80 C 480 100, 540 60, 600 55 L 600 180 L 50 180 Z",
      pathOrange: "M 50 170 C 160 140, 280 90, 420 100 C 500 110, 550 120, 600 90",
      areaOrange: "M 50 170 C 160 140, 280 90, 420 100 C 500 110, 550 120, 600 90 L 600 180 L 50 180 Z",
      anchorX: 420,
      anchorY: 80,
      tooltipDate: 'Week 3 (Sep 18 - 25, 2026)',
      forecastVal: '₹62,40,000',
      pipelineVal: '₹1.84 Cr',
      totalVal: '₹2.84 Cr',
      subtitle: 'Monthly pipeline velocity & closed revenue in INR'
    },
    year: {
      labels: ['Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026 (Est)'],
      pathPurple: "M 50 170 C 180 140, 290 90, 400 60 C 480 40, 540 35, 600 30",
      areaPurple: "M 50 170 C 180 140, 290 90, 400 60 C 480 40, 540 35, 600 30 L 600 180 L 50 180 Z",
      pathOrange: "M 50 180 C 170 150, 280 110, 390 85 C 470 70, 530 65, 600 50",
      areaOrange: "M 50 180 C 170 150, 280 110, 390 85 C 470 70, 530 65, 600 50 L 600 180 L 50 180 Z",
      anchorX: 400,
      anchorY: 60,
      tooltipDate: 'Q3 2026 Milestone',
      forecastVal: '₹2.60 Cr',
      pipelineVal: '₹8.20 Cr',
      totalVal: '₹12.4 Cr',
      subtitle: 'Annual multi-quarter trajectory & quota pace in INR'
    }
  };

  const currentChart = chartConfigs[timeframe];

  // Pipeline flow stages
  const flowStages: { stage: DealStage; label: string; count: number; value: string }[] = [
    { stage: 'Qualification', label: 'Qualification', count: 12, value: '₹2.1 Cr' },
    { stage: 'Discovery', label: 'Discovery', count: 18, value: '₹3.4 Cr' },
    { stage: 'Proposal', label: 'Proposal', count: 10, value: '₹2.7 Cr' },
    { stage: 'Negotiation', label: 'Negotiation', count: 7, value: '₹1.9 Cr' },
    { stage: 'Closed Won', label: 'Closed Won', count: 9, value: '₹3.6 Cr' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* 4 TOP KPI CARDS - ALL CLICKABLE BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <button
          onClick={() => setActiveKpiModal('revenue')}
          className="nexus-card p-5 space-y-2 text-left hover:border-emerald-300 hover:shadow-md transition-all group"
          title="Click to view Revenue and Quota breakdown"
        >
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700">Revenue</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            ₹2.84 Cr
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit">
            <span>+18%</span>
            <span className="font-normal text-slate-500">Vs last month</span>
          </div>
        </button>

        {/* Pipeline Value */}
        <button
          onClick={() => setActiveKpiModal('pipeline')}
          className="nexus-card p-5 space-y-2 text-left hover:border-blue-300 hover:shadow-md transition-all group"
          title="Click to view Pipeline Value breakdown"
        >
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700">Pipeline Value</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {formatINR(totalPipeline, true)}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            <span className="font-semibold text-blue-600">{activeDeals.length}</span> Active Opportunities
          </div>
        </button>

        {/* Deals Won */}
        <button
          onClick={() => setActiveKpiModal('deals_won')}
          className="nexus-card p-5 space-y-2 text-left hover:border-teal-300 hover:shadow-md transition-all group"
          title="Click to view Deals Won breakdown"
        >
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700">Deals Won</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            148
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            <span className="font-semibold text-teal-600">72%</span> Win Rate
          </div>
        </button>

        {/* Forecast Accuracy */}
        <button
          onClick={() => setActiveKpiModal('forecast')}
          className="nexus-card p-5 space-y-2 text-left hover:border-purple-300 hover:shadow-md transition-all group"
          title="Click to view Predictive Forecast model"
        >
          <div className="flex items-center justify-between text-slate-500">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-700">Forecast Accuracy</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            96%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            <span className="font-semibold text-purple-600">14K</span> Predictions Analyzed
          </div>
        </button>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT MATCHING IMAGE 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER COLUMN (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* REVENUE GROWTH CHART CARD WITH ANIMATED WEEK/MONTH/YEAR DATA */}
          <div className="nexus-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Revenue Growth</h3>
                <p className="text-xs text-slate-400">{currentChart.subtitle}</p>
              </div>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === 'week' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                  }`}
                >
                  1 Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === 'month' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setTimeframe('year')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === 'year' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'hover:text-slate-900'
                  }`}
                >
                  Year
                </button>
              </div>
            </div>

            {/* CURVE CHART SVG WITH DYNAMIC PATHS */}
            <div className="relative h-64 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 650 200">
                <defs>
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FB923C" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#FB923C" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="0" y1="30" x2="650" y2="30" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="650" y2="80" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="650" y2="130" stroke="#F1F5F9" strokeDasharray="3 3" />
                <line x1="0" y1="180" x2="650" y2="180" stroke="#E2E8F0" />

                {/* Y Axis Labels */}
                <text x="5" y="32" fontSize="10" fill="#94A3B8">₹80L</text>
                <text x="5" y="82" fontSize="10" fill="#94A3B8">₹60L</text>
                <text x="5" y="132" fontSize="10" fill="#94A3B8">₹40L</text>
                <text x="5" y="178" fontSize="10" fill="#94A3B8">₹20L</text>

                {/* Area 1: Purple Gradient */}
                <path
                  d={currentChart.areaPurple}
                  fill="url(#purpleGrad)"
                  className="transition-all duration-300"
                />
                {/* Line 1: Purple */}
                <path
                  d={currentChart.pathPurple}
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Area 2: Orange Gradient */}
                <path
                  d={currentChart.areaOrange}
                  fill="url(#orangeGrad)"
                  className="transition-all duration-300"
                />
                {/* Line 2: Orange */}
                <path
                  d={currentChart.pathOrange}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Active Tooltip Anchor */}
                <circle cx={currentChart.anchorX} cy={currentChart.anchorY} r="5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1={currentChart.anchorX} y1="20" x2={currentChart.anchorX} y2="180" stroke="#0F172A" strokeDasharray="2 2" strokeOpacity="0.4" />

                {/* X Axis Labels */}
                {currentChart.labels.map((lbl, idx) => {
                  const xPos = 50 + (idx * (550 / (currentChart.labels.length - 1 || 1)));
                  return (
                    <text key={idx} x={xPos} y="196" fontSize="10" fill="#94A3B8" textAnchor="middle">
                      {lbl}
                    </text>
                  );
                })}
              </svg>

              {/* Floating Tooltip Box matching Image 1 */}
              <div 
                style={{ left: `${(currentChart.anchorX / 650) * 85}%` }}
                className="absolute top-[8%] bg-slate-900 text-white rounded-xl p-3 text-xs shadow-xl border border-slate-800 space-y-1 z-10 transition-all duration-200"
              >
                <div className="flex items-center gap-1.5 text-slate-300 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{currentChart.tooltipDate}</span>
                </div>
                <div className="font-semibold text-slate-100 flex items-center justify-between gap-3">
                  <span className="text-indigo-400">● Forecast:</span>
                  <span>{currentChart.forecastVal}</span>
                </div>
                <div className="font-semibold text-slate-100 flex items-center justify-between gap-3">
                  <span className="text-orange-400">● Pipeline:</span>
                  <span>{currentChart.pipelineVal}</span>
                </div>
                <div className="font-bold text-slate-100 pt-1 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span>Total Val:</span>
                  <span>{currentChart.totalVal}</span>
                </div>
              </div>
            </div>

            {/* FLOWCHART / DEAL VELOCITY TIMELINE (USER REQUESTED: "flowchart should be animated and workable") */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-orange-500" />
                  <span>Pipeline Conversion Flowchart (Click any stage)</span>
                </span>
                <span className="text-[10px] text-slate-400">Live Stage Velocity Flow</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {flowStages.map((st, idx) => {
                  const isSelected = selectedFlowStage === st.stage;
                  return (
                    <div
                      key={st.stage}
                      onClick={() => setSelectedFlowStage(isSelected ? null : st.stage)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left relative ${
                        isSelected 
                          ? 'border-orange-500 bg-orange-50/50 shadow-sm ring-1 ring-orange-200' 
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-500">{st.label}</span>
                        {idx < flowStages.length - 1 && (
                          <ArrowRight className="w-2.5 h-2.5 text-slate-300 hidden sm:block" />
                        )}
                      </div>
                      <div className="text-sm font-bold text-slate-900 mt-1">{st.value}</div>
                      <div className="text-[10px] text-slate-400">{st.count} deals flowing</div>
                    </div>
                  );
                })}
              </div>

              {/* Show deals in selected flow stage if clicked */}
              {selectedFlowStage && (
                <div className="p-3 bg-orange-50/40 border border-orange-200 rounded-xl space-y-2 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-950">
                      Deals currently in {selectedFlowStage}:
                    </span>
                    <button
                      onClick={() => setSelectedFlowStage(null)}
                      className="text-[10px] font-semibold text-slate-400 hover:text-slate-700"
                    >
                      Close preview
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {deals.filter(d => d.stage === selectedFlowStage).map(d => (
                      <button
                        key={d.id}
                        onClick={() => onSelectDeal(d.id)}
                        className="px-2.5 py-1 bg-white border border-orange-200 hover:border-orange-400 rounded-lg text-left text-xs transition-colors shadow-xs"
                      >
                        <strong className="text-slate-900">{d.company}</strong> ({formatINR(d.value, true)})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3 MINI STATUS CARDS - ALL WORKING BUTTONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pipeline Health - Clickable Modal */}
            <button
              onClick={() => setActiveKpiModal('health')}
              className="nexus-card p-4 space-y-2 text-left hover:border-emerald-300 transition-all group"
              title="Click to diagnose Pipeline Health"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pipeline Health</span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <div className="text-[11px] text-slate-400">124 Active Deals</div>
              <div className="text-xl font-bold text-slate-900">82%</div>
              {/* Mini vertical bar graph visualization */}
              <div className="flex items-end gap-1 h-7 pt-1">
                {[40, 60, 50, 80, 90, 75, 85, 60, 95, 82, 88, 92, 70, 85, 90, 82].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-emerald-400/80 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <span>14.2K Total Deals</span>
                <span className="text-slate-600 font-semibold">22 Flagged</span>
              </div>
            </button>

            {/* Deals At Risk - Clickable to Risk Agent */}
            <button 
              onClick={onOpenRiskAgent}
              className="nexus-card p-4 space-y-2 text-left hover:border-orange-300 transition-all group cursor-pointer"
              title="Click to open Deal Risk Agent"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                  <span>Deals At Risk</span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-orange-600 transition-colors" />
              </div>
              <div className="text-[11px] text-slate-400">23 Deals Need Review</div>
              <div className="text-xl font-bold text-slate-900">68.34%</div>
              {/* Mini vertical bar graph visualization */}
              <div className="flex items-end gap-1 h-7 pt-1">
                {[65, 70, 85, 60, 90, 75, 68, 80, 70, 68, 75, 82, 60, 70, 68, 65].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-orange-400/80 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <span>14.2K Total Deals</span>
                <span className="text-orange-600 font-semibold">23 At Risk</span>
              </div>
            </button>

            {/* Billing Status - Clickable Modal */}
            <button
              onClick={() => setActiveKpiModal('billing')}
              className="nexus-card p-4 space-y-2 text-left hover:border-blue-300 transition-all group"
              title="Click to view Billing and Invoices"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Billing Status</span>
                </div>
                <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="text-[11px] text-slate-400">4 Pending Invoices</div>
              <div className="text-xl font-bold text-slate-900">62.34%</div>
              {/* Mini vertical bar graph visualization */}
              <div className="flex items-end gap-1 h-7 pt-1">
                {[50, 45, 60, 70, 55, 62, 65, 58, 62, 70, 65, 55, 60, 62, 58, 62].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className="flex-1 bg-blue-400/80 rounded-t-sm"
                  />
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                <span>₹14.2 Cr Collected</span>
                <span className="text-blue-600 font-semibold">4 Pending</span>
              </div>
            </button>
          </div>

          {/* ACTIVE DEALS TABLE CARD */}
          <div className="nexus-card overflow-hidden">
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900">Active deals</h3>
              <button
                onClick={onViewAllDeals}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="py-3 px-5">Client</th>
                    <th className="py-3 px-4">Task</th>
                    <th className="py-3 px-4">Due date</th>
                    <th className="py-3 px-4">Revenue</th>
                    <th className="py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deals.slice(0, 5).map((deal) => {
                    const statusBadge = 
                      deal.stage === 'Closed Won' ? { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Completed' }
                      : deal.risk === 'High Risk' || deal.risk === 'Silence' ? { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending' }
                      : { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'In progress' };

                    return (
                      <tr 
                        key={deal.id}
                        onClick={() => onSelectDeal(deal.id)}
                        className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-semibold flex items-center justify-center text-xs border border-slate-200">
                              {deal.company.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{deal.company}</div>
                              <div className="text-[11px] text-slate-400">{deal.name.slice(0, 30)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 font-medium">
                          {deal.industry} • {deal.stage}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(deal.closeDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                          {formatINR(deal.value)}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge.bg}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN MATCHING IMAGE 1 (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* GOOD MORNING ALEX STATUS CARD */}
          <div className="nexus-card p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Good Morning, Alex 👋</h3>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Live
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>Revenue increased by <strong className="text-slate-900">18%</strong> this month</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">7 deals</strong> require attention today</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900">12 hot leads</strong> detected this week</span>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                <span>Pipeline health is <strong className="text-emerald-600">excellent</strong></span>
              </div>
            </div>
          </div>

          {/* 4 WORKING QUICK ACTION BUTTONS (USER REQUESTED: "generate flow of email and create a proposal option and scheduling meeting and predict outcome") */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onOpenEmailComposer ? onOpenEmailComposer() : handleSendChat('Generate follow-up email for Aurora Solutions')}
              className="nexus-card p-3.5 text-left hover:border-orange-400 hover:shadow-sm transition-all flex flex-col justify-between h-24 group cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-500 group-hover:text-orange-500 transition-colors" />
              <div>
                <span className="text-xs font-semibold text-slate-800 leading-tight block">
                  Generate Follow-up Email
                </span>
                <span className="text-[10px] text-orange-600 font-medium">Run AI Flow →</span>
              </div>
            </button>

            <button
              onClick={() => onOpenProposal ? onOpenProposal() : handleSendChat('Create commercial proposal draft in INR')}
              className="nexus-card p-3.5 text-left hover:border-blue-400 hover:shadow-sm transition-all flex flex-col justify-between h-24 group cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
              <div>
                <span className="text-xs font-semibold text-slate-800 leading-tight block">
                  Create Proposal
                </span>
                <span className="text-[10px] text-blue-600 font-medium">In INR (₹) →</span>
              </div>
            </button>

            <button
              onClick={() => onOpenScheduleMeeting ? onOpenScheduleMeeting() : handleSendChat('Schedule CISO alignment meeting with Vikram Merchant')}
              className="nexus-card p-3.5 text-left hover:border-emerald-400 hover:shadow-sm transition-all flex flex-col justify-between h-24 group cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500 group-hover:text-emerald-600 transition-colors" />
              <div>
                <span className="text-xs font-semibold text-slate-800 leading-tight block">
                  Schedule Meeting
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">AI Agenda →</span>
              </div>
            </button>

            <button
              onClick={() => onOpenPredictOutcome ? onOpenPredictOutcome() : handleSendChat('Predict outcome for Aurora Solutions and Flexion deals')}
              className="nexus-card p-3.5 text-left hover:border-purple-400 hover:shadow-sm transition-all flex flex-col justify-between h-24 group cursor-pointer"
            >
              <Target className="w-4 h-4 text-slate-500 group-hover:text-purple-600 transition-colors" />
              <div>
                <span className="text-xs font-semibold text-slate-800 leading-tight block">
                  Predict Deal Outcome
                </span>
                <span className="text-[10px] text-purple-600 font-medium">Win/Loss ML →</span>
              </div>
            </button>
          </div>

          {/* EMBEDDED NEXUSAI COPILOT CHAT WITH EXPANDED RECOMMENDATION CHIPS */}
          <div className="nexus-card overflow-hidden flex flex-col h-[390px]">
            {/* Header */}
            <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center text-white">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-slate-900">NexusAI Copilot</span>
              </div>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer" />
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white font-medium rounded-br-none shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isCopilotTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 text-slate-400 rounded-xl px-3 py-1.5 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Suggestions & Input (USER REQUESTED: "I need more recommendations in that") */}
            <div className="p-3 bg-white border-t border-slate-100 space-y-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => handleSendChat('Show me the at-risk accounts...')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-600 whitespace-nowrap transition-colors"
                >
                  Show at-risk accounts
                </button>
                <button
                  onClick={() => handleSendChat('What did we promise Aurora Solutions?')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-600 whitespace-nowrap transition-colors"
                >
                  What did we promise?
                </button>
                <button
                  onClick={() => handleSendChat('Draft BYOK KMS security defense')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-600 whitespace-nowrap transition-colors"
                >
                  Draft BYOK defense
                </button>
                <button
                  onClick={() => handleSendChat('Simulate Flexion pricing concession')}
                  className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-600 whitespace-nowrap transition-colors"
                >
                  Flexion pricing move
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Ask NexusAI about deal memory..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-500 rounded-lg focus:outline-none transition-colors"
                />
                <button
                  onClick={() => handleSendChat()}
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center transition-colors shadow-sm"
                  title="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI DETAIL MODALS */}
      <KpiDetailModal
        type={activeKpiModal}
        isOpen={Boolean(activeKpiModal)}
        onClose={() => setActiveKpiModal(null)}
        deals={deals}
        onSelectDeal={onSelectDeal}
        onNavigateToPipeline={onOpenPipeline}
      />
    </div>
  );
};
