import { useState, useEffect } from 'react';

const NUDGES = [
  {
    id: 1,
    icon: 'fa-fire',
    title: 'Loss Aversion Alert',
    text: 'Your uninvested ₹50,000 surplus is losing ~₹12/day to inflation.',
    color: 'rose',
    action: 'Invest Now',
    actionColor: 'bg-rose-500 hover:bg-rose-600',
  },
  {
    id: 2,
    icon: 'fa-chart-line',
    title: 'Market Opportunity',
    text: 'NIFTY is down 2% this week. Good time to increase your SIP.',
    color: 'primary',
    action: 'Increase SIP',
    actionColor: 'bg-primary hover:bg-primary/90',
  },
  {
    id: 3,
    icon: 'fa-piggy-bank',
    title: 'Savings Streak',
    text: 'You have saved consistently for 8 days. Keep the streak alive!',
    color: 'success',
    action: 'View Goals',
    actionColor: 'bg-success hover:bg-success/90',
  },
];

export default function BehavioralNudges() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % NUDGES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [visible]);

  const nudge = NUDGES[current];
  const colorMap: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-emerald-100 text-emerald-600',
  };

  if (!visible) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-xs transform transition-all duration-500 animate-slide-in-right">
      <div className="bg-white dark:bg-dark-light rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 relative">
        <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-xs">
          <i className="fas fa-times" />
        </button>
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[nudge.color]}`}>
            <i className={`fas ${nudge.icon} text-xs`} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{nudge.title}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{nudge.text}</p>
            <button className={`mt-2 text-[10px] px-2 py-1 text-white rounded transition-colors ${nudge.actionColor}`}>{nudge.action}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
