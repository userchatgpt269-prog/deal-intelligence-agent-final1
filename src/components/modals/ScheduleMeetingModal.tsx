'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Sparkles, Check, Video, MapPin } from 'lucide-react';
import { Deal } from '@/types';

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  initialDealId?: string;
  onMeetingScheduled?: (meeting: any) => void;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  isOpen,
  onClose,
  deals,
  initialDealId,
  onMeetingScheduled,
}) => {
  const [selectedDealId, setSelectedDealId] = useState(initialDealId || deals[0]?.id || '');
  const selectedDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  const [title, setTitle] = useState(`Security & BYOK Architecture Alignment`);
  const [meetingDate, setMeetingDate] = useState('2026-10-02');
  const [meetingTime, setMeetingTime] = useState('14:30');
  const [duration, setDuration] = useState('30 min');
  const [attendees, setAttendees] = useState('Rajesh Subramanian (CITO), Vikram Merchant (VP InfoSec)');
  const [agenda, setAgenda] = useState(
    `1. Review BYOK KMS cryptographic isolation spec\n2. Demonstrate <42ms private bank ledger latency proof\n3. Address Oct 15 procurement budget lock timeline\n4. Confirm pilot deployment milestones`
  );
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeeting = {
      id: `mtg-${Date.now()}`,
      dealId: selectedDealId,
      company: selectedDeal.company,
      title,
      date: meetingDate,
      time: meetingTime,
      duration,
      attendees,
      agenda,
      status: 'upcoming',
    };

    if (onMeetingScheduled) {
      onMeetingScheduled(newMeeting);
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Schedule Strategic Meeting</h3>
              <p className="text-xs text-slate-500">Auto-align agenda with deal risks & stakeholder blockers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Deal / Account</label>
            <select
              value={selectedDealId}
              onChange={(e) => {
                setSelectedDealId(e.target.value);
                const d = deals.find(x => x.id === e.target.value);
                if (d) {
                  setTitle(`Commercial & Technical Sync — ${d.company}`);
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
            >
              {deals.map(d => (
                <option key={d.id} value={d.id}>
                  {d.company} ({d.stage})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Meeting Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time (IST)</label>
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="15 min">15 min</option>
                <option value="30 min">30 min</option>
                <option value="45 min">45 min</option>
                <option value="60 min">60 min</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Stakeholders / Attendees</label>
            <div className="relative">
              <Users className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Names and email addresses..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">Recommended Agenda (Hindsight Grounded)</label>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                AI Generated
              </span>
            </div>
            <textarea
              rows={4}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:border-emerald-500 focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-slate-400" />
              Google Meet link auto-attached
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
              >
                {isSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Meeting Scheduled!</span>
                  </>
                ) : (
                  <>
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Confirm & Schedule</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
