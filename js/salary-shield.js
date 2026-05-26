/**
 * ═══════════════════════════════════════════════════════════════
 *  SALARY FORTRESS — Intelligent Salary Protection System
 * ═══════════════════════════════════════════════════════════════
 *
 *  INNOVATION: When salary is credited, Salary Fortress automatically
 *  creates a protective "fortress" around it. It detects salary day,
 *  auto-allocates using the 50/30/20 rule, and enforces cooling-off
 *  periods for large withdrawals on payday (a peak fraud window).
 *
 *  Unique features:
 *  - Salary Day Detection: Recognizes salary credits automatically
 *  - Auto-Fortress: Locks X% of salary in virtual vault on credit
 *  - Payday Fraud Shield: Heightened scrutiny for 48h after salary
 *  - Smart Allocation: Auto-suggests 50/30/20 split
 *  - Employer Verification: Cross-checks salary amount consistency
 */

const SalaryFortress = {
  config: {
    salaryDay: 1,                 // Expected salary day (1-31)
    expectedAmount: 125000,       // Expected monthly salary
    autoLockPercent: 25,          // Auto-lock 25% in fortress vault
    fortressCoolingHours: 24,     // Hours before locked funds can be accessed
    paydayRiskWindowHours: 48,    // Heightened scrutiny window after salary
    maxPaydayWithdrawal: 25000,   // Max single withdrawal during risk window
    allocation: {
      essentials: 50,  // Rent, bills, groceries
      discretionary: 30, // Entertainment, shopping
      savings: 20       // Investments, emergency fund
    }
  },

  state: {
    lastSalaryDate: null,
    lastSalaryAmount: 0,
    fortressBalance: 0,
    fortressLockedUntil: null,
    isPaydayRiskWindow: false,
    salaryHistory: [],
    allocationTracker: {
      essentials: 0,
      discretionary: 0,
      savings: 0
    }
  },

  /**
   * Initialize Salary Fortress
   */
  init() {
    this.loadState();
    this.checkPaydayWindow();
    this.detectSalaryDay();
  },

  /**
   * Detect the user's likely salary day from history
   */
  detectSalaryDay() {
    if (this.state.salaryHistory.length >= 2) {
      const days = this.state.salaryHistory.map(s => new Date(s.date).getDate());
      const mode = this._mode(days);
      if (mode) this.config.salaryDay = mode;

      const amounts = this.state.salaryHistory.map(s => s.amount);
      this.config.expectedAmount = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
    }
  },

  /**
   * Check if we're currently in a payday risk window
   */
  checkPaydayWindow() {
    if (!this.state.lastSalaryDate) {
      this.state.isPaydayRiskWindow = false;
      return;
    }
    const salaryTime = new Date(this.state.lastSalaryDate).getTime();
    const now = Date.now();
    const hoursSinceSalary = (now - salaryTime) / (1000 * 60 * 60);
    this.state.isPaydayRiskWindow = hoursSinceSalary <= this.config.paydayRiskWindowHours;
  },

  /**
   * Simulate a salary credit
   */
  simulateSalaryCredit(amount, date) {
    amount = amount || this.config.expectedAmount;
    date = date || new Date().toISOString();

    const salaryDate = new Date(date);

    // Record salary
    this.state.lastSalaryDate = date;
    this.state.lastSalaryAmount = amount;
    this.state.salaryHistory.push({ date, amount, dayOfWeek: salaryDate.toLocaleDateString('en-US', { weekday: 'long' }) });
    if (this.state.salaryHistory.length > 24) this.state.salaryHistory.shift();

    // Auto-fortress: lock a portion
    const lockAmount = Math.round(amount * (this.config.autoLockPercent / 100));
    this.state.fortressBalance += lockAmount;
    this.state.fortressLockedUntil = new Date(Date.now() + this.config.fortressCoolingHours * 3600 * 1000).toISOString();

    // Activate payday risk window
    this.state.isPaydayRiskWindow = true;

    // Auto-allocation suggestion
    const allocation = {
      essentials: Math.round(amount * (this.config.allocation.essentials / 100)),
      discretionary: Math.round(amount * (this.config.allocation.discretionary / 100)),
      savings: Math.round(amount * (this.config.allocation.savings / 100))
    };

    // Detect if salary amount is anomalous
    const amountCheck = this._checkAmountConsistency(amount);

    this.saveState();

    return {
      salaryCredited: true,
      amount,
      date: salaryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      fortressLocked: lockAmount,
      fortressUnlockDate: new Date(Date.now() + this.config.fortressCoolingHours * 3600 * 1000).toLocaleString(),
      suggestedAllocation: allocation,
      paydayRiskActive: true,
      amountConsistency: amountCheck,
      message: amountCheck.anomalous
        ? `⚠️ Salary amount differs from your average (${amountCheck.variancePercent}% variance). Please verify.`
        : `✅ Salary credited. ₹${lockAmount.toLocaleString()} auto-locked in Fortress for ${this.config.fortressCoolingHours}h.`
    };
  },

  /**
   * Check a proposed withdrawal during payday risk window
   */
  checkWithdrawal(amount, type) {
    const checks = [];

    // Check 1: Is payday risk window active?
    const inRiskWindow = this.state.isPaydayRiskWindow;
    checks.push({
      check: 'payday_window',
      label: 'Payday Risk Window',
      status: inRiskWindow ? 'warning' : 'pass',
      message: inRiskWindow
        ? 'Heightened scrutiny active — salary was credited recently'
        : 'Normal risk levels'
    });

    // Check 2: Amount exceeds payday max?
    if (inRiskWindow && amount > this.config.maxPaydayWithdrawal) {
      checks.push({
        check: 'payday_limit',
        label: 'Payday Withdrawal Limit',
        status: 'fail',
        message: `Withdrawal of ₹${amount.toLocaleString()} exceeds payday limit of ₹${this.config.maxPaydayWithdrawal.toLocaleString()}`
      });
    }

    // Check 3: Would this deplete the fortress?
    if (this.state.fortressBalance > 0) {
      const remainingAfterWithdrawal = this.state.lastSalaryAmount - this._getTotalWithdrawalsSinceSalary() - amount;
      const fortressDip = remainingAfterWithdrawal < this.state.fortressBalance;
      checks.push({
        check: 'fortress_integrity',
        label: 'Fortress Integrity',
        status: fortressDip ? 'warning' : 'pass',
        message: fortressDip
          ? 'This withdrawal would dip into your protected fortress funds'
          : 'Fortress funds remain protected'
      });
    }

    // Check 4: Category-based risk
    const highRiskCategories = ['gambling', 'crypto', 'forex', 'unregistered_app'];
    if (highRiskCategories.includes(type)) {
      checks.push({
        check: 'category_risk',
        label: 'Transaction Category',
        status: 'fail',
        message: `High-risk category detected: ${type}. Blocked during payday window.`
      });
    }

    const failChecks = checks.filter(c => c.status === 'fail');
    const warnChecks = checks.filter(c => c.status === 'warning');

    return {
      allowed: failChecks.length === 0,
      requiresCooling: warnChecks.length >= 2,
      checks,
      recommendation: failChecks.length > 0
        ? 'Transaction blocked. Try again after the payday risk window ends.'
        : warnChecks.length > 0
          ? 'Transaction flagged for review. A 30-minute cooling-off applies.'
          : 'Transaction approved.',
      fortressBalance: this.state.fortressBalance,
      riskWindowRemaining: inRiskWindow ? this._getRiskWindowRemaining() : null
    };
  },

  /**
   * Get comprehensive salary shield status
   */
  getStatus() {
    this.checkPaydayWindow();
    return {
      isPaydayWindow: this.state.isPaydayRiskWindow,
      lastSalaryDate: this.state.lastSalaryDate
        ? new Date(this.state.lastSalaryDate).toLocaleDateString('en-IN')
        : null,
      lastSalaryAmount: this.state.lastSalaryAmount,
      expectedSalary: this.config.expectedAmount,
      salaryDay: this.config.salaryDay,
      fortressBalance: this.state.fortressBalance,
      fortressLockedUntil: this.state.fortressLockedUntil,
      isFortressLocked: this.state.fortressLockedUntil
        ? new Date(this.state.fortressLockedUntil) > new Date()
        : false,
      allocation: this.config.allocation,
      autoLockPercent: this.config.autoLockPercent,
      salaryHistory: this.state.salaryHistory.slice(-6),
      riskWindowRemaining: this.state.isPaydayRiskWindow
        ? this._getRiskWindowRemaining()
        : null
    };
  },

  /**
   * Release fortress funds (after cooling period)
   */
  releaseFortress(amount) {
    if (!amount || amount <= 0) amount = this.state.fortressBalance;
    if (this.state.fortressLockedUntil && new Date(this.state.fortressLockedUntil) > new Date()) {
      return {
        success: false,
        message: `Fortress funds locked until ${new Date(this.state.fortressLockedUntil).toLocaleString()}`,
        remaining: this.state.fortressBalance
      };
    }
    const released = Math.min(amount, this.state.fortressBalance);
    this.state.fortressBalance -= released;
    this.saveState();
    return {
      success: true,
      released,
      remaining: this.state.fortressBalance,
      message: `₹${released.toLocaleString()} released from Fortress. ₹${this.state.fortressBalance.toLocaleString()} remaining.`
    };
  },

  // ─── Private helpers ──────────────────────────────────────

  _checkAmountConsistency(amount) {
    if (this.state.salaryHistory.length < 2) {
      return { anomalous: false, variancePercent: 0, message: 'Not enough history for comparison' };
    }
    const recent = this.state.salaryHistory.slice(-3);
    const avg = recent.reduce((s, r) => s + r.amount, 0) / recent.length;
    const variance = Math.abs(amount - avg) / avg * 100;
    return {
      anomalous: variance > 20,
      variancePercent: Math.round(variance),
      expectedAmount: Math.round(avg),
      message: variance > 20
        ? `Salary varies ${Math.round(variance)}% from your 3-month average`
        : 'Salary amount is consistent with history'
    };
  },

  _getTotalWithdrawalsSinceSalary() {
    // Simplified: in production, this would sum actual transactions
    return 0;
  },

  _getRiskWindowRemaining() {
    if (!this.state.lastSalaryDate) return null;
    const salaryTime = new Date(this.state.lastSalaryDate).getTime();
    const elapsed = Date.now() - salaryTime;
    const windowMs = this.config.paydayRiskWindowHours * 3600 * 1000;
    const remaining = Math.max(0, windowMs - elapsed);
    const hours = Math.floor(remaining / 3600000);
    const mins = Math.floor((remaining % 3600000) / 60000);
    return { hours, minutes: mins, totalMs: remaining, expired: remaining <= 0 };
  },

  _mode(arr) {
    const freq = {};
    let maxFreq = 0, mode = null;
    for (const v of arr) {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) { maxFreq = freq[v]; mode = v; }
    }
    return mode;
  },

  saveState() {
    try { localStorage.setItem('sw_fortress_state', JSON.stringify(this.state)); } catch (e) {}
  },

  loadState() {
    try {
      const data = localStorage.getItem('sw_fortress_state');
      if (data) this.state = { ...this.state, ...JSON.parse(data) };
    } catch (e) {}
  }
};

SalaryFortress.init();
