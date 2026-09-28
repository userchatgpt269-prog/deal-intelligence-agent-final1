'use client';

import React, { useState } from 'react';
import { X, User, Shield, HeartHandshake } from 'lucide-react';
import { StakeholderInfluence, StakeholderSentiment } from '@/types';

interface CreateStakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
  onCreated: () => void;
}

export const CreateStakeholderModal: React.FC<CreateStakeholderModalProps> = ({
  isOpen,
  onClose,
  dealId,
  onCreated,
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [role, setRole] = useState('Champion');
  const [influence, setInfluence] = useState<StakeholderInfluence>('High');
  const [sentiment, setSentiment] = useState<StakeholderSentiment>('Positive');
  const [decisionRole, setDecisionRole] = useState('Technical Evaluator');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [relationshipStatus, setRelationshipStatus] = useState('Engaged');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) {
      setError('Please provide Stakeholder Name and Role.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/stakeholders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId,
          name: name.trim(),
          title: title.trim(),
          role: role.trim(),
          influence,
          sentiment,
          decisionRole,
          email: email.trim(),
          phone: phone.trim(),
          notes: notes.trim(),
          relationshipStatus,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to add stakeholder');
      }

      onCreated();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Add Stakeholder</h3>
            <p className="text-xs text-slate-500">Record champion, decision maker, or blocker dynamics</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Vikram Merchant"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Corporate Title</label>
              <input
                type="text"
                placeholder="e.g. VP of InfoSec & Compliance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Deal Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Decision Maker">Decision Maker</option>
                <option value="Champion">Champion</option>
                <option value="Blocker">Blocker</option>
                <option value="Influencer">Influencer</option>
                <option value="End User">End User</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Sentiment</label>
              <select
                value={sentiment}
                onChange={(e) => setSentiment(e.target.value as StakeholderSentiment)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Positive">Positive</option>
                <option value="Neutral">Neutral</option>
                <option value="Skeptical">Skeptical</option>
                <option value="Hostile">Hostile</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Influence Level</label>
              <select
                value={influence}
                onChange={(e) => setInfluence(e.target.value as StakeholderInfluence)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Key Decision Maker">Key Decision Maker</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="e.g. vikram.m@aurorasolutions.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Key Context & Stances</label>
              <textarea
                placeholder="Specific positions, objections, preferences, or alliances..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
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
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Add Stakeholder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
