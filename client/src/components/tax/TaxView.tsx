import { useState } from 'react';
import { useWealthStore } from '../../store/wealthStore';

export default function TaxView() {
  const user = useWealthStore((s) => s.user);
  const [section80c, setSection80c] = useState(125000);
  const [section80d, setSection80d] = useState(25000);
  const [nps, setNps] = useState(50000);

  const max80c = 150000;
  const max80d = 25000;
  const maxNps = 50000;

  const totalSavings = section80c + section80d + nps;
  const taxSaved = totalSavings * (user.taxBracket / 100);

  const recommendations = [
    { name: 'ELSS Mutual Fund', category: '80C', limit: '₹1.5L', returns: '12% avg', lockIn: '3 years' },
    { name: 'PPF', category: '80C', limit: '₹1.5L', returns: '7.1%', lockIn: '15 years' },
    { name: 'NPS Tier 1', category: '80CCD(1B)', limit: '₹50K', returns: '9% avg', lockIn: 'Till 60' },
    { name: 'Health Insurance', category: '80D', limit: '₹25K', returns: 'N/A', lockIn: 'N/A' },
    { name: 'Term Insurance', category: '80C', limit: '₹1.5L', returns: 'N/A', lockIn: 'N/A' },
    { name: 'Sukanya Samriddhi', category: '80C', limit: '₹1.5L', returns: '8.2%', lockIn: '21 years' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h3 className="font-semibold text-slate-800 mb-4">Tax Savings Calculator</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-600 block mb-1">Section 80C (Investments) — Max ₹1.5L</label>
              <input type="range" min="0" max={max80c} step="5000" value={section80c} onChange={(e) => setSection80c(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>₹{section80c.toLocaleString()}</span>
                <span>Max: ₹{max80c.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">Section 80D (Health Insurance) — Max ₹25K</label>
              <input type="range" min="0" max={max80d} step="1000" value={section80d} onChange={(e) => setSection80d(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>₹{section80d.toLocaleString()}</span>
                <span>Max: ₹{max80d.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-600 block mb-1">NPS 80CCD(1B) — Max ₹50K</label>
              <input type="range" min="0" max={maxNps} step="1000" value={nps} onChange={(e) => setNps(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>₹{nps.toLocaleString()}</span>
                <span>Max: ₹{maxNps.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary to-secondary text-white">
          <h3 className="font-semibold mb-4">Your Tax Savings</h3>
          <div className="text-center py-4">
            <p className="text-4xl font-bold">₹{taxSaved.toLocaleString()}</p>
            <p className="text-sm text-white/80 mt-1">Total savings at {user.taxBracket}% bracket</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>80C</span><span>₹{(section80c * user.taxBracket / 100).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>80D</span><span>₹{(section80d * user.taxBracket / 100).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>NPS</span><span>₹{(nps * user.taxBracket / 100).toLocaleString()}</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-800 mb-4">Recommended Tax-Saving Instruments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.name} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">{rec.category}</span>
                <span className="text-xs text-slate-400">Limit: {rec.limit}</span>
              </div>
              <h4 className="font-semibold text-slate-800 mb-1">{rec.name}</h4>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Returns: {rec.returns}</span>
                <span>Lock-in: {rec.lockIn}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
