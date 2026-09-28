'use client';

import React, { useState } from 'react';
import { X, Play, CheckCircle2, Sparkles, Database, Mail, ShieldAlert } from 'lucide-react';
import { Deal } from '@/types';
import { formatINR } from '@/lib/format';

interface RescuePlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: Deal | null;
  onExecuted: () => void;
}

export const RescuePlayModal: React.FC<RescuePlayModalProps> = ({
  isOpen,
  onClose,
  deal,
  onExecuted,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !deal) return null;

  const handleExecute = async () => {
    setIsExecuting(true);
    try {
      // 1. Record interaction for rescue play
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: deal.id,
          type: 'Email',
          participants: ['Alex Morgan', 'CITO Rajesh Subramanian', 'VP InfoSec Vikram Merchant'],
          summary: 'Executed Automated Rescue Play: Delivered BYOK Encryption Whitepaper & Scheduled CISO Alignment.',
          keyPoints: [
            'Sent personalized note resolving Vikram Merchants on-prem HSM key escrow objection.',
            'Provided third-party benchmark report showing sub-42ms latency in Mumbai testbed.',
            'Proposed 15-minute executive briefing slot for next Tuesday.',
          ],
          objections: ['KMS key escrow in public cloud (mitigated with BYOK blueprint)'],
          competitors: ['Infosys Finacle', 'Oracle FLEXCUBE'],
          pricingDiscussion: 'Reiterated standard enterprise tier with complimentary 24/7 TAM.',
          commitments: ['Alex to facilitate CISO-to-CISO architecture review.'],
          nextSteps: ['Await Vikram Merchants response on Tuesday briefing.'],
        }),
      });

      // 2. Update deal health
      await fetch(`/api/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          health: 72,
          risk: 'Medium Risk',
          lastContactDaysAgo: 0,
        }),
      });

      setIsSuccess(true);
      setTimeout(() => {
        onExecuted();
        onClose();
        setIsSuccess(false);
      }, 1400);
    } catch (err) {
      console.error('Failed to execute rescue play:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center">
              <Play className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Execute Rescue Play</h3>
              <p className="text-xs text-slate-500">Autonomous deal recovery workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <div className="font-bold text-slate-900 text-sm">{deal.company}</div>
            <div className="text-slate-500">
              Deal Value: <strong className="text-slate-800">{formatINR(deal.value)}</strong> • Current Risk: <strong className="text-red-600">{deal.risk}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-700">Actions to be executed automatically:</div>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <Mail className="w-4 h-4 text-orange-500" />
                <span>1. Generate and log personalized value email to CITO Rajesh Subramanian</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <ShieldAlert className="w-4 h-4 text-blue-500" />
                <span>2. Attach Bring-Your-Own-KMS encryption blueprint to resolve Vikram's objection</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                <Database className="w-4 h-4 text-purple-500" />
                <span>3. Retain rescue play event into Hindsight memory bank <code className="font-mono text-[10px] text-orange-700">deal-bank-{deal.id}</code></span>
              </div>
            </div>
          </div>

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Rescue play executed! Hindsight memory retained and deal health upgraded.</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isExecuting}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={isExecuting || isSuccess}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-slate-900" />
              <span>{isExecuting ? 'Executing Play...' : 'Confirm & Execute Rescue Play'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
