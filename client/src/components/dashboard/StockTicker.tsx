import { useState, useEffect } from 'react';

const INITIAL_DATA = [
  { name: 'NIFTY 50', value: 25340, change: 1.2, icon: 'fa-arrow-trend-up' },
  { name: 'SENSEX', value: 83245, change: 0.9, icon: 'fa-arrow-trend-up' },
  { name: 'NIFTY Bank', value: 47890, change: -0.4, icon: 'fa-arrow-trend-down' },
  { name: 'GOLD', value: 78500, change: 2.1, icon: 'fa-arrow-trend-up' },
  { name: 'USD/INR', value: 83.2, change: -0.1, icon: 'fa-arrow-trend-down' },
  { name: 'BTC/INR', value: 6250000, change: 3.5, icon: 'fa-arrow-trend-up' },
];

export default function StockTicker() {
  const [data, setData] = useState(INITIAL_DATA);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item) => ({
          ...item,
          value: item.value * (1 + (Math.random() - 0.5) * 0.002),
          change: item.change + (Math.random() - 0.5) * 0.1,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-dark text-white py-2 overflow-hidden">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {[...data, ...data].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{item.name}</span>
            <span>{item.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
            <span className={item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              <i className={`fas ${item.change >= 0 ? 'fa-caret-up' : 'fa-caret-down'} mr-1`} />
              {Math.abs(item.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
