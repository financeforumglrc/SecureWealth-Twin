import { useState, useRef, useEffect } from 'react';
import { useWealthStore } from '../../store/wealthStore';

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const notifications = useWealthStore((s) => s.notifications);
  const markNotificationRead = useWealthStore((s) => s.markNotificationRead);
  const panelRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);

  const colorMap: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-600',
    primary: 'bg-primary/10 text-primary',
    emerald: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition-colors relative"
      >
        <i className="fas fa-bell" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-[10px] rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-12 right-0 w-80 bg-white dark:bg-dark-light rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
          <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-white">Notifications</h3>
            <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{unreadCount} new</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`flex items-start gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 cursor-pointer ${n.unread ? 'bg-primary/5' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${colorMap[n.color] || 'bg-slate-100 text-slate-600'}`}>
                  <i className={`fas ${n.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs text-slate-700 dark:text-slate-200 ${n.unread ? 'font-medium' : ''}`}>{n.text}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                </div>
                {n.unread && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />}
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-slate-100 dark:border-slate-700 text-center">
            <button
              onClick={() => { notifications.forEach((n) => markNotificationRead(n.id)); }}
              className="text-xs text-primary hover:underline"
            >
              Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
