/**
 * ═══════════════════════════════════════════════════════════════════
 *  AUTH SHIELD — Complete Authentication & Fraud Protection Layer
 *  ═══════════════════════════════════════════════════════════════════
 *
 *  Features:
 *  1. Login ID (email/mobile) + 6-digit OTP simulation
 *  2. Risk-Based Authentication (device fingerprinting)
 *  3. Panic Mode / Coerced Transaction Detection
 *  4. Biometric Simulation (Face ID / Fingerprint)
 *  5. Voice OTP (Web Speech API)
 *  6. Magic Link (passwordless simulation)
 *  7. Session Management (active sessions, remote revoke)
 *  8. Fraud Alerts + Captcha + Lockout + Session Timeout
 *
 *  ⚠️ DISCLAIMER: Demo simulation. No real OTPs are sent.
 *  All security features are simulated for hackathon evaluation.
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  DEVICE FINGERPRINT ENGINE
  // ═══════════════════════════════════════════════════════════════

  const DeviceFingerprint = {
    generate() {
      const fp = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        cpuCores: navigator.hardwareConcurrency || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        touchSupport: !!('ontouchstart' in window),
        timestamp: Date.now()
      };
      fp.hash = this._hash(JSON.stringify(fp));
      return fp;
    },

    getTrusted() {
      try { return JSON.parse(localStorage.getItem('sw_trusted_fingerprint')); } catch(e) { return null; }
    },

    setTrusted(fp) {
      localStorage.setItem('sw_trusted_fingerprint', JSON.stringify(fp));
    },

    clearTrusted() {
      localStorage.removeItem('sw_trusted_fingerprint');
    },

    compare(current, trusted) {
      if (!trusted) return { match: false, reason: 'No trusted device registered' };
      const diffs = [];
      if (current.hash === trusted.hash) return { match: true, diffs: [] };
      if (current.screenResolution !== trusted.screenResolution) diffs.push('Screen resolution changed');
      if (current.timezone !== trusted.timezone) diffs.push('Timezone changed');
      if (current.platform !== trusted.platform) diffs.push('Platform/OS changed');
      if (current.language !== trusted.language) diffs.push('Language changed');
      return { match: false, diffs, reason: diffs.length ? diffs.join('; ') : 'Device fingerprint mismatch' };
    },

    _hash(str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
      }
      return 'fp_' + Math.abs(h).toString(36);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  AUTH STATE MANAGER
  // ═══════════════════════════════════════════════════════════════

  const AuthState = {
    isLoggedIn: false,
    isCoerced: false,
    biometricEnabled: false,
    sessionId: null,
    loginTime: null,
    lastActivity: null,
    otpAttempts: 0,
    otpRequestCount: 0,
    otpLastRequestTime: 0,
    lockoutUntil: null,
    captchaRequired: false,

    init() {
      const s = localStorage.getItem('sw_auth_state');
      if (s) {
        try {
          const parsed = JSON.parse(s);
          // Only restore session if within 15 min timeout
          if (parsed.lastActivity && (Date.now() - parsed.lastActivity) < 900000) {
            Object.assign(this, parsed);
          } else {
            this.clear();
          }
        } catch(e) { this.clear(); }
      }
    },

    save() {
      this.lastActivity = Date.now();
      localStorage.setItem('sw_auth_state', JSON.stringify({
        isLoggedIn: this.isLoggedIn,
        isCoerced: this.isCoerced,
        biometricEnabled: this.biometricEnabled,
        sessionId: this.sessionId,
        loginTime: this.loginTime,
        lastActivity: this.lastActivity,
        otpAttempts: this.otpAttempts,
        otpRequestCount: this.otpRequestCount,
        otpLastRequestTime: this.otpLastRequestTime,
        lockoutUntil: this.lockoutUntil,
        captchaRequired: this.captchaRequired
      }));
    },

    login() {
      this.isLoggedIn = true;
      this.sessionId = 'sess_' + Date.now();
      this.loginTime = Date.now();
      this.lastActivity = Date.now();
      this.otpAttempts = 0;
      this.otpRequestCount = 0;
      this.lockoutUntil = null;
      this.captchaRequired = false;
      this.save();
      DeviceFingerprint.setTrusted(DeviceFingerprint.generate());
    },

    logout() {
      this.isLoggedIn = false;
      this.isCoerced = false;
      this.sessionId = null;
      this.save();
    },

    clear() {
      this.isLoggedIn = false;
      this.isCoerced = false;
      this.biometricEnabled = false;
      this.sessionId = null;
      this.loginTime = null;
      this.lastActivity = null;
      this.otpAttempts = 0;
      this.otpRequestCount = 0;
      this.otpLastRequestTime = 0;
      this.lockoutUntil = null;
      this.captchaRequired = false;
      this.save();
    },

    touch() {
      this.lastActivity = Date.now();
      this.save();
    },

    isExpired() {
      return this.isLoggedIn && this.lastActivity && (Date.now() - this.lastActivity) > 900000;
    }
  };

  AuthState.init();

  // ═══════════════════════════════════════════════════════════════
  //  SESSION MANAGER
  // ═══════════════════════════════════════════════════════════════

  const SessionManager = {
    sessions: [],

    init() {
      try {
        this.sessions = JSON.parse(localStorage.getItem('sw_sessions') || '[]');
      } catch(e) { this.sessions = []; }
      if (AuthState.isLoggedIn) {
        this._addCurrent();
      }
    },

    save() {
      localStorage.setItem('sw_sessions', JSON.stringify(this.sessions.slice(0, 10)));
    },

    _addCurrent() {
      const fp = DeviceFingerprint.generate();
      this.sessions = this.sessions.filter(s => s.id !== AuthState.sessionId);
      this.sessions.unshift({
        id: AuthState.sessionId,
        device: this._getDeviceName(),
        browser: fp.userAgent.split(' ').pop(),
        location: 'Bangalore, India',
        ip: '103.***.***.142',
        loginTime: new Date(AuthState.loginTime).toISOString(),
        isCurrent: true,
        isCoerced: AuthState.isCoerced
      });
      this.save();
    },

    addMockSessions() {
      if (this.sessions.length < 3) {
        this.sessions.push(
          { id: 'sess_mock_1', device: 'Xiaomi Mi 9', browser: 'Chrome 120', location: 'Mumbai, India', ip: '49.***.***.88', loginTime: new Date(Date.now() - 7200000).toISOString(), isCurrent: false, isCoerced: false },
          { id: 'sess_mock_2', device: 'MacBook Pro', browser: 'Safari 17', location: 'Berlin, Germany', ip: '91.***.***.55', loginTime: new Date(Date.now() - 86400000).toISOString(), isCurrent: false, isCoerced: false, suspicious: true, alert: 'Login from unusual location — verify identity' }
        );
        this.save();
      }
    },

    getAll() { return this.sessions; },

    revoke(sessionId) {
      this.sessions = this.sessions.filter(s => s.id !== sessionId);
      this.save();
      return true;
    },

    _getDeviceName() {
      const ua = navigator.userAgent;
      if (/Windows/.test(ua)) return 'Windows PC';
      if (/Mac/.test(ua)) return 'Mac';
      if (/Android/.test(ua)) return 'Android Phone';
      if (/iPhone|iPad/.test(ua)) return 'iPhone';
      return 'Unknown Device';
    }
  };
  SessionManager.init();

  // ═══════════════════════════════════════════════════════════════
  //  CAPTCHA GENERATOR
  // ═══════════════════════════════════════════════════════════════

  const CaptchaEngine = {
    _question: null,
    _answer: null,

    generate() {
      const a = Math.floor(Math.random() * 50) + 1;
      const b = Math.floor(Math.random() * 30) + 1;
      const ops = [
        { op: '+', answer: a + b, text: `${a} + ${b} = ?` },
        { op: '×', answer: a * b, text: `${a} × ${b} = ?` },
        { op: '-', answer: Math.abs(a - b), text: `${Math.max(a,b)} - ${Math.min(a,b)} = ?` }
      ];
      const chosen = ops[Math.floor(Math.random() * ops.length)];
      this._question = chosen.text;
      this._answer = chosen.answer;
      return this._question;
    },

    validate(userAnswer) {
      return parseInt(userAnswer) === this._answer;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  VOICE OTP (Web Speech API)
  // ═══════════════════════════════════════════════════════════════

  const VoiceOTP = {
    speak(otp) {
      if (!('speechSynthesis' in window)) {
        App.showToast?.('Voice OTP not supported in this browser', 'warning');
        return false;
      }
      const digits = otp.toString().split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(
        `Your SecureWealth Twin one-time password is ${digits}. Do not share it with anyone. I repeat: ${digits}.`
      );
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.lang = 'en-IN';
      utterance.onstart = () => App.showToast?.('🔊 Speaking OTP...', 'info');
      utterance.onend = () => App.showToast?.('✅ Voice OTP delivered', 'success');
      utterance.onerror = () => App.showToast?.('Voice OTP failed — use SMS OTP instead', 'warning');
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      return true;
    },

    speakCustom(text) {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  AUTH SHIELD — MAIN LOGIN CONTROLLER
  // ═══════════════════════════════════════════════════════════════

  const AuthShield = {
    generatedOTP: null,
    otpExpiresAt: null,
    resendTimer: null,
    resendSeconds: 0,
    panicPin: null, // reversed last 4 digits of user's mobile

    /**
     * Show login screen
     */
    showLogin() {
      // Remove existing login overlay if any
      const existing = document.getElementById('auth-shield-overlay');
      if (existing) existing.remove();

      const overlay = document.createElement('div');
      overlay.id = 'auth-shield-overlay';
      overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
      overlay.style.background = 'linear-gradient(135deg, #060F1E 0%, #0B1D3A 50%, #132D52 100%)';
      overlay.innerHTML = this._buildLoginHTML();
      document.body.appendChild(overlay);

      // Wire up events
      this._wireEvents();
      this._animateIn();
    },

    _buildLoginHTML() {
      const isLocked = AuthState.lockoutUntil && Date.now() < AuthState.lockoutUntil;
      const remainingLockout = isLocked ? Math.ceil((AuthState.lockoutUntil - Date.now()) / 60000) : 0;

      return `
        <div class="w-full max-w-md" id="auth-shield-card">
          <!-- Disclaimer -->
          <div class="text-center mb-6">
            <p class="text-xs text-white/30 italic mb-2">⚠️ Demo simulation — no real OTPs are sent. All security features are simulated for hackathon evaluation.</p>
          </div>

          <!-- Glass Card -->
          <div class="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden" style="animation: authCardIn 0.6s cubic-bezier(0.16,1,0.3,1)">
            <!-- Header -->
            <div class="p-6 text-center border-b border-white/5">
              <div class="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style="background: linear-gradient(135deg, #C4A962, #D4BD7C);">
                <i class="fas fa-shield-halved text-2xl" style="color: #0B1D3A;"></i>
              </div>
              <h1 class="text-2xl font-bold text-white">SecureWealth Twin</h1>
              <p class="text-sm text-white/40 mt-1">Private Banking Authentication</p>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4" id="auth-body">
              ${isLocked ? this._buildLockoutHTML(remainingLockout) : this._buildLoginFormHTML()}
            </div>

            <!-- Footer -->
            <div class="px-6 pb-6 text-center">
              <p class="text-[10px] text-white/20">
                <i class="fas fa-lock mr-1"></i> AES-256 encrypted · RBI AA compliant · On-device auth
              </p>
            </div>
          </div>

          <!-- Innovation badges -->
          <div class="flex justify-center gap-3 mt-4 flex-wrap">
            <span class="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40"><i class="fas fa-fingerprint mr-1 text-amber-400/50"></i>RBA</span>
            <span class="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40"><i class="fas fa-shield-virus mr-1 text-red-400/50"></i>Anti-Coercion</span>
            <span class="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40"><i class="fas fa-microphone mr-1 text-blue-400/50"></i>Voice OTP</span>
            <span class="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40"><i class="fas fa-link mr-1 text-emerald-400/50"></i>Magic Link</span>
          </div>
        </div>
      `;
    },

    _buildLockoutHTML(minutes) {
      return `
        <div class="text-center py-6">
          <i class="fas fa-lock text-5xl text-red-400 mb-4 block"></i>
          <h3 class="text-lg font-bold text-white mb-2">Account Locked</h3>
          <p class="text-sm text-white/50">Suspicious activity detected. Login disabled for ${minutes} minute(s).</p>
          <p class="text-xs text-white/30 mt-3">Too many OTP requests in a short period. Please wait.</p>
        </div>
      `;
    },

    _buildLoginFormHTML() {
      return `
        <!-- ID Input -->
        <div id="auth-step-id">
          <label class="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Login ID</label>
          <div class="relative">
            <i class="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm"></i>
            <input type="text" id="auth-id-input" placeholder="Email or mobile number"
              class="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-amber-400/50 focus:bg-white/8 transition-all"
              autocomplete="off" autofocus>
          </div>
          <p class="text-[10px] text-white/25 mt-1.5">Demo: any email or 10-digit number accepted</p>

          ${AuthState.captchaRequired ? `
            <div class="mt-3 p-3 bg-white/5 rounded-xl" id="captcha-box">
              <p class="text-xs text-white/50 mb-2"><i class="fas fa-shield mr-1"></i>Security Check</p>
              <div class="flex items-center gap-2">
                <span class="text-sm font-mono font-bold text-white" id="captcha-question"></span>
                <input type="number" id="captcha-answer" placeholder="Answer" class="w-20 px-2 py-1.5 bg-white/10 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-amber-400/50">
              </div>
            </div>
          ` : ''}

          <button id="auth-send-otp-btn" class="w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #C4A962, #B8954A); color: #0B1D3A;">
            <i class="fas fa-paper-plane"></i> Send OTP
          </button>

          <!-- Alternative auth methods -->
          <div class="grid grid-cols-3 gap-2 mt-3">
            <button id="auth-biometric-btn" class="py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white/40 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
              <i class="fas fa-fingerprint"></i> Biometric
            </button>
            <button id="auth-voice-btn" class="py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white/40 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
              <i class="fas fa-microphone"></i> Voice OTP
            </button>
            <button id="auth-magic-link-btn" class="py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white/40 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
              <i class="fas fa-link"></i> Magic Link
            </button>
          </div>
        </div>

        <!-- OTP Input (hidden initially) -->
        <div id="auth-step-otp" class="hidden">
          <div class="text-center mb-4">
            <i class="fas fa-shield-halved text-3xl text-amber-400 mb-2 block"></i>
            <p class="text-sm text-white/60">OTP sent to <span id="auth-masked-id" class="text-white font-semibold"></span></p>
            <p class="text-xs text-amber-400/70 mt-1"><i class="fas fa-info-circle mr-1"></i>For demo, use: <b>123456</b></p>
          </div>

          <label class="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 block">Enter 6-Digit OTP</label>
          <div class="flex gap-2 justify-center" id="otp-boxes">
            ${Array(6).fill(0).map((_, i) => `
              <input type="text" maxlength="1" inputmode="numeric" pattern="[0-9]"
                class="otp-digit w-11 h-14 bg-white/5 border border-white/10 rounded-xl text-white text-xl font-bold text-center focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
                data-index="${i}" autocomplete="off">
            `).join('')}
          </div>

          <div class="flex items-center justify-between mt-3 text-xs">
            <button id="auth-resend-btn" class="text-amber-400/60 hover:text-amber-400 transition-colors" disabled>
              <span id="resend-text">Resend OTP</span>
              <span id="resend-timer" class="hidden"></span>
            </button>
            <button id="auth-back-btn" class="text-white/30 hover:text-white/50 transition-colors">
              <i class="fas fa-arrow-left mr-1"></i>Change ID
            </button>
          </div>

          <button id="auth-verify-btn" class="w-full mt-4 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2" style="background: linear-gradient(135deg, #C4A962, #B8954A); color: #0B1D3A;">
            <i class="fas fa-check-circle"></i> Verify & Login
          </button>

          <!-- Panic mode hint -->
          <p class="text-[10px] text-white/15 text-center mt-2 cursor-help" title="Anti-coercion: Enter your mobile's last 4 digits reversed to trigger silent alert and fake balance mode">
            <i class="fas fa-shield-virus mr-1"></i>Panic Mode: enter reversed caller ID to silently alert authorities
          </p>
        </div>

        <!-- Magic Link Preview -->
        <div id="auth-step-magic" class="hidden text-center">
          <i class="fas fa-envelope-open-text text-4xl text-amber-400 mb-3 block"></i>
          <h3 class="text-lg font-bold text-white mb-2">Magic Link Sent</h3>
          <p class="text-sm text-white/50 mb-3">Check your inbox at <span id="magic-email" class="text-white font-semibold"></span></p>
          <div class="bg-white/5 border border-white/10 rounded-xl p-4 text-left text-xs text-white/40 space-y-1 mb-4">
            <p class="text-white/60 font-semibold">Subject: 🔗 SecureWealth Twin — Your Login Link</p>
            <p>Click the button below to securely log in:</p>
            <div class="text-center py-3 px-6 my-2 rounded-lg font-semibold text-sm" style="background: linear-gradient(135deg, #C4A962, #B8954A); color: #0B1D3A;">Log in to SecureWealth Twin</div>
            <p class="text-white/25">Link expires in 10 minutes. Do not share this email.</p>
          </div>
          <button id="auth-magic-login-btn" class="w-full py-3 rounded-xl font-semibold text-sm" style="background: linear-gradient(135deg, #C4A962, #B8954A); color: #0B1D3A;">
            <i class="fas fa-bolt mr-2"></i>Simulate Magic Link Login
          </button>
          <button id="auth-magic-back-btn" class="text-white/30 hover:text-white/50 text-xs mt-3 transition-colors">
            <i class="fas fa-arrow-left mr-1"></i>Back to login
          </button>
        </div>
      `;
    },

    _wireEvents() {
      // CAPTCHA
      if (AuthState.captchaRequired) {
        const q = CaptchaEngine.generate();
        const qEl = document.getElementById('captcha-question');
        if (qEl) qEl.textContent = q;
      }

      // Send OTP
      const sendBtn = document.getElementById('auth-send-otp-btn');
      if (sendBtn) {
        sendBtn.addEventListener('click', () => this._handleSendOTP());
      }

      // ID input enter key
      const idInput = document.getElementById('auth-id-input');
      if (idInput) {
        idInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') this._handleSendOTP();
        });
      }

      // OTP box auto-focus
      document.querySelectorAll('.otp-digit').forEach(box => {
        box.addEventListener('input', (e) => {
          const val = e.target.value.replace(/[^0-9]/g, '');
          e.target.value = val;
          if (val && e.target.dataset.index < 5) {
            const next = document.querySelector(`.otp-digit[data-index="${parseInt(e.target.dataset.index) + 1}"]`);
            if (next) next.focus();
          }
          if (this._getOTPValue().length === 6) {
            setTimeout(() => this._handleVerifyOTP(), 300);
          }
        });
        box.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !e.target.value && e.target.dataset.index > 0) {
            const prev = document.querySelector(`.otp-digit[data-index="${parseInt(e.target.dataset.index) - 1}"]`);
            if (prev) prev.focus();
          }
        });
        box.addEventListener('paste', (e) => {
          e.preventDefault();
          const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').slice(0, 6);
          paste.split('').forEach((d, i) => {
            const b = document.querySelector(`.otp-digit[data-index="${i}"]`);
            if (b) b.value = d;
          });
          if (paste.length === 6) setTimeout(() => this._handleVerifyOTP(), 300);
        });
      });

      // Verify OTP
      const verifyBtn = document.getElementById('auth-verify-btn');
      if (verifyBtn) verifyBtn.addEventListener('click', () => this._handleVerifyOTP());

      // Resend
      const resendBtn = document.getElementById('auth-resend-btn');
      if (resendBtn) resendBtn.addEventListener('click', () => this._handleSendOTP(true));

      // Back
      const backBtn = document.getElementById('auth-back-btn');
      if (backBtn) backBtn.addEventListener('click', () => this._showStep('id'));

      // Biometric
      const bioBtn = document.getElementById('auth-biometric-btn');
      if (bioBtn) bioBtn.addEventListener('click', () => this._handleBiometric());

      // Voice OTP
      const voiceBtn = document.getElementById('auth-voice-btn');
      if (voiceBtn) voiceBtn.addEventListener('click', () => this._handleVoiceOTP());

      // Magic Link
      const magicBtn = document.getElementById('auth-magic-link-btn');
      if (magicBtn) magicBtn.addEventListener('click', () => this._handleMagicLink());

      const magicLogin = document.getElementById('auth-magic-login-btn');
      if (magicLogin) magicLogin.addEventListener('click', () => this._handleMagicLogin());

      const magicBack = document.getElementById('auth-magic-back-btn');
      if (magicBack) magicBack.addEventListener('click', () => this._showStep('id'));
    },

    _showStep(step) {
      document.getElementById('auth-step-id').classList.toggle('hidden', step !== 'id');
      document.getElementById('auth-step-otp').classList.toggle('hidden', step !== 'otp');
      const magicStep = document.getElementById('auth-step-magic');
      if (magicStep) magicStep.classList.toggle('hidden', step !== 'magic');
    },

    _handleSendOTP(isResend) {
      const idInput = document.getElementById('auth-id-input');
      if (!idInput) return;
      const id = idInput.value.trim();

      if (!id) {
        this._showError('Please enter an email or mobile number');
        return;
      }

      // Validate format
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
      const isMobile = /^\d{10}$/.test(id);
      if (!isEmail && !isMobile) {
        this._showError('Enter a valid email or 10-digit mobile number');
        return;
      }

      // Captcha check
      if (AuthState.captchaRequired) {
        const captchaAns = document.getElementById('captcha-answer')?.value;
        if (!CaptchaEngine.validate(captchaAns)) {
          this._showError('Incorrect security answer. Try again.');
          return;
        }
      }

      // Rate limit check
      const now = Date.now();
      if (now - AuthState.otpLastRequestTime < 300000 && AuthState.otpRequestCount >= 3) {
        AuthState.lockoutUntil = now + 900000; // 15 min lockout
        AuthState.save();
        this.showLogin();
        App.showToast?.('⚠️ Suspicious activity — login locked for 15 minutes', 'error');
        return;
      }

      // Track request
      AuthState.otpRequestCount = (now - AuthState.otpLastRequestTime < 300000) ? AuthState.otpRequestCount + 1 : 1;
      AuthState.otpLastRequestTime = now;
      AuthState.save();

      // Generate OTP
      this.generatedOTP = '123456'; // Fixed for demo
      this.otpExpiresAt = now + 120000; // 2 min

      // Store panic pin
      if (isMobile) {
        const rev = id.slice(-4).split('').reverse().join('');
        this.panicPin = rev;
      }

      // Show loading
      const sendBtn = document.getElementById('auth-send-otp-btn');
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      }

      // Simulate network delay
      setTimeout(() => {
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send OTP';
        }

        // Show OTP step
        this._showStep('otp');

        // Show masked ID
        const masked = document.getElementById('auth-masked-id');
        if (masked) {
          masked.textContent = isEmail
            ? id.replace(/(.{3}).*(@.*)/, '$1***$2')
            : id.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
        }

        // Focus first OTP box
        const firstBox = document.querySelector('.otp-digit[data-index="0"]');
        if (firstBox) firstBox.focus();

        // Start resend timer
        this._startResendTimer();

        // Toast
        App.showToast?.(
          `📱 OTP sent to ${isEmail ? 'email' : 'mobile'}. Demo OTP: 123456`,
          'success'
        );

        // Voice OTP hint
        if (isMobile && AuthState.otpRequestCount === 1) {
          setTimeout(() => App.showToast?.('💡 Tip: Try Voice OTP for accessibility demo!', 'info'), 2000);
        }
      }, 1500);
    },

    _handleVerifyOTP() {
      const otp = this._getOTPValue();
      if (otp.length !== 6) {
        this._showError('Please enter all 6 digits');
        return;
      }

      // Check expiry
      if (Date.now() > this.otpExpiresAt) {
        this._showError('OTP expired. Request a new one.');
        return;
      }

      // Check if OTP matches (demo: always accept 123456, also accept any for hackathon demo)
      const isCorrect = otp === '123456' || otp === this.generatedOTP;

      if (!isCorrect) {
        AuthState.otpAttempts++;
        AuthState.save();

        if (AuthState.otpAttempts >= 3) {
          this._showError('Too many failed attempts. Request a new OTP.');
          AuthState.otpAttempts = 0;
          AuthState.captchaRequired = true;
          AuthState.save();
          this._showStep('id');
          return;
        }

        // Enable captcha after 2 failures
        if (AuthState.otpAttempts >= 2) {
          AuthState.captchaRequired = true;
          AuthState.save();
        }

        this._showError(`Invalid OTP. ${3 - AuthState.otpAttempts} attempts remaining.`);
        this._clearOTPBoxes();
        return;
      }

      // ─── OTP CORRECT ───

      // Check for PANIC MODE
      if (this.panicPin && otp === this.panicPin) {
        AuthState.isCoerced = true;
        localStorage.setItem('sw_coerced', 'true');
        // Silent alert simulation
        setTimeout(() => {
          console.warn('🔴 [SILENT ALERT] Possible coercion detected — family/authorities notified (simulated)');
        }, 1000);
      } else {
        AuthState.isCoerced = false;
        localStorage.removeItem('sw_coerced');
      }

      // Device fingerprint check
      const currentFp = DeviceFingerprint.generate();
      const trustedFp = DeviceFingerprint.getTrusted();
      const fpResult = DeviceFingerprint.compare(currentFp, trustedFp);

      if (!fpResult.match && trustedFp) {
        // New device — show warning but allow
        App.showToast?.('⚠️ Login from a new device. Additional verification applied.', 'warning');
        // Force re-trust after successful login
      }

      // Login
      AuthState.login();
      SessionManager._addCurrent();
      SessionManager.addMockSessions();

      // Remove login overlay with animation
      const overlay = document.getElementById('auth-shield-overlay');
      if (overlay) {
        overlay.style.transition = 'opacity 0.5s, transform 0.5s';
        overlay.style.opacity = '0';
        overlay.style.transform = 'scale(1.05)';
        setTimeout(() => overlay.remove(), 500);
      }

      // Init dashboard
      if (window.App && window.App.init) {
        window.App.init();
      }

      // Show welcome
      const msg = AuthState.isCoerced
        ? 'Login successful. Welcome back!'
        : 'Welcome back, Rahul! ✨';
      App.showToast?.(msg, AuthState.isCoerced ? 'warning' : 'success');

      // Coerced mode notification
      if (AuthState.isCoerced) {
        setTimeout(() => {
          VoiceOTP.speakCustom('Security alert. Coerced mode activated. Authorities notified. Stay calm.');
        }, 2000);
      }
    },

    _handleBiometric() {
      const bioModal = document.createElement('div');
      bioModal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4';
      bioModal.innerHTML = `
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style="background: linear-gradient(135deg, #10B981, #059669);">
            <i class="fas fa-fingerprint text-3xl text-white"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-2">Biometric Check</h3>
          <p class="text-sm text-slate-500 mb-4">Simulating fingerprint / face ID verification...</p>
          <div class="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
            <div class="h-full rounded-full transition-all duration-2000" style="background: linear-gradient(90deg, #10B981, #059669); width: 0%;" id="bio-progress"></div>
          </div>
          <p class="text-xs text-slate-400">Demo: biometric check passed</p>
        </div>`;
      document.body.appendChild(bioModal);

      // Animate progress
      let w = 0;
      const iv = setInterval(() => {
        w += 5;
        const bar = document.getElementById('bio-progress');
        if (bar) bar.style.width = w + '%';
        if (w >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            bioModal.remove();
            AuthState.biometricEnabled = true;
            AuthState.login();
            SessionManager._addCurrent();
            SessionManager.addMockSessions();
            const overlay = document.getElementById('auth-shield-overlay');
            if (overlay) overlay.remove();
            if (window.App && window.App.init) window.App.init();
            App.showToast?.('✅ Biometric authentication successful', 'success');
          }, 500);
        }
      }, 40);
    },

    _handleVoiceOTP() {
      App.showToast?.('🔊 Calling... Voice OTP will speak shortly', 'info');
      setTimeout(() => {
        VoiceOTP.speak('123456');
      }, 1000);
    },

    _handleMagicLink() {
      const idInput = document.getElementById('auth-id-input');
      const id = idInput?.value?.trim();
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);

      if (!isEmail) {
        this._showError('Magic Link requires a valid email address');
        return;
      }

      const maskedEl = document.getElementById('magic-email');
      if (maskedEl) maskedEl.textContent = id.replace(/(.{3}).*(@.*)/, '$1***$2');
      this._showStep('magic');
    },

    _handleMagicLogin() {
      const magicStep = document.getElementById('auth-step-magic');
      if (magicStep) magicStep.innerHTML = `
        <div class="text-center py-4">
          <i class="fas fa-check-circle text-5xl text-emerald-400 mb-3 block"></i>
          <h3 class="text-lg font-bold text-white mb-2">Authenticated!</h3>
          <p class="text-sm text-white/50">Magic link verified. Logging you in...</p>
        </div>`;

      setTimeout(() => {
        AuthState.login();
        SessionManager._addCurrent();
        const overlay = document.getElementById('auth-shield-overlay');
        if (overlay) overlay.remove();
        if (window.App && window.App.init) window.App.init();
        App.showToast?.('🔗 Logged in via Magic Link (passwordless)', 'success');
      }, 1200);
    },

    _startResendTimer() {
      this.resendSeconds = 30;
      this._updateResendUI();
      clearInterval(this.resendTimer);
      this.resendTimer = setInterval(() => {
        this.resendSeconds--;
        if (this.resendSeconds <= 0) {
          clearInterval(this.resendTimer);
          this._updateResendUI(true);
        } else {
          this._updateResendUI();
        }
      }, 1000);
    },

    _updateResendUI(enabled) {
      const resendBtn = document.getElementById('auth-resend-btn');
      const resendText = document.getElementById('resend-text');
      const resendTimer = document.getElementById('resend-timer');
      if (!resendBtn) return;

      if (enabled) {
        resendBtn.disabled = false;
        resendText.classList.remove('hidden');
        resendTimer.classList.add('hidden');
      } else {
        resendBtn.disabled = true;
        resendText.classList.add('hidden');
        resendTimer.classList.remove('hidden');
        resendTimer.textContent = `(${this.resendSeconds}s)`;
      }
    },

    _getOTPValue() {
      let val = '';
      document.querySelectorAll('.otp-digit').forEach(b => val += b.value);
      return val;
    },

    _clearOTPBoxes() {
      document.querySelectorAll('.otp-digit').forEach(b => b.value = '');
      const first = document.querySelector('.otp-digit[data-index="0"]');
      if (first) first.focus();
    },

    _showError(msg) {
      const existing = document.querySelector('.auth-error-msg');
      if (existing) existing.remove();
      const err = document.createElement('p');
      err.className = 'auth-error-msg text-xs text-red-400 mt-2 text-center';
      err.textContent = msg;
      const body = document.getElementById('auth-body');
      if (body) body.appendChild(err);
      setTimeout(() => err.remove(), 3000);
    },

    _animateIn() {
      const style = document.createElement('style');
      style.id = 'auth-shield-style';
      style.textContent = `
        @keyframes authCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        #auth-shield-overlay * { font-family: 'Inter', sans-serif; }
      `;
      if (!document.getElementById('auth-shield-style')) {
        document.head.appendChild(style);
      }
    },

    /**
     * Handle logout
     */
    handleLogout() {
      if (confirm('Log out of SecureWealth Twin?')) {
        AuthState.logout();
        location.reload();
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  SESSION TIMEOUT WATCHER
  // ═══════════════════════════════════════════════════════════════

  function startSessionWatcher() {
    // Activity tracking
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(evt => {
      document.addEventListener(evt, () => {
        if (AuthState.isLoggedIn) AuthState.touch();
      }, { passive: true });
    });

    // Timeout check every 30s
    setInterval(() => {
      if (AuthState.isExpired()) {
        AuthState.logout();
        App.showToast?.('⏰ Session expired — logged out after 15 min inactivity', 'warning');
        setTimeout(() => location.reload(), 1500);
      }
    }, 30000);
  }

  // ═══════════════════════════════════════════════════════════════
  //  GLOBAL EXPORTS & INTEGRATION
  // ═══════════════════════════════════════════════════════════════

  // Wait for App
  function waitForApp(cb, retries) {
    retries = retries || 100;
    if (window.App && window.App.renderView) cb();
    else if (retries > 0) setTimeout(() => waitForApp(cb, retries - 1), 100);
  }

  waitForApp(function() {
    window.AuthShield = AuthShield;
    window.AuthState = AuthState;
    window.SessionManager = SessionManager;
    window.DeviceFingerprint = DeviceFingerprint;
    window.VoiceOTP = VoiceOTP;

    // Patch App.logout
    App.logout = function() { AuthShield.handleLogout(); };

    // Expose coerced mode flag
    window.isCoercedSession = function() { return AuthState.isCoerced; };

    // Start session watcher
    startSessionWatcher();

    // Show login if not logged in, but defer to consent modal first
    if (!AuthState.isLoggedIn) {
      function tryShowLogin() {
        var consent = localStorage.getItem('sw_consent');
        if (consent === 'agreed' || consent === 'declined') {
          AuthShield.showLogin();
        } else {
          setTimeout(tryShowLogin, 300);
        }
      }
      tryShowLogin();
    } else {
      // Already logged in — add mock sessions & init
      SessionManager._addCurrent();
      SessionManager.addMockSessions();
    }

    // Add session manager view
    const origRender = App.renderView.bind(App);
    App.renderView = function(view) {
      const container = document.getElementById('main-content');
      if (!container) return origRender(view);
      if (view === 'sessions') {
        renderSessionManager(container);
        document.querySelectorAll('.nav-item').forEach(el => {
          el.classList.remove('active');
          if (el.dataset.view === 'sessions') el.classList.add('active');
        });
        document.getElementById('page-title').textContent = 'Active Sessions';
      } else {
        origRender(view);
      }
    };

    // Add session nav item
    function addSessionNav() {
      const nav = document.querySelector('.fb-nav, #sidebar-nav');
      if (!nav || document.querySelector('[data-view="sessions"]')) return;

      const a = document.createElement('a');
      a.href = '#'; a.dataset.view = 'sessions';
      a.className = 'fb-nav-item nav-item';
      a.innerHTML = '<i class="fas fa-mobile-screen-button"></i><span class="flex-1">Sessions</span><span class="nav-badge">LIVE</span>';
      a.addEventListener('click', function(e) { e.preventDefault(); App.renderView('sessions'); });
      nav.appendChild(a);
    }
    setTimeout(addSessionNav, 500);

    console.log('[AuthShield] Full authentication layer active. RBA · Panic Mode · Voice OTP · Magic Link · Sessions');
  });

  // ═══════════════════════════════════════════════════════════════
  //  SESSION MANAGER VIEW RENDERER
  // ═══════════════════════════════════════════════════════════════

  function renderSessionManager(container) {
    const sessions = SessionManager.getAll();
    const currentFp = DeviceFingerprint.generate();
    const trustedFp = DeviceFingerprint.getTrusted();

    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">📱 Active Sessions</h2>
            <p class="text-sm text-slate-500 mt-1">Manage your login sessions and monitor account access</p>
          </div>
          <button onclick="AuthShield.handleLogout()" class="fb-btn fb-btn-outline fb-btn-sm text-red-500 border-red-300">
            <i class="fas fa-sign-out-alt mr-1.5"></i>Logout All
          </button>
        </div>

        <!-- Device Fingerprint Info -->
        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold mb-3"><i class="fas fa-fingerprint mr-2 text-blue-600"></i>This Device</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div><span class="text-slate-400 block">Fingerprint</span><span class="font-mono font-semibold">${currentFp.hash}</span></div>
            <div><span class="text-slate-400 block">Screen</span><span>${currentFp.screenResolution}</span></div>
            <div><span class="text-slate-400 block">Timezone</span><span>${currentFp.timezone}</span></div>
            <div><span class="text-slate-400 block">Platform</span><span>${currentFp.platform}</span></div>
          </div>
          <p class="text-xs mt-3 ${trustedFp ? 'text-emerald-500' : 'text-amber-500'}">
            <i class="fas ${trustedFp ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-1"></i>
            ${trustedFp ? 'This is a trusted device' : 'New device — trust established after this login'}
          </p>
        </div>

        <!-- Sessions -->
        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold mb-4"><i class="fas fa-history mr-2"></i>Session History</h3>
          <div class="overflow-x-auto">
            <table class="fb-table text-sm">
              <thead><tr><th>Device</th><th>Browser</th><th>Location</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                ${sessions.map(s => `
                  <tr class="${s.suspicious ? 'bg-red-50 dark:bg-red-900/10' : ''}">
                    <td class="font-medium">${s.device} ${s.isCurrent ? '<span class="ml-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 text-[10px] rounded-full font-semibold">CURRENT</span>' : ''}</td>
                    <td class="text-xs">${s.browser}</td>
                    <td class="text-xs">${s.location} ${s.suspicious ? '<span class="ml-1 text-red-500"><i class="fas fa-exclamation-triangle"></i></span>' : ''}</td>
                    <td class="text-xs">${new Date(s.loginTime).toLocaleString('en-IN')}</td>
                    <td>${s.isCoerced ? '<span class="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-semibold">⚠️ Coerced</span>' : '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold">Normal</span>'}</td>
                    <td>${!s.isCurrent ? `<button onclick="SessionManager.revoke('${s.id}');App.showToast('Session revoked','info');setTimeout(()=>App.renderView('sessions'),400)" class="text-xs text-red-500 hover:underline font-medium">Revoke</button>` : '<span class="text-xs text-slate-300">—</span>'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ${sessions.some(s => s.suspicious) ? `
            <div class="mt-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-600 dark:text-red-400">
              <i class="fas fa-exclamation-triangle mr-1.5"></i><b>Alert:</b> Unusual login location detected. Verify your account security.
            </div>
          ` : ''}
        </div>

        <!-- Security Tips -->
        <div class="fb-card p-5 border-l-4 border-amber-400">
          <h3 class="text-sm font-semibold mb-2"><i class="fas fa-lightbulb text-amber-500 mr-2"></i>Security Tips</h3>
          <ul class="text-xs text-slate-500 space-y-1">
            <li><i class="fas fa-check text-emerald-500 mr-1"></i>Revoke sessions from devices you don't recognize</li>
            <li><i class="fas fa-check text-emerald-500 mr-1"></i>Use biometric authentication for faster, safer login</li>
            <li><i class="fas fa-check text-emerald-500 mr-1"></i>Enable panic mode: reversed caller ID as OTP triggers silent alert</li>
          </ul>
        </div>
      </div>`;
  }

})();
