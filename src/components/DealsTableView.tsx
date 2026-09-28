'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  SlidersHorizontal, 
  Building2, 
  User, 
  GitBranch, 
  Calendar, 
  IndianRupee, 
  Eye, 
  Trash2, 
  Sparkles, 
  Plus, 
  CheckSquare, 
  Square,
  ArrowUpDown,
  BarChart3,
  TrendingUp,
  PieChart,
  LayoutGrid,
  List,
  RotateCcw,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Deal } from '@/types';
import { formatINR } from '@/lib/format';

interface DealsTableViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onOpenCreateDeal: () => void;
  onDeleteDeal: (dealId: string) => void;
  onAddSampleDeal?: () => void;
}

export const DealsTableView: React.FC<DealsTableViewProps> = ({
  deals,
  onSelectDeal,
  onOpenCreateDeal,
  onDeleteDeal,
  onAddSampleDeal,
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'analytics'>('overview');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'company'>('date');

  // Filter Expand/Collapse states
  const [openFilterSection, setOpenFilterSection] = useState<string | null>('company');

  // Multi-Filter States
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>('all');
  const [selectedCloseDateRange, setSelectedCloseDateRange] = useState<string>('all');
  const [selectedCustomField, setSelectedCustomField] = useState<string>('all');
  const [selectedAccountList, setSelectedAccountList] = useState<string>('all');

  // Unique companies and owners
  const allCompanies = Array.from(new Set(deals.map(d => d.company)));
  const allOwners = Array.from(new Set(deals.map(d => d.owner)));
  const allStages = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

  // Count active filters
  const activeFiltersCount = 
    selectedCompanies.length + 
    selectedOwners.length + 
    selectedStages.length + 
    (selectedAmountRange !== 'all' ? 1 : 0) + 
    (selectedCloseDateRange !== 'all' ? 1 : 0) +
    (pipelineFilter !== 'all' ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCompanies([]);
    setSelectedOwners([]);
    setSelectedStages([]);
    setSelectedAmountRange('all');
    setSelectedCloseDateRange('all');
    setSelectedCustomField('all');
    setSelectedAccountList('all');
    setPipelineFilter('all');
    setSearchQuery('');
  };

  // Filtered and Sorted deals
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.owner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPipeline = pipelineFilter === 'all' || deal.pipeline === pipelineFilter;
    const matchesCompany = selectedCompanies.length === 0 || selectedCompanies.includes(deal.company);
    const matchesOwner = selectedOwners.length === 0 || selectedOwners.includes(deal.owner);
    const matchesStage = selectedStages.length === 0 || selectedStages.includes(deal.stage);

    let matchesAmount = true;
    if (selectedAmountRange === 'under15') matchesAmount = deal.value < 15000000;
    else if (selectedAmountRange === '15to22') matchesAmount = deal.value >= 15000000 && deal.value <= 22000000;
    else if (selectedAmountRange === 'above22') matchesAmount = deal.value > 22000000;

    let matchesCloseDate = true;
    if (selectedCloseDateRange === 'q3') {
      const m = new Date(deal.closeDate).getMonth();
      matchesCloseDate = m >= 6 && m <= 8;
    } else if (selectedCloseDateRange === 'q4') {
      const m = new Date(deal.closeDate).getMonth();
      matchesCloseDate = m >= 9 && m <= 11;
    }

    return matchesSearch && matchesPipeline && matchesCompany && matchesOwner && matchesStage && matchesAmount && matchesCloseDate;
  }).sort((a, b) => {
    if (sortBy === 'amount') return b.value - a.value;
    if (sortBy === 'company') return a.company.localeCompare(b.company);
    return new Date(b.closeDate).getTime() - new Date(a.closeDate).getTime();
  });

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDeals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDeals.map(d => d.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getStageBadgeStyle = (stage: string) => {
    switch (stage) {
      case 'Closed Won':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Negotiation':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Proposal':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Discovery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Qualification':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
      {/* SUB-HEADER WITH TABS & CREATE BUTTON MATCHING IMAGE 2 */}
      <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-slate-900">Deals</h2>
          <div className="flex items-center gap-1 border-b border-transparent">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'overview'
                  ? 'text-slate-900 bg-slate-100'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'analytics'
                  ? 'text-slate-900 bg-slate-100'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 py-0.2 rounded font-bold">New</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => onSelectDeal(deals[0]?.id || '')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Assistant</span>
          </button>

          <button
            onClick={onOpenCreateDeal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FEF08A] hover:bg-[#FDE047] text-slate-900 font-bold rounded-lg text-xs shadow-sm transition-all border border-amber-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create deal</span>
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR MATCHING IMAGE 2 */}
      <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pipeline select */}
          <div className="relative">
            <select
              value={pipelineFilter}
              onChange={(e) => setPipelineFilter(e.target.value)}
              className="appearance-none pl-3 pr-7 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-400 cursor-pointer shadow-sm"
            >
              <option value="all">All Pipelines</option>
              <option value="Enterprise Pipeline">Enterprise Pipeline</option>
              <option value="Apollo Pipeline">Apollo Pipeline</option>
              <option value="SMB Pipeline">SMB Pipeline</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Hide/Show Filters toggle button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-1 bg-white border rounded-md text-xs font-semibold shadow-sm transition-colors ${
              activeFiltersCount > 0 ? 'border-orange-400 text-orange-700 bg-orange-50/50' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Search deals input */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-md text-xs placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
            />
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sort By Toggle */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none pl-7 pr-7 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700 focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="date">Sort: Close Date</option>
              <option value="amount">Sort: Deal Amount</option>
              <option value="company">Sort: Company</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* View Mode Toggle (Table vs Cards) */}
          <div className="flex bg-white border border-slate-200 rounded-md p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded ${viewMode === 'table' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1 rounded ${viewMode === 'cards' ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-600'}`}
              title="Cards view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* OVERVIEW VS ANALYTICS TABS */}
      {activeSubTab === 'analytics' ? (
        /* DEALS ANALYTICS DASHBOARD */
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Deals Pipeline Analytics</h3>
              <p className="text-xs text-slate-500">Conversion funnels, velocity drop-offs, and win distributions</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Live Model Analysis
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Stage Velocity & Average Cycle */}
            <div className="nexus-card p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Average Days in Stage (Velocity)</span>
              </h4>
              <div className="space-y-2.5 pt-2">
                {[
                  { stage: 'Qualification', days: 8, benchmark: 'Healthy (< 10d)', pct: 40 },
                  { stage: 'Discovery', days: 14, benchmark: 'Normal (14d avg)', pct: 60 },
                  { stage: 'Proposal', days: 21, benchmark: 'Slow • Attention needed', pct: 85, alert: true },
                  { stage: 'Negotiation', days: 12, benchmark: 'Fast (12d avg)', pct: 50 },
                  { stage: 'Closed Won', days: 28, benchmark: 'Total cycle time', pct: 70 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.stage}</span>
                      <span className={`font-bold ${item.alert ? 'text-orange-600' : 'text-slate-900'}`}>
                        {item.days} days ({item.benchmark})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.alert ? 'bg-orange-500' : 'bg-blue-600'}`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pipeline by Industry */}
            <div className="nexus-card p-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-blue-500" />
                <span>Pipeline Value by Industry (INR ₹)</span>
              </h4>
              <div className="space-y-3 pt-2">
                {[
                  { industry: 'Financial Services & Banking', amount: '₹2.50 Cr', deals: 1, share: '30%' },
                  { industry: 'Telecommunications', amount: '₹2.10 Cr', deals: 1, share: '25%' },
                  { industry: 'Retail & Logistics', amount: '₹2.00 Cr', deals: 1, share: '24%' },
                  { industry: 'Cybersecurity', amount: '₹1.75 Cr', deals: 1, share: '21%' },
                ].map((ind, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{ind.industry}</div>
                      <div className="text-[10px] text-slate-400">{ind.deals} active enterprise account</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 text-xs">{ind.amount}</div>
                      <span className="text-[10px] text-emerald-600 font-semibold">{ind.share} share</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN CONTAINER: LEFT FILTER SIDEBAR + RIGHT DEALS VIEW */
        <div className="flex-1 flex overflow-hidden">
          {/* LEFT ACCORDION FILTER SIDEBAR (USER REQUESTED: all 10 filters must work) */}
          {showFilters && (
            <aside className="w-64 border-r border-slate-200 bg-white overflow-y-auto p-4 space-y-3 select-none flex-shrink-0 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1">
                <span>Filter By</span>
                {activeFiltersCount > 0 && (
                  <button onClick={resetAllFilters} className="text-orange-600 lowercase hover:underline">
                    clear all
                  </button>
                )}
              </div>

              {/* 1. Company Filter */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'company' ? null : 'company')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Company</span>
                    {selectedCompanies.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                        {selectedCompanies.length}
                      </span>
                    )}
                  </div>
                  {openFilterSection === 'company' ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openFilterSection === 'company' && (
                  <div className="p-2.5 space-y-1.5 bg-white border-t border-slate-100 max-h-40 overflow-y-auto">
                    {allCompanies.map((comp) => {
                      const checked = selectedCompanies.includes(comp);
                      return (
                        <label key={comp} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedCompanies(checked ? selectedCompanies.filter(c => c !== comp) : [...selectedCompanies, comp]);
                            }}
                            className="rounded text-orange-500 focus:ring-orange-500"
                          />
                          <span className="truncate">{comp}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 2. Owner Filter */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'owner' ? null : 'owner')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Owner</span>
                    {selectedOwners.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                        {selectedOwners.length}
                      </span>
                    )}
                  </div>
                  {openFilterSection === 'owner' ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openFilterSection === 'owner' && (
                  <div className="p-2.5 space-y-1.5 bg-white border-t border-slate-100">
                    {allOwners.map((owner) => {
                      const checked = selectedOwners.includes(owner);
                      return (
                        <label key={owner} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedOwners(checked ? selectedOwners.filter(o => o !== owner) : [...selectedOwners, owner]);
                            }}
                            className="rounded text-orange-500 focus:ring-orange-500"
                          />
                          <span>{owner}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Stage Filter */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'stage' ? null : 'stage')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                    <span>Stage</span>
                    {selectedStages.length > 0 && (
                      <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                        {selectedStages.length}
                      </span>
                    )}
                  </div>
                  {openFilterSection === 'stage' ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openFilterSection === 'stage' && (
                  <div className="p-2.5 space-y-1.5 bg-white border-t border-slate-100">
                    {allStages.map((st) => {
                      const checked = selectedStages.includes(st);
                      return (
                        <label key={st} className="flex items-center gap-2 cursor-pointer text-slate-700 hover:text-slate-900">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedStages(checked ? selectedStages.filter(s => s !== st) : [...selectedStages, st]);
                            }}
                            className="rounded text-orange-500 focus:ring-orange-500"
                          />
                          <span>{st}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 4. Amount INR Filter */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'amount' ? null : 'amount')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" />
                    <span>Amount (INR ₹)</span>
                  </div>
                  {openFilterSection === 'amount' ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openFilterSection === 'amount' && (
                  <div className="p-2.5 space-y-1.5 bg-white border-t border-slate-100">
                    {[
                      { id: 'all', label: 'All Values' },
                      { id: 'under15', label: '< ₹1.5 Cr' },
                      { id: '15to22', label: '₹1.5 Cr – ₹2.2 Cr' },
                      { id: 'above22', label: '> ₹2.2 Cr' },
                    ].map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="radio"
                          name="amountFilter"
                          checked={selectedAmountRange === opt.id}
                          onChange={() => setSelectedAmountRange(opt.id)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Closed Date Filter */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'closedDate' ? null : 'closedDate')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Closed Date</span>
                  </div>
                  {openFilterSection === 'closedDate' ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openFilterSection === 'closedDate' && (
                  <div className="p-2.5 space-y-1.5 bg-white border-t border-slate-100">
                    {[
                      { id: 'all', label: 'All Dates' },
                      { id: 'q3', label: 'Q3 2026 (Jul - Sep)' },
                      { id: 'q4', label: 'Q4 2026 (Oct - Dec)' },
                    ].map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                        <input
                          type="radio"
                          name="closeDateFilter"
                          checked={selectedCloseDateRange === opt.id}
                          onChange={() => setSelectedCloseDateRange(opt.id)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Custom Fields & Lists */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFilterSection(openFilterSection === 'custom' ? null : 'custom')}
                  className="w-full p-2.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Custom Fields & Lists</span>
                  </div>
                  {openFilterSection === 'custom' ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                {openFilterSection === 'custom' && (
                  <div className="p-2.5 space-y-1.5 bg-white border-t border-slate-100">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedCustomField === 'byok'}
                        onChange={(e) => setSelectedCustomField(e.target.checked ? 'byok' : 'all')}
                        className="rounded text-orange-500"
                      />
                      <span>BYOK Encryption Required</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedAccountList === 'strategic'}
                        onChange={(e) => setSelectedAccountList(e.target.checked ? 'strategic' : 'all')}
                        className="rounded text-orange-500"
                      />
                      <span>Strategic Enterprise List</span>
                    </label>
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* RIGHT VIEW: TABLE OR CARDS */}
          <main className="flex-1 overflow-auto bg-white">
            {viewMode === 'table' ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-200">
                  <tr className="text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4 w-10">
                      <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                        {selectedIds.length === filteredDeals.length && filteredDeals.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-orange-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 font-bold text-slate-700">Deal Name</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Company</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Deal Amount</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Stage</th>
                    <th className="py-3 px-4 font-bold text-slate-700">Pipeline</th>
                    <th className="py-3 px-4 text-right font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No deals match the selected filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredDeals.map((deal) => {
                      const isSelected = selectedIds.includes(deal.id);
                      return (
                        <tr
                          key={deal.id}
                          className={`hover:bg-slate-50/80 transition-colors group ${
                            isSelected ? 'bg-orange-50/40' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => toggleSelectOne(deal.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-orange-500" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 font-medium">
                            <button
                              onClick={() => onSelectDeal(deal.id)}
                              className="text-left text-slate-900 font-semibold hover:text-orange-600 hover:underline transition-colors leading-tight"
                            >
                              {deal.name}
                            </button>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Owner: {deal.owner} • Close: {new Date(deal.closeDate).toLocaleDateString('en-IN')}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700 font-medium">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-3.5 h-3.5 text-slate-400" />
                              <span>{deal.company}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {formatINR(deal.value)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getStageBadgeStyle(deal.stage)}`}>
                              {deal.stage}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {deal.pipeline}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => onSelectDeal(deal.id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 rounded-md font-semibold text-[11px] transition-colors inline-flex items-center gap-1"
                              title="Open Deal Intelligence Workspace"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Intelligence</span>
                            </button>
                            <button
                              onClick={() => onDeleteDeal(deal.id)}
                              className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                              title="Delete Deal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            ) : (
              /* CARDS GRID VIEW */
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDeals.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => onSelectDeal(deal.id)}
                    className="nexus-card p-5 space-y-3 cursor-pointer hover:border-slate-300 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStageBadgeStyle(deal.stage)}`}>
                          {deal.stage}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{formatINR(deal.value)}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-2">{deal.company}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{deal.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Owner: {deal.owner}</span>
                      <span className="text-orange-600 font-semibold hover:underline">View Intelligence →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};
