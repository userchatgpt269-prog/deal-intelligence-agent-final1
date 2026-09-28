'use client';

import React, { useState } from 'react';
import { X, Mail, Sparkles, Copy, Check, Send, RefreshCw, FileText } from 'lucide-react';
import { Deal } from '@/types';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  initialDealId?: string;
}

export const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  isOpen,
  onClose,
  deals,
  initialDealId,
}) => {
  const [selectedDealId, setSelectedDealId] = useState(initialDealId || deals[0]?.id || '');
  const [flowType, setFlowType] = useState<'reengage' | 'byok' | 'proposal_followup' | 'ciso_intro'>('reengage');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const selectedDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  const getGeneratedEmail = () => {
    const company = selectedDeal?.company || 'Enterprise Account';
    const amount = (selectedDeal?.value ? `₹${(selectedDeal.value / 10000000).toFixed(2)} Cr` : '₹2.50 Cr');

    if (flowType === 'byok') {
      return {
        subject: `Security Architecture & KMS Verification for ${company}`,
        to: `rajesh.subramanian@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        body: `Hi Rajesh,\n\nFollowing our technical discussion with Vikram Merchant regarding the ${company} Core Modernization (${amount}), I wanted to share our dedicated Bring-Your-Own-KMS (BYOK) architecture specification.\n\nKey highlights addressing the InfoSec objection:\n1. Customer-Managed Keys (AWS KMS / Azure Key Vault / HSM) with zero vendor-side plain text access.\n2. Sub-42ms latency SLA verified in active private bank deployments.\n3. Automatic compliance audit trails and hardware-level isolation.\n\nCould we set up a brief 20-minute technical validation call with Vikram on Thursday at 2:30 PM IST?\n\nBest regards,\nNaruka Sado\nSenior Enterprise Sales Lead`
      };
    }

    if (flowType === 'proposal_followup') {
      return {
        subject: `Follow-up: Commercial Proposal & Deployment Scope for ${company}`,
        to: `ananya.sharma@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        body: `Hi Ananya,\n\nI hope your week is off to a great start. Touching base regarding our ${amount} commercial proposal for ${company}.\n\nTo align with your Q3 operational budget constraints, our leadership has approved the inclusion of a dedicated Technical Account Manager and 24/7 dedicated support at no additional cost, ensuring seamless rollout across all 40 operational hubs.\n\nPlease let me know if Friday morning works for a quick walkthrough with procurement.\n\nWarm regards,\nNaruka Sado\nEnterprise Solutions`
      };
    }

    if (flowType === 'ciso_intro') {
      return {
        subject: `Executive Security Briefing: Tier-1 Regulatory Compliance for ${company}`,
        to: `ciso.office@${company.toLowerCase().replace(/\s+/g, '')}.com`,
        body: `Dear Vikram,\n\nThank you for your rigorous review of our data protection controls for the upcoming ${company} deployment.\n\nWe have prepared a benchmark packet showing our SOC2 Type II, ISO 27001, and RBI data localization certifications, specifically tailored for your security audit committee.\n\nWe would welcome the opportunity to present our cryptographic proof in a focused 15-minute executive briefing.\n\nSincerely,\nNaruka Sado\nEnterprise Sales`
      };
    }

    // Default reengage flow
    return {
      subject: `Re-engaging on ${company} Strategic Initiative — Next Steps`,
      to: `leadership@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      body: `Hi Team,\n\nIt's been a couple of weeks since our discovery workshop on the ${company} modernization project (${amount}).\n\nWe recently published a case study on an identical Tier-1 deployment that accelerated time-to-market by 41% while reducing operational overhead. Given your Q4 roadmap targets, I'd love to share the architecture diagram and ROI calculator.\n\nAre you open for a brief 15-minute check-in this week?\n\nBest regards,\nNaruka Sado\nSenior Enterprise Solutions`
    };
  };

  const email = getGeneratedEmail();
  const [editableBody, setEditableBody] = useState(email.body);
  const [editableSubject, setEditableSubject] = useState(email.subject);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${editableSubject}\nTo: ${email.to}\n\n${editableBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1200);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const regenerated = getGeneratedEmail();
      setEditableSubject(regenerated.subject);
      setEditableBody(regenerated.body);
      setIsGenerating(false);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-orange-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Generate AI Email Flow</h3>
              <p className="text-xs text-slate-500">Grounded in deal memory, objections, and past commitments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Configuration Row */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Deal / Account</label>
            <select
              value={selectedDealId}
              onChange={(e) => {
                setSelectedDealId(e.target.value);
                const nextDeal = deals.find(d => d.id === e.target.value);
                if (nextDeal) {
                  const gen = getGeneratedEmail();
                  setEditableSubject(gen.subject);
                  setEditableBody(gen.body);
                }
              }}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
            >
              {deals.map(d => (
                <option key={d.id} value={d.id}>
                  {d.company} — {d.stage}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Flow Objective</label>
            <select
              value={flowType}
              onChange={(e) => {
                setFlowType(e.target.value as any);
                handleRegenerate();
              }}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
            >
              <option value="reengage">Re-engagement (Overcome Silence)</option>
              <option value="byok">BYOK Security & Architecture Defense</option>
              <option value="proposal_followup">Commercial Proposal & Value Follow-up</option>
              <option value="ciso_intro">CISO Executive Security Alignment</option>
            </select>
          </div>
        </div>

        {/* Editor Area */}
        <div className="p-5 space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">To</label>
            <input
              type="text"
              readOnly
              value={email.to}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subject Line</label>
            <input
              type="text"
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-semibold text-slate-500">Email Body (AI Generated)</label>
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Regenerate with Hindsight</span>
              </button>
            </div>
            <textarea
              rows={9}
              value={editableBody}
              onChange={(e) => setEditableBody(e.target.value)}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 leading-relaxed font-sans text-xs focus:border-orange-500 focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Tone: Professional & Consultative</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              {sentSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dispatched via Mailbox!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Follow-up</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
