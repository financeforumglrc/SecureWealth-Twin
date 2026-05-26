/**
 * ═══════════════════════════════════════════════════════════════
 *  WEALTH GUARDIAN ID — Secure Login + Behavioral OTP Auth
 * ═══════════════════════════════════════════════════════════════
 *
 *  INNOVATION: A multi-layered authentication system that combines
 *  traditional username/password with BioOTP (behavioral typing analysis)
 *  and device fingerprinting. Every login is risk-scored.
 *
 *  Unique features:
 *  - ID + Password + Behavioral OTP (3-factor)
 *  - Device Fingerprinting (browser, OS, screen, timezone)
 *  - Login History with location tracking
 *  - Anomaly Detection (new device, new location, odd hour)
 *  - Auto-lockout after failed attempts
 *  - Simulated credit card payment OTP with typing analysis
 */

const WealthGuardianID = {
  // User credentials (simulated — in production, server-side hashed)
  credentials: {
    username: 'rahul.sharma',
    passwordHash: 'sw_demo_2026', // simulated hash
    userId: 'user_rahul_001',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91-98765-43210'
  },

  // Login state
  session: {
    isLoggedIn: false,
    loginTime: null,
    deviceFingerprint: null,
    failedAttempts: 0,
    lockoutUntil: null,
    requireOTP: true,
    otpVerified: false,
    bioOtpVerified: false
  },

  // Login history
  loginHistory: [],

  // Device fingerprint cache
  knownDevices: [],

  /**
   * Initialize Wealth Guardian ID
   */
  init() {
    this.loadState();
    this.fingerprintDevice();
  },

  /**
   * Generate device fingerprint
   */
  fingerprintDevice() {
    this.session.deviceFingerprint = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cpuCores: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      touchSupport: 'ontouchstart' in window,
      fingerprint: this._generateFingerprintHash()
    };

    // Check if this is a known device
    const known = this.knownDevices.find(d => d.fingerprint === this.session.deviceFingerprint.fingerprint);
    this.session.deviceFingerprint.isKnown = !!known;
    this.session.deviceFingerprint.knownDeviceName = known ? known.name : null;
  },

  /**
   * Attempt login with username and password
   */
  attemptLogin(username, password) {
    // Check lockout
    if (this.session.lockoutUntil && Date.now() < this.session.lockoutUntil) {
      const remaining = Math.ceil((this.session.lockoutUntil - Date.now()) / 60000);
      return {
        success: false,
        step: 'locked',
        message: `Account locked. Try again in ${remaining} minute(s).`,
        remainingMinutes: remaining
      };
    }

    // Verify credentials
    if (username !== this.credentials.username || password !== this.credentials.passwordHash) {
      this.session.failedAttempts++;
      if (this.session.failedAttempts >= 5) {
        this.session.lockoutUntil = Date.now() + 15 * 60000; // 15 min lockout
        this.saveState();
        return {
          success: false,
          step: 'locked',
          message: 'Too many failed attempts. Account locked for 15 minutes.',
          failedAttempts: this.session.failedAttempts
        };
      }
      this.saveState();
      return {
        success: false,
        step: 'credentials',
        message: 'Invalid username or password.',
        failedAttempts: this.session.failedAttempts,
        attemptsRemaining: 5 - this.session.failedAttempts
      };
    }

    // Reset failed attempts on success
    this.session.failedAttempts = 0;

    // Device check
    const deviceCheck = this._checkDeviceRisk();
    const requiresOTP = deviceCheck.isNewDevice || deviceCheck.isUnusualLocation || deviceCheck.isOddHour;

    return {
      success: true,
      step: requiresOTP ? 'otp_required' : 'authenticated',
      message: requiresOTP
        ? 'Credentials verified. Additional verification required for this device.'
        : 'Welcome back, Rahul! ✨',
      deviceCheck,
      requiresOTP,
      failedAttempts: 0
    };
  },

  /**
   * Verify OTP (with optional BioOTP analysis)
   */
  verifyOTP(otpCode, bioOtpData) {
    const correctOTP = '248163'; // Simulated correct OTP

    if (otpCode !== correctOTP) {
      return {
        success: false,
        step: 'otp',
        message: 'Invalid OTP. Please try again.',
        otpValid: false
      };
    }

    // Run BioOTP analysis if typing data available
    let bioOtpResult = null;
    if (bioOtpData) {
      bioOtpResult = BioOTP.analyzeEntry();
      if (bioOtpResult.level === 'high') {
        return {
          success: false,
          step: 'bio_otp',
          message: 'OTP code is correct but typing pattern doesn\'t match. Additional verification needed.',
          otpValid: true,
          bioOtpResult,
          bioOtpPassed: false
        };
      }
    }

    // Complete login
    this.session.isLoggedIn = true;
    this.session.loginTime = new Date().toISOString();
    this.session.otpVerified = true;
    this.session.bioOtpVerified = bioOtpResult ? bioOtpResult.level === 'low' : false;

    // Record login
    this.loginHistory.unshift({
      timestamp: new Date().toISOString(),
      device: this.session.deviceFingerprint,
      location: 'Bangalore, India', // Simulated
      ipAddress: '103.***.***.142',
      method: bioOtpResult ? 'Password + OTP + BioOTP' : 'Password + OTP',
      riskScore: bioOtpResult ? bioOtpResult.score : 15
    });
    if (this.loginHistory.length > 50) this.loginHistory.pop();

    // Remember this device
    if (!this.session.deviceFingerprint.isKnown) {
      this.knownDevices.push({
        name: `Device ${this.knownDevices.length + 1}`,
        fingerprint: this.session.deviceFingerprint.fingerprint,
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        loginCount: 1
      });
    } else {
      const known = this.knownDevices.find(d => d.fingerprint === this.session.deviceFingerprint.fingerprint);
      if (known) {
        known.lastSeen = new Date().toISOString();
        known.loginCount++;
      }
    }

    this.saveState();

    return {
      success: true,
      step: 'authenticated',
      message: 'Authentication complete. Welcome to SecureWealth Twin!',
      otpValid: true,
      bioOtpResult,
      bioOtpPassed: true,
      deviceTrusted: this.session.deviceFingerprint.isKnown
    };
  },

  /**
   * Simulate credit card payment OTP protection
   */
  simulateCardPayment(amount, merchant, cardLast4) {
    const otp = BioOTP.generateOTP();
    const riskScore = RiskEngine.assessRisk(amount, 'card_payment');

    return {
      transactionId: 'txn_' + Date.now(),
      amount,
      merchant,
      cardLast4: '****' + cardLast4,
      otpGenerated: otp,
      otpExpiry: new Date(Date.now() + 120000).toISOString(), // 2 min expiry
      riskAssessment: riskScore,
      requiresBioOTP: amount > 50000, // BioOTP for high-value
      message: amount > 100000
        ? 'High-value transaction. BioOTP typing analysis will be performed.'
        : 'OTP sent to registered mobile. Enter within 2 minutes.',
      warnings: riskScore.level !== 'low'
        ? [`Risk Level: ${riskScore.level.toUpperCase()}`, 'Additional verification may be required']
        : []
    };
  },

  /**
   * Get login security status
   */
  getSecurityStatus() {
    return {
      isLoggedIn: this.session.isLoggedIn,
      loginTime: this.session.loginTime,
      device: this.session.deviceFingerprint,
      knownDevices: this.knownDevices.length,
      recentLogins: this.loginHistory.slice(0, 5),
      failedAttemptsToday: this.session.failedAttempts,
      isLockedOut: !!(this.session.lockoutUntil && Date.now() < this.session.lockoutUntil),
      authMethod: this.session.bioOtpVerified ? '3-Factor (ID + Password + BioOTP)' : '2-Factor (ID + Password + OTP)'
    };
  },

  /**
   * Logout
   */
  logout() {
    this.session.isLoggedIn = false;
    this.session.otpVerified = false;
    this.session.bioOtpVerified = false;
    this.saveState();
    return { success: true, message: 'Logged out successfully.' };
  },

  // ─── Private helpers ──────────────────────────────────────

  _checkDeviceRisk() {
    const fp = this.session.deviceFingerprint;
    const now = new Date();
    const hour = now.getHours();

    // Check if device is known
    const isNewDevice = !fp.isKnown;

    // Check login hour (odd hours = higher risk)
    const isOddHour = hour >= 1 && hour <= 5;

    // Check location consistency (simulated)
    const isUnusualLocation = Math.random() < 0.15; // 15% chance for demo

    return {
      isNewDevice,
      isOddHour,
      isUnusualLocation,
      riskLevel: (isNewDevice || isOddHour || isUnusualLocation) ? 'elevated' : 'normal',
      details: [
        isNewDevice ? 'New device detected' : 'Known device',
        isOddHour ? `Unusual login hour (${hour}:00)` : 'Normal login time',
        isUnusualLocation ? 'Login from new location' : 'Regular location'
      ].filter(Boolean)
    };
  },

  _generateFingerprintHash() {
    const components = [
      navigator.userAgent,
      navigator.platform,
      window.screen.width,
      window.screen.height,
      navigator.hardwareConcurrency,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    ];
    // Simple hash for demo
    let hash = 0;
    const str = components.join('|');
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'fp_' + Math.abs(hash).toString(36);
  },

  saveState() {
    try {
      localStorage.setItem('sw_guardian_state', JSON.stringify({
        session: this.session,
        loginHistory: this.loginHistory.slice(0, 50),
        knownDevices: this.knownDevices
      }));
    } catch (e) {}
  },

  loadState() {
    try {
      const data = localStorage.getItem('sw_guardian_state');
      if (data) {
        const parsed = JSON.parse(data);
        this.session = { ...this.session, ...parsed.session };
        this.loginHistory = parsed.loginHistory || [];
        this.knownDevices = parsed.knownDevices || [];
      }
    } catch (e) {}
  }
};

WealthGuardianID.init();
