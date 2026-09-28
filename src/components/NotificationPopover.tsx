'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Receipt, 
  X, 
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { formatINR } from '@/lib/format';

export interface NotificationItem {
  id: string;
  type: 'risk' | 'stalled' | 'meeting' | 'billing' | 'memory' | 'won';
  title: string;
  description: string;
  timeAgo: string;
  unread: boolean;
  dealId?: string;
  amount?: number;
}

interface NotificationPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDeal: (dealId: string) => void;
  onOpenMeetings?: () => void;
  onOpenBilling?: () => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  isOpen,
  onClose,
  onSelectDeal,
  onOpenMeetings,
  onOpenBilling,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'risk',
      title: 'High Risk Alert: Aurora Solutions',
      description: '14 days with zero engagement in Discovery stage. Active BYOK security objection pending CISO review.',
      timeAgo: '18m ago',
      unread: true,
      dealId: 'deal-1',
      amount: 25000000,
    },
    {
      id: 'notif-2',
      type: 'stalled',
      title: 'Stalled Deal: Flexion Enterprises',
      description: 'Moved to Proposal 21 days ago without budget alignment. ₹20 L discount requested.',
      timeAgo: '1h ago',
      unread: true,
      dealId: 'deal-3',
      amount: 20000000,
    },
    {
      id: 'notif-3',
      type: 'meeting',
      title: 'Upcoming Meeting: CISO Alignment',
      description: 'Scheduled with Vikram Merchant (Aurora Solutions) tomorrow at 2:30 PM IST.',
      timeAgo: '3h ago',
      unread: true,
      dealId: 'deal-1',
    },
    {
      id: 'notif-4',
      type: 'billing',
      title: 'Invoice Due: Vertex Digital',
      description: 'Invoice #INV-2026-08 (₹42.5 L) due in 3 days. Awaiting finance department signature.',
      timeAgo: '5h ago',
      unread: false,
      dealId: 'deal-6',
      amount: 4250000,
    },
    {
      id: 'notif-5',
      type: 'memory',
      title: 'Hindsight Memory Synchronized',
      description: '18 facts & commitments indexed for Tier-1 accounts into local persistent bank.',
      timeAgo: 'Yesterday',
      unread: false,
    },
    {
      id: 'notif-6',
      type: 'won',
      title: 'Closed Won: Globex Corporation',
      description: 'Enterprise SIP contract signed for ₹2.10 Cr! Revenue recognized for Q3.',
      timeAgo: '2d ago',
      unread: false,
      dealId: 'deal-5',
      amount: 21000000,
    },
  ]);

  if (!isOpen) return null;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const markSingleAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    if (filter === 'critical') return n.type === 'risk' || n.type === 'stalled';
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'stalled':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'billing':
        return <Receipt className="w-4 h-4 text-purple-500" />;
      case 'won':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'memory':
      default:
        return <Sparkles className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popover */}
      <div className="absolute right-6 top-16 w-96 max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900">Notifications & Alerts</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 hover:underline"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200/50"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white text-[11px]">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              filter === 'unread'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`px-2.5 py-1 rounded-full font-medium transition-colors ${
              filter === 'critical'
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            Critical Deal Risks
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications to display.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markSingleAsRead(item.id);
                  if (item.dealId) {
                    onSelectDeal(item.dealId);
                    onClose();
                  } else if (item.type === 'meeting' && onOpenMeetings) {
                    onOpenMeetings();
                    onClose();
                  } else if (item.type === 'billing' && onOpenBilling) {
                    onOpenBilling();
                    onClose();
                  }
                }}
                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                  item.unread ? 'bg-orange-50/20' : ''
                }`}
              >
                {/* Dot if unread */}
                {item.unread && (
                  <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-4 right-4" />
                )}

                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="flex-1 text-xs pr-4">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 leading-snug">
                    <span>{item.title}</span>
                    {item.amount && (
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                        {formatINR(item.amount, true)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                    <span>{item.timeAgo}</span>
                    <span>•</span>
                    <span className="text-orange-600 group-hover:underline flex items-center gap-0.5">
                      View details <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
          <span className="text-[11px] text-slate-400">
            Real-time pipeline monitoring powered by NexusAI sentinel
          </span>
        </div>
      </div>
    </>
  );
};
