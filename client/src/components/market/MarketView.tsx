import { useWealthStore } from '../../store/wealthStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SmartTriggers from './SmartTriggers';
import MarketStrategist from './MarketStrategist';

const niftyData = [
  { month: 'Jan', value: 21400 }, { month: 'Feb', value: 22300 }, { month: 'Mar', value: 22800 },
  { month: 'Apr', value: 23500 }, { month: 'May', value: 23200 }, { month: 'Jun', value: 24100 },
  { month: 'Jul', value: 24800 }, { month: 'Aug', value: 24500 }, { month: 'Sep', value: 25200 },
  { month: 'Oct', value: 24900 }, { month: 'Nov', value: 25100 }, { month: 'Dec', value: 25340 },
];

const INDICATORS = [
  { label: 'NIFTY P/E', value: '23.4', status: 'Above Average', color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'RBI Repo Rate', value: '6.5%', status: 'Stable', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Inflation (CPI)', value: '6.2%', status: 'Elevated', color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Gold', value: '₹78,500', status: '+2.1%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'USD/INR', value: '83.2', status: 'Stable', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: '10Y G-Sec', value: '7.1%', status: 'Rising', color: 'text-amber-600', bg: 'bg-amber-50' },
];

export default function MarketView() {
  const market = useWealthStore((s) => s.marketData);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {INDICATORS.map((ind) => (
          <div key={ind.label} className="card text-center">
            <p className="text-[10px] text-slate-500 uppercase mb-1">{ind.label}</p>
            <p className="text-lg font-bold text-slate-800">{ind.value}</p>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${ind.bg} ${ind.color}`}>{ind.status}</span>
          </div>
        ))}
      </div>

      <SmartTriggers />

      <MarketStrategist />

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">NIFTY 50 Trend (12 Months)</h3>
          <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-500">Last 12 months</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={niftyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={['dataMin - 1000', 'dataMax + 500']} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#0f766e" fill="#0f766e" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">AI Market Insight</h3>
          <div className="space-y-3">
            <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm font-medium text-primary"><i className="fas fa-chart-line mr-2" />NIFTY P/E at {market.niftyPe}</p>
              <p className="text-xs text-slate-600 mt-1">Above historical average of 20. Consider staggered SIPs over lump sum investments.</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-sm font-medium text-amber-700"><i className="fas fa-triangle-exclamation mr-2" />Inflation Alert</p>
              <p className="text-xs text-slate-600 mt-1">CPI at {market.inflation}% is above RBI's 4% target. Allocate 15% to gold/FDs for stability.</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="text-sm font-medium text-emerald-700"><i className="fas fa-coins mr-2" />Gold Rally</p>
              <p className="text-xs text-slate-600 mt-1">Gold prices surged 2.1% this week. Good hedge against inflation. Review allocation.</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Global Indices</h3>
          <div className="space-y-3">
            {[
              { name: 'S&P 500', country: 'US', value: '5,840', change: 0.8 },
              { name: 'FTSE 100', country: 'UK', value: '8,250', change: -0.3 },
              { name: 'Nikkei 225', country: 'Japan', value: '39,800', change: 1.2 },
              { name: 'DAX', country: 'Germany', value: '19,400', change: 0.5 },
              { name: 'Hang Seng', country: 'Hong Kong', value: '20,100', change: -1.1 },
            ].map((idx) => (
              <div key={idx.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-slate-800">{idx.name}</p>
                  <p className="text-xs text-slate-400">{idx.country}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-slate-800">{idx.value}</p>
                  <p className={`text-xs ${idx.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {idx.change >= 0 ? '+' : ''}{idx.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
