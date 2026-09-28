'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Plus, Database, Building2, ChevronRight, X } from 'lucide-react';
import { Deal } from '@/types';
import { formatINR } from '@/lib/format';
import { NotificationPopover } from './NotificationPopover';
import { UserProfileData } from './modals/UserProfileModal';

interface HeaderProps {
  title: string;
  subtitle?: string;
  deals: Deal[];
  onSelectDeal: (id: string) => void;
  onOpenCreateDeal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isCloudMemory: boolean;
  onOpenSettings: () => void;
  userProfile: UserProfileData;
  onOpenProfile: () => void;
  onOpenMeetings?: () => void;
  onOpenBilling?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'Last synced 2 min ago',
  deals,
  onSelectDeal,
  onOpenCreateDeal,
  searchQuery,
  onSearchChange,
  isCloudMemory,
  onOpenSettings,
  userProfile,
  onOpenProfile,
  onOpenMeetings,
  onOpenBilling,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter matching deals for dropdown
  const searchResults = searchQuery.trim()
    ? deals.filter((d) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.stage.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Sync Status */}
      <div className="flex flex-col justify-center">
        <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-slate-500 font-medium">{subtitle}</span>
          <span className="text-slate-300">•</span>
          <button 
            onClick={onOpenSettings}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide transition-colors ${
              isCloudMemory 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
            title="Click to configure Hindsight Cloud & Groq Cloud API Keys"
          >
            <Database className="w-2.5 h-2.5" />
            {isCloudMemory ? 'Hindsight Cloud Connected' : 'Hindsight Persistent Bank (Active)'}
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Working Search Input with Dropdown */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Ask NexusAI or search deals..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-14 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition-all"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 pointer-events-none">
              ⌘K
            </kbd>
          )}

          {/* Search Dropdown Results */}
          {isSearchFocused && searchResults.length > 0 && (
            <>
              <div 
                className="fixed inset-0 z-30" 
                onClick={() => setIsSearchFocused(false)} 
              />
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-40 overflow-hidden divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
                <div className="p-2 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex justify-between">
                  <span>Matching Deals ({searchResults.length})</span>
                  <span>Press Esc to close</span>
                </div>
                {searchResults.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => {
                      onSelectDeal(deal.id);
                      setIsSearchFocused(false);
                      onSearchChange('');
                    }}
                    className="p-3 hover:bg-slate-50 cursor-pointer flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[11px]">
                        {deal.company.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                          {deal.company}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {deal.name.slice(0, 35)}...
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{formatINR(deal.value, true)}</div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        {deal.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Create Deal Button */}
        <button
          onClick={onOpenCreateDeal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#166534] border border-[#86EFAC] rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create deal</span>
        </button>

        {/* Notifications Bell with Popover */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors relative"
            title="Notifications & Risk Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-orange-500 absolute top-1.5 right-1.5 ring-2 ring-white"></span>
          </button>

          <NotificationPopover
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onSelectDeal={onSelectDeal}
            onOpenMeetings={onOpenMeetings}
            onOpenBilling={onOpenBilling}
          />
        </div>

        {/* Working User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 border-l border-slate-200 hover:opacity-85 transition-opacity text-left cursor-pointer group"
          title="Click to view & edit your User Profile and AI Requirements"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-semibold overflow-hidden border border-emerald-800 group-hover:ring-2 ring-emerald-400 transition-all">
            {userProfile.initials || 'NS'}
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-900 leading-none group-hover:text-orange-600 transition-colors">
              {userProfile.name}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {userProfile.role}
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
