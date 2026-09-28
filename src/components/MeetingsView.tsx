'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  Users, 
  Sparkles, 
  Building2, 
  CheckCircle2, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  History
} from 'lucide-react';
import { Deal } from '@/types';

interface MeetingsViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onOpenScheduleModal: () => void;
}

export const MeetingsView: React.FC<MeetingsViewProps> = ({
  deals,
  onSelectDeal,
  onOpenScheduleModal,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBriefMeetingId, setSelectedBriefMeetingId] = useState<string | null>(null);

  const upcomingMeetings = [
    {
      id: 'mtg-up-1',
      dealId: 'deal-1',
      company: 'Aurora Solutions',
      title: 'BYOK Architecture & CISO Sign-off Review',
      date: 'Tomorrow, Oct 02, 2026',
      time: '02:30 PM IST',
      duration: '30 min',
      attendees: ['Rajesh Subramanian (CITO)', 'Vikram Merchant (VP InfoSec)', 'Alex Morgan (NexusAI Lead)'],
      agenda: '1. Review BYOK KMS cryptographic isolation spec\n2. Demonstrate <42ms private bank ledger latency proof\n3. Address Oct 15 procurement budget lock timeline\n4. Confirm pilot deployment milestones',
      aiBrief: {
        objective: 'Disarm Vikram Merchant\'s security objection regarding vendor key access and lock commitment before Oct 15 budget freeze.',
        knownBlockers: 'Vikram requested dedicated Customer-Managed Key HSM proof and latency SLA under 50ms.',
        recommendedOpening: 'Open with the benchmark results from our Tier-1 private bank client showing 38ms average transaction commit time.',
        dangerPoints: 'Do not offer discount on license fees until security sign-off is ratified in writing.'
      }
    },
    {
      id: 'mtg-up-2',
      dealId: 'deal-3',
      company: 'Flexion Enterprises',
      title: 'Commercial Terms & Procurement Walkthrough',
      date: 'Friday, Oct 05, 2026',
      time: '11:00 AM IST',
      duration: '45 min',
      attendees: ['Ananya Sharma (VP Eng)', 'Priya Patel (Head of Procurement)'],
      agenda: '1. Walkthrough of ₹2.0 Cr commercial proposal\n2. Inclusion of complimentary Technical Account Manager\n3. Quarterly tranche payment structure\n4. SLA definitions across 40 operational hubs',
      aiBrief: {
        objective: 'Defend ₹2.0 Cr quote by packaging complimentary TAM rather than discounting core software fees.',
        knownBlockers: 'Priya Patel holds a strict budget cap of ₹1.8 Cr.',
        recommendedOpening: 'Confirm technical fit with Ananya Sharma before discussing commercial concessions.',
        dangerPoints: 'Avoid multi-year discount without minimum 24-month contract lock.'
      }
    },
    {
      id: 'mtg-up-3',
      dealId: 'deal-2',
      company: 'Northwind Labs',
      title: 'Genomic Cluster Pilot Milestone Evaluation',
      date: 'Next Tuesday, Oct 09, 2026',
      time: '04:00 PM IST',
      duration: '30 min',
      attendees: ['Dr. Aris Thorne (Chief Medical Data Officer)', 'Sarah Jenkins (NexusAI)'],
      agenda: '1. Review clinical throughput metrics on 100-sample test batch\n2. HIPAA data localization verification\n3. Production sizing proposal',
      aiBrief: {
        objective: 'Transition pilot evaluation into full commercial contracting for Q4 deployment.',
        knownBlockers: 'Concerns over multi-tenant GPU memory leakage.',
        recommendedOpening: 'Present physical enclave isolation certificates.',
        dangerPoints: 'Do not commit to on-premise hardware maintenance without professional services rider.'
      }
    }
  ];

  const pastMeetings = [
    {
      id: 'mtg-past-1',
      dealId: 'deal-1',
      company: 'Aurora Solutions',
      title: 'Initial Architecture Discovery & Scoping',
      date: 'Sep 18, 2026',
      summary: 'Met with Rajesh Subramanian and enterprise architecture leads. Identified core requirement for sub-50ms transaction latency and replacement of legacy IBM mainframe ledger. Vikram Merchant joined for the final 10 minutes and raised objection regarding cloud KMS encryption keys.',
      commitmentsWeMade: ['Deliver BYOK specification within 5 business days', 'Provide private bank latency benchmark'],
      customerCommitments: ['Rajesh will reserve Oct 15 budget allocation pending InfoSec clearance'],
      memoriesRetained: 8,
    },
    {
      id: 'mtg-past-2',
      dealId: 'deal-3',
      company: 'Flexion Enterprises',
      title: 'Warehouse Telematics Integration Demo',
      date: 'Sep 10, 2026',
      summary: 'Live demonstration of IoT telematics gateway. Ananya Sharma confirmed integration compatibility with existing ERP. Procurement lead Priya Patel joined and stated that current budget is capped at ₹1.8 Cr against our standard ₹2.0 Cr tier.',
      commitmentsWeMade: ['Review commercial package with sales leadership', 'Draft customized SLA agreement'],
      customerCommitments: ['Ananya will share network topology for 40 hubs'],
      memoriesRetained: 6,
    },
    {
      id: 'mtg-past-3',
      dealId: 'deal-5',
      company: 'Globex Corporation',
      title: 'Executive Contract Sign-off & Celebration',
      date: 'Sep 02, 2026',
      summary: 'Sophie Kim and executive committee signed the ₹2.10 Cr enterprise agreement for 12,000 employee migration. Implementation kick-off scheduled for Q4.',
      commitmentsWeMade: ['Assign dedicated enterprise onboarding engineer'],
      customerCommitments: ['First quarterly invoice approved for release'],
      memoriesRetained: 4,
    }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Header */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Meetings & Strategic Engagements</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {upcomingMeetings.length} Upcoming
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Client calendar, AI meeting prep briefs, and historical commitments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold text-slate-600">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'upcoming'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Upcoming ({upcomingMeetings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'past'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Previous & Notes ({pastMeetings.length})</span>
            </button>
          </div>

          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {upcomingMeetings.map((mtg) => {
              const isSelected = selectedBriefMeetingId === mtg.id;
              return (
                <div
                  key={mtg.id}
                  className="nexus-card p-5 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {mtg.date}
                      </span>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {mtg.time}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{mtg.title}</h3>
                      <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{mtg.company}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-700 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span>Attendees:</span>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-4">
                        {mtg.attendees.join(' • ')}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="font-semibold text-slate-800 text-[11px]">Agenda:</div>
                      <p className="text-[11px] text-slate-600 whitespace-pre-line leading-relaxed font-sans">
                        {mtg.agenda}
                      </p>
                    </div>

                    {/* AI Prep Brief Accordion */}
                    {isSelected && (
                      <div className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl space-y-2 animate-in fade-in duration-150">
                        <div className="font-bold text-purple-900 text-xs flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                          <span>NexusAI Strategic Briefing</span>
                        </div>
                        <div className="text-[11px] space-y-1.5 text-slate-700">
                          <div>
                            <strong className="text-purple-950">Primary Objective:</strong> {mtg.aiBrief.objective}
                          </div>
                          <div>
                            <strong className="text-purple-950">Key Opening Move:</strong> {mtg.aiBrief.recommendedOpening}
                          </div>
                          <div>
                            <strong className="text-red-700">Danger Point:</strong> {mtg.aiBrief.dangerPoints}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedBriefMeetingId(isSelected ? null : mtg.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isSelected
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>{isSelected ? 'Hide AI Brief' : 'AI Brief'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectDeal(mtg.dealId)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                      >
                        Deal
                      </button>
                      <button
                        onClick={() => alert(`Launching Google Meet video conference with ${mtg.company}...`)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Video className="w-3 h-3" />
                        <span>Join</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {pastMeetings.map((mtg) => (
              <div key={mtg.id} className="nexus-card p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{mtg.title}</h3>
                      <span className="text-xs font-semibold text-slate-500">• {mtg.company}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{mtg.date}</div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{mtg.memoriesRetained} memories indexed</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {mtg.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                    <div className="font-semibold text-amber-900 text-[11px] mb-1">Commitments We Made:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {mtg.commitmentsWeMade.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100">
                    <div className="font-semibold text-blue-900 text-[11px] mb-1">Customer Next Steps:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                      {mtg.customerCommitments.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => onSelectDeal(mtg.dealId)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>Open Deal History & Interaction Log</span>
                    <ChevronRight className="w-3 h-3" />
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
