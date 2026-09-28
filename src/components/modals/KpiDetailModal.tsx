'use client';

import React from 'react';
import { 
  X, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Target, 
  Activity, 
  Clock, 
  Receipt, 
  ArrowUpRight, 
  Send, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { Deal } from '@/types';
import { formatINR } from '@/lib/format';

export type KpiModalType = 
  | 'revenue' 
  | 'pipeline' 
  | 'deals_won' 
  | 'forecast' 
  | 'health' 
  | 'billing' 
  | null;

interface KpiDetailModalProps {
  type: KpiModalType;
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onNavigateToPipeline?: () => void;
}

export const KpiDetailModal: React.FC<KpiDetailModalProps> = ({
  type,
  isOpen,
  onClose,
  deals,
  onSelectDeal,
  onNavigateToPipeline,
}) => {
  if (!isOpen || !type) return null;

  const wonDeals = deals.filter(d => d.stage === 'Closed Won');
  const activeDeals = deals.filter(d => d.stage !== 'Closed Won' && d.stage !== 'Closed Lost');
  const totalPipeline = deals.reduce((acc, d) => acc + d.value, 0);

  // Invoices mock data for Billing status
  const invoices = [
    { id: 'INV-2026-08', company: 'Vertex Digital', amount: 4250000, due: 'Oct 02, 2026', status: 'Pending', daysLeft: '3 days left' },
    { id: 'INV-2026-07', company: 'Northwind Labs', amount: 3000000, due: 'Oct 10, 2026', status: 'Pending', daysLeft: '11 days left' },
    { id: 'INV-2026-06', company: 'Globex Corporation', amount: 21000000, due: 'Sep 15, 2026', status: 'Paid', daysLeft: 'Completed' },
    { id: 'INV-2026-05', company: 'Apex Cloud Systems', amount: 8500000, due: 'Sep 01, 2026', status: 'Paid', daysLeft: 'Completed' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            {type === 'revenue' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            )}
            {type === 'pipeline' && (
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
            )}
            {type === 'deals_won' && (
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            )}
            {type === 'forecast' && (
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
            )}
            {type === 'health' && (
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
            )}
            {type === 'billing' && (
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-900">
                {type === 'revenue' && 'Revenue & Quota Attainment Intelligence'}
                {type === 'pipeline' && 'Total Pipeline Value Breakdown'}
                {type === 'deals_won' && 'Closed Won Deals & Win Rate Analytics'}
                {type === 'forecast' && 'Predictive Revenue Forecast Model'}
                {type === 'health' && 'Pipeline Health & Velocity Diagnostics'}
                {type === 'billing' && 'Billing Status & Accounts Receivable'}
              </h3>
              <p className="text-xs text-slate-500">Live drill-down analysis in Indian Rupee (₹)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* REVENUE MODAL */}
          {type === 'revenue' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Recognized Revenue</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">₹2.84 Cr</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+18% Vs last month</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Quarterly Quota Target</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">₹3.50 Cr</div>
                  <div className="text-[10px] text-slate-500 font-medium">81.1% Target Achieved</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Projected Q3 Finish</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-0.5">₹3.92 Cr</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">112% Quota Attainment</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Top Revenue-Generating Accounts This Quarter:</div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {deals.slice(0, 4).map(d => (
                    <div key={d.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-semibold text-slate-900">{d.company}</div>
                        <div className="text-[11px] text-slate-400">{d.industry} • {d.owner}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatINR(d.value)}</div>
                        <span className="text-[10px] text-slate-500">{d.stage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PIPELINE MODAL */}
          {type === 'pipeline' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Total Pipeline</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">{formatINR(totalPipeline, true)}</div>
                  <div className="text-[10px] text-blue-600 font-semibold">{deals.length} Total Deals</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Active Opportunities</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">{activeDeals.length}</div>
                  <div className="text-[10px] text-slate-500">In Active Stages</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Weighted Pipeline</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-0.5">₹4.86 Cr</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Risk-Adjusted</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Pipeline Stage Distribution:</div>
                <div className="space-y-2">
                  {[
                    { stage: 'Qualification', count: 12, value: '₹2.1 Cr', pct: 20 },
                    { stage: 'Discovery', count: 18, value: '₹3.4 Cr', pct: 35 },
                    { stage: 'Proposal', count: 10, value: '₹2.7 Cr', pct: 25 },
                    { stage: 'Negotiation', count: 7, value: '₹1.9 Cr', pct: 15 },
                    { stage: 'Closed Won', count: 9, value: '₹3.6 Cr', pct: 30 },
                  ].map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700">{s.stage} ({s.count} deals)</span>
                        <span className="font-bold text-slate-900">{s.value}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${s.pct * 2.5}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DEALS WON MODAL */}
          {type === 'deals_won' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Total Won Deals</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">148</div>
                  <div className="text-[10px] text-teal-600 font-semibold">+24 YoY</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Win Rate</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">72%</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">Top Decile in SaaS</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Avg Sales Cycle</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">28 Days</div>
                  <div className="text-[10px] text-slate-500 font-medium">-6 days faster</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Recent Enterprise Wins:</div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="p-3 flex items-center justify-between bg-emerald-50/30">
                    <div>
                      <div className="font-bold text-slate-900">Globex Corporation</div>
                      <div className="text-[11px] text-slate-500">Telephony Migration • Closed by Sarah Jenkins</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-700">₹2.10 Cr</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Closed Won</span>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">Duck Creek Tech</div>
                      <div className="text-[11px] text-slate-500">Insurance Core • Closed by Alex Morgan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">₹1.30 Cr</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">Closed Won</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORECAST MODAL */}
          {type === 'forecast' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-xl">
                  <div className="text-purple-700 text-[11px] font-semibold">Forecast Accuracy</div>
                  <div className="text-2xl font-bold text-purple-950 mt-0.5">96.8%</div>
                  <div className="text-[10px] text-purple-600 font-medium">Model R² = 0.94</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Predictions Analyzed</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">14,280</div>
                  <div className="text-[10px] text-slate-400">Trained on Historical CRM</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Next Quarter Forecast</div>
                  <div className="text-2xl font-bold text-emerald-700 mt-0.5">₹2.60 Cr</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">+12.6% Growth</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-xs">AI Forecast Attribution:</div>
                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                  <li>• <strong>Enterprise Tier Upgrades:</strong> Generating +41% pipeline velocity in BFSI accounts.</li>
                  <li>• <strong>Slippage Mitigation:</strong> 23 at-risk accounts identified early to protect ₹4.28 Cr.</li>
                  <li>• <strong>Cycle Compression:</strong> BYOK security compliance decks reduced negotiation stalls by 14 days.</li>
                </ul>
              </div>
            </div>
          )}

          {/* PIPELINE HEALTH MODAL */}
          {type === 'health' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                  <div className="text-emerald-700 text-[11px] font-semibold">Overall Pipeline Health</div>
                  <div className="text-2xl font-bold text-emerald-950 mt-0.5">82%</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Strong Health Rating</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Active Opportunities</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">124 Deals</div>
                  <div className="text-[10px] text-slate-500">Across 3 Pipelines</div>
                </div>
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                  <div className="text-amber-700 text-[11px] font-semibold">Attention Required</div>
                  <div className="text-2xl font-bold text-amber-950 mt-0.5">22 Flagged</div>
                  <div className="text-[10px] text-amber-600 font-medium">Stalled &gt; 14 Days</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="font-semibold text-slate-900">Health Factors Diagnosed by NexusAI:</div>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-semibold text-slate-700">Stage Velocity:</span>
                    <p className="text-slate-500 mt-0.5">Average time in Discovery is 14 days (healthy). Qualification to Proposal conversion is 68%.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-semibold text-slate-700">Stakeholder Engagement:</span>
                    <p className="text-slate-500 mt-0.5">3.4 decision-makers mapped per Tier-1 deal. Security blockers are primary friction point.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BILLING STATUS MODAL */}
          {type === 'billing' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Collected Revenue</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">₹14.2 Cr</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">FY26 Collections</div>
                </div>
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl">
                  <div className="text-blue-700 text-[11px] font-semibold">Pending Invoices</div>
                  <div className="text-2xl font-bold text-blue-950 mt-0.5">4 Invoices</div>
                  <div className="text-[10px] text-blue-600 font-medium">₹72.5 L In Progress</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-[11px]">Collection Efficiency</div>
                  <div className="text-2xl font-bold text-slate-900 mt-0.5">62.34%</div>
                  <div className="text-[10px] text-slate-500 font-medium">DSO: 22 Days</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-semibold text-slate-800">Pending & Recent Invoices:</div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <span>{inv.company}</span>
                          <span className="text-[10px] font-mono text-slate-400">({inv.id})</span>
                        </div>
                        <div className="text-[11px] text-slate-400">Due: {inv.due} • {inv.daysLeft}</div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{formatINR(inv.amount)}</div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        {inv.status === 'Pending' && (
                          <button
                            onClick={() => alert(`Payment reminder email dispatched for ${inv.company} (${inv.id})`)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-[10px] font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <Send className="w-2.5 h-2.5" />
                            <span>Remind</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            NexusAI real-time metric synchronization active
          </span>
          <div className="flex items-center gap-2">
            {type === 'pipeline' && onNavigateToPipeline && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToPipeline();
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                Open Full Pipeline View
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
