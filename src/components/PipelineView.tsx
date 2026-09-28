'use client';

import React, { useState } from 'react';
import { 
  BarChart3, 
  Plus, 
  ChevronRight, 
  Star, 
  Search, 
  Filter, 
  IndianRupee, 
  Building2, 
  User, 
  Clock, 
  ArrowRight,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Deal, DealStage } from '@/types';
import { formatINR } from '@/lib/format';

interface PipelineViewProps {
  deals: Deal[];
  onSelectDeal: (dealId: string) => void;
  onOpenCreateDeal: () => void;
  onUpdateDealStage?: (dealId: string, nextStage: DealStage) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  deals,
  onSelectDeal,
  onOpenCreateDeal,
}) => {
  const [pipelineFilter, setPipelineFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localDeals, setLocalDeals] = useState<Deal[]>(deals);

  // Sync if props change
  React.useEffect(() => {
    setLocalDeals(deals);
  }, [deals]);

  const stages: { stage: DealStage; label: string; color: string }[] = [
    { stage: 'Qualification', label: '1. Qualification', color: 'border-purple-300' },
    { stage: 'Discovery', label: '2. Discovery', color: 'border-blue-300' },
    { stage: 'Proposal', label: '3. Proposal', color: 'border-orange-300' },
    { stage: 'Negotiation', label: '4. Negotiation', color: 'border-amber-300' },
    { stage: 'Closed Won', label: '5. Closed Won', color: 'border-emerald-300' },
  ];

  const filteredDeals = localDeals.filter(deal => {
    const matchesSearch = 
      deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPipeline = pipelineFilter === 'all' || deal.pipeline === pipelineFilter;
    return matchesSearch && matchesPipeline;
  });

  const totalValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  const moveStage = (dealId: string, direction: 'forward' | 'backward', e: React.MouseEvent) => {
    e.stopPropagation();
    const stageOrder: DealStage[] = ['Qualification', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];
    setLocalDeals(prev => prev.map(d => {
      if (d.id !== dealId) return d;
      const curIdx = stageOrder.indexOf(d.stage);
      const nextIdx = direction === 'forward' ? Math.min(curIdx + 1, stageOrder.length - 1) : Math.max(curIdx - 1, 0);
      return { ...d, stage: stageOrder[nextIdx] };
    }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50">
      {/* Top Header */}
      <div className="p-6 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Pipeline Board</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredDeals.length} Opportunities
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual deal stages, stage velocity, and conversion flow in INR
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Pipeline Value</div>
            <div className="text-base font-bold text-slate-900">{formatINR(totalValue, true)}</div>
          </div>

          {/* Pipeline select */}
          <select
            value={pipelineFilter}
            onChange={(e) => setPipelineFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer shadow-sm"
          >
            <option value="all">All Pipelines</option>
            <option value="Enterprise Pipeline">Enterprise Pipeline</option>
            <option value="Apollo Pipeline">Apollo Pipeline</option>
            <option value="SMB Pipeline">SMB Pipeline</option>
          </select>

          {/* Search */}
          <div className="relative w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter pipeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:border-orange-500 shadow-sm"
            />
          </div>

          <button
            onClick={onOpenCreateDeal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create deal</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-w-[1100px] h-full">
          {stages.map((st) => {
            const colDeals = filteredDeals.filter(d => d.stage === st.stage);
            const colTotal = colDeals.reduce((acc, d) => acc + d.value, 0);

            return (
              <div 
                key={st.stage}
                className="bg-slate-100/80 rounded-2xl p-3 border border-slate-200 flex flex-col h-full shadow-sm"
              >
                {/* Column Header */}
                <div className="pb-3 border-b border-slate-200/80 mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{st.label}</h3>
                    <div className="text-[11px] font-bold text-slate-500 mt-0.5">
                      {formatINR(colTotal, true)}
                    </div>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shadow-xs">
                    {colDeals.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colDeals.map((deal) => {
                    const isAurora = deal.company.includes('Aurora');
                    return (
                      <div
                        key={deal.id}
                        onClick={() => onSelectDeal(deal.id)}
                        className={`p-3.5 bg-white border rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer group ${
                          isAurora ? 'border-amber-400 ring-1 ring-amber-300' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                            {deal.company}
                          </span>
                          {isAurora && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                        </div>

                        <div className="text-xs font-bold text-slate-900 mt-1">
                          {formatINR(deal.value)}
                        </div>

                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          {deal.name}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{deal.daysInStage}d in stage</span>
                          </div>
                          <span className="font-medium text-slate-600">{deal.owner}</span>
                        </div>

                        {/* Stage Move Controls */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={(e) => moveStage(deal.id, 'backward', e)}
                            disabled={deal.stage === 'Qualification'}
                            className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded disabled:opacity-20"
                            title="Move back a stage"
                          >
                            ← Back
                          </button>
                          <span className="text-[10px] text-orange-600 font-semibold group-hover:underline flex items-center gap-0.5">
                            Intel <Eye className="w-2.5 h-2.5" />
                          </span>
                          <button
                            onClick={(e) => moveStage(deal.id, 'forward', e)}
                            disabled={deal.stage === 'Closed Won'}
                            className="px-2 py-0.5 text-[10px] font-semibold text-slate-900 bg-slate-100 hover:bg-orange-100 hover:text-orange-800 rounded disabled:opacity-20 flex items-center gap-0.5"
                            title="Advance to next stage"
                          >
                            <span>Next</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add deal at bottom of column */}
                <button
                  onClick={onOpenCreateDeal}
                  className="mt-3 py-1.5 w-full text-center text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-colors flex items-center justify-center gap-1 border border-dashed border-slate-300"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add deal</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
