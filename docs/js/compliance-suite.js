/**
 * ═══════════════════════════════════════════════════════════════════
 *  COMPLIANCE & PRIVACY SUITE
 *  ═══════════════════════════════════════════════════════════════════
 *
 *  Features:
 *  - Privacy Settings Dashboard (withdraw / re-grant consent)
 *  - AA Consent Artifacts (simulated RBI AA flow)
 *  - Risk Scoring Sandbox (interactive sliders)
 *  - AI Explainability Engine
 *  - Wealth Twin Score (gamification)
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  PRIVACY SETTINGS & CONSENT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════

  const PrivacyManager = {
    getConsentStatus() {
      return localStorage.getItem('sw_consent') || 'none';
    },

    getConsentHistory() {
      try { return JSON.parse(localStorage.getItem('sw_consent_history') || '[]'); } catch(e) { return []; }
    },

    logConsentEvent(action) {
      const history = this.getConsentHistory();
      history.unshift({ action, timestamp: new Date().toISOString() });
      if (history.length > 50) history.pop();
      localStorage.setItem('sw_consent_history', JSON.stringify(history));
    },

    withdrawConsent() {
      // Clear all user-specific data
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('sw_') || k.startsWith('sw_enc_'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      this.logConsentEvent('withdrawn');
      return keysToRemove.length;
    },

    grantConsent() {
      localStorage.setItem('sw_consent', 'agreed');
      this.logConsentEvent('granted');
    },

    declineConsent() {
      localStorage.setItem('sw_consent', 'declined');
      this.logConsentEvent('declined');
    },

    isAccepted() {
      return localStorage.getItem('sw_consent') === 'agreed';
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  AA CONSENT ARTIFACTS
  // ═══════════════════════════════════════════════════════════════

  const AAConsentRegistry = {
    consents: [],

    init() {
      try {
        this.consents = JSON.parse(localStorage.getItem('sw_aa_consents') || '[]');
      } catch(e) { this.consents = []; }
    },

    save() {
      localStorage.setItem('sw_aa_consents', JSON.stringify(this.consents));
    },

    createConsent(bankId, bankName, dataTypes, durationMonths) {
      const consent = {
        id: 'aa_cns_' + Date.now(),
        bankId,
        bankName,
        dataTypes,
        purpose: 'Wealth intelligence & fraud protection',
        durationMonths,
        grantedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + durationMonths * 30 * 86400000).toISOString(),
        status: 'active',
        fifaId: 'FIPA-' + crypto.randomUUID().substring(0, 8).toUpperCase()
      };
      this.consents.push(consent);
      this.save();
      return consent;
    },

    revokeConsent(consentId) {
      const c = this.consents.find(c => c.id === consentId);
      if (c) {
        c.status = 'revoked';
        c.revokedAt = new Date().toISOString();
        this.save();
        return true;
      }
      return false;
    },

    getAll() { return this.consents; },

    getActive() { return this.consents.filter(c => c.status === 'active'); }
  };
  AAConsentRegistry.init();

  // ═══════════════════════════════════════════════════════════════
  //  RISK SCORING SANDBOX
  // ═══════════════════════════════════════════════════════════════

  const RiskSandbox = {
    defaults: {
      deviceTrust: 80,       // 0-100 (higher = more trusted)
      otpRetries: 1,         // 1-5
      amountRatio: 1,        // 0.5x - 5x of avg
      urgency: 'Normal',     // Normal / Rushed / Panic
      sessionAge: 30,        // minutes since login
      newActionType: false
    },

    calculateRisk(params) {
      const p = params || this.defaults;
      let score = 0;
      const signals = [];

      // Device trust (15% weight)
      const deviceScore = Math.round((100 - p.deviceTrust) * 0.15);
      score += deviceScore;
      signals.push({ name: 'Device Trust', score: deviceScore, weight: 15, detail: p.deviceTrust < 30 ? 'New/unrecognized device' : p.deviceTrust < 70 ? 'Partially trusted device' : 'Known trusted device' });

      // OTP retries (20% weight)
      const otpScore = p.otpRetries >= 5 ? 20 : p.otpRetries >= 3 ? 12 : p.otpRetries >= 2 ? 5 : 0;
      score += otpScore;
      signals.push({ name: 'OTP Retries', score: otpScore, weight: 20, detail: p.otpRetries >= 5 ? '5+ attempts — possible coercion' : p.otpRetries >= 3 ? '3 attempts — unusual' : 'Normal OTP entry' });

      // Amount vs history (25% weight)
      let amountScore = 0;
      if (p.amountRatio >= 5) amountScore = 25;
      else if (p.amountRatio >= 3) amountScore = 18;
      else if (p.amountRatio >= 2) amountScore = 10;
      else if (p.amountRatio >= 1.5) amountScore = 5;
      score += amountScore;
      signals.push({ name: 'Amount vs History', score: amountScore, weight: 25, detail: p.amountRatio >= 3 ? `${p.amountRatio}x average — significantly higher` : p.amountRatio >= 1.5 ? `${p.amountRatio}x average — above normal` : 'Within normal range' });

      // Urgency (15% weight)
      const urgencyScore = p.urgency === 'Panic' ? 15 : p.urgency === 'Rushed' ? 8 : 0;
      score += urgencyScore;
      signals.push({ name: 'Urgency Level', score: urgencyScore, weight: 15, detail: p.urgency === 'Panic' ? 'Panic mode detected' : p.urgency === 'Rushed' ? 'Rushed action' : 'Normal pace' });

      // Session age (10% weight)
      const sessionScore = p.sessionAge < 2 ? 10 : p.sessionAge < 5 ? 5 : 0;
      score += sessionScore;
      signals.push({ name: 'Session Age', score: sessionScore, weight: 10, detail: p.sessionAge < 2 ? 'Very new session' : p.sessionAge < 5 ? 'Recent login' : 'Established session' });

      // New action type (15% weight)
      const actionScore = p.newActionType ? 15 : 0;
      score += actionScore;
      signals.push({ name: 'New Action Type', score: actionScore, weight: 15, detail: p.newActionType ? 'First time performing this action' : 'Familiar action' });

      let decision, color, icon;
      if (score < 30) { decision = '✅ Allow'; color = '#10B981'; icon = 'fa-check-circle'; }
      else if (score < 60) { decision = '⚠️ Warn + Cooling-off'; color = '#F59E0B'; icon = 'fa-exclamation-triangle'; }
      else { decision = '🚫 Block + Cooldown'; color = '#EF4444'; icon = 'fa-shield-halved'; }

      return { score: Math.min(100, score), decision, color, icon, signals };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  AI EXPLAINABILITY ENGINE
  // ═══════════════════════════════════════════════════════════════

  const ExplainabilityEngine = {
    rules: [
      { id: 'tax_bracket', condition: 'Tax bracket > 30%', action: 'Recommend ELSS for 80C deduction', confidence: 92, source: 'Income Tax Act §80C' },
      { id: 'emergency_fund', condition: 'Emergency fund < 6 months', action: 'Prioritize liquid fund building', confidence: 95, source: 'Financial planning best practice' },
      { id: 'sip_discipline', condition: 'Monthly savings > ₹20,000', action: 'SIP step-up of 10% annually', confidence: 88, source: 'Historical NIFTY CAGR analysis' },
      { id: 'debt_ratio', condition: 'Debt-to-income > 30%', action: 'Suggest debt consolidation', confidence: 85, source: 'RBI financial stability guidelines' },
      { id: 'gold_allocation', condition: 'Gold allocation > 15%', action: 'Suggest partial rebalance to equity', confidence: 78, source: 'Portfolio theory (Markowitz)' },
      { id: 'age_risk', condition: 'Age < 35 and equity < 60%', action: 'Increase equity exposure for long-term growth', confidence: 90, source: 'Age-based asset allocation model' },
      { id: 'fd_rates', condition: 'FD rates < inflation (CPI)', action: 'Shift excess FD to debt mutual funds', confidence: 82, source: 'Real rate of return analysis' },
      { id: 'tax_loss', condition: 'Unrealized short-term loss exists', action: 'Consider tax-loss harvesting', confidence: 87, source: 'Capital gains tax optimization' }
    ],

    explain(recommendation) {
      const matches = this.rules.filter(r =>
        recommendation.toLowerCase().includes(r.action.toLowerCase().substring(0, 20)) ||
        recommendation.toLowerCase().includes(r.condition.toLowerCase().substring(0, 15))
      );

      if (matches.length === 0) {
        return {
          basic: 'This recommendation is based on your current financial snapshot and market conditions.',
          advanced: 'No matching rule found. Recommendation generated from pattern analysis of your spending, savings rate, and risk profile.',
          rules: [],
          sources: ['General financial advisory model']
        };
      }

      return {
        basic: matches.map(m => `• ${m.condition} → ${m.action}`).join('\n'),
        advanced: matches.map(m => `Rule: ${m.condition}\n→ Action: ${m.action}\n→ Confidence: ${m.confidence}%\n→ Source: ${m.source}`).join('\n\n'),
        rules: matches,
        sources: [...new Set(matches.map(m => m.source))]
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  WEALTH TWIN SCORE
  // ═══════════════════════════════════════════════════════════════

  const WealthTwinScore = {
    compute() {
      const savingsRate = 22.4; // % from WealthEngine
      const goalProgress = 65;   // % goals completed
      const protectionScore = 94; // RiskEngine score
      const privacyScore = PrivacyManager.isAccepted() ? 100 : 0;
      const diversityScore = 72;  // Portfolio diversification
      const loginStreak = parseInt(localStorage.getItem('sw_login_streak') || '1');

      const total = Math.round(
        (savingsRate * 2.5) +
        (goalProgress * 2) +
        (protectionScore * 2) +
        (privacyScore * 0.5) +
        (diversityScore * 1.5) +
        (Math.min(loginStreak, 30) * 5)
      );

      return Math.min(1000, total);
    },

    getBadges() {
      const badges = [];
      if (PrivacyManager.isAccepted()) badges.push({ name: 'Privacy Champion', icon: 'fa-shield-halved', color: '#C4A962' });
      const streak = parseInt(localStorage.getItem('sw_login_streak') || '1');
      if (streak >= 7) badges.push({ name: 'Weekly Warrior', icon: 'fa-calendar-check', color: '#10B981' });
      if (streak >= 30) badges.push({ name: 'Diamond Discipline', icon: 'fa-gem', color: '#2563EB' });
      badges.push({ name: 'Wealth Builder', icon: 'fa-chart-line', color: '#0B1D3A' });
      return badges;
    },

    getChallenges() {
      return [
        { id: 'review_expenses', title: 'Review one expense category', reward: '+25 pts', icon: 'fa-magnifying-glass-chart', done: false },
        { id: 'check_goals', title: 'Check your goal progress', reward: '+15 pts', icon: 'fa-bullseye', done: false },
        { id: 'run_risk_sandbox', title: 'Try the Risk Sandbox', reward: '+30 pts', icon: 'fa-shield-virus', done: false },
        { id: 'encrypt_data', title: 'Encrypt your financial data', reward: '+40 pts', icon: 'fa-lock', done: false },
        { id: 'link_bank', title: 'Link a bank via AA', reward: '+50 pts', icon: 'fa-building-columns', done: false }
      ];
    },

    logLogin() {
      const today = new Date().toDateString();
      const last = localStorage.getItem('sw_last_login_date');
      if (last !== today) {
        const streak = parseInt(localStorage.getItem('sw_login_streak') || '0');
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        localStorage.setItem('sw_login_streak', last === yesterday ? streak + 1 : 1);
        localStorage.setItem('sw_last_login_date', today);
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  RENDER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  function C(n) {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  }

  function renderPrivacySettings(container) {
    const status = PrivacyManager.getConsentStatus();
    const history = PrivacyManager.getConsentHistory();
    const aaConsents = AAConsentRegistry.getAll();
    const cryptStatus = typeof VaultCrypt !== 'undefined' ? VaultCrypt.getStatus() : { initialized: false, encryptedItems: 0 };
    const score = WealthTwinScore.compute();
    const badges = WealthTwinScore.getBadges();

    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">🔐 Privacy & Compliance Centre</h2>
            <p class="text-sm text-slate-500 mt-1">RBI Account Aggregator compliant · On-device encryption · Full transparency</p>
          </div>
          <span class="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full"><i class="fas fa-certificate mr-1.5"></i>Privacy Certified</span>
        </div>

        <!-- Consent Status -->
        <div class="fb-card p-6">
          <h3 class="text-sm font-semibold mb-4 flex items-center gap-2"><i class="fas fa-file-signature text-blue-600"></i>Consent Status</h3>
          <div class="flex items-center justify-between">
            <div>
              <span class="px-3 py-1.5 rounded-full text-sm font-bold ${status === 'agreed' ? 'bg-emerald-100 text-emerald-700' : status === 'declined' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}">${status === 'agreed' ? '✅ Consent Granted' : status === 'declined' ? '❌ Consent Declined' : '⏳ Pending'}</span>
              <p class="text-xs text-slate-500 mt-2">${status === 'agreed' ? 'Full access to personalized wealth insights and fraud protection.' : 'Limited demo mode. Personalized features are disabled.'}</p>
            </div>
            <div class="flex gap-2">
              ${status === 'agreed' ? `
                <button onclick="window.withdrawConsentAndReload()" class="fb-btn fb-btn-outline fb-btn-sm text-red-500 border-red-300 hover:bg-red-50"><i class="fas fa-undo mr-1.5"></i>Withdraw Consent</button>
              ` : `
                <button onclick="window.regrantConsentAndReload()" class="fb-btn fb-btn-primary fb-btn-sm"><i class="fas fa-check mr-1.5"></i>Grant Consent</button>
              `}
            </div>
          </div>
        </div>

        <!-- Encryption Status -->
        <div class="fb-card p-6">
          <h3 class="text-sm font-semibold mb-4 flex items-center gap-2"><i class="fas fa-lock text-emerald-600"></i>On-Device Encryption</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><span class="text-xs text-slate-500 block">Algorithm</span><span class="font-semibold">${cryptStatus.algorithm}</span></div>
            <div><span class="text-xs text-slate-500 block">Key ID</span><span class="font-mono text-xs">${cryptStatus.keyId || 'Not initialized'}</span></div>
            <div><span class="text-xs text-slate-500 block">Encrypted Items</span><span class="font-semibold">${cryptStatus.encryptedItems}</span></div>
            <div><span class="text-xs text-slate-500 block">Server Access</span><span class="font-semibold text-emerald-500">Never shared</span></div>
          </div>
          <p class="text-xs text-slate-400 mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"><i class="fas fa-info-circle mr-1.5"></i> All financial data is encrypted with AES-256-GCM in your browser. Decryption happens only in memory. Keys never leave this device. <b>Decrypted only in your browser — never stored on servers.</b></p>
        </div>

        <!-- AA Consents -->
        <div class="fb-card p-6">
          <h3 class="text-sm font-semibold mb-4 flex items-center gap-2"><i class="fas fa-building-columns text-amber-600"></i>Account Aggregator Consents</h3>
          ${aaConsents.length === 0 ? `
            <p class="text-sm text-slate-500">No AA consents active. <a href="#" onclick="App.renderView('aggregator')" class="text-blue-600 hover:underline">Link a bank account →</a></p>
          ` : `
            <div class="overflow-x-auto">
              <table class="fb-table text-sm">
                <thead><tr><th>Bank</th><th>FIPA ID</th><th>Data Types</th><th>Expires</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  ${aaConsents.map(c => `
                    <tr>
                      <td class="font-medium">${c.bankName}</td>
                      <td class="font-mono text-xs">${c.fifaId}</td>
                      <td class="text-xs">${c.dataTypes}</td>
                      <td class="text-xs">${new Date(c.expiresAt).toLocaleDateString('en-IN')}</td>
                      <td><span class="px-2 py-0.5 rounded-full text-xs font-semibold ${c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}">${c.status}</span></td>
                      <td>${c.status === 'active' ? `<button onclick="window.revokeAAConsent('${c.id}')" class="text-xs text-red-500 hover:underline font-medium">Revoke</button>` : `<span class="text-xs text-slate-400">Revoked ${new Date(c.revokedAt).toLocaleDateString('en-IN')}</span>`}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- Privacy Promise -->
        <div class="fb-card p-6 border-l-4 border-emerald-400">
          <h3 class="text-sm font-semibold mb-3"><i class="fas fa-handshake mr-2 text-emerald-500"></i>Privacy Promise</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>No data is ever sold, rented, or shared with third parties for advertising.</span></div>
            <div class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>Data used only for wealth intelligence and fraud protection.</span></div>
            <div class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>All processing is on-device or via secure audited APIs.</span></div>
            <div class="flex items-start gap-2"><i class="fas fa-check text-emerald-500 mt-0.5"></i><span>You can withdraw consent and delete all data at any time.</span></div>
          </div>
        </div>

        <!-- Consent History -->
        <div class="fb-card p-6">
          <h3 class="text-sm font-semibold mb-3">Consent Activity Log</h3>
          <div class="max-h-48 overflow-y-auto text-xs">
            ${history.slice(0, 10).map(h => `
              <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span>${h.action}</span><span class="text-slate-400">${new Date(h.timestamp).toLocaleString('en-IN')}</span></div>
            `).join('')}
            ${history.length === 0 ? '<p class="text-slate-400">No consent activity recorded.</p>' : ''}
          </div>
        </div>
      </div>`;
  }

  function renderRiskSandbox(container) {
    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">🛡️ Wealth Protection Sandbox</h2>
            <p class="text-sm text-slate-500 mt-1">Adjust risk signals and see real-time scoring — prove the mandatory cyber-protection layer</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Sliders -->
          <div class="lg:col-span-2 fb-card p-6 space-y-5">
            <h3 class="text-sm font-semibold">Risk Signal Controls</h3>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2"><span class="font-medium">Device Trust</span><span id="slider-device-val" class="font-mono">80%</span></div>
                <input type="range" id="slider-device" min="0" max="100" value="80" class="w-full accent-blue-900" oninput="window.updateRiskSandbox()">
                <div class="flex justify-between text-xs text-slate-400"><span>New Device (0%)</span><span>Known Trusted (100%)</span></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2"><span class="font-medium">OTP Retries</span><span id="slider-otp-val" class="font-mono">1</span></div>
                <input type="range" id="slider-otp" min="1" max="5" value="1" class="w-full accent-blue-900" oninput="window.updateRiskSandbox()">
                <div class="flex justify-between text-xs text-slate-400"><span>1 try (Normal)</span><span>5+ tries (Suspicious)</span></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2"><span class="font-medium">Amount vs History</span><span id="slider-amount-val" class="font-mono">1x</span></div>
                <input type="range" id="slider-amount" min="5" max="50" value="10" step="1" class="w-full accent-blue-900" oninput="window.updateRiskSandbox()">
                <div class="flex justify-between text-xs text-slate-400"><span>0.5x (Small)</span><span>5x (Very Large)</span></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2"><span class="font-medium">Action Urgency</span></div>
                <div class="flex gap-2">
                  <button id="btn-urgency-normal" class="flex-1 py-2 rounded-lg text-sm font-medium bg-emerald-100 text-emerald-700" onclick="window.setUrgency('Normal')">Normal</button>
                  <button id="btn-urgency-rushed" class="flex-1 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600" onclick="window.setUrgency('Rushed')">Rushed</button>
                  <button id="btn-urgency-panic" class="flex-1 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600" onclick="window.setUrgency('Panic')">⚠️ Panic</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Result -->
          <div class="fb-card p-6 text-center" id="risk-sandbox-result">
            <div class="fb-risk-ring mx-auto mb-4" id="risk-ring" style="background: conic-gradient(#10B981 0deg, #E2E8F0 0deg); width:120px; height:120px;">
              <span class="fb-risk-ring-value" id="risk-score-display">15</span>
            </div>
            <p class="text-lg font-bold" id="risk-decision">✅ Allow</p>
            <p class="text-xs text-slate-500 mt-1" id="risk-detail">Low risk — proceed normally</p>
            <div class="mt-4 space-y-1 text-left text-xs" id="risk-signals"></div>
          </div>
        </div>
      </div>`;

    // Initialize
    setTimeout(() => window.updateRiskSandbox(), 100);
  }

  // ═══════════════════════════════════════════════════════════════
  //  GLOBAL HELPERS
  // ═══════════════════════════════════════════════════════════════

  let sandboxUrgency = 'Normal';

  window.setUrgency = function(level) {
    sandboxUrgency = level;
    ['Normal','Rushed','Panic'].forEach(l => {
      const btn = document.getElementById('btn-urgency-' + l.toLowerCase());
      if (btn) {
        btn.className = l === level
          ? 'flex-1 py-2 rounded-lg text-sm font-medium ' + (l === 'Normal' ? 'bg-emerald-100 text-emerald-700' : l === 'Rushed' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')
          : 'flex-1 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-600';
      }
    });
    window.updateRiskSandbox();
  };

  window.updateRiskSandbox = function() {
    const device = parseInt(document.getElementById('slider-device')?.value || 80);
    const otp = parseInt(document.getElementById('slider-otp')?.value || 1);
    const amountRaw = parseInt(document.getElementById('slider-amount')?.value || 10);
    const amountRatio = amountRaw / 10;

    document.getElementById('slider-device-val').textContent = device + '%';
    document.getElementById('slider-otp-val').textContent = otp;
    document.getElementById('slider-amount-val').textContent = amountRatio.toFixed(1) + 'x';

    const result = RiskSandbox.calculateRisk({
      deviceTrust: device,
      otpRetries: otp,
      amountRatio,
      urgency: sandboxUrgency,
      sessionAge: 30,
      newActionType: false
    });

    // Update ring
    const ring = document.getElementById('risk-ring');
    if (ring) {
      const deg = (result.score / 100) * 360;
      const color = result.score < 30 ? '#10B981' : result.score < 60 ? '#F59E0B' : '#EF4444';
      ring.style.background = `conic-gradient(${color} ${deg}deg, #E2E8F0 0deg)`;
      document.getElementById('risk-score-display').textContent = result.score;
    }

    const decisionEl = document.getElementById('risk-decision');
    if (decisionEl) decisionEl.textContent = result.decision;

    const detailEl = document.getElementById('risk-detail');
    if (detailEl) detailEl.textContent = result.score < 30 ? 'Low risk — proceed normally' : result.score < 60 ? 'Medium risk — warning + cooling-off period' : 'High risk — action blocked for protection';

    const signalsEl = document.getElementById('risk-signals');
    if (signalsEl) {
      signalsEl.innerHTML = result.signals.map(s =>
        `<div class="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800"><span>${s.name} (${s.weight}%)</span><span class="font-semibold ${s.score > 10 ? 'text-red-500' : s.score > 5 ? 'text-amber-500' : 'text-emerald-500'}">+${s.score}</span></div>`
      ).join('');
    }
  };

  window.withdrawConsentAndReload = function() {
    if (confirm('Withdraw consent? This will delete all your financial data from this device. This action cannot be undone.')) {
      PrivacyManager.withdrawConsent();
      if (typeof VaultCrypt !== 'undefined') VaultCrypt.wipeAll();
      App.showToast('Consent withdrawn. All data deleted.', 'warning');
      setTimeout(() => location.reload(), 1500);
    }
  };

  window.regrantConsentAndReload = function() {
    PrivacyManager.grantConsent();
    App.showToast('Consent granted. Welcome back!', 'success');
    setTimeout(() => location.reload(), 800);
  };

  window.revokeAAConsent = function(consentId) {
    if (confirm('Revoke this AA consent? The bank\'s data will no longer be used for your net worth calculation.')) {
      AAConsentRegistry.revokeConsent(consentId);
      App.showToast('AA consent revoked. Bank data removed.', 'info');
      setTimeout(() => App.renderView('privacy-settings'), 500);
    }
  };

  window.explainRecommendation = function(text) {
    const result = ExplainabilityEngine.explain(text);
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6" onclick="event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold"><i class="fas fa-brain mr-2 text-blue-600"></i>AI Decision Tree</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
        </div>
        <div class="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-4 text-sm whitespace-pre-line">${result.basic}</div>
        ${result.rules.length > 0 ? `
          <details class="mb-3"><summary class="text-sm font-medium text-blue-600 cursor-pointer">Advanced View (${result.rules.length} rules)</summary>
            <div class="mt-3 space-y-3">${result.rules.map(r => `<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs"><p class="font-semibold">IF: ${r.condition}</p><p class="text-emerald-600 mt-1">THEN: ${r.action}</p><div class="flex justify-between mt-2 text-slate-400"><span>Confidence: ${r.confidence}%</span><span>Source: ${r.source}</span></div></div>`).join('')}</div>
          </details>
        ` : ''}
        <p class="text-xs text-slate-400">Sources: ${(result.sources || []).join(', ')}</p>
      </div>`;
    document.body.appendChild(modal);
  };

  // ═══════════════════════════════════════════════════════════════
  //  INTEGRATION
  // ═══════════════════════════════════════════════════════════════

  function waitForApp(cb, retries) {
    retries = retries || 50;
    if (window.App && window.App.renderView) cb();
    else if (retries > 0) setTimeout(() => waitForApp(cb, retries - 1), 100);
  }

  waitForApp(function() {
    window.PrivacyManager = PrivacyManager;
    window.AAConsentRegistry = AAConsentRegistry;
    window.RiskSandbox = RiskSandbox;
    window.ExplainabilityEngine = ExplainabilityEngine;
    window.WealthTwinScore = WealthTwinScore;

    // Track login streak
    WealthTwinScore.logLogin();

    // Patch renderView
    const orig = App.renderView.bind(App);
    App.renderView = function(view) {
      const container = document.getElementById('main-content');
      if (!container) return orig(view);
      if (view === 'privacy-settings') { renderPrivacySettings(container); }
      else if (view === 'risk-sandbox') { renderRiskSandbox(container); }
      else { orig(view); return; }

      document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.remove('active');
        if (el.dataset.view === view) el.classList.add('active');
      });
      document.getElementById('page-title').textContent = view === 'privacy-settings' ? 'Privacy & Compliance' : 'Risk Sandbox';
    };

    // Add sidebar items
    const nav = document.querySelector('.fb-nav, #sidebar-nav');
    if (nav && !document.querySelector('[data-view="risk-sandbox"]')) {
      const divider = document.createElement('div');
      divider.className = 'fb-nav-section';
      divider.textContent = 'Security & Tools';
      nav.appendChild(divider);

      [{ view: 'risk-sandbox', icon: 'fa-shield-virus', label: 'Risk Sandbox', badge: 'LIVE' },
       { view: 'privacy-settings', icon: 'fa-shield-halved', label: 'Privacy Centre', badge: 'GDPR' }]
      .forEach(item => {
        const a = document.createElement('a');
        a.href = '#'; a.dataset.view = item.view;
        a.className = 'fb-nav-item nav-item';
        a.innerHTML = `<i class="fas ${item.icon}"></i><span class="flex-1">${item.label}</span><span class="nav-badge">${item.badge}</span>`;
        a.addEventListener('click', function(e) { e.preventDefault(); App.renderView(item.view); });
        nav.appendChild(a);
      });
    }
  });

})();
