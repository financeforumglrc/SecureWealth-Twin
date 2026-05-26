import { useState, useMemo } from 'react';
import { useWealthStore } from '../../store/wealthStore';
import type { RecurringBill } from '../../types';

export default function BillCalendar() {
  const bills = useWealthStore((s) => s.bills);
  const toggleBillPaid = useWealthStore((s) => s.toggleBillPaid);
  const payBill = useWealthStore((s) => s.payBill);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showPayModal, setShowPayModal] = useState<RecurringBill | null>(null);

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Compute bill statuses based on due dates
  const computedBills = useMemo(() => {
    return bills.map((bill) => {
      const dueDate = new Date(currentYear, currentMonth, bill.dueDay);
      const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let status: RecurringBill['status'] = bill.status;
      if (bill.status !== 'paid') {
        if (daysUntil < 0) status = 'overdue';
        else if (daysUntil <= 3) status = 'due';
        else status = 'upcoming';
      }
      return { ...bill, daysUntil, status };
    });
  }, [bills, currentMonth, currentYear, today]);

  // Smart alerts
  const alerts = useMemo(() => {
    const list: { type: 'warning' | 'info' | 'danger'; icon: string; text: string }[] = [];

    // Spike detection
    const elec = computedBills.find((b) => b.name === 'Electricity Bill');
    if (elec && elec.predictedAmount && elec.amount > elec.predictedAmount * 1.3) {
      const pct = Math.round(((elec.amount - elec.predictedAmount) / elec.predictedAmount) * 100);
      list.push({
        type: 'warning',
        icon: 'fa-bolt',
        text: `Your electricity bill is usually ₹${elec.predictedAmount.toLocaleString()}. This month it's ₹${elec.amount.toLocaleString()} — ${pct}% higher! Check for issues.`,
      });
    }

    // Weekly due summary
    const dueThisWeek = computedBills.filter((b) => b.status !== 'paid' && b.daysUntil !== undefined && b.daysUntil >= 0 && b.daysUntil <= 7);
    if (dueThisWeek.length >= 2) {
      const total = dueThisWeek.reduce((s, b) => s + b.amount, 0);
      list.push({
        type: 'info',
        icon: 'fa-calendar-week',
        text: `${dueThisWeek.length} bills due this week. Total: ₹${total.toLocaleString()}. Ensure sufficient balance.`,
      });
    }

    // Overdue alert
    const overdue = computedBills.filter((b) => b.status === 'overdue');
    if (overdue.length > 0) {
      list.push({
        type: 'danger',
        icon: 'fa-circle-exclamation',
        text: `${overdue.length} bill(s) overdue! Pay immediately to avoid late fees.`,
      });
    }

    return list;
  }, [computedBills]);

  // Bills for selected date
  const selectedBills = selectedDate
    ? computedBills.filter((b) => b.dueDay === selectedDate)
    : [];

  function getStatusColor(status: RecurringBill['status']) {
    switch (status) {
      case 'paid': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200';
      case 'due': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200';
      case 'overdue': return 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200';
    }
  }

  function getStatusBadge(status: RecurringBill['status'], days?: number) {
    switch (status) {
      case 'paid': return { text: 'Paid', class: 'bg-emerald-100 text-emerald-700' };
      case 'overdue': return { text: 'Overdue', class: 'bg-rose-100 text-rose-700' };
      case 'due': return { text: days === 0 ? 'Due today' : `Due in ${days}d`, class: 'bg-amber-100 text-amber-700' };
      default: return { text: days === undefined ? 'Upcoming' : `In ${days}d`, class: 'bg-slate-100 text-slate-600' };
    }
  }

  function navigateMonth(delta: number) {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setSelectedDate(null);
  }

  const totalDue = computedBills.filter((b) => b.status !== 'paid').reduce((s, b) => s + b.amount, 0);
  const totalPaid = computedBills.filter((b) => b.status === 'paid').reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-slate-400 uppercase">Total Due</p>
          <p className="text-xl font-bold text-rose-600">₹{totalDue.toLocaleString()}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-400 uppercase">Total Paid</p>
          <p className="text-xl font-bold text-emerald-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-400 uppercase">Bills This Month</p>
          <p className="text-xl font-bold text-primary">{computedBills.length}</p>
        </div>
      </div>

      {/* Smart Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm ${
              alert.type === 'danger' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200' :
              alert.type === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200' :
              'bg-primary/5 text-primary border border-primary/20'
            }`}>
              <i className={`fas ${alert.icon} mt-0.5`} />
              <p className="font-medium">{alert.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Calendar + Bills Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              <i className="fas fa-calendar-days text-primary mr-2" />
              Bill Calendar
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={() => navigateMonth(-1)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                <i className="fas fa-chevron-left text-xs" />
              </button>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200 min-w-[100px] text-center">
                {monthNames[currentMonth]} {currentYear}
              </span>
              <button onClick={() => navigateMonth(1)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-600">
                <i className="fas fa-chevron-right text-xs" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-[10px] text-slate-400 font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayBills = computedBills.filter((b) => b.dueDay === day);
              const isToday = day === todayDate && currentMonth === todayMonth && currentYear === todayYear;
              const isSelected = selectedDate === day;
              const hasOverdue = dayBills.some((b) => b.status === 'overdue');
              const hasDue = dayBills.some((b) => b.status === 'due');
              const allPaid = dayBills.length > 0 && dayBills.every((b) => b.status === 'paid');

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day === selectedDate ? null : day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                    isSelected
                      ? 'ring-2 ring-primary bg-primary/5'
                      : isToday
                      ? 'bg-primary/10'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-sm font-medium ${isToday ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{day}</span>
                  {dayBills.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayBills.slice(0, 3).map((b, bi) => (
                        <div key={bi} className={`w-1.5 h-1.5 rounded-full ${
                          b.status === 'paid' ? 'bg-emerald-400' :
                          b.status === 'overdue' ? 'bg-rose-500' :
                          b.status === 'due' ? 'bg-amber-400' :
                          'bg-slate-300'
                        }`} />
                      ))}
                      {dayBills.length > 3 && <span className="text-[8px] text-slate-400">+</span>}
                    </div>
                  )}
                  {hasOverdue && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />}
                  {hasDue && !hasOverdue && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                  {allPaid && <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full" />}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-slate-400">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Overdue</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Due soon</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Paid</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Upcoming</div>
          </div>
        </div>

        {/* Bills List for selected date / all upcoming */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
            {selectedDate ? `Bills on ${selectedDate} ${monthNames[currentMonth]}` : 'Upcoming Bills'}
          </h3>

          {(selectedDate ? selectedBills : computedBills.sort((a, b) => a.dueDay - b.dueDay)).map((bill) => {
            const badge = getStatusBadge(bill.status, bill.daysUntil);
            return (
              <div key={bill.id} className={`card p-3 border ${getStatusColor(bill.status)}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg ${bill.color} text-white flex items-center justify-center flex-shrink-0`}>
                    <i className={`fas ${bill.icon} text-xs`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-slate-800 dark:text-white truncate">{bill.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${badge.class}`}>{badge.text}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {bill.autoDetected && <i className="fas fa-wand-magic-sparkles mr-1 text-secondary" />}
                      {bill.category} · Due {bill.dueDay}{['st','nd','rd'][((bill.dueDay+90)%100-10)%10] || 'th'}
                    </p>
                    <div className="flex items-end justify-between mt-2">
                      <div>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">₹{bill.amount.toLocaleString()}</p>
                        {bill.predictedAmount && bill.amount !== bill.predictedAmount && (
                          <p className="text-[10px] text-slate-400">
                            Avg: ₹{bill.predictedAmount.toLocaleString()}
                            {bill.amount > bill.predictedAmount ? (
                              <span className="text-rose-500 ml-1">▲ {Math.round(((bill.amount - bill.predictedAmount) / bill.predictedAmount) * 100)}%</span>
                            ) : (
                              <span className="text-emerald-500 ml-1">▼ {Math.round(((bill.predictedAmount - bill.amount) / bill.predictedAmount) * 100)}%</span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {(bill.status === 'upcoming' || bill.status === 'due' || bill.status === 'overdue') ? (
                        <>
                          <button
                            onClick={() => setShowPayModal(bill)}
                            className="flex-1 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <i className="fas fa-credit-card mr-1" /> Pay Now
                          </button>
                          <label className="flex items-center gap-1.5 text-[10px] text-slate-500 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={false}
                              onChange={() => toggleBillPaid(bill.id)}
                              className="accent-primary"
                            />
                            Already paid
                          </label>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-600 text-xs font-medium">
                          <i className="fas fa-check-circle" />
                          Paid {bill.lastPaid ? `on ${bill.lastPaid}` : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {(selectedDate ? selectedBills : computedBills).length === 0 && (
            <div className="card p-6 text-center">
              <i className="fas fa-check-double text-2xl text-emerald-400 mb-2" />
              <p className="text-sm text-slate-500">{selectedDate ? 'No bills on this date.' : 'All bills paid for this month!'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Pay Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <i className={`fas ${showPayModal.icon} text-2xl text-primary`} />
            </div>
            <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-1">Pay {showPayModal.name}</h3>
            <p className="text-center text-slate-500 text-sm mb-4">
              Amount: <span className="font-bold text-slate-800 dark:text-white">₹{showPayModal.amount.toLocaleString()}</span>
            </p>
            <div className="space-y-2 mb-4">
              <button className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <i className="fas fa-bolt mr-2" /> UPI / Instant Pay
              </button>
              <button className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                <i className="fas fa-building-columns mr-2" /> Net Banking
              </button>
            </div>
            <button
              onClick={() => { payBill(showPayModal.id); setShowPayModal(null); }}
              className="w-full py-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <i className="fas fa-check mr-1" /> Mark as Paid (No Payment)
            </button>
            <button onClick={() => setShowPayModal(null)} className="w-full mt-2 py-2 text-xs text-slate-400 hover:text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
