import { useState } from 'react';
import { useWealthStore } from '../../store/wealthStore';
import TransactionDetailModal from './TransactionDetailModal';
import ScanReceipt from './ScanReceipt';
import AICategorization from './AICategorization';
import SmartDuplicateDetection from './SmartDuplicateDetection';
import TransactionTagger from './TransactionTagger';
import type { Transaction } from '../../types';

type FilterType = 'all' | 'allowed' | 'blocked' | 'delayed';

const STATUS_STYLES: Record<string, string> = {
  ALLOWED: 'bg-emerald-100 text-emerald-700',
  BLOCKED: 'bg-rose-100 text-rose-700',
  DELAYED: 'bg-amber-100 text-amber-700',
};

const RISK_STYLES: Record<string, string> = {
  LOW: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  MEDIUM: 'bg-amber-50 text-amber-600 border-amber-100',
  HIGH: 'bg-rose-50 text-rose-600 border-rose-100',
};

const CATEGORY_ICONS: Record<string, string> = {
  Income: 'fa-wallet',
  Food: 'fa-utensils',
  Utilities: 'fa-bolt',
  Investment: 'fa-chart-line',
  Housing: 'fa-house',
  Transfer: 'fa-money-bill-transfer',
  Shopping: 'fa-bag-shopping',
  Transport: 'fa-car',
};

export default function TransactionsView() {
  const transactions = useWealthStore((s) => s.transactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.status.toLowerCase() === filter;
  });

  const stats = {
    total: transactions.length,
    allowed: transactions.filter((t) => t.status === 'ALLOWED').length,
    blocked: transactions.filter((t) => t.status === 'BLOCKED').length,
    delayed: transactions.filter((t) => t.status === 'DELAYED').length,
    blockedAmount: transactions.filter((t) => t.status === 'BLOCKED').reduce((s, t) => s + t.amount, 0),
    delayedAmount: transactions.filter((t) => t.status === 'DELAYED').reduce((s, t) => s + t.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</p>
          <p className="text-xs text-slate-500">Total Transactions</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-emerald-600">{stats.allowed}</p>
          <p className="text-xs text-slate-500">Allowed</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-rose-600">{stats.blocked}</p>
          <p className="text-xs text-slate-500">Blocked</p>
          <p className="text-[10px] text-rose-400">₹{stats.blockedAmount.toLocaleString()} protected</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.delayed}</p>
          <p className="text-xs text-slate-500">Delayed</p>
          <p className="text-[10px] text-amber-400">₹{stats.delayedAmount.toLocaleString()} cooling</p>
        </div>
      </div>

      {/* Scan Receipt */}
      <ScanReceipt />

      {/* AI Categorization */}
      <AICategorization />

      {/* Smart Duplicate Detection */}
      <SmartDuplicateDetection />

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {([
            { key: 'all', label: 'All', count: stats.total },
            { key: 'allowed', label: 'Allowed', count: stats.allowed },
            { key: 'blocked', label: 'Blocked', count: stats.blocked },
            { key: 'delayed', label: 'Delayed', count: stats.delayed },
          ] as { key: FilterType; label: string; count: number }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                filter === f.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {f.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f.key ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400">{filtered.length} shown</span>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <th className="pb-3 font-medium px-4">Date</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium text-center">Status</th>
                <th className="pb-3 font-medium text-center">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setSelectedTx(t)}
                  className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                        t.status === 'BLOCKED' ? 'bg-rose-100 text-rose-600' :
                        t.status === 'DELAYED' ? 'bg-amber-100 text-amber-600' :
                        'bg-slate-100 dark:bg-slate-700 text-slate-500'
                      }`}>
                        <i className={`fas ${t.status === 'BLOCKED' ? 'fa-shield-virus' : t.status === 'DELAYED' ? 'fa-hourglass-half' : CATEGORY_ICONS[t.category] || 'fa-circle'}`} />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{t.description}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs">{t.category}</span>
                  </td>
                  <td className={`py-3 text-right font-medium whitespace-nowrap ${t.type === 'credit' ? 'text-emerald-600' : 'text-slate-800 dark:text-white'}`}>
                    {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_STYLES[t.status]}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${RISK_STYLES[t.riskLevel]}`}>
                      {t.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-slate-400">No transactions match this filter.</p>
          </div>
        )}
      </div>

      {/* Regret & Align Tagger */}
      <TransactionTagger />

      {/* Security Summary Card */}
      <div className="card">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">
          <i className="fas fa-shield-halved text-primary mr-2" /> Security Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl text-center border border-emerald-100 dark:border-emerald-800">
            <p className="text-3xl font-bold text-emerald-600">{stats.allowed}</p>
            <p className="text-xs text-emerald-600 mt-1">Allowed Transactions</p>
            <p className="text-[10px] text-emerald-400">Passed all security checks</p>
          </div>
          <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl text-center border border-rose-100 dark:border-rose-800">
            <p className="text-3xl font-bold text-rose-600">₹{stats.blockedAmount.toLocaleString()}</p>
            <p className="text-xs text-rose-600 mt-1">Blocked Amount</p>
            <p className="text-[10px] text-rose-400">Fraud prevention active</p>
          </div>
          <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl text-center border border-amber-100 dark:border-amber-800">
            <p className="text-3xl font-bold text-amber-600">₹{stats.delayedAmount.toLocaleString()}</p>
            <p className="text-xs text-amber-600 mt-1">Delayed Amount</p>
            <p className="text-[10px] text-amber-400">Cooling vault protection</p>
          </div>
        </div>
      </div>

      <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </div>
  );
}
