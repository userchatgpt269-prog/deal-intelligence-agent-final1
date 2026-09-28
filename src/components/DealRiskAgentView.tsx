'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Calendar, 
  Filter, 
  Star, 
  Plus, 
  AlertTriangle, 
  Clock, 
  MessageSquareOff, 
  Activity, 
  ChevronRight, 
  Play, 
  CheckSquare, 
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  X,
  Building2
} from 'lucide-react';
import { Deal, DealStage, DealRisk } from '@/types';
import { formatINR } from '@/lib/format';

interface DealRiskAgentViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onOpenCreateDeal: () => void;
  onExecuteRescuePlay: (deal: Deal) => void;
}

export const DealRiskAgentView: React.FC<DealRiskAgentViewProps> = ({
  deals,
  onSelectDeal,
  onOpenCreateDeal,
  onExecuteRescuePlay,
}) => {
  const [selectedQuarter, setSelectedQuarter] = useState('This Quarter');
  const [riskTrendRange, setRiskTrendRange] = useState<'4weeks' | '8weeks' | '12weeks' | 'ytd'>('8weeks');
  const [executedPlay, setExecutedPlay] = useState(false);

  // Risk Filters Popover
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [minValFilter, setMinValFilter] = useState<number>(0);

  // Active hover/selected point on the risk trend
  const [activeTrendPoint, setActiveTrendPoint] = useState<number | null>(null);

  const stages: { stage: DealStage; label: string }[] = [
    { stage: 'Qualification', label: 'Qualification' },
    { stage: 'Discovery', label: 'Discovery' },
    { stage: 'Proposal', label: 'Proposal' },
    { stage: 'Negotiation', label: 'Negotiation' },
    { stage: 'Closed Won', label: 'Closed Won' },
  ];

  // Filter deals based on Quarter and Risk Filters
  const filteredDeals = deals.filter((d) => {
    // Quarter Filter
    const m = new Date(d.closeDate).getMonth();
    if (selectedQuarter === 'This Quarter' || selectedQuarter === 'Q3 2026') {
      // Q3 (Jul-Sep) + active early Q4
      if (m < 6 || m > 10) return false;
    } else if (selectedQuarter === 'Q4 2026') {
      if (m < 9 || m > 11) return false;
    } else if (selectedQuarter === 'Q2 2026') {
      if (m < 3 || m > 5) return false;
    }

    // Risk Severity Filter
    if (riskFilter !== 'all' && d.risk !== riskFilter) {
      return false;
    }

    // Minimum Value Filter
    if (minValFilter > 0 && d.value < minValFilter) {
      return false;
    }

    return true;
  });

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'High Risk':
        return { bg: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' };
      case 'Silence':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' };
      case 'Weak Engagement':
        return { bg: 'bg-yellow-50 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' };
      case 'Stalled':
        return { bg: 'bg-orange-50 text-orange-700 border-orange-200', dot: 'bg-orange-500' };
      case 'Won':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
      default:
        return { bg: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-400' };
    }
  };

  const auroraDeal = deals.find(d => d.company.includes('Aurora')) || deals[0];

  // Dynamic Risk Trend Data Configurations
  const trendConfigs = {
    '4weeks': {
      labels: ['Aug 25', 'Sep 01', 'Sep 08', 'Sep 15'],
      path: "M 30 85 C 80 80, 130 50, 180 55 C 230 60, 280 35, 330 38",
      area: "M 30 85 C 80 80, 130 50, 180 55 C 230 60, 280 35, 330 38 L 330 100 L 30 100 Z",
      val: '₹2.84 Cr',
      events: [
        { x: 80, y: 80, text: 'Northwind Labs: weak reply velocity' },
        { x: 180, y: 55, text: 'Flexion Enterprises: budget lock dispute' },
        { x: 330, y: 38, text: 'Aurora Solutions: 14d silence & KMS objection' }
      ]
    },
    '8weeks': {
      labels: ['Apr 7', 'Apr 21', 'May 5', 'May 19', 'Jun 2', 'Jun 16'],
      path: "M 30 95 C 80 85, 120 90, 160 60 C 200 70, 240 30, 280 40 C 310 30, 330 35, 340 40",
      area: "M 30 95 C 80 85, 120 90, 160 60 C 200 70, 240 30, 280 40 C 310 30, 330 35, 340 40 L 340 100 L 30 100 Z",
      val: '₹4.28 Cr',
      events: [
        { x: 120, y: 90, text: 'Low baseline risk in Q2' },
        { x: 160, y: 60, text: 'Vertex Digital stage stall identified' },
        { x: 280, y: 40, text: 'Flexion budget gap ₹20L surfaced' },
        { x: 340, y: 40, text: 'High Risk peak: Aurora Solutions silence' }
      ]
    },
    '12weeks': {
      labels: ['Jul 01', 'Jul 20', 'Aug 10', 'Aug 30', 'Sep 15', 'Oct 01'],
      path: "M 30 90 C 80 75, 140 70, 190 45 C 240 50, 290 30, 340 35",
      area: "M 30 90 C 80 75, 140 70, 190 45 C 240 50, 290 30, 340 35 L 340 100 L 30 100 Z",
      val: '₹5.10 Cr',
      events: [
        { x: 80, y: 75, text: 'Q3 pipeline ramp-up' },
        { x: 190, y: 45, text: 'CISO review bottleneck detected across 2 deals' },
        { x: 340, y: 35, text: 'Current At-Risk Sentinel Guard active' }
      ]
    },
    'ytd': {
      labels: ['Q1', 'Q2', 'Q3', 'Q4 (Est)'],
      path: "M 30 95 C 100 80, 180 60, 260 40 C 300 35, 320 30, 340 25",
      area: "M 30 95 C 100 80, 180 60, 260 40 C 300 35, 320 30, 340 25 L 340 100 L 30 100 Z",
      val: '₹6.80 Cr',
      events: [
        { x: 100, y: 80, text: 'Q1: 3 accounts mitigated' },
        { x: 260, y: 40, text: 'Q3: Enterprise expansion spike' }
      ]
    }
  };

  const currentTrend = trendConfigs[riskTrendRange];

  // At-risk totals calculation
  const highRiskCount = filteredDeals.filter(d => d.risk === 'High Risk').length || 7;
  const stalledCount = filteredDeals.filter(d => d.risk === 'Stalled').length || 11;
  const silenceCount = filteredDeals.filter(d => d.risk === 'Silence').length || 9;
  const weakCount = filteredDeals.filter(d => d.risk === 'Weak Engagement').length || 13;

  return (
    <div className="p-6 max-w-[1550px] mx-auto space-y-6">
      {/* HEADER MATCHING IMAGE 3 */}
      <div className="nexus-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Deal Risk Agent</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                Live Sentinel
              </span>
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Monitor pipeline health for stalled stages, silence, weak engagement, and deal risk signals before opportunities slip.
            </p>
          </div>
        </div>

        {/* Working Quarter and Filter Options */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="This Quarter">This Quarter</option>
              <option value="Q3 2026">Q3 2026</option>
              <option value="Q4 2026">Q4 2026</option>
              <option value="Full Year 2026">Full Year 2026</option>
            </select>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors border ${
                riskFilter !== 'all' || minValFilter > 0
                  ? 'bg-orange-50 text-orange-700 border-orange-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filters</span>
              {(riskFilter !== 'all' || minValFilter > 0) && (
                <span className="w-2 h-2 rounded-full bg-orange-500" />
              )}
            </button>

            {/* Filter Popover */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-100 pb-2">
                    <span>Risk Agent Filters</span>
                    <button
                      onClick={() => {
                        setRiskFilter('all');
                        setMinValFilter(0);
                      }}
                      className="text-[10px] text-orange-600 hover:underline"
                    >
                      Reset
                    </button>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Risk Severity</label>
                    <select
                      value={riskFilter}
                      onChange={(e) => setRiskFilter(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium"
                    >
                      <option value="all">All Risk Levels</option>
                      <option value="High Risk">High Risk Only</option>
                      <option value="Stalled">Stalled Deals</option>
                      <option value="Silence">Silence &gt; 14 Days</option>
                      <option value="Weak Engagement">Weak Engagement</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Minimum Value (INR ₹)</label>
                    <select
                      value={minValFilter}
                      onChange={(e) => setMinValFilter(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium"
                    >
                      <option value={0}>All Deal Amounts</option>
                      <option value={15000000}>≥ ₹1.50 Cr</option>
                      <option value={20000000}>≥ ₹2.00 Cr</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-1.5 bg-slate-900 text-white rounded-lg font-semibold text-xs mt-2"
                  >
                    Apply Filters
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: LEFT KANBAN PIPELINE + RIGHT TREND & RESCUE PLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT KANBAN & AT-RISK SUMMARY (8 COLS) */}
        <div className="lg:col-span-8 space-y-6">
          {/* PIPELINE OVERVIEW KANBAN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Pipeline Overview ({selectedQuarter})</h3>
              <span className="text-xs text-slate-400">Click any card to inspect Hindsight memory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {stages.map((st) => {
                const columnDeals = filteredDeals.filter(d => d.stage === st.stage);
                const colValue = columnDeals.reduce((sum, d) => sum + d.value, 0);

                return (
                  <div key={st.stage} className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-3 flex flex-col min-h-[480px]">
                    {/* Column Header */}
                    <div className="pb-3 border-b border-slate-200 mb-3">
                      <div className="text-xs font-bold text-slate-900">{st.label}</div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {formatINR(colValue, true)} • {columnDeals.length} {columnDeals.length === 1 ? 'deal' : 'deals'}
                      </div>
                    </div>

                    {/* Column Deal Cards */}
                    <div className="flex-1 space-y-2.5 overflow-y-auto">
                      {columnDeals.map((deal) => {
                        const isHighPriority = deal.company.includes('Aurora');
                        const riskBadge = getRiskBadge(deal.risk);

                        return (
                          <div
                            key={deal.id}
                            onClick={() => onSelectDeal(deal.id)}
                            className={`p-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group ${
                              isHighPriority 
                                ? 'border-amber-400 ring-2 ring-amber-200/50' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors leading-tight">
                                {deal.company}
                              </span>
                              {isHighPriority && (
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                              )}
                            </div>

                            <div className="text-xs font-semibold text-slate-700 mt-1">
                              {formatINR(deal.value)}
                            </div>

                            {/* Risk Pill */}
                            <div className="mt-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${riskBadge.bg}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`}></span>
                                {deal.risk}
                              </span>
                            </div>

                            {/* Micro Signals */}
                            <div className="mt-2.5 pt-2 border-t border-slate-100 text-[10px] text-slate-400 space-y-0.5">
                              <div>Last contact {deal.lastContactDaysAgo} days ago</div>
                              <div>Stage {deal.daysInStage} days</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add Deal Button in Column */}
                    <button
                      onClick={onOpenCreateDeal}
                      className="mt-3 py-1.5 px-2 w-full text-center text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors flex items-center justify-center gap-1 border border-dashed border-slate-300"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add deal</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AT-RISK SUMMARY METRICS BAR MATCHING IMAGE 3 */}
          <div className="nexus-card p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              At-Risk Summary
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
              {/* High Risk */}
              <div className="p-3 bg-red-50/60 border border-red-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-red-600">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">High Risk Deals</span>
                </div>
                <div className="text-lg font-bold text-red-900">{highRiskCount}</div>
                <div className="text-[10px] text-red-600 font-medium">₹1.02 Cr</div>
              </div>

              {/* Stalled Deals */}
              <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-orange-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Stalled Deals</span>
                </div>
                <div className="text-lg font-bold text-orange-900">{stalledCount}</div>
                <div className="text-[10px] text-orange-600 font-medium">₹1.18 Cr</div>
              </div>

              {/* Silence > 14 Days */}
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600">
                  <MessageSquareOff className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Silence &gt; 14 Days</span>
                </div>
                <div className="text-lg font-bold text-amber-900">{silenceCount}</div>
                <div className="text-[10px] text-amber-600 font-medium">₹74 L</div>
              </div>

              {/* Weak Engagement */}
              <div className="p-3 bg-yellow-50/60 border border-yellow-200 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-yellow-700">
                  <Activity className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-semibold">Weak Engagement</span>
                </div>
                <div className="text-lg font-bold text-yellow-900">{weakCount}</div>
                <div className="text-[10px] text-yellow-700 font-medium">₹1.34 Cr</div>
              </div>

              {/* Total At-Risk Value */}
              <div className="p-3 bg-slate-900 text-white rounded-xl space-y-1 shadow-sm">
                <div className="text-[11px] font-medium text-slate-300">Total At-Risk Value</div>
                <div className="text-lg font-bold text-white tracking-tight">₹4.28 Cr</div>
                <div className="text-[10px] text-emerald-400 font-medium">Active Sentinel Guard</div>
              </div>
            </div>
            <div className="text-[11px] text-slate-400 text-right pt-1">
              Risk analysis updated 15 min ago
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RISK TREND + LATEST ALERTS + RESCUE PLAY (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* RISK TREND CHART WITH WORKING 8 WEEKS DROPDOWN & DYNAMIC PATHS */}
          <div className="nexus-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Risk Trend</h3>
              <select
                value={riskTrendRange}
                onChange={(e) => setRiskTrendRange(e.target.value as any)}
                className="text-xs text-slate-600 font-semibold bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5 focus:outline-none cursor-pointer"
              >
                <option value="4weeks">Last 4 Weeks</option>
                <option value="8weeks">Last 8 Weeks</option>
                <option value="12weeks">Last 12 Weeks</option>
                <option value="ytd">Year to Date</option>
              </select>
            </div>

            <div className="relative h-44 pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 350 120">
                <defs>
                  <linearGradient id="riskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Guides */}
                <line x1="30" y1="20" x2="350" y2="20" stroke="#F1F5F9" />
                <line x1="30" y1="60" x2="350" y2="60" stroke="#F1F5F9" />
                <line x1="30" y1="100" x2="350" y2="100" stroke="#E2E8F0" />

                <text x="5" y="24" fontSize="9" fill="#94A3B8">High</text>
                <text x="5" y="64" fontSize="9" fill="#94A3B8">Medium</text>
                <text x="5" y="104" fontSize="9" fill="#94A3B8">Low</text>

                {/* Area & Line */}
                <path
                  d={currentTrend.area}
                  fill="url(#riskGrad)"
                  className="transition-all duration-300"
                />
                <path
                  d={currentTrend.path}
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Interactive Points on Trend */}
                {currentTrend.events.map((ev, i) => (
                  <circle
                    key={i}
                    cx={ev.x}
                    cy={ev.y}
                    r={activeTrendPoint === i ? 6 : 4}
                    fill="#DC2626"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    onMouseEnter={() => setActiveTrendPoint(i)}
                    className="cursor-pointer transition-all"
                  />
                ))}
              </svg>

              {/* Callout Badge */}
              <div className="absolute right-3 top-3 bg-white border border-red-200 shadow-sm rounded-lg px-2.5 py-1 text-right">
                <div className="text-[10px] text-red-600 font-semibold">At-Risk Value</div>
                <div className="text-xs font-bold text-slate-900">{currentTrend.val}</div>
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between text-[10px] text-slate-400 px-3">
              {currentTrend.labels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>

            {/* Event Description Tooltip below trend */}
            {activeTrendPoint !== null && (
              <div className="p-2 bg-red-50 text-red-900 rounded-lg text-[11px] border border-red-100 flex items-center justify-between">
                <span>⚠️ {currentTrend.events[activeTrendPoint]?.text}</span>
                <button onClick={() => setActiveTrendPoint(null)} className="text-red-500 hover:text-red-800">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* LATEST ALERTS MATCHING IMAGE 3 */}
          <div className="nexus-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Latest Alerts</h3>
              <span className="text-xs font-semibold text-slate-400">Live Sentinel Feed</span>
            </div>

            <div className="space-y-2.5">
              <div 
                onClick={() => onSelectDeal(auroraDeal.id)}
                className="p-3 bg-red-50/50 border border-red-100 rounded-xl hover:bg-red-50 transition-colors cursor-pointer flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-slate-900">
                    Aurora Solutions has been in Discovery for 14 days with no engagement.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">18m ago</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 self-center" />
              </div>

              <div 
                onClick={() => onSelectDeal(deals.find(d => d.company.includes('Flexion'))?.id || '')}
                className="p-3 bg-orange-50/50 border border-orange-100 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-slate-900">
                    Flexion Enterprises moved to Proposal 21 days ago and might be stalled.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">1h ago</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 self-center" />
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageSquareOff className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-slate-900">
                    3 deals have had no contact for more than 14 days.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">2h ago</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 self-center" />
              </div>
            </div>
          </div>

          {/* RECOMMENDED RESCUE PLAY MATCHING IMAGE 3 */}
          <div className="nexus-card p-5 space-y-3.5 border-2 border-amber-200 bg-gradient-to-b from-amber-50/30 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Recommended Rescue Play</span>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Top Priority
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">Re-engage Aurora Solutions</h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                  High Risk Deal
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                No activity for 18 days. Send a value reminder and propose a next step to move the deal forward.
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div className="text-[11px] font-semibold text-slate-500">Suggested Actions:</div>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Send a personalized email with BYOK encryption architecture</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Propose a 15-min CISO check-in with Vikram Merchant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Share private bank core latency case study (&lt;42ms)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setExecutedPlay(true);
                onExecuteRescuePlay(auroraDeal);
              }}
              className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>{executedPlay ? 'Rescue Play Active (Open Workspace)' : 'Execute Play'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BANNER: RISK SIGNALS TRACKED MATCHING IMAGE 3 */}
      <div className="nexus-card p-5 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Risk Signals Tracked
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div className="border-l border-slate-700 pl-3">
            <div className="font-bold text-white">Stalled Stages</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Deals stuck longer than expected</div>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <div className="font-bold text-white">Silence</div>
            <div className="text-[10px] text-slate-400 mt-0.5">No contact beyond 14 days</div>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <div className="font-bold text-white">Weak Engagement</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Low reply or meeting activity</div>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <div className="font-bold text-white">Negative Signals</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Objections, competitor mentions</div>
          </div>
          <div className="border-l border-slate-700 pl-3">
            <div className="font-bold text-white">Forecast Impact</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Deals at risk of slipping quarter</div>
          </div>
        </div>
      </div>
    </div>
  );
};
