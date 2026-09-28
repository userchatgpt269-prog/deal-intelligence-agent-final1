'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab, ActiveWorkspace } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { DealsTableView } from '@/components/DealsTableView';
import { DealRiskAgentView } from '@/components/DealRiskAgentView';
import { PipelineView } from '@/components/PipelineView';
import { ContactsView } from '@/components/ContactsView';
import { MeetingsView } from '@/components/MeetingsView';
import { EmailsView } from '@/components/EmailsView';
import { DealDetailWorkspace } from '@/components/DealDetailWorkspace';
import { SettingsView } from '@/components/SettingsView';

// Modals
import { CreateDealModal } from '@/components/modals/CreateDealModal';
import { AddInteractionModal } from '@/components/modals/AddInteractionModal';
import { CreateStakeholderModal } from '@/components/modals/CreateStakeholderModal';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { RescuePlayModal } from '@/components/modals/RescuePlayModal';
import { UserProfileModal, UserProfileData } from '@/components/modals/UserProfileModal';
import { EmailComposerModal } from '@/components/modals/EmailComposerModal';
import { ProposalModal } from '@/components/modals/ProposalModal';
import { ScheduleMeetingModal } from '@/components/modals/ScheduleMeetingModal';
import { PredictOutcomeModal } from '@/components/modals/PredictOutcomeModal';

import { Deal } from '@/types';
import { formatINR } from '@/lib/format';
import { Building2, X } from 'lucide-react';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [currentTab, setCurrentTab] = useState<ActiveTab>('dashboard');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCloudMemory, setIsCloudMemory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Active Workspace: 'all' | 'enterprise' | 'smb' | 'outbound'
  const [activeWorkspace, setActiveWorkspace] = useState<ActiveWorkspace>('all');

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Naruka Sado',
    role: 'Lead Account Executive',
    email: 'naruka.sado@nexusai.com',
    initials: 'NS',
    avatarBg: 'bg-emerald-700',
    workspace: 'Enterprise Sales',
    quota: 35000000, // ₹3.50 Cr
    territory: 'India & APAC Strategic Accounts',
    aiTone: 'executive',
    silenceThresholdDays: 14,
    aiRequirements: 'Always address BYOK KMS security objections, flag budget disparities in INR, emphasize RBI compliance and sub-42ms latency SLA.',
    emailAlerts: true,
    soundAlerts: false,
    riskPushNotifications: true,
  });

  // Modals
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isCreateDealOpen, setIsCreateDealOpen] = useState(false);
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);
  const [isAddStakeholderOpen, setIsAddStakeholderOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isRescuePlayOpen, setIsRescuePlayOpen] = useState(false);
  const [rescueTargetDeal, setRescueTargetDeal] = useState<Deal | null>(null);

  // New Dashboard Action Modals
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isScheduleMeetingOpen, setIsScheduleMeetingOpen] = useState(false);
  const [isPredictOutcomeOpen, setIsPredictOutcomeOpen] = useState(false);
  const [modalTargetDealId, setModalTargetDealId] = useState<string | undefined>(undefined);

  // Load Deals
  const fetchDeals = async () => {
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      if (data.success) {
        setDeals(data.deals);
      }
    } catch (err) {
      console.error('Failed to load deals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check Settings / Memory Status
  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setIsCloudMemory(Boolean(data.settings?.status?.hindsightCloudActive));
      }
    } catch (err) {
      console.error('Failed to check memory status:', err);
    }
  };

  useEffect(() => {
    fetchDeals();
    fetchStatus();

    // Check localStorage for saved user profile
    try {
      const saved = localStorage.getItem('nexusai_user_profile');
      if (saved) {
        setUserProfile(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleSaveProfile = (updated: UserProfileData) => {
    setUserProfile(updated);
    try {
      localStorage.setItem('nexusai_user_profile', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectDeal = (dealId: string | null) => {
    setSelectedDealId(dealId);
    if (dealId) {
      setCurrentTab('detail');
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal and its associated records?')) return;
    try {
      const res = await fetch(`/api/deals/${dealId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        if (selectedDealId === dealId) {
          setSelectedDealId(null);
          setCurrentTab('deals');
        }
        fetchDeals();
      }
    } catch (err) {
      console.error('Failed to delete deal:', err);
    }
  };

  const handleResetData = async () => {
    if (!confirm('Reset all deals, interactions, and memories to initial realistic seed data?')) return;
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchDeals();
        setSelectedDealId(null);
        setCurrentTab('dashboard');
        alert('Database reset to fresh enterprise demo state.');
      }
    } catch (err) {
      console.error('Failed to reset data:', err);
    }
  };

  const handleExecuteRescuePlay = (deal: Deal) => {
    setRescueTargetDeal(deal);
    setIsRescuePlayOpen(true);
  };

  // Workspace-filtered deals
  const displayedDeals = deals.filter(deal => {
    if (activeWorkspace === 'enterprise') {
      return deal.pipeline === 'Enterprise Pipeline' || deal.value >= 15000000;
    }
    if (activeWorkspace === 'smb') {
      return deal.pipeline === 'SMB Pipeline' || deal.value < 15000000;
    }
    if (activeWorkspace === 'outbound') {
      return deal.stage === 'Qualification' || deal.stage === 'Discovery';
    }
    return true;
  });

  const selectedDeal = deals.find(d => d.id === selectedDealId);

  const getHeaderTitle = () => {
    if (currentTab === 'detail' && selectedDeal) {
      return `${selectedDeal.company} — Deal Intelligence`;
    }
    switch (currentTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'deals':
        return 'Deals';
      case 'risk-agent':
        return 'Deal Risk Agent';
      case 'pipeline':
        return 'Pipeline Board';
      case 'contacts':
        return 'Contacts & Stakeholders';
      case 'meetings':
        return 'Meetings';
      case 'emails':
        return 'Email Flows';
      case 'settings':
        return 'Settings & Integrations Hub';
      default:
        return 'NexusAI';
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* LEFT SIDEBAR MATCHING IMAGE 1, 2, 3 */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'detail') setSelectedDealId(null);
        }}
        selectedDealId={selectedDealId}
        onSelectDeal={handleSelectDeal}
        activeWorkspace={activeWorkspace}
        onWorkspaceChange={setActiveWorkspace}
        userProfile={userProfile}
        onOpenProfile={() => setIsUserProfileOpen(true)}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP HEADER MATCHING IMAGE 1 & 2 */}
        <Header
          title={getHeaderTitle()}
          deals={deals}
          onSelectDeal={handleSelectDeal}
          onOpenCreateDeal={() => setIsCreateDealOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isCloudMemory={isCloudMemory}
          onOpenSettings={() => {
            setCurrentTab('settings');
            setSelectedDealId(null);
          }}
          userProfile={userProfile}
          onOpenProfile={() => setIsUserProfileOpen(true)}
          onOpenMeetings={() => setCurrentTab('meetings')}
          onOpenBilling={() => {
            setCurrentTab('dashboard');
          }}
        />

        {/* WORKSPACE FILTER BANNER (IF FILTERING) */}
        {activeWorkspace !== 'all' && (
          <div className="bg-slate-900 text-white px-6 py-2 flex items-center justify-between text-xs z-10 shadow-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-orange-400" />
              <span>
                Active Workspace Filter: <strong>
                  {activeWorkspace === 'enterprise' ? 'Enterprise Sales (Tier-1 Accounts)' : activeWorkspace === 'smb' ? 'SMB Sales' : 'Outbound Team (Pipeline Gen)'}
                </strong> • Showing {displayedDeals.length} filtered deals ({formatINR(displayedDeals.reduce((a, b) => a + b.value, 0), true)} total value)
              </span>
            </div>
            <button
              onClick={() => setActiveWorkspace('all')}
              className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] underline font-medium"
            >
              <X className="w-3 h-3" />
              <span>Reset to All Workspaces</span>
            </button>
          </div>
        )}

        {/* BODY VIEWS */}
        <main className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-xs font-semibold text-slate-600">Loading NexusAI Intelligence...</div>
              </div>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onViewAllDeals={() => setCurrentTab('deals')}
                  onOpenRiskAgent={() => setCurrentTab('risk-agent')}
                  onOpenPipeline={() => setCurrentTab('pipeline')}
                  onOpenEmailComposer={(dealId) => {
                    setModalTargetDealId(dealId);
                    setIsEmailComposerOpen(true);
                  }}
                  onOpenProposal={(dealId) => {
                    setModalTargetDealId(dealId);
                    setIsProposalOpen(true);
                  }}
                  onOpenScheduleMeeting={(dealId) => {
                    setModalTargetDealId(dealId);
                    setIsScheduleMeetingOpen(true);
                  }}
                  onOpenPredictOutcome={(dealId) => {
                    setModalTargetDealId(dealId);
                    setIsPredictOutcomeOpen(true);
                  }}
                />
              )}

              {currentTab === 'deals' && (
                <DealsTableView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onOpenCreateDeal={() => setIsCreateDealOpen(true)}
                  onDeleteDeal={handleDeleteDeal}
                />
              )}

              {currentTab === 'risk-agent' && (
                <DealRiskAgentView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onOpenCreateDeal={() => setIsCreateDealOpen(true)}
                  onExecuteRescuePlay={handleExecuteRescuePlay}
                />
              )}

              {currentTab === 'pipeline' && (
                <PipelineView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onOpenCreateDeal={() => setIsCreateDealOpen(true)}
                />
              )}

              {currentTab === 'contacts' && (
                <ContactsView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onOpenEmailComposer={(dealId) => {
                    setModalTargetDealId(dealId);
                    setIsEmailComposerOpen(true);
                  }}
                  onOpenScheduleMeeting={(dealId) => {
                    setModalTargetDealId(dealId);
                    setIsScheduleMeetingOpen(true);
                  }}
                />
              )}

              {currentTab === 'meetings' && (
                <MeetingsView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onOpenScheduleModal={() => setIsScheduleMeetingOpen(true)}
                />
              )}

              {currentTab === 'emails' && (
                <EmailsView
                  deals={displayedDeals}
                  onSelectDeal={handleSelectDeal}
                  onOpenComposeModal={() => setIsEmailComposerOpen(true)}
                />
              )}

              {currentTab === 'detail' && selectedDeal && (
                <DealDetailWorkspace
                  deal={selectedDeal}
                  onBack={() => {
                    setSelectedDealId(null);
                    setCurrentTab('deals');
                  }}
                  onOpenAddInteraction={() => setIsAddInteractionOpen(true)}
                  onOpenAddStakeholder={() => setIsAddStakeholderOpen(true)}
                  onOpenAddTask={() => setIsAddTaskOpen(true)}
                  onDeleteDeal={handleDeleteDeal}
                  onRefreshDeal={fetchDeals}
                />
              )}

              {currentTab === 'settings' && (
                <SettingsView onResetData={handleResetData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* USER PROFILE MODAL */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        profile={userProfile}
        onSave={handleSaveProfile}
      />

      {/* QUICK ACTION MODALS */}
      <EmailComposerModal
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        deals={deals}
        initialDealId={modalTargetDealId}
      />

      <ProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        deals={deals}
        initialDealId={modalTargetDealId}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleMeetingOpen}
        onClose={() => setIsScheduleMeetingOpen(false)}
        deals={deals}
        initialDealId={modalTargetDealId}
        onMeetingScheduled={(mtg) => {
          alert(`Meeting "${mtg.title}" scheduled for ${mtg.date} at ${mtg.time} IST with Google Meet link attached.`);
        }}
      />

      <PredictOutcomeModal
        isOpen={isPredictOutcomeOpen}
        onClose={() => setIsPredictOutcomeOpen(false)}
        deals={deals}
        initialDealId={modalTargetDealId}
        onSelectDeal={handleSelectDeal}
      />

      {/* GENERAL MODALS */}
      <CreateDealModal
        isOpen={isCreateDealOpen}
        onClose={() => setIsCreateDealOpen(false)}
        onCreated={fetchDeals}
      />

      {selectedDeal && (
        <>
          <AddInteractionModal
            isOpen={isAddInteractionOpen}
            onClose={() => setIsAddInteractionOpen(false)}
            dealId={selectedDeal.id}
            dealCompany={selectedDeal.company}
            onAdded={fetchDeals}
          />

          <CreateStakeholderModal
            isOpen={isAddStakeholderOpen}
            onClose={() => setIsAddStakeholderOpen(false)}
            dealId={selectedDeal.id}
            onCreated={fetchDeals}
          />

          <CreateTaskModal
            isOpen={isAddTaskOpen}
            onClose={() => setIsAddTaskOpen(false)}
            dealId={selectedDeal.id}
            onCreated={fetchDeals}
          />
        </>
      )}

      <RescuePlayModal
        isOpen={isRescuePlayOpen}
        onClose={() => setIsRescuePlayOpen(false)}
        deal={rescueTargetDeal}
        onExecuted={fetchDeals}
      />
    </div>
  );
}
