'use client';

import React, { useState } from 'react';
import { X, User, Mail, Briefcase, IndianRupee, Bell, Sparkles, Check, Building, ShieldCheck } from 'lucide-react';
import { formatINR } from '@/lib/format';

export interface UserProfileData {
  name: string;
  role: string;
  email: string;
  initials: string;
  avatarBg: string;
  workspace: string;
  quota: number; // in INR
  territory: string;
  aiTone: 'executive' | 'technical' | 'urgent' | 'consultative';
  silenceThresholdDays: number;
  aiRequirements: string;
  emailAlerts: boolean;
  soundAlerts: boolean;
  riskPushNotifications: boolean;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSave: (updated: UserProfileData) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfileData>({ ...profile });
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'ai'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-emerald-200">
              {formData.initials || 'NS'}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Profile & Agent Requirements</h3>
              <p className="text-xs text-slate-500">Configure your sales identity, target quota, and NexusAI rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-5 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Sales Identity
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'preferences'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Quota & Territory
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Copilot Rules</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {activeTab === 'profile' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const inits = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'NS';
                        setFormData({ ...formData, name, initials: inits });
                      }}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Role / Title</label>
                  <div className="relative">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Corporate Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Workspace</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.workspace}
                    onChange={(e) => setFormData({ ...formData, workspace: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium cursor-pointer"
                  >
                    <option value="Enterprise Sales">Enterprise Sales (Tier 1 & Strategic)</option>
                    <option value="SMB Sales">SMB Sales (Mid-Market)</option>
                    <option value="Outbound Team">Outbound Team (Pipeline Gen)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quarterly Target Quota (INR ₹)</label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={formData.quota}
                    onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                    step="500000"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Current Quota: <strong className="text-slate-700">{formatINR(formData.quota, true)}</strong>
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Region / Territory</label>
                <input
                  type="text"
                  value={formData.territory}
                  onChange={(e) => setFormData({ ...formData, territory: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="font-semibold text-slate-700">Notification Alerts</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.riskPushNotifications}
                    onChange={(e) => setFormData({ ...formData, riskPushNotifications: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Push alert when a deal reaches 14+ days of silence</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailAlerts}
                    onChange={(e) => setFormData({ ...formData, emailAlerts: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Daily morning pipeline briefing & agenda</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">AI Copilot Persona & Tone</label>
                <select
                  value={formData.aiTone}
                  onChange={(e) => setFormData({ ...formData, aiTone: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none font-medium cursor-pointer"
                >
                  <option value="executive">Executive & Strategic (Crisp, metric-driven)</option>
                  <option value="consultative">Consultative & Solution-focused (Technical alignment)</option>
                  <option value="urgent">Urgent & Deal Closing (Pushes momentum, risk alerts)</option>
                  <option value="technical">Technical Architecture (InfoSec, KMS, SLA emphasis)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Silence Alert Threshold</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={formData.silenceThresholdDays}
                    onChange={(e) => setFormData({ ...formData, silenceThresholdDays: Number(e.target.value) })}
                    className="flex-1 accent-orange-500"
                  />
                  <span className="font-bold text-slate-800 w-16">{formData.silenceThresholdDays} days</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Custom Agent Instructions (User Requirements)
                </label>
                <textarea
                  rows={4}
                  value={formData.aiRequirements}
                  onChange={(e) => setFormData({ ...formData, aiRequirements: e.target.value })}
                  placeholder="e.g. Always address BYOK KMS security objections, flag budget disparities in INR, emphasize SOC2 compliance..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:border-orange-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  NexusAI will incorporate these requirements into every deal recommendation, email draft, and risk prediction.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Synced with Hindsight memory bank
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm flex items-center gap-1.5"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Profile</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
