import { useState, useMemo } from 'react';
import { useWealthStore } from '../../store/wealthStore';
import { formatCurrency } from '../../utils/demoMode';
import AddGoalModal from './AddGoalModal';
import GoalConflictModal from './GoalConflictModal';
import GoalConflictIntelligence from './GoalConflictIntelligence';
import type { Goal } from '../../types';

const GOAL_ICONS: Record<Goal['type'], string> = {
  home: 'fa-house',
  education: 'fa-graduation-cap',
  retirement: 'fa-umbrella-beach',
  emergency: 'fa-kit-medical',
  car: 'fa-car',
  travel: 'fa-plane',
  wedding: 'fa-heart',
  other: 'fa-bullseye',
};

const DEPENDENCY_ORDER: Goal['type'][] = ['emergency', 'home', 'education', 'car', 'wedding', 'travel', 'retirement', 'other'];

interface Props {
  asWidget?: boolean;
}

export default function GoalTracker({ asWidget = false }: Props) {
  const goals = useWealthStore((s) => s.goals);
  const user = useWealthStore((s) => s.user);
  const addGoal = useWealthStore((s) => s.addGoal);
  const editGoal = useWealthStore((s) => s.editGoal);
  const deleteGoal = useWealthStore((s) => s.deleteGoal);
  const monthlySavings = user.monthlySavings;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictGoal, setConflictGoal] = useState<Goal | null>(null);
  const [conflictTotal, setConflictTotal] = useState(0);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const [editCurrent, setEditCurrent] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  function handleSaveGoal(goal: Goal) {
    addGoal(goal);
  }

  function handleConflict(newGoal: Goal, totalMonthlyNeed: number) {
    setConflictGoal(newGoal);
    setConflictTotal(totalMonthlyNeed);
    setShowConflictModal(true);
  }

  function handleResolve(resolvedGoals: Goal[]) {
    resolvedGoals.forEach((g) => {
      const exists = goals.find((existing) => existing.id === g.id);
      if (exists) {
        editGoal(g.id, { deadline: g.deadline, targetAmount: g.targetAmount });
      } else {
        addGoal(g);
      }
    });
    setShowConflictModal(false);
    setShowAddModal(false);
  }

  function applyStrategy(strategy: 'extend' | 'reduce' | 'increase') {
    if (strategy === 'extend') {
      goals.forEach((g) => {
        const d = new Date(g.deadline);
        d.setMonth(d.getMonth() + 12);
        editGoal(g.id, { deadline: d.toISOString().split('T')[0] });
      });
    } else if (strategy === 'reduce') {
      goals.forEach((g) => {
        editGoal(g.id, { targetAmount: Math.round(g.targetAmount * 0.7) });
      });
    }
    // For 'increase', we just show a toast/message since we can't actually change user's income
  }

  function startEdit(goal: Goal) {
    setEditingGoal(goal);
    setEditName(goal.name);
    setEditTarget(goal.targetAmount.toString());
    setEditCurrent(goal.currentAmount.toString());
    setEditDeadline(goal.deadline);
  }

  function saveEdit() {
    if (!editingGoal) return;
    editGoal(editingGoal.id, {
      name: editName,
      targetAmount: parseInt(editTarget) || 0,
      currentAmount: parseInt(editCurrent) || 0,
      deadline: editDeadline,
    });
    setEditingGoal(null);
  }

  const totalMonthlyNeed = goals.reduce((sum, g) => {
    const months = Math.max(1, Math.ceil((new Date(g.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
    return sum + Math.ceil((g.targetAmount - g.currentAmount) / months);
  }, 0);

  const isOverBudget = totalMonthlyNeed > monthlySavings;

  // Goal Health Score: 100 if under budget, drops based on overage ratio and goal count
  const healthScore = useMemo(() => {
    if (goals.length === 0) return 0;
    const ratio = totalMonthlyNeed / monthlySavings;
    const feasibility = ratio <= 1 ? 100 : Math.max(10, Math.round(100 - (ratio - 1) * 40));
    const coverage = Math.min(goals.filter((g) => g.currentAmount > 0).length / goals.length, 1);
    return Math.round(feasibility * 0.7 + coverage * 30);
  }, [goals, totalMonthlyNeed, monthlySavings]);

  const healthColor = healthScore >= 80 ? 'text-emerald-600' : healthScore >= 50 ? 'text-amber-600' : 'text-rose-600';
  const healthBg = healthScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800' : healthScore >= 50 ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800' : 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800';

  // Dependency warnings
  const dependencyWarnings = useMemo(() => {
    const warnings: string[] = [];
    const sorted = [...goals].sort((a, b) => DEPENDENCY_ORDER.indexOf(a.type) - DEPENDENCY_ORDER.indexOf(b.type));
    for (let i = 0; i < sorted.length; i++) {
      const goal = sorted[i];
      const pct = goal.currentAmount / goal.targetAmount;
      // Find higher-priority incomplete goals
      for (let j = 0; j < i; j++) {
        const higher = sorted[j];
        const higherPct = higher.currentAmount / higher.targetAmount;
        if (higherPct < 0.8 && pct > 0.3) {
          warnings.push(`Complete ${higher.name} before ${goal.name}`);
        }
      }
    }
    return [...new Set(warnings)].slice(0, 3);
  }, [goals]);

  if (asWidget) {
    return (
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 dark:text-white">Financial Goals</h3>
          <button onClick={() => setShowAddModal(true)} className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 flex items-center gap-1">
            <i className="fas fa-plus" /> Add
          </button>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {goals.map((goal) => {
            const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{goal.name}</span>
                  <span className="text-xs font-bold text-slate-500">{pct.toFixed(0)}%</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill gradient-primary h-1.5" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Financial Goals</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {goals.length} active • Need ₹{totalMonthlyNeed.toLocaleString()}/mo
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus" /> Add New Goal
        </button>
      </div>

      {/* Goal Health Score */}
      {goals.length > 0 && (
        <div className={`p-4 rounded-xl border ${healthBg}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${healthColor} bg-white dark:bg-slate-800 border-2`} style={{ borderColor: 'currentColor' }}>
                {healthScore}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Goal Health Score</p>
                <p className="text-xs text-slate-500">
                  {healthScore >= 80 ? 'Your goals are well within reach' : healthScore >= 50 ? 'Some adjustments recommended' : 'Immediate action required'}
                </p>
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs text-slate-400">Feasibility</p>
              <p className={`text-sm font-bold ${healthColor}`}>
                {healthScore >= 80 ? 'High' : healthScore >= 50 ? 'Medium' : 'Low'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Goal Conflict Intelligence */}
      {isOverBudget && goals.length > 0 && (
        <GoalConflictIntelligence
          totalMonthlyNeed={totalMonthlyNeed}
          monthlySavings={monthlySavings}
          onApplyStrategy={applyStrategy}
        />
      )}

      {/* Dependency Warnings */}
      {dependencyWarnings.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-800">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-2">
            <i className="fas fa-lightbulb text-amber-500 mr-2" />Goal Sequence Recommendations
          </p>
          <div className="space-y-1.5">
            {dependencyWarnings.map((w, i) => (
              <p key={i} className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <i className="fas fa-arrow-right text-[10px]" /> {w}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const months = Math.max(1, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));
          const monthlyNeed = Math.ceil((goal.targetAmount - goal.currentAmount) / months);
          const isEditing = editingGoal?.id === goal.id;

          return (
            <div key={goal.id} className="card relative group">
              {!isEditing && (
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(goal)} className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors" title="Edit">
                    <i className="fas fa-pen text-[10px]" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${goal.name}"?`)) deleteGoal(goal.id); }} className="w-7 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors" title="Delete">
                    <i className="fas fa-trash text-[10px]" />
                  </button>
                </div>
              )}

              {isEditing ? (
                <div className="space-y-3">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium dark:text-white" />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400">Target (₹)</label>
                      <input type="number" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400">Current (₹)</label>
                      <input type="number" value={editCurrent} onChange={(e) => setEditCurrent(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400">Deadline</label>
                    <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="flex-1 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90"><i className="fas fa-check mr-1" /> Save</button>
                    <button onClick={() => setEditingGoal(null)} className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-200">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <i className={`fas ${GOAL_ICONS[goal.type]}`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-800 dark:text-white pr-14">{goal.name}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{goal.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500">{pct.toFixed(0)}%</span>
                    <span className="text-[10px] text-slate-400">{months} months left</span>
                  </div>
                  <div className="progress-bar mb-3">
                    <div className="progress-bar-fill gradient-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Saved</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{formatCurrency(goal.currentAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Target</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200">{formatCurrency(goal.targetAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700">
                      <span className="text-slate-500">Monthly Need</span>
                      <span className="font-medium text-primary">{formatCurrency(monthlyNeed)}/mo</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {goals.length === 0 && (
        <div className="card text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-bullseye text-2xl text-slate-300" />
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No goals yet</p>
          <p className="text-xs text-slate-400 mt-1">Add your first financial goal to start tracking progress</p>
          <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors">
            <i className="fas fa-plus mr-1" /> Add Goal
          </button>
        </div>
      )}

      <AddGoalModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveGoal}
        existingGoals={goals}
        monthlySavings={monthlySavings}
        onConflict={handleConflict}
      />

      <GoalConflictModal
        show={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        newGoal={conflictGoal}
        existingGoals={goals}
        monthlySavings={monthlySavings}
        totalMonthlyNeed={conflictTotal}
        onResolve={handleResolve}
      />
    </div>
  );
}
