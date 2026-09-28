'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Briefcase, 
  ShieldAlert, 
  BrainCircuit, 
  Users, 
  Building2, 
  Calendar, 
  Mail, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus, 
  ChevronRight,
  SunMedium,
  PanelLeftClose,
  Zap,
  Globe,
  Check
} from 'lucide-react';
import { UserProfileData } from './modals/UserProfileModal';

export type ActiveTab = 
  | 'dashboard' 
  | 'deals' 
  | 'risk-agent' 
  | 'pipeline' 
  | 'contacts' 
  | 'meetings' 
  | 'emails' 
  | 'detail' 
  | 'settings';

export type ActiveWorkspace = 'all' | 'enterprise' | 'smb' | 'outbound';

interface SidebarProps {
  currentTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedDealId: string | null;
  onSelectDeal: (id: string | null) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  activeWorkspace: ActiveWorkspace;
  onWorkspaceChange: (ws: ActiveWorkspace) => void;
  userProfile: UserProfileData;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  selectedDealId,
  onSelectDeal,
  collapsed = false,
  onToggleCollapse,
  activeWorkspace,
  onWorkspaceChange,
  userProfile,
  onOpenProfile,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 select-none z-30 flex-shrink-0">
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <div 
          onClick={() => { onTabChange('dashboard'); onSelectDeal(null); }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/30 group-hover:scale-105 transition-transform">
            <SunMedium className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Nexus<span className="text-orange-500">AI</span>
          </span>
        </div>
        <button 
          onClick={onToggleCollapse} 
          className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
          title="Toggle Navigation"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* OVERVIEW SECTION - ALL BUTTONS WORKING */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Overview
          </div>
          <nav className="space-y-0.5">
            {/* 1. Dashboard */}
            <button
              onClick={() => { onTabChange('dashboard'); onSelectDeal(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dashboard' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-slate-500" />
              <span>Dashboard</span>
            </button>

            {/* 2. Deals */}
            <button
              onClick={() => { onTabChange('deals'); onSelectDeal(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'deals' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-slate-500" />
              <span>Deals</span>
            </button>

            {/* 3. Deal Risk Agent */}
            <button
              onClick={() => { onTabChange('risk-agent'); onSelectDeal(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'risk-agent' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                <span>Deal Risk Agent</span>
              </div>
              <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">
                AI
              </span>
            </button>

            {/* Selected Deal Workspace Link */}
            {selectedDealId && (
              <button
                onClick={() => onTabChange('detail')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === 'detail'
                    ? 'bg-orange-50 text-orange-900 font-semibold border-l-2 border-orange-500'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BrainCircuit className="w-4 h-4 text-orange-600" />
                <span>Deal Intelligence</span>
              </button>
            )}

            {/* 4. Pipeline (Dedicated Working Option) */}
            <button
              onClick={() => { onTabChange('pipeline'); onSelectDeal(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'pipeline' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span>Pipeline</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* 5. Accounts */}
            <button 
              onClick={() => { onTabChange('deals'); onSelectDeal(null); }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Building2 className="w-4 h-4 text-slate-500" />
              <span>Accounts</span>
            </button>

            {/* 6. Contacts (Dedicated Working Option) */}
            <button 
              onClick={() => { onTabChange('contacts'); onSelectDeal(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'contacts' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Contacts</span>
            </button>

            {/* 7. Meetings (Dedicated Working Option) */}
            <button 
              onClick={() => { onTabChange('meetings'); onSelectDeal(null); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'meetings' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Meetings</span>
            </button>

            {/* 8. Emails (Dedicated Working Option) */}
            <button 
              onClick={() => { onTabChange('emails'); onSelectDeal(null); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'emails' && !selectedDealId
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Emails</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </nav>
        </div>

        {/* WORKSPACES SECTION - WORKING SWITCHER */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <span>Workspaces</span>
            <button 
              onClick={() => onWorkspaceChange('all')}
              className="text-[10px] text-orange-600 hover:underline capitalize"
            >
              {activeWorkspace === 'all' ? 'Filtering: All' : 'Show All'}
            </button>
          </div>
          <div className="space-y-0.5">
            {/* Enterprise Sales */}
            <div 
              onClick={() => onWorkspaceChange('enterprise')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                activeWorkspace === 'enterprise' 
                  ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">E</span>
                <span className="font-medium text-xs">Enterprise Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">(12)</span>
                {activeWorkspace === 'enterprise' && <Check className="w-3 h-3 text-blue-600" />}
              </div>
            </div>

            {/* SMB Sales */}
            <div 
              onClick={() => onWorkspaceChange('smb')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                activeWorkspace === 'smb' 
                  ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">S</span>
                <span className="font-medium text-xs">SMB Sales</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">(8)</span>
                {activeWorkspace === 'smb' && <Check className="w-3 h-3 text-amber-600" />}
              </div>
            </div>

            {/* Outbound Team */}
            <div 
              onClick={() => onWorkspaceChange('outbound')}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors ${
                activeWorkspace === 'outbound' 
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center">O</span>
                <span className="font-medium text-xs">Outbound Team</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 font-medium">(15)</span>
                {activeWorkspace === 'outbound' && <Check className="w-3 h-3 text-emerald-600" />}
              </div>
            </div>
          </div>
        </div>

        {/* UPGRADE CARD */}
        <div className="p-3.5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
            <Zap className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Upgrade your workspace</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Unlock advanced Hindsight persistent memory and enterprise team collaboration.
          </p>
          <button 
            onClick={() => onTabChange('settings')}
            className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
          >
            Upgrade Now
          </button>
        </div>
      </div>

      {/* FOOTER USER PROFILE - CLICKABLE TO OPEN USER PROFILE MODAL */}
      <div className="p-3 border-t border-slate-200/80 space-y-1">
        <button
          onClick={() => { onTabChange('settings'); onSelectDeal(null); }}
          className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            currentTab === 'settings'
              ? 'bg-slate-100 text-slate-900 font-semibold'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings & API Keys</span>
        </button>

        <button 
          onClick={() => { onTabChange('settings'); }}
          className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <HelpCircle className="w-4 h-4 text-slate-500" />
          <span>Support & Docs</span>
        </button>

        {/* User Profile Trigger Button */}
        <div 
          onClick={onOpenProfile}
          className="pt-2 flex items-center justify-between px-2 hover:bg-slate-50 rounded-lg p-1.5 cursor-pointer transition-colors group"
          title="Click to view & edit your User Profile and AI Requirements"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-300 group-hover:ring-2 ring-orange-300">
              {userProfile.initials || 'NS'}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-none group-hover:text-orange-600 transition-colors">
                {userProfile.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[120px]">
                {userProfile.role}
              </span>
            </div>
          </div>
          <button className="text-slate-400 hover:text-slate-600 p-1" title="User Profile Settings">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
