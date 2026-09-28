'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  ExternalLink,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Deal, Stakeholder } from '@/types';

interface ContactsViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onOpenEmailComposer?: (dealId: string) => void;
  onOpenScheduleMeeting?: (dealId: string) => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  deals,
  onSelectDeal,
  onOpenEmailComposer,
  onOpenScheduleMeeting,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  // Realistic enterprise stakeholders aggregated across deals
  const initialContacts: (Stakeholder & { dealCompany: string; dealName: string })[] = [
    {
      id: 'stk-1',
      dealId: 'deal-1',
      dealCompany: 'Aurora Solutions',
      dealName: 'Core Banking Modernization',
      name: 'Rajesh Subramanian',
      role: 'Executive Sponsor',
      title: 'Chief Information & Technology Officer',
      influence: 'Key Decision Maker',
      sentiment: 'Positive',
      decisionRole: 'Budget & Strategic Sign-off',
      email: 'rajesh.subramanian@aurorasolutions.com',
      phone: '+91 98201 44552',
      notes: 'Strong executive champion. Eager to deprecate legacy IBM mainframe ledger. Needs CISO sign-off before Oct 15.',
      relationshipStatus: 'Warm • Met 3 times',
      createdAt: '2026-08-10',
      updatedAt: '2026-09-20',
    },
    {
      id: 'stk-2',
      dealId: 'deal-1',
      dealCompany: 'Aurora Solutions',
      dealName: 'Core Banking Modernization',
      name: 'Vikram Merchant',
      role: 'Technical Blocker',
      title: 'VP Information Security (CISO)',
      influence: 'High',
      sentiment: 'Skeptical',
      decisionRole: 'InfoSec Compliance Gatekeeper',
      email: 'vikram.merchant@aurorasolutions.com',
      phone: '+91 98200 99881',
      notes: 'Demanded Bring-Your-Own-KMS specification and proof of sub-42ms latency. Unwilling to approve without cryptographic audit.',
      relationshipStatus: 'Cautious • Requires BYOK spec',
      createdAt: '2026-08-15',
      updatedAt: '2026-09-22',
    },
    {
      id: 'stk-3',
      dealId: 'deal-3',
      dealCompany: 'Flexion Enterprises',
      dealName: 'Omni-Channel Supply Chain',
      name: 'Ananya Sharma',
      role: 'Champion',
      title: 'VP Engineering & Infrastructure',
      influence: 'Key Decision Maker',
      sentiment: 'Positive',
      decisionRole: 'Architecture & Technical Sign-off',
      email: 'ananya.sharma@flexion.in',
      phone: '+91 98450 12345',
      notes: 'Tested our telematics API connectors. Very impressed with real-time throughput. Needs pricing concessions for procurement.',
      relationshipStatus: 'Strong • Internal Advocate',
      createdAt: '2026-07-20',
      updatedAt: '2026-09-18',
    },
    {
      id: 'stk-4',
      dealId: 'deal-3',
      dealCompany: 'Flexion Enterprises',
      dealName: 'Omni-Channel Supply Chain',
      name: 'Priya Patel',
      role: 'Commercial Evaluator',
      title: 'Head of Global Procurement',
      influence: 'High',
      sentiment: 'Neutral',
      decisionRole: 'Pricing & Contract Terms',
      email: 'priya.patel@flexion.in',
      phone: '+91 98110 56789',
      notes: 'Requested a ₹20 L discount or complimentary Technical Account Manager to approve before fiscal quarter close.',
      relationshipStatus: 'Commercial negotiations ongoing',
      createdAt: '2026-08-01',
      updatedAt: '2026-09-25',
    },
    {
      id: 'stk-5',
      dealId: 'deal-2',
      dealCompany: 'Northwind Labs',
      dealName: 'AI Diagnostics Infrastructure',
      name: 'Dr. Aris Thorne',
      role: 'Evaluator',
      title: 'Chief Medical Data Officer',
      influence: 'High',
      sentiment: 'Neutral',
      decisionRole: 'HIPAA & Genomic Data Governance',
      email: 'aris.thorne@northwindlabs.org',
      phone: '+91 98300 77123',
      notes: 'Evaluating GPU cluster throughput. Concerned about data residency requirements for clinical trial records.',
      relationshipStatus: 'In evaluation pilot',
      createdAt: '2026-08-25',
      updatedAt: '2026-09-21',
    },
    {
      id: 'stk-6',
      dealId: 'deal-5',
      dealCompany: 'Globex Corporation',
      dealName: 'Global Telephony Migration',
      name: 'Sophie Kim',
      role: 'Executive Sponsor',
      title: 'Global VP of IT Operations',
      influence: 'Key Decision Maker',
      sentiment: 'Positive',
      decisionRole: 'Final Sign-off',
      email: 'sophie.kim@globex.com',
      phone: '+91 98990 11223',
      notes: 'Signed ₹2.10 Cr enterprise agreement. Now supervising stage 1 rollout for 12,000 employees.',
      relationshipStatus: 'Won Customer • High Trust',
      createdAt: '2026-05-12',
      updatedAt: '2026-09-15',
    },
  ];

  const filteredContacts = initialContacts.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.dealCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSentiment = sentimentFilter === 'all' || c.sentiment === sentimentFilter;
    const matchesRole = roleFilter === 'all' || c.role === roleFilter;
    return matchesSearch && matchesSentiment && matchesRole;
  });

  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Skeptical':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Neutral':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Contacts & Stakeholders Directory</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredContacts.length} People
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Decision makers, champions, and technical blockers across all enterprise deals
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          {/* Sentiment Filter */}
          <select
            value={sentimentFilter}
            onChange={(e) => setSentimentFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Sentiments</option>
            <option value="Positive">Positive (Champions)</option>
            <option value="Neutral">Neutral</option>
            <option value="Skeptical">Skeptical (Blockers)</option>
          </select>

          {/* Search */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Directory Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="nexus-card p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              {/* Top Contact Details */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                      {contact.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{contact.name}</h3>
                      <div className="text-[11px] text-slate-500 font-medium">{contact.title}</div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSentimentStyle(contact.sentiment)}`}>
                    {contact.sentiment}
                  </span>
                </div>

                {/* Company & Deal info */}
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      <span>{contact.dealCompany}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                      {contact.role}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    Deal: {contact.dealName}
                  </div>
                </div>

                {/* Notes & Authority */}
                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <strong className="text-slate-700">Role:</strong> {contact.decisionRole}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed bg-amber-50/50 p-2 rounded-lg border border-amber-100">
                    "{contact.notes}"
                  </p>
                </div>

                {/* Contact Coordinates */}
                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px] select-all">{contact.email}</span>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectDeal(contact.dealId)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>View Deal</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {onOpenScheduleMeeting && (
                    <button
                      onClick={() => onOpenScheduleMeeting(contact.dealId)}
                      className="p-1.5 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700"
                      title="Schedule meeting with contact"
                    >
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    </button>
                  )}
                  {onOpenEmailComposer && (
                    <button
                      onClick={() => onOpenEmailComposer(contact.dealId)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Draft Email</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
