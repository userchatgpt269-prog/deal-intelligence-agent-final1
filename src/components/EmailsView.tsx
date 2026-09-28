'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCheck, 
  Eye, 
  FileText, 
  Building2, 
  ArrowUpRight,
  RefreshCw,
  Play
} from 'lucide-react';
import { Deal } from '@/types';

interface EmailsViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onOpenComposeModal: () => void;
}

export const EmailsView: React.FC<EmailsViewProps> = ({
  deals,
  onSelectDeal,
  onOpenComposeModal,
}) => {
  const [activeTab, setActiveTab] = useState<'flows' | 'history'>('flows');

  const automatedFlows = [
    {
      id: 'flow-1',
      title: 'Enterprise Silence Breakout Flow',
      trigger: 'Triggered when a deal has > 14 days without interaction',
      stats: { activeDeals: 3, openRate: '78%', replyRate: '42%' },
      steps: [
        'Step 1 (Day 14): Send value-oriented case study with latency benchmark',
        'Step 2 (Day 18): Propose low-friction 15-min CISO alignment call',
        'Step 3 (Day 22): Executive sponsor gentle check-in'
      ],
      recommendedFor: 'Aurora Solutions, Omega Corp',
      status: 'Active'
    },
    {
      id: 'flow-2',
      title: 'BYOK InfoSec Objection Defense Flow',
      trigger: 'Triggered on security or cryptographic key management blockers',
      stats: { activeDeals: 2, openRate: '92%', replyRate: '65%' },
      steps: [
        'Step 1: Dispatch BYOK KMS cryptographic isolation spec',
        'Step 2: Share RBI data localization certification checklist',
        'Step 3: Offer technical validation sandbox trial'
      ],
      recommendedFor: 'Aurora Solutions',
      status: 'Active'
    },
    {
      id: 'flow-3',
      title: 'Commercial Proposal Follow-Up Flow',
      trigger: 'Triggered 5 days after proposal submission without procurement feedback',
      stats: { activeDeals: 4, openRate: '84%', replyRate: '51%' },
      steps: [
        'Step 1: Check in on scope alignment and budget feedback',
        'Step 2: Propose complimentary Technical Account Manager rider',
        'Step 3: Executive pricing concession walkthrough'
      ],
      recommendedFor: 'Flexion Enterprises',
      status: 'Active'
    }
  ];

  const emailHistory = [
    {
      id: 'em-1',
      dealId: 'deal-1',
      company: 'Aurora Solutions',
      recipient: 'Rajesh Subramanian (CITO)',
      subject: 'Security Architecture & KMS Verification for Aurora Solutions',
      date: 'Today, 10:15 AM',
      status: 'Sent',
      opened: true,
      replied: false,
      preview: 'Following our technical discussion with Vikram Merchant regarding the Core Modernization (₹2.50 Cr), sharing our dedicated Bring-Your-Own-KMS specification...'
    },
    {
      id: 'em-2',
      dealId: 'deal-3',
      company: 'Flexion Enterprises',
      recipient: 'Priya Patel (Procurement)',
      subject: 'Commercial Proposal Scope & Milestone Terms',
      date: 'Yesterday, 04:30 PM',
      status: 'Sent',
      opened: true,
      replied: true,
      preview: 'To align with your Q3 operational budget constraints, our leadership approved the inclusion of a dedicated Technical Account Manager at no extra fee...'
    },
    {
      id: 'em-3',
      dealId: 'deal-2',
      company: 'Northwind Labs',
      recipient: 'Dr. Aris Thorne',
      subject: 'Genomic Lakehouse Cluster Pilot Milestone Confirmation',
      date: 'Sep 24, 2026',
      status: 'Sent',
      opened: true,
      replied: true,
      preview: 'Attaching the throughput benchmark verifying sub-12s genomic sample processing across the 100-batch test run...'
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Email Intelligence & Flows</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {automatedFlows.length} Active Sequences
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated re-engagement flows, AI drafts, and sent deal correspondence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('flows')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'flows'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Sequences & Flows ({automatedFlows.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              Sent & Drafts ({emailHistory.length})
            </button>
          </div>

          <button
            onClick={onOpenComposeModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose AI Email</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'flows' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {automatedFlows.map((flow) => (
              <div
                key={flow.id}
                className="nexus-card p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {flow.status}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Open Rate: <strong className="text-slate-900">{flow.stats.openRate}</strong>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{flow.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      {flow.trigger}
                    </p>
                  </div>

                  {/* Flow Steps */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-700">Sequence Steps:</div>
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      {flow.steps.map((st, i) => (
                        <div key={i} className="p-2 bg-slate-50 rounded-lg border border-slate-100 leading-snug">
                          {st}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500">
                    <strong>Recommended for:</strong> {flow.recommendedFor}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Reply rate: {flow.stats.replyRate}</span>
                  <button
                    onClick={onOpenComposeModal}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <Play className="w-3 h-3 fill-white" />
                    <span>Run Flow</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3 max-w-4xl mx-auto">
            {emailHistory.map((em) => (
              <div key={em.id} className="nexus-card p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{em.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                        {em.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>To: <strong>{em.recipient}</strong></span>
                      <span>•</span>
                      <span>{em.company}</span>
                      <span>•</span>
                      <span>{em.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] font-semibold">
                    {em.opened && (
                      <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCheck className="w-3 h-3" /> Opened
                      </span>
                    )}
                    {em.replied && (
                      <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <CheckCheck className="w-3 h-3" /> Replied
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed font-sans">
                  "{em.preview}"
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onSelectDeal(em.dealId)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>View Deal Intelligence</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
