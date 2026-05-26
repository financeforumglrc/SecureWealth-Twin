import { useWealthStore } from '../../store/wealthStore';
import { formatCurrency } from '../../utils/demoMode';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#0f766e', '#14b8a6', '#f59e0b', '#8b5cf6', '#64748b', '#ef4444'];

export default function NetWorthCard() {
  const assets = useWealthStore((s) => s.assets);
  const netWorth = assets.reduce((sum, a) => sum + a.value, 0);
  const liquid = assets.filter((a) => a.liquidity === 'high').reduce((s, a) => s + a.value, 0);
  const investments = assets.filter((a) => ['stock', 'mutualFund'].includes(a.type)).reduce((s, a) => s + a.value, 0);
  const physical = assets.filter((a) => ['gold', 'property', 'vehicle'].includes(a.type)).reduce((s, a) => s + a.value, 0);

  const data = [
    { name: 'Bank', value: assets.filter((a) => a.type === 'bank').reduce((s, a) => s + a.value, 0) },
    { name: 'Mutual Funds', value: assets.filter((a) => a.type === 'mutualFund').reduce((s, a) => s + a.value, 0) },
    { name: 'Stocks', value: assets.filter((a) => a.type === 'stock').reduce((s, a) => s + a.value, 0) },
    { name: 'Gold', value: assets.filter((a) => a.type === 'gold').reduce((s, a) => s + a.value, 0) },
    { name: 'Property', value: assets.filter((a) => a.type === 'property').reduce((s, a) => s + a.value, 0) },
    { name: 'Other', value: assets.filter((a) => a.type === 'other' || a.type === 'vehicle').reduce((s, a) => s + a.value, 0) },
  ].filter((d) => d.value > 0);

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">Net Worth Overview</h3>
        <ComplianceBadge />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Stat label="Total Net Worth" value={formatCurrency(netWorth)} icon="fa-wallet" color="text-primary" />
        <Stat label="Liquid Assets" value={formatCurrency(liquid)} icon="fa-droplet" color="text-secondary" />
        <Stat label="Investments" value={formatCurrency(investments)} icon="fa-chart-pie" color="text-accent" />
        <Stat label="Physical" value={formatCurrency(physical)} icon="fa-gem" color="text-purple-500" />
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(val) => formatCurrency(Number(val))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 justify-center mt-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <i className={`fas ${icon} text-xs ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase">{label}</span>
      </div>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}

function ComplianceBadge() {
  return (
    <span className="text-[10px] px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
      <i className="fas fa-vial mr-1" /> Simulated
    </span>
  );
}
