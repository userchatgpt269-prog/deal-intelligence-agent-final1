'use client';

import React, { useState } from 'react';
import { X, Target, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Deal } from '@/types';
import { formatINR } from '@/lib/format';

interface PredictOutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  initialDealId?: string;
  onSelectDeal?: (dealId: string) => void;
}

export const PredictOutcomeModal: React.FC<PredictOutcomeModalProps> = ({
  isOpen,
  onClose,
  deals,
  initialDealId,
  onSelectDeal,
}) => {
  const [selectedDealId, setSelectedDealId] = useState(initialDealId || deals[0]?.id || '');
  const selectedDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  if (!isOpen) return null;

  // Compute dynamic prediction signals based on deal properties
  const winProbability = selectedDeal.stage === 'Closed Won' ? 100 : selectedDeal.risk === 'High Risk' ? 42 : selectedDeal.risk === 'Silence' ? 48 : 76;
  const isHealthy = winProbability >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Predict Deal Outcome & Close Velocity</h3>
              <p className="text-xs text-slate-500">Machine learning model grounded in 14K enterprise sales cycles</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Deal Picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Deal to Analyze</label>
            <select
              value={selectedDealId}
              onChange={(e) => setSelectedDealId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-purple-500"
            >
              {deals.map(d => (
                <option key={d.id} value={d.id}>
                  {d.company} — {d.name} ({formatINR(d.value, true)})
                </option>
              ))}
            </select>
          </div>

          {/* Main Prediction Gauge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Probability Card */}
            <div className="p-4 bg-purple-50/60 border border-purple-200/80 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-purple-700">Predicted Win Probability</span>
              <div className="text-3xl font-black text-purple-950 flex items-baseline gap-1">
                <span>{winProbability}%</span>
                <span className="text-xs font-normal text-purple-600">
                  {isHealthy ? 'High Confidence' : 'Risk Flagged'}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                <div
                  className="bg-purple-600 h-1.5 rounded-full"
                  style={{ width: `${winProbability}%` }}
                />
              </div>
            </div>

            {/* Expected Revenue */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-emerald-700">Weighted Pipeline Impact</span>
              <div className="text-2xl font-black text-emerald-950">
                {formatINR(Math.round(selectedDeal.value * (winProbability / 100)), true)}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                From {formatINR(selectedDeal.value, true)} face value
              </div>
            </div>

            {/* Predicted Close Date */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-600">Forecast Target Date</span>
              <div className="text-lg font-bold text-slate-900">
                {new Date(selectedDeal.closeDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="text-[10px] text-slate-400">
                Quarter: {new Date(selectedDeal.closeDate).getMonth() < 9 ? 'Q3 2026' : 'Q4 2026'}
              </div>
            </div>
          </div>

          {/* Drivers & Blockers */}
          <div className="grid grid-cols-2 gap-4">
            {/* Positive Drivers */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Positive Deal Velocity Drivers</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
                <li>Strong Champion alignment with CTO office</li>
                <li>Budget allocated in FY26 strategic IT budget</li>
                <li>Proven sub-42ms latency benchmark matches requirement</li>
              </ul>
            </div>

            {/* Critical Blockers */}
            <div className="p-3.5 bg-red-50/50 border border-red-200/80 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-red-900 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                <span>Key Slip Risks & Blockers</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-red-800 list-disc list-inside">
                <li>{selectedDeal.lastContactDaysAgo > 7 ? `${selectedDeal.lastContactDaysAgo} days since last meeting engagement` : 'Security committee sign-off required'}</li>
                <li>Vikram Merchant requires BYOK architectural sign-off</li>
                <li>Oct 15 procurement freeze window approaching</li>
              </ul>
            </div>
          </div>

          {/* Recommended Play */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Recommended Prescriptive Play</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Execute BYOK Encryption briefing with Vikram Merchant to increase win probability from {winProbability}% to 88%.
              </p>
            </div>
            {onSelectDeal && (
              <button
                onClick={() => {
                  onSelectDeal(selectedDeal.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm whitespace-nowrap transition-colors"
              >
                <span>Open Intelligence</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
