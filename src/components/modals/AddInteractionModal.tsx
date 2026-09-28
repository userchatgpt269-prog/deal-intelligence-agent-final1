'use client';

import React, { useState } from 'react';
import { X, Sparkles, Database, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { InteractionType } from '@/types';

interface AddInteractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
  dealCompany: string;
  onAdded: () => void;
}

export const AddInteractionModal: React.FC<AddInteractionModalProps> = ({
  isOpen,
  onClose,
  dealId,
  dealCompany,
  onAdded,
}) => {
  const [type, setType] = useState<InteractionType>('Meeting');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState('Alex Morgan, CITO Rajesh Subramanian');
  const [summary, setSummary] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [objections, setObjections] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [pricingDiscussion, setPricingDiscussion] = useState('');
  const [commitments, setCommitments] = useState('');
  const [customerRequirements, setCustomerRequirements] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError('Please provide a meeting/interaction summary.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId,
          type,
          date: new Date(date).toISOString(),
          participants: participants.split(',').map(p => p.trim()).filter(Boolean),
          summary: summary.trim(),
          keyPoints: keyPoints.split('\n').map(p => p.trim()).filter(Boolean),
          objections: objections.split('\n').map(o => o.trim()).filter(Boolean),
          competitors: competitors.split(',').map(c => c.trim()).filter(Boolean),
          pricingDiscussion: pricingDiscussion.trim(),
          commitments: commitments.split('\n').map(c => c.trim()).filter(Boolean),
          customerRequirements: customerRequirements.split('\n').map(r => r.trim()).filter(Boolean),
          nextSteps: nextSteps.split('\n').map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to record interaction');
      }

      onAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Record Interaction</h3>
              <span className="flex items-center gap-1 text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-200">
                <Database className="w-3 h-3 text-orange-600" />
                Hindsight Auto-Retain
              </span>
            </div>
            <p className="text-xs text-slate-500">
              For account: <strong className="text-slate-800">{dealCompany}</strong>. Automatically stored into persistent memory.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Interaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InteractionType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Meeting">Meeting</option>
                <option value="Call">Call</option>
                <option value="Demo">Demo</option>
                <option value="Proposal">Proposal Review</option>
                <option value="Email">Email</option>
                <option value="Note">Internal Note</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Participants (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan, Sarah Jenkins, Rajesh Subramanian (CITO)"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Interaction Summary *</label>
              <textarea
                placeholder="High-level narrative of what was discussed, tone of the customer, and outcome..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-red-700">Customer Objections (one per line)</label>
              <textarea
                placeholder="e.g. KMS keys must stay on-premise&#10;Implementation fee is 20% over budget"
                value={objections}
                onChange={(e) => setObjections(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-red-50/40 border border-red-200 rounded-lg focus:outline-none focus:bg-white focus:border-red-500 font-medium text-red-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-blue-700">Our Commitments (What we promised)</label>
              <textarea
                placeholder="e.g. Alex to provide dedicated TAM authorization in writing&#10;Sarah to send BYOK architecture diagram"
                value={commitments}
                onChange={(e) => setCommitments(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-blue-50/40 border border-blue-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500 font-medium text-blue-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Competitors Mentioned</label>
              <input
                type="text"
                placeholder="e.g. Infosys Finacle, Oracle FLEXCUBE"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Pricing / Commercial Discussion (INR ₹)</label>
              <input
                type="text"
                placeholder="e.g. Quoted ₹2.5 Cr; customer requested complimentary TAM"
                value={pricingDiscussion}
                onChange={(e) => setPricingDiscussion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Key Points & Customer Requirements</label>
              <textarea
                placeholder="e.g. Active-active Mumbai/Hyderabad multi-region failover&#10;Sub-50ms transaction latency on peak volume"
                value={customerRequirements}
                onChange={(e) => setCustomerRequirements(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>
          </div>

          <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl text-orange-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>Persistent Memory Impact: </strong>
              Submitting this interaction immediately writes facts, objections, and commitments to Hindsight memory bank <code className="font-mono bg-white px-1 py-0.5 rounded border border-orange-200">deal-bank-{dealId}</code>. Future agent queries will recall and connect this context!
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Retaining to Hindsight...' : 'Save & Retain Memory'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
