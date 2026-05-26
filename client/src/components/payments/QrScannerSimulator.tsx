import { useState, useEffect } from 'react';

interface Props {
  onScan: (upiId: string, payeeName: string, amount?: number) => void;
  onClose: () => void;
}

const MOCK_QR_CODES = [
  { upiId: 'swiggy@upi', name: 'Swiggy', amount: 485 },
  { upiId: 'zomato@upi', name: 'Zomato', amount: 320 },
  { upiId: 'bigbasket@upi', name: 'BigBasket', amount: 1299 },
  { upiId: 'amazon@upi', name: 'Amazon India', amount: 2499 },
  { upiId: 'reliancefresh@upi', name: 'Reliance Fresh', amount: 675 },
  { upiId: 'merchant@paytm', name: 'Local Store', amount: 150 },
];

export default function QrScannerSimulator({ onScan, onClose }: Props) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [detected, setDetected] = useState<typeof MOCK_QR_CODES[0] | null>(null);

  useEffect(() => {
    if (!scanning) return;
    setProgress(0);
    setDetected(null);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          const random = MOCK_QR_CODES[Math.floor(Math.random() * MOCK_QR_CODES.length)];
          setDetected(random);
          return 100;
        }
        return p + 4;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [scanning]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-slate-900 rounded-3xl shadow-2xl p-6 m-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">
            <i className="fas fa-qrcode mr-2" />
            Scan Any QR
          </h3>
          <button onClick={onClose} className="w-8 h-8 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <i className="fas fa-xmark" />
          </button>
        </div>

        {/* Camera View */}
        <div className="aspect-square rounded-2xl bg-black relative overflow-hidden mb-4">
          {/* Simulated camera feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black">
            {scanning && (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-primary/50 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary" />
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary" />
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-0 right-0 px-4">
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-white/70 text-xs text-center mt-2">
                    {progress < 100 ? 'Align QR code within frame...' : 'QR code detected!'}
                  </p>
                </div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/30 animate-[scan_2s_ease-in-out_infinite]" />
              </>
            )}
          </div>

          {!scanning && !detected && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
              <i className="fas fa-camera text-4xl mb-3" />
              <p className="text-sm">Camera preview</p>
            </div>
          )}

          {detected && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-4 text-center mx-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <i className="fas fa-check text-green-500 text-xl" />
                </div>
                <p className="font-bold text-slate-800 dark:text-white">{detected.name}</p>
                <p className="text-sm text-slate-500">{detected.upiId}</p>
                <p className="text-lg font-bold text-primary mt-1">₹{detected.amount}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {!scanning && !detected && (
          <button
            onClick={() => setScanning(true)}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fas fa-camera" />
            Start Scan
          </button>
        )}

        {detected && (
          <div className="flex gap-3">
            <button
              onClick={() => { setScanning(false); setDetected(null); }}
              className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors"
            >
              Scan Again
            </button>
            <button
              onClick={() => onScan(detected.upiId, detected.name, detected.amount)}
              className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
            >
              Pay Now
            </button>
          </div>
        )}

        <p className="text-white/40 text-xs text-center mt-4">
          <i className="fas fa-shield-halved mr-1" />
          Secure & encrypted
        </p>
      </div>
    </div>
  );
}
