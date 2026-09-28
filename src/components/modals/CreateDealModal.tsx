'use client';

import React, { useState } from 'react';
import { X, Building2, IndianRupee, User, Calendar, Layers, ShieldAlert } from 'lucide-react';
import { DealStage, DealPriority, DealRisk } from '@/types';

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export const CreateDealModal: React.FC<CreateDealModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<DealStage>('Qualification');
  const [priority, setPriority] = useState<DealPriority>('Medium');
  const [risk, setRisk] = useState<DealRisk>('Low Risk');
  const [owner, setOwner] = useState('Alex Morgan');
  const [closeDate, setCloseDate] = useState('2026-11-30');
  const [pipeline, setPipeline] = useState('Enterprise Pipeline');
  const [industry, setIndustry] = useState('Enterprise Technology');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !value) {
      setError('Please provide Deal Name, Company, and Deal Amount in INR.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim(),
          value: Number(value),
          stage,
          priority,
          risk,
          owner,
          closeDate,
          pipeline,
          industry,
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create deal');
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
            <h3 className="text-base font-bold text-slate-900">Create New Deal</h3>
            <p className="text-xs text-slate-500">Add an enterprise sales opportunity with INR currency</p>
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
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Deal Name *</label>
              <input
                type="text"
                placeholder="e.g. Apex Logistics - Warehouse AI Automation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Company / Account *</label>
              <input
                type="text"
                placeholder="e.g. Apex Logistics"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Deal Value in INR (₹) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  placeholder="e.g. 18500000 (₹1.85 Cr)"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-bold"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Qualification">Qualification</option>
                <option value="Discovery">Discovery</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Risk Assessment</label>
              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value as DealRisk)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Low Risk">Low Risk</option>
                <option value="Medium Risk">Medium Risk</option>
                <option value="High Risk">High Risk</option>
                <option value="Silence">Silence</option>
                <option value="Weak Engagement">Weak Engagement</option>
                <option value="Stalled">Stalled</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Pipeline</label>
              <select
                value={pipeline}
                onChange={(e) => setPipeline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              >
                <option value="Enterprise Pipeline">Enterprise Pipeline</option>
                <option value="Apollo Pipeline">Apollo Pipeline</option>
                <option value="SMB Pipeline">SMB Pipeline</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Target Close Date</label>
              <input
                type="date"
                value={closeDate}
                onChange={(e) => setCloseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-orange-500 font-medium"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Description & Scope</label>
              <textarea
                placeholder="Key scope, objectives, requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Deal...' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
