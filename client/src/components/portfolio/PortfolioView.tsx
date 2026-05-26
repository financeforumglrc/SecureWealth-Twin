import { useWealthStore } from '../../store/wealthStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ESGScore from './ESGScore';

const COLORS = ['#0f766e', '#14b8a6', '#f59e0b', '#8b5cf6', '#64748b'];

export default function PortfolioView() {
  const assets = useWealthStore((s) => s.assets);

  const allocation = [
    { name: 'Equity', value: assets.filter((a) => a.type === 'stock' || a.type === 'mutualFund').reduce((s, a) => s + a.value, 0) },
    { name: 'Debt', value: assets.filter((a) => a.type === 'bank').reduce((s, a) => s + a.value, 0) },
    { name: 'Gold', value: assets.filter((a) => a.type === 'gold').reduce((s, a) => s + a.value, 0) },
    { name: 'Real Estate', value: assets.filter((a) => a.type === 'property').reduce((s, a) => s + a.value, 0) },
    { name: 'Other', value: assets.filter((a) => a.type === 'vehicle' || a.type === 'other').reduce((s, a) => s + a.value, 0) },
  ].filter((d) => d.value > 0);

  const sips = [
    { name: 'Axis Bluechip SIP', amount: 15000, frequency: 'Monthly', status: 'Active', startDate: '2024-01-15' },
    { name: 'Nifty 50 Index SIP', amount: 10000, frequency: 'Monthly', status: 'Active', startDate: '2024-03-01' },
    { name: 'PPF Contribution', amount: 12500, frequency: 'Monthly', status: 'Active', startDate: '2023-04-01' },
  ];

  const holdings = [
    { name: 'Axis Bluechip Fund', type: 'equity', value: 280000, returns: 14.2 },
    { name: 'Nifty 50 ETF', type: 'equity', value: 150000, returns: 12.8 },
    { name: 'SBI Savings', type: 'debt', value: 450000, returns: 3.5 },
    { name: 'HDFC Savings', type: 'debt', value: 320000, returns: 3.5 },
    { name: 'Physical Gold', type: 'gold', value: 200000, returns: 8.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Asset Allocation</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {allocation.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {allocation.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-slate-600">{d.name}</span>
                </div>
                <span className="font-medium">₹{(d.value / 1e5).toFixed(1)}L</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Active SIPs</h3>
          <div className="space-y-3">
            {sips.map((sip) => (
              <div key={sip.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <i className="fas fa-rotate text-sm" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{sip.name}</p>
                    <p className="text-xs text-slate-500">Started {new Date(sip.startDate).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800">₹{sip.amount.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">{sip.frequency}</p>
                </div>
                <span className="px-2 py-1 bg-success/10 text-success rounded-full text-xs font-medium">{sip.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card">
          <h3 className="font-semibold text-slate-800 mb-4">Investment Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Type</th>
                  <th className="pb-3 font-medium text-right">Value</th>
                  <th className="pb-3 font-medium text-right">Returns</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-medium text-slate-800">{h.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${h.type === 'equity' ? 'bg-primary/10 text-primary' : h.type === 'gold' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                        {h.type}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium">₹{h.value.toLocaleString()}</td>
                    <td className="py-3 text-right text-success font-medium">+{h.returns}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <ESGScore />
      </div>
    </div>
  );
}
