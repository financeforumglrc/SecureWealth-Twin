import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { setAuthState, generateOTP, generateVoiceCode, speakCode, trustDevice, isLockedOut } from '../../services/authService';

export default function LoginPage() {
  const { state, dispatch } = useAuth();
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'id' | 'otp' | 'voice'>('id');
  const [timer, setTimer] = useState(30);
  const [currentOtp, setCurrentOtp] = useState('');
  const [currentVoiceCode, setCurrentVoiceCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showVoiceButton, setShowVoiceButton] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'trusted' | 'untrusted' | 'denied' | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  // Location-based auth
  useEffect(() => {
    if (step !== 'id') return;
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('checking');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const trustedLocs = JSON.parse(localStorage.getItem('sw_trusted_locations') || '[]');
        const isTrusted = trustedLocs.some((loc: any) => {
          const d = Math.sqrt(
            Math.pow(pos.coords.latitude - loc.lat, 2) +
            Math.pow(pos.coords.longitude - loc.lng, 2)
          ) * 111000;
          return d < 500;
        });
        setLocationStatus(isTrusted ? 'trusted' : 'untrusted');
      },
      () => setLocationStatus('denied')
    );
  }, [step]);

  // Timer
  useEffect(() => {
    if (step !== 'otp' || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = () => {
    if (!userId.trim()) return;
    if (isLockedOut()) {
      setError('Account temporarily locked. Please wait 60 seconds.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      const otp = generateOTP();
      setCurrentOtp(otp);
      setStep('otp');
      setTimer(30);
      setLoading(false);
      setShowVoiceButton(true);
      // Show toast with demo OTP
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 z-[100] bg-primary text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-bold animate-fade-in';
      toast.innerHTML = `<i class="fas fa-mobile-screen-button mr-2"/>Demo OTP: ${otp}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }, 1500);
  };

  const handleVoiceOtp = () => {
    const code = generateVoiceCode();
    setCurrentVoiceCode(code);
    speakCode(code);
    setStep('voice');
  };

  const handleVerify = () => {
    if (isLockedOut()) {
      setError('Account temporarily locked. Please wait.');
      return;
    }

    const entered = otp.trim();
    const isDuress = entered === '9876' || entered === currentOtp.split('').reverse().join('');

    if (entered === currentOtp || entered === currentVoiceCode || entered === '123456') {
      // Success
      if (rememberDevice) trustDevice();
      const token = 'mock-jwt-' + Date.now();
      setAuthState({ isAuthenticated: true, userId, token });
      dispatch({ type: 'LOGIN', userId });
      if (isDuress) {
        // Trigger coerced mode silently
        localStorage.setItem('sw_coerced_mode', 'true');
        console.log('🚨 SILENT ALERT: Coerced login detected for user ' + userId);
      }
    } else {
      setError('Invalid OTP. Please try again.');
      dispatch({ type: 'FAIL_ATTEMPT' });
      setOtp('');
    }
  };

  const handleTrustedLocationLogin = () => {
    if (rememberDevice) trustDevice();
    const token = 'mock-jwt-' + Date.now();
    setAuthState({ isAuthenticated: true, userId, token });
    dispatch({ type: 'LOGIN', userId });
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-dark dark:to-dark-light p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 border-2 border-secondary">
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <circle cx="20" cy="20" r="18" fill="white" />
              <circle cx="20" cy="20" r="14" fill="#FFD700" />
              <circle cx="20" cy="20" r="10" fill="white" />
              <path d="M15 25 L20 15 L25 25" stroke="#1B5E20" strokeWidth="1.5" fill="none" />
              <path d="M14 22 L20 18 L26 22" stroke="#1B5E20" strokeWidth="1.2" fill="none" />
              <circle cx="20" cy="15" r="2" fill="#B71C1C" />
              <text x="20" y="24" textAnchor="middle" fontSize="4.5" fontWeight="bold" fill="#1B5E20">PSB</text>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Punjab & Sind Bank</h1>
          <p className="text-sm text-slate-400 mt-1">Internet Banking Portal</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
          {step === 'id' && (
            <>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Welcome back</h2>
              <p className="text-xs text-slate-400 mb-4">Enter your User ID to continue</p>

              {locationStatus === 'trusted' && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800 mb-4">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                    <i className="fas fa-location-dot mr-1" />
                    You are at your trusted location — instant login available!
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-500 font-medium mb-1 block">User ID / Email / Mobile</label>
                  <input
                    ref={inputRef}
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. rahul.sharma@email.com"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-xs text-slate-500">Remember this device</span>
                </label>
                <button
                  onClick={handleSendOtp}
                  disabled={!userId.trim() || loading}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  {loading ? <i className="fas fa-circle-notch animate-spin mr-2" /> : <i className="fas fa-paper-plane mr-2" />}
                  Send OTP
                </button>
                {locationStatus === 'trusted' && (
                  <button
                    onClick={handleTrustedLocationLogin}
                    className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                  >
                    <i className="fas fa-location-dot mr-2" /> Trusted Location Login
                  </button>
                )}
              </div>
            </>
          )}

          {(step === 'otp' || step === 'voice') && (
            <>
              <button onClick={() => setStep('id')} className="text-xs text-slate-400 hover:text-slate-600 mb-3 flex items-center gap-1">
                <i className="fas fa-arrow-left" /> Back
              </button>
              <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                {step === 'otp' ? 'Enter OTP' : 'Voice Verification'}
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                {step === 'otp'
                  ? `We sent a 6-digit code to ${userId}`
                  : 'Enter the 4-digit code you heard'}
              </p>

              <div className="space-y-3">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="numeric"
                  maxLength={step === 'voice' ? 4 : 6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder={step === 'voice' ? '0000' : '000000'}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm tracking-[0.5em] text-center font-bold focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {error && (
                  <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-900/10 p-2 rounded-lg">
                    <i className="fas fa-circle-exclamation mr-1" /> {error}
                    {state.failedAttempts > 0 && (
                      <span className="block mt-0.5">Attempt {state.failedAttempts}/3</span>
                    )}
                  </p>
                )}

                <button
                  onClick={handleVerify}
                  className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                  Verify & Login
                </button>

                {step === 'otp' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setTimer(30); setCurrentOtp(generateOTP()); }}
                      disabled={timer > 0}
                      className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold disabled:opacity-40"
                    >
                      Resend {timer > 0 ? `(${timer}s)` : ''}
                    </button>
                    {showVoiceButton && (
                      <button
                        onClick={handleVoiceOtp}
                        className="flex-1 py-2 bg-violet-100 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-200 transition-colors"
                      >
                        <i className="fas fa-volume-high mr-1" /> Voice OTP
                      </button>
                    )}
                  </div>
                )}

                {step === 'voice' && (
                  <button
                    onClick={() => speakCode(currentVoiceCode)}
                    className="w-full py-2 bg-violet-100 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-200 transition-colors"
                  >
                    <i className="fas fa-volume-high mr-1" /> Replay Code
                  </button>
                )}
              </div>
            </>
          )}

          <p className="text-[10px] text-slate-400 text-center mt-4">
            Demo: OTP is 123456 or check toast. Duress PIN: 9876
          </p>
        </div>
      </div>
    </div>
  );
}
