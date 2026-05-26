import { useState } from 'react';

interface Props {
  onSubmit: (pin: string) => void;
  onCancel: () => void;
  amount: number;
  payee: string;
}

export default function MPINInput({ onSubmit, onCancel, amount, payee }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleKey = (n: string) => {
    if (pin.length < 6) setPin((p) => p + n);
  };

  const handleBack = () => setPin((p) => p.slice(0, -1));

  const handleSubmit = () => {
    if (pin.length !== 6) {
      setError('Enter 6-digit MPIN');
      return;
    }
    setError('');
    onSubmit(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 m-4">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-shield-halved text-primary text-xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Enter MPIN</h3>
          <p className="text-xs text-slate-400 mt-1">Paying ₹{amount.toLocaleString()} to {payee}</p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all ${
                i < pin.length ? 'bg-primary scale-110' : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-xs text-rose-500 text-center mb-3">{error}</p>}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'back'].map((key) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'back') handleBack();
                else if (key) handleKey(key);
              }}
              className={`h-14 rounded-xl text-xl font-bold transition-colors ${
                key === '' ? 'pointer-events-none' :
                key === 'back'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {key === 'back' ? <i className="fas fa-delete-left text-lg" /> : key}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
            Pay Securely
          </button>
        </div>
      </div>
    </div>
  );
}
