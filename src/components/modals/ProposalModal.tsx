'use client';

import React, { useState } from 'react';
import { X, FileText, Check, Download, IndianRupee, Sparkles, Building2, Shield, Calendar } from 'lucide-react';
import { Deal } from '@/types';
import { formatINR } from '@/lib/format';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: Deal[];
  initialDealId?: string;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  deals,
  initialDealId,
}) => {
  const [selectedDealId, setSelectedDealId] = useState(initialDealId || deals[0]?.id || '');
  const selectedDeal = deals.find(d => d.id === selectedDealId) || deals[0];

  const [tier, setTier] = useState<'enterprise' | 'custom' | 'standard'>('enterprise');
  const [contractTermMonths, setContractTermMonths] = useState(12);
  const [customPrice, setCustomPrice] = useState(selectedDeal?.value || 25000000);
  const [includeTAM, setIncludeTAM] = useState(true);
  const [byokOption, setByokOption] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create Commercial Proposal Draft</h3>
              <p className="text-xs text-slate-500">Generate executive proposal in INR with AI scope alignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Deal Picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Account / Deal</label>
            <select
              value={selectedDealId}
              onChange={(e) => {
                setSelectedDealId(e.target.value);
                const nextDeal = deals.find(d => d.id === e.target.value);
                if (nextDeal) setCustomPrice(nextDeal.value);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500"
            >
              {deals.map(d => (
                <option key={d.id} value={d.id}>
                  {d.company} — {d.name} ({formatINR(d.value, true)})
                </option>
              ))}
            </select>
          </div>

          {/* Pricing & Commercial Structure */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Total Commercial Value (INR ₹)</label>
              <div className="relative">
                <IndianRupee className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  step="100000"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Formatted: <strong className="text-slate-800">{formatINR(customPrice)}</strong>
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contract Term</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={contractTermMonths}
                  onChange={(e) => setContractTermMonths(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value={12}>12 Months (Annual Pre-pay)</option>
                  <option value={24}>24 Months (Multi-year, 10% benefit)</option>
                  <option value={36}>36 Months (Enterprise Strategic)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add-on Scope Checkboxes */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <div className="font-semibold text-slate-800 text-xs">Included Architecture & Enterprise Add-ons:</div>
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={byokOption}
                onChange={(e) => setByokOption(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Bring-Your-Own-KMS (BYOK) Customer Controlled Encryption module</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={includeTAM}
                onChange={(e) => setIncludeTAM(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Dedicated Enterprise Technical Account Manager (TAM) & 99.99% SLA</span>
            </label>
          </div>

          {/* Proposal Summary Preview */}
          <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-blue-900 font-bold">
              <span>Proposal Summary for {selectedDeal?.company}</span>
              <span>{formatINR(customPrice, true)}</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Scope includes full production deployment for {selectedDeal?.industry} ledger modernization, 
              compliance reporting under RBI/SOC2 guidelines, and hardware-isolated API connectors. 
              Payment scheduled in quarterly tranches upon milestone sign-off.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Auto-formatted with enterprise legal terms
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
            >
              {exported ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Proposal Generated!</span>
                </>
              ) : isExporting ? (
                <span>Generating Proposal...</span>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate Proposal Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
