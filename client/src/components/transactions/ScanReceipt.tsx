import { useState, useCallback } from 'react';
import { useWealthStore } from '../../store/wealthStore';
import type { Transaction } from '../../types';

interface Receipt {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  items: string[];
  icon: string;
  color: string;
  bg: string;
}

const MOCK_RECEIPTS: Receipt[] = [
  {
    id: 'r-bigbasket',
    merchant: 'BigBasket',
    category: 'Food',
    amount: 2347,
    date: new Date().toISOString().split('T')[0],
    items: ['Organic Rice 5kg', 'Fresh Vegetables', 'Dairy Products', 'Household Supplies'],
    icon: 'fa-basket-shopping',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    id: 'r-shell',
    merchant: 'Shell Petrol',
    category: 'Transport',
    amount: 3500,
    date: new Date().toISOString().split('T')[0],
    items: ['Petrol - 42.5L @ ₹82.35/L', 'Engine Oil Top-up', 'Car Wash'],
    icon: 'fa-gas-pump',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    id: 'r-zomato',
    merchant: 'Zomato',
    category: 'Food',
    amount: 1200,
    date: new Date().toISOString().split('T')[0],
    items: ['Biryani Combo x2', 'Cold Drinks', 'Delivery Fee', 'GST'],
    icon: 'fa-utensils',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
];

export default function ScanReceipt() {
  const [showScanner, setShowScanner] = useState(false);
  const [scanning, setScanning] = useState<string | null>(null);
  const [scanned, setScanned] = useState<Receipt | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const addTransaction = useWealthStore((s) => s.addTransaction);
  const transactions = useWealthStore((s) => s.transactions);

  const diningSpend = transactions
    .filter((t) => t.category === 'Food' && t.type === 'debit')
    .reduce((s, t) => s + t.amount, 0);

  const handleScan = useCallback((receipt: Receipt) => {
    setScanning(receipt.id);
    setTimeout(() => {
      setScanning(null);
      setScanned(receipt);
    }, 2500);
  }, []);

  const handleAdd = useCallback(() => {
    if (!scanned) return;
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      date: scanned.date,
      description: `${scanned.merchant} — Receipt Scan`,
      category: scanned.category,
      amount: scanned.amount,
      type: 'debit',
      status: 'ALLOWED',
      riskLevel: 'LOW',
    };
    addTransaction(tx);
    setScanned(null);
    setShowScanner(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  }, [scanned, addTransaction]);

  return (
    <>
      {/* Scan Button + Dining Insight */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          onClick={() => setShowScanner(true)}
          className="px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <i className="fas fa-camera" />
          Scan Receipt
        </button>

        {diningSpend > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 text-xs text-amber-700">
            <i className="fas fa-chart-line" />
            <span>
              You spent <strong>₹{diningSpend.toLocaleString()}</strong> on dining this month.
              <span className="text-rose-500 ml-1">23% higher than last month</span>
            </span>
          </div>
        )}
      </div>

      {/* Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              onClick={() => { setShowScanner(false); setScanned(null); setScanning(null); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <i className="fas fa-xmark" />
            </button>

            {!scanned ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <i className="fas fa-camera text-2xl text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Scan Receipt</h3>
                  <p className="text-xs text-slate-400 mt-1">Select a receipt to simulate AI OCR scanning</p>
                </div>

                {/* Camera Frame */}
                <div className="relative bg-slate-900 rounded-xl p-4 mb-6">
                  <div className="aspect-[4/3] rounded-lg border-2 border-dashed border-primary/40 flex items-center justify-center relative overflow-hidden">
                    {/* Scan line animation */}
                    {scanning && (
                      <div className="absolute inset-0 z-10">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary shadow-[0_0_10px_rgba(15,118,110,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                      </div>
                    )}
                    <div className="text-center">
                      <i className="fas fa-receipt text-4xl text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500">
                        {scanning ? 'AI Processing...' : 'Frame your receipt here'}
                      </p>
                    </div>
                    {/* Corner brackets */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary" />
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary" />
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary" />
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary" />
                  </div>
                </div>

                {/* Receipt Options */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Demo Receipts</p>
                  {MOCK_RECEIPTS.map((receipt) => (
                    <button
                      key={receipt.id}
                      onClick={() => handleScan(receipt)}
                      disabled={!!scanning}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        scanning === receipt.id
                          ? 'border-primary bg-primary/5'
                          : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800'
                      } ${scanning && scanning !== receipt.id ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-lg ${receipt.bg} flex items-center justify-center ${receipt.color}`}>
                        <i className={`fas ${receipt.icon}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{receipt.merchant}</p>
                        <p className="text-[10px] text-slate-400">{receipt.items[0]} · {receipt.items.length} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">₹{receipt.amount.toLocaleString()}</p>
                        {scanning === receipt.id && (
                          <p className="text-[10px] text-primary animate-pulse">Scanning...</p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              /* Scanned Result */
              <div className="animate-fade-in">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center mb-3">
                    <i className="fas fa-check text-2xl text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Receipt Scanned!</h3>
                  <p className="text-xs text-slate-400 mt-1">AI categorized automatically</p>
                </div>

                <div className={`rounded-xl p-4 mb-4 ${scanned.bg} border`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center ${scanned.color}`}>
                      <i className={`fas ${scanned.icon}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{scanned.merchant}</p>
                      <p className="text-xs text-slate-500">{scanned.date}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">₹{scanned.amount.toLocaleString()}</p>
                      <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">{scanned.category}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {scanned.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <i className="fas fa-check text-emerald-500 text-[10px]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-3 mb-4 border border-primary/10">
                  <p className="text-xs text-primary font-medium">
                    <i className="fas fa-robot mr-1" /> AI Insight
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    {scanned.category === 'Food' && scanned.amount > 2000
                      ? 'Large grocery bill detected. Consider bulk-buying staples to save 8-12%.'
                      : scanned.category === 'Transport'
                      ? 'Fuel expense tracked. You are 23% over monthly fuel budget.'
                      : 'Dining expense logged. This is your 4th order this week.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                  >
                    <i className="fas fa-plus mr-2" /> Add to Transactions
                  </button>
                  <button
                    onClick={() => setScanned(null)}
                    className="px-4 py-3 text-xs text-slate-400 hover:text-slate-600"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-[90] bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-medium animate-bounce">
          <i className="fas fa-check-circle text-lg" />
          <div>
            <p>Receipt scanned and categorized by AI!</p>
            <p className="text-[10px] text-emerald-100">Added to your transactions</p>
          </div>
        </div>
      )}

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </>
  );
}
