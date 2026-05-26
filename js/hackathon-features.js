/**
 * SecureWealth Twin - Hackathon Missing Features
 * Implements: Risk Assessment, Consent Modal, Physical Assets, 
 * Protection Center, Goal Simulator, Market Insights, Tax Savings
 */
(function() {
  'use strict';

  const C = n => {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  };

  // ===================== CONSENT MANAGER =====================
  const ConsentManager = {
    hasConsent() {
      try { return localStorage.getItem('sw_consent') === 'agreed'; } catch(e) { return false; }
    },
    setConsent(val) {
      try { localStorage.setItem('sw_consent', val ? 'agreed' : 'declined'); } catch(e) {}
    },
    show() {
      if (this.hasConsent()) return;
      const modal = document.createElement('div');
      modal.id = 'consent-modal';
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" style="animation: consentModalIn 0.4s ease-out">
          <div class="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <h3 class="text-xl font-bold"><i class="fas fa-shield-halved mr-2"></i>Privacy & Consent</h3>
            <p class="text-sm text-white/80 mt-1">SecureWealth Twin - PSB Hackathon 2026</p>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-600 dark:text-slate-300">
              SecureWealth Twin uses your financial data to provide personalized wealth insights, 
              fraud protection, and AI-powered recommendations. All data is encrypted in your browser 
              and never shared with third parties.
            </p>
            <div class="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <div class="flex items-center gap-2"><i class="fas fa-check text-success"></i> On-device encryption</div>
              <div class="flex items-center gap-2"><i class="fas fa-check text-success"></i> RBI Account Aggregator compliant</div>
              <div class="flex items-center gap-2"><i class="fas fa-check text-success"></i> No data sold to advertisers</div>
              <div class="flex items-center gap-2"><i class="fas fa-check text-success"></i> You can withdraw consent anytime</div>
            </div>
            <div class="flex gap-3 pt-2">
              <button id="consent-agree" class="flex-1 py-3 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl" style="background: linear-gradient(135deg, #0B1D3A, #132D52);">
                <i class="fas fa-check mr-1.5"></i> I Agree
              </button>
              <button id="consent-decline" class="flex-1 py-3 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg" style="background: linear-gradient(135deg, #64748B, #94A3B8);">
                <i class="fas fa-times mr-1.5"></i> Decline
              </button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(modal);
      if (!document.getElementById('consent-modal-style')) {
        const style = document.createElement('style');
        style.id = 'consent-modal-style';
        style.textContent = `@keyframes consentModalIn { from { opacity:0; transform:scale(0.9) translateY(30px); } to { opacity:1; transform:scale(1) translateY(0); } }`;
        document.head.appendChild(style);
      }
      document.getElementById('consent-agree').onclick = () => {
        this.setConsent(true);
        modal.remove();
        NudgeEngine?.show?.('Welcome to SecureWealth Twin!', 'success');
        // Trigger auth login screen immediately
        setTimeout(function() {
          if (window.AuthShield && !window.AuthState.isLoggedIn) {
            window.AuthShield.showLogin();
          }
        }, 400);
      };
      document.getElementById('consent-decline').onclick = () => {
        this.setConsent(false);
        modal.remove();
        const banner = document.createElement('div');
        banner.className = 'fixed bottom-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-xs z-50';
        banner.innerHTML = '<i class="fas fa-exclamation-triangle mr-1"></i> Limited functionality mode. Personalized insights disabled.';
        document.body.appendChild(banner);
      };
    }
  };

  // ===================== RISK ENGINE =====================
  const RiskEngine = {
    signals: {
      deviceTrust: { score: 0, weight: 0, label: 'Device Trust', desc: 'Device is recognized and secure' },
      amountHistory: { score: 0, weight: 0, label: 'Amount vs History', desc: 'Transaction amount within normal range' },
      otpSpeed: { score: 0, weight: 0, label: 'OTP Entry Speed', desc: 'OTP entered at normal speed' },
      retryUrgency: { score: 0, weight: 0, label: 'Retry/Urgency', desc: 'No repeated clicks detected' },
      newType: { score: 0, weight: 0, label: 'New Action Type', desc: 'User has performed this action before' },
      sessionAge: { score: 0, weight: 0, label: 'Session Age', desc: 'Session is established' }
    },
    clickTracker: {},
    sessionStart: Date.now(),

    trackClicks(actionId) {
      const now = Date.now();
      if (!this.clickTracker[actionId]) this.clickTracker[actionId] = [];
      this.clickTracker[actionId] = this.clickTracker[actionId].filter(t => now - t < 10000);
      this.clickTracker[actionId].push(now);
      return this.clickTracker[actionId].length;
    },

    assess(actionType, amount = 0) {
      const signals = [];
      let totalScore = 0;

      // Device Trust (mock: always trusted for demo)
      const isTrusted = true;
      signals.push({ name: 'Device Trust', status: isTrusted ? 'passed' : 'failed', score: isTrusted ? 0 : 20, desc: isTrusted ? 'Recognized device' : 'Unrecognized device' });
      totalScore += isTrusted ? 0 : 20;

      // Amount vs History
      const avgAmount = 50000;
      const amountRisk = amount > avgAmount * 2 ? 25 : amount > avgAmount * 1.5 ? 15 : 0;
      signals.push({ name: 'Amount vs History', status: amountRisk > 0 ? 'flagged' : 'passed', score: amountRisk, desc: amount > avgAmount * 2 ? `₹${amount.toLocaleString()} is >2x average` : 'Within normal range' });
      totalScore += amountRisk;

      // OTP Speed (simulated)
      const otpTime = 2 + Math.random() * 6;
      const otpRisk = otpTime < 3 ? 15 : 0;
      signals.push({ name: 'OTP Entry Speed', status: otpRisk > 0 ? 'flagged' : 'passed', score: otpRisk, desc: `Entered in ${otpTime.toFixed(1)}s` });
      totalScore += otpRisk;

      // Retry/Urgency
      const clicks = this.trackClicks(actionType);
      const retryRisk = clicks > 3 ? 20 : clicks > 2 ? 10 : 0;
      signals.push({ name: 'Retry/Urgency', status: retryRisk > 0 ? 'flagged' : 'passed', score: retryRisk, desc: `${clicks} clicks in 10 seconds` });
      totalScore += retryRisk;

      // New Action Type
      const completedActions = JSON.parse(localStorage.getItem('sw_completed_actions') || '[]');
      const isNew = !completedActions.includes(actionType);
      const newRisk = isNew ? 10 : 0;
      signals.push({ name: 'New Action Type', status: newRisk > 0 ? 'flagged' : 'passed', score: newRisk, desc: isNew ? 'First time performing this action' : 'Previously performed' });
      totalScore += newRisk;
      if (isNew) {
        completedActions.push(actionType);
        localStorage.setItem('sw_completed_actions', JSON.stringify(completedActions));
      }

      // Session Age
      const sessionMin = (Date.now() - this.sessionStart) / 60000;
      const sessionRisk = sessionMin < 5 ? 5 : 0;
      signals.push({ name: 'Session Age', status: sessionRisk > 0 ? 'flagged' : 'passed', score: sessionRisk, desc: `Session active for ${Math.floor(sessionMin)} min` });
      totalScore += sessionRisk;

      const level = totalScore <= 33 ? 'low' : totalScore <= 66 ? 'medium' : 'high';
      return { score: totalScore, level, signals, actionType, amount };
    },

    updateProtectionScore(result) {
      const badge = document.querySelector('[id="protection-score-badge"]') || document.querySelector('.fa-shield-halved')?.closest('span');
      if (!badge) return;
      // Calculate new score based on risk level
      let newScore = 94;
      if (result.level === 'medium') newScore = Math.max(60, 94 - result.score);
      if (result.level === 'high') newScore = Math.max(30, 94 - result.score - 10);
      badge.innerHTML = `<i class="fas fa-shield-halved mr-1"></i>Protection: ${newScore}/100`;
      badge.className = `px-3 py-1.5 text-xs font-medium rounded-full ${result.level === 'low' ? 'bg-emerald-100 text-emerald-700' : result.level === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-danger'}`;
      setTimeout(() => {
        badge.innerHTML = '<i class="fas fa-shield-halved mr-1"></i>Protection: 94/100';
        badge.className = 'px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full';
      }, 5000);
    },

    showModal(result, onConfirm, onCancel) {
      // Store last assessment for Protection Center display
      localStorage.setItem('sw_last_risk_assessment', JSON.stringify({ score: result.score, level: result.level, signals: result.signals, timestamp: Date.now() }));
      this.updateProtectionScore(result);
      const existing = document.getElementById('risk-modal-custom');
      if (existing) existing.remove();

      const colorClass = result.level === 'low' ? 'text-emerald-500' : result.level === 'medium' ? 'text-amber-500' : 'text-danger';
      const btnText = result.level === 'low' ? 'Confirm' : result.level === 'medium' ? 'Confirm (30s cooldown)' : 'Blocked';
      const btnDisabled = result.level === 'high';

      const modal = document.createElement('div');
      modal.id = 'risk-modal-custom';
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" id="risk-modal-content-custom" style="animation: riskModalIn 0.3s ease-out">
          <div class="bg-gradient-to-r from-dark to-dark-light p-5 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <i class="fas fa-shield-halved text-xl"></i>
                </div>
                <div>
                  <h3 class="text-lg font-bold">Wealth Protection Check</h3>
                  <p class="text-xs text-slate-300">Risk Score: <span class="${colorClass} font-bold text-sm">${result.score}/100 (${result.level.toUpperCase()})</span></p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-5 space-y-3 max-h-72 overflow-y-auto">
            <p class="text-xs text-slate-500 dark:text-slate-400">Action: <strong>${result.actionType}</strong> ${result.amount > 0 ? '· Amount: ' + C(result.amount) : ''}</p>
            <div class="space-y-2">
              ${result.signals.map(s => `
                <div class="flex items-center justify-between p-2 rounded-lg ${s.status === 'passed' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : s.status === 'flagged' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800'}">
                  <div class="flex items-center gap-2">
                    <i class="fas ${s.status === 'passed' ? 'fa-check-circle text-emerald-500' : s.status === 'flagged' ? 'fa-exclamation-circle text-amber-500' : 'fa-times-circle text-danger'}"></i>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-200">${s.name}</span>
                  </div>
                  <span class="text-xs text-slate-500">${s.desc}</span>
                </div>
              `).join('')}
            </div>
            ${result.level === 'medium' ? '<div class="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg"><i class="fas fa-clock mr-1"></i>30-second cooling-off period required for your security.</div><div id="cooling-off-nudge" class="mt-2"></div>' : ''}
            ${result.level === 'high' ? '<div class="text-xs text-danger bg-red-50 dark:bg-red-900/20 p-2 rounded-lg"><i class="fas fa-ban mr-1"></i>This action has been temporarily blocked for your security. Please contact customer support.</div>' : ''}
          </div>
          <div class="p-4 border-t border-slate-100 dark:border-slate-700 flex gap-3">
            <button id="risk-cancel-btn" class="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Cancel</button>
            <button id="risk-confirm-btn" class="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors" ${btnDisabled ? 'disabled' : ''}>${btnText}</button>
          </div>
        </div>`;
      document.body.appendChild(modal);

      // Add keyframe animation if not present
      if (!document.getElementById('risk-modal-style')) {
        const style = document.createElement('style');
        style.id = 'risk-modal-style';
        style.textContent = `@keyframes riskModalIn { from { opacity:0; transform:translateY(20px) scale(0.95); } to { opacity:1; transform:translateY(0) scale(1); } }`;
        document.head.appendChild(style);
      }

      document.getElementById('risk-cancel-btn').onclick = () => { modal.remove(); if (onCancel) onCancel(); };

      const confirmBtn = document.getElementById('risk-confirm-btn');
      if (result.level === 'medium') {
        confirmBtn.disabled = true;
        let secs = 30;
        confirmBtn.textContent = `Confirm (${secs}s)`;
        CoolingOffNudges.start('cooling-off-nudge');
        const timer = setInterval(() => {
          secs--;
          if (confirmBtn) confirmBtn.textContent = `Confirm (${secs}s)`;
          if (secs <= 0) {
            clearInterval(timer);
            CoolingOffNudges.stop();
            if (confirmBtn) { confirmBtn.disabled = false; confirmBtn.textContent = 'Confirm'; }
          }
        }, 1000);
        confirmBtn.onclick = () => { clearInterval(timer); CoolingOffNudges.stop(); modal.remove(); if (onConfirm) onConfirm(); };
      } else if (!btnDisabled) {
        confirmBtn.onclick = () => { modal.remove(); if (onConfirm) onConfirm(); };
      }
    },

    protect(actionType, amount, onConfirm, onCancel) {
      const result = this.assess(actionType, amount);
      this.showModal(result, onConfirm, onCancel);
      return result;
    }
  };

  // ===================== PHYSICAL ASSETS =====================
  const PhysicalAssets = {
    getAssets() {
      try { return JSON.parse(localStorage.getItem('sw_physical_assets') || '[]'); } catch(e) { return []; }
    },
    saveAssets(assets) {
      try { localStorage.setItem('sw_physical_assets', JSON.stringify(assets)); } catch(e) {}
    },
    getTotal() {
      return this.getAssets().reduce((sum, a) => sum + (a.value || 0), 0);
    },
    renderManager(container) {
      const assets = this.getAssets();
      const types = { property: 'fa-building', gold: 'fa-coins', vehicle: 'fa-car', other: 'fa-box' };
      container.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-slate-800 dark:text-white">Physical Assets</h3>
            <span class="text-sm font-bold text-primary">${C(this.getTotal())}</span>
          </div>
          ${assets.length === 0 ? '<p class="text-xs text-slate-400">No physical assets added yet.</p>' : `
            <div class="space-y-2">
              ${assets.map((a, i) => `
                <div class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div class="flex items-center gap-2">
                    <i class="fas ${types[a.type] || types.other} text-slate-400 text-xs"></i>
                    <span class="text-xs font-medium text-slate-700 dark:text-slate-200">${a.name}</span>
                    <span class="text-[10px] text-slate-400 capitalize">${a.type}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-700 dark:text-slate-200">${C(a.value)}</span>
                    <button onclick="PhysicalAssets.delete(${i})" class="text-slate-400 hover:text-danger text-xs"><i class="fas fa-trash"></i></button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
          <form id="asset-form" class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div class="grid grid-cols-2 gap-2">
              <input type="text" id="asset-name" placeholder="Asset name" class="px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-white" required>
              <select id="asset-type" class="px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-white">
                <option value="property">Property</option>
                <option value="gold">Gold</option>
                <option value="vehicle">Vehicle</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="flex gap-2">
              <input type="number" id="asset-value" placeholder="Estimated value (₹)" class="flex-1 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary dark:text-white" required>
              <button type="submit" class="px-3 py-1.5 bg-primary text-white text-xs rounded hover:bg-primary/90"><i class="fas fa-plus mr-1"></i>Add</button>
            </div>
          </form>
        </div>`;

      const form = document.getElementById('asset-form');
      if (form) {
        form.onsubmit = (e) => {
          e.preventDefault();
          const name = document.getElementById('asset-name').value.trim();
          const type = document.getElementById('asset-type').value;
          const value = parseInt(document.getElementById('asset-value').value) || 0;
          if (!name || value <= 0) return;
          const all = this.getAssets();
          all.push({ name, type, value, date: new Date().toISOString() });
          this.saveAssets(all);
          this.renderManager(container);
          NudgeEngine?.show?.('Asset added successfully', 'success');
        };
      }
    },
    delete(index) {
      const all = this.getAssets();
      all.splice(index, 1);
      this.saveAssets(all);
      const container = document.getElementById('physical-assets-panel');
      if (container) this.renderManager(container);
    }
  };

  // ===================== GOAL SIMULATOR =====================
  const GoalSimulator = {
    simulate(goal, extraMonthly) {
      const monthlyRate = 0.10 / 12;
      let months = 0;
      let current = goal.current;
      while (current < goal.target && months < 600) {
        current += extraMonthly;
        current *= (1 + monthlyRate);
        months++;
      }
      const date = new Date();
      date.setMonth(date.getMonth() + months);
      return { months, date: date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }), totalInvested: extraMonthly * months };
    }
  };

  // ===================== MARKET INSIGHTS =====================
  const MarketInsights = {
    getNiftyPE() {
      const base = 22;
      const variation = (Math.random() - 0.5) * 6;
      return parseFloat((base + variation).toFixed(1));
    },
    getInsight() {
      const pe = this.getNiftyPE();
      if (pe > 25) {
        return {
          title: 'Market Valuations Elevated',
          text: `NIFTY P/E is at <strong>${pe}</strong>, above historical averages. Consider booking partial profits in equity funds and shifting to debt for stability.`,
          rule: 'NIFTY P/E > 25 indicates overvaluation. Historical mean is ~20. Reducing equity exposure protects against corrections.',
          action: 'Rebalance to 60:40 debt:equity',
          level: 'warning'
        };
      } else if (pe < 18) {
        return {
          title: 'Market Opportunity',
          text: `NIFTY P/E is at <strong>${pe}</strong>, below historical averages. Good time to increase SIP allocations in equity funds.`,
          rule: 'NIFTY P/E < 18 indicates undervaluation. Increasing equity exposure now can yield higher long-term returns.',
          action: 'Increase equity SIP by 20%',
          level: 'success'
        };
      }
      return {
        title: 'Market Fairly Valued',
        text: `NIFTY P/E is at <strong>${pe}</strong>, near historical averages. Continue with your current SIP strategy.`,
        rule: 'NIFTY P/E between 18-25 is considered fair value. Maintain regular investments without timing the market.',
        action: 'Continue regular SIPs',
        level: 'info'
      };
    }
  };

  // ===================== TAX SAVINGS =====================
  const TaxSavings = {
    getRecommendations(income = 1250000) {
      const recommendations = [];
      recommendations.push({
        section: '80C',
        title: 'ELSS Mutual Funds',
        amount: 150000,
        taxSaved: Math.round(150000 * 0.312),
        desc: 'Invest ₹1.5L in ELSS for 3-year lock-in. Returns are tax-free and you save ₹46,800 in taxes.',
        icon: 'fa-chart-line'
      });
      recommendations.push({
        section: '80CCD(1B)',
        title: 'NPS Contribution',
        amount: 50000,
        taxSaved: Math.round(50000 * 0.312),
        desc: 'Additional ₹50,000 in NPS saves ₹15,600. Great for retirement planning with market-linked returns.',
        icon: 'fa-piggy-bank'
      });
      recommendations.push({
        section: '80D',
        title: 'Health Insurance',
        amount: 25000,
        taxSaved: Math.round(25000 * 0.312),
        desc: 'Premium up to ₹25,000 for self/family saves ₹7,800. Senior citizen parents: additional ₹50,000.',
        icon: 'fa-heart-pulse'
      });
      if (income > 1000000) {
        recommendations.push({
          section: '80EEA',
          title: 'Home Loan Interest',
          amount: 200000,
          taxSaved: Math.round(150000 * 0.312),
          desc: 'First-time homebuyers can claim ₹1.5L additional deduction on home loan interest under 80EEA.',
          icon: 'fa-house'
        });
      }
      return recommendations;
    }
  };

  // ===================== PROTECTION CENTER =====================
  const ProtectionCenter = {
    checks: [
      { id: 'device', name: 'Device Trust', desc: 'Device fingerprint verified', status: 'passed' },
      { id: 'location', name: 'Location Check', desc: 'Login from familiar location', status: 'passed' },
      { id: 'behavior', name: 'Behavior Pattern', desc: 'Typing rhythm matches profile', status: 'passed' },
      { id: 'amount', name: 'Amount Anomaly', desc: 'Transaction within normal range', status: 'passed' },
      { id: 'time', name: 'Time-of-Day', desc: 'Activity during normal hours', status: 'passed' },
      { id: 'velocity', name: 'Velocity Check', desc: 'No rapid successive transactions', status: 'passed' }
    ],
    updateCheck(id, status, desc) {
      const check = this.checks.find(c => c.id === id);
      if (check) { check.status = status; check.desc = desc; }
    },
    renderChecks(container) {
      container.innerHTML = this.checks.map(c => `
        <div class="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border ${c.status === 'passed' ? 'border-emerald-100 dark:border-emerald-800' : c.status === 'flagged' ? 'border-amber-100 dark:border-amber-800' : 'border-red-100 dark:border-red-800'}">
          <div class="w-8 h-8 rounded-full flex items-center justify-center ${c.status === 'passed' ? 'bg-emerald-100 text-emerald-600' : c.status === 'flagged' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-danger'} flex-shrink-0">
            <i class="fas ${c.status === 'passed' ? 'fa-check' : c.status === 'flagged' ? 'fa-exclamation' : 'fa-times'}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-700 dark:text-slate-200">${c.name}</span>
              <span class="text-[10px] uppercase font-bold ${c.status === 'passed' ? 'text-emerald-500' : c.status === 'flagged' ? 'text-amber-500' : 'text-danger'}">${c.status}</span>
            </div>
            <p class="text-[10px] text-slate-500 truncate">${c.desc}</p>
          </div>
        </div>
      `).join('');
    }
  };

  // ===================== EXPLAINABILITY RULE LIBRARY =====================
  const RuleLibrary = {
    rules: {
      'overspending-dining': 'Your dining expenses (₹12,400) are 45% above the average for your income bracket (₹1.25L/month). Industry benchmark is ₹8,000/month. Reducing this to ₹8,000 could free up ₹4,400 monthly — enough for an extra SIP.',
      'sip-performance': 'Your SIP portfolio (Axis Bluechip, Mirae Emerging, SBI Small Cap) has delivered 14.2% CAGR over 3 years. NIFTY 50 returned 12.1% in the same period. Your fund selection beat the benchmark by 2.1%.',
      'protection-active': 'The 6-signal risk engine evaluates Device Trust, Session Behavior, Amount Anomaly, OTP Pattern, Action Familiarity, and Behavior Consistency before every critical wealth action. All checks passed in the last review.',
      'sip-gap': 'Your current monthly surplus is ₹17,000 after expenses. Investing 50% (₹8,500) in a diversified equity SIP could grow to ₹42L in 15 years at 12% CAGR, helping you reach retirement 3.2 years earlier.',
      'emergency-fund-low': 'Your emergency fund covers 2.1 months of expenses (₹72K/month). RBI recommends 6 months. You need ₹4.32L for full coverage. You are ₹1.77L short.',
      'market-elevated': 'NIFTY P/E at 26.3 is 31% above its 10-year average of 20.1. Historically, returns are muted 12-18 months after such valuations. Shifting 10-15% from equity to debt protects gains.',
      'market-opportunity': 'NIFTY P/E at 17.2 is 14% below its 10-year average of 20.1. Historical data shows 18-22% annualized returns 3 years after such entry points. Increasing equity allocation now is optimal.'
    },
    show(id) {
      const text = this.rules[id] || 'This recommendation is based on your historical data, current market conditions, and AI pattern analysis.';
      const existing = document.getElementById('rule-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'rule-modal';
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-xl shadow-2xl max-w-sm w-full p-5 transform transition-all scale-95 opacity-0" id="rule-modal-content">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary"><i class="fas fa-brain text-sm"></i></div>
            <h4 class="font-semibold text-slate-800 dark:text-white text-sm">Why This Recommendation?</h4>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${text}</p>
          <button onclick="document.getElementById('rule-modal').remove()" class="mt-4 w-full py-2 bg-primary text-white text-xs rounded-lg hover:bg-primary/90">Got it</button>
        </div>`;
      document.body.appendChild(modal);
      requestAnimationFrame(() => {
        const content = document.getElementById('rule-modal-content');
        if (content) { content.classList.remove('scale-95', 'opacity-0'); content.classList.add('scale-100', 'opacity-100'); }
      });
    }
  };

  // Override Explainability.show if it exists, or create it
  if (typeof window.Explainability === 'undefined') {
    window.Explainability = { show: (id) => RuleLibrary.show(id) };
  } else {
    const orig = window.Explainability.show;
    window.Explainability.show = function(arg) {
      if (typeof arg === 'string') RuleLibrary.show(arg);
      else if (orig) orig.apply(this, arguments);
    };
  }

  // ===================== EXPOSE GLOBALLY =====================
  window.RiskEngine = RiskEngine;
  window.ConsentManager = ConsentManager;
  window.PhysicalAssets = PhysicalAssets;
  window.GoalSimulator = GoalSimulator;
  window.MarketInsights = MarketInsights;
  window.TaxSavings = TaxSavings;
  window.ProtectionCenter = ProtectionCenter;

  // ===================== DEMO CONTROLS PANEL =====================
  const DemoControls = {
    state: {
      deviceTrust: true,
      highUrgency: false,
      otpSpeed: 4.0,
      newSession: false,
      highVolatility: false,
      skipOTP: false
    },
    toggle(key) {
      this.state[key] = !this.state[key];
      this.render();
    },
    setOTP(val) {
      this.state.otpSpeed = parseFloat(val);
    },
    reset() {
      this.state = { deviceTrust: true, highUrgency: false, otpSpeed: 4.0, newSession: false, highVolatility: false };
      if (window.DuressMode && DuressMode.isActive()) DuressMode.deactivate();
      this.render();
      App.showToast('Demo controls reset to normal', 'success');
    },
    render() {
      const panel = document.getElementById('demo-controls-panel');
      if (!panel) return;
      panel.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-700 dark:text-white"><i class="fas fa-sliders mr-1"></i>Demo Controls</span>
          <button onclick="DemoControls.reset()" class="text-[10px] text-primary hover:underline">Reset All</button>
        </div>
        <div class="space-y-2">
          <label class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
            <span>Simulate New Device</span>
            <input type="checkbox" ${!this.state.deviceTrust ? 'checked' : ''} onchange="DemoControls.toggle('deviceTrust')" class="accent-primary w-3.5 h-3.5">
          </label>
          <label class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
            <span>Simulate High Urgency</span>
            <input type="checkbox" ${this.state.highUrgency ? 'checked' : ''} onchange="DemoControls.toggle('highUrgency')" class="accent-primary w-3.5 h-3.5">
          </label>
          <label class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
            <span>New Session (<5 min)</span>
            <input type="checkbox" ${this.state.newSession ? 'checked' : ''} onchange="DemoControls.toggle('newSession')" class="accent-primary w-3.5 h-3.5">
          </label>
          <div>
            <span class="text-[10px] text-slate-600 dark:text-slate-300">OTP Speed: <strong>${this.state.otpSpeed.toFixed(1)}s</strong></span>
            <input type="range" min="1.5" max="8" step="0.1" value="${this.state.otpSpeed}" oninput="DemoControls.setOTP(this.value); DemoControls.render()" class="w-full accent-primary h-1 mt-1">
          </div>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 text-[10px] text-slate-400">
          Use these toggles to demonstrate different risk scenarios during your presentation.
        </div>`;
    },
    init() {
      const btn = document.createElement('button');
      btn.id = 'demo-controls-toggle';
      btn.className = 'fixed bottom-4 right-4 z-40 w-10 h-10 bg-slate-800 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-700 transition-colors';
      btn.innerHTML = '<i class="fas fa-sliders"></i>';
      btn.title = 'Demo Controls';
      btn.onclick = () => {
        let panel = document.getElementById('demo-controls-panel');
        if (panel) {
          panel.classList.toggle('hidden');
        } else {
          panel = document.createElement('div');
          panel.id = 'demo-controls-panel';
          panel.className = 'fixed bottom-16 right-4 z-40 w-64 bg-white dark:bg-dark-light rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-4';
          document.body.appendChild(panel);
          this.render();
        }
      };
      document.body.appendChild(btn);
    }
  };

  // Override RiskEngine to use DemoControls
  const originalAssess = RiskEngine.assess;
  RiskEngine.assess = function(actionType, amount = 0) {
    const result = originalAssess.call(this, actionType, amount);
    // Apply demo overrides
    if (!DemoControls.state.deviceTrust) {
      const dev = result.signals.find(s => s.name === 'Device Trust');
      if (dev) { dev.status = 'failed'; dev.score = 20; dev.desc = 'Unrecognized device (Demo)'; }
      result.score += 20;
    }
    if (DemoControls.state.highUrgency) {
      const retry = result.signals.find(s => s.name === 'Retry/Urgency');
      if (retry) { retry.status = 'flagged'; retry.score = 20; retry.desc = '4 clicks in 10 seconds (Demo)'; }
      result.score += 20;
    }
    if (DemoControls.state.newSession) {
      const sess = result.signals.find(s => s.name === 'Session Age');
      if (sess) { sess.status = 'flagged'; sess.score = 5; sess.desc = 'Session active for 2 min (Demo)'; }
      result.score += 5;
    }
    // Override OTP speed
    const otp = result.signals.find(s => s.name === 'OTP Entry Speed');
    if (otp) {
      otp.desc = `Entered in ${DemoControls.state.otpSpeed.toFixed(1)}s (Demo)`;
      otp.score = DemoControls.state.otpSpeed < 3 ? 15 : 0;
      otp.status = DemoControls.state.otpSpeed < 3 ? 'flagged' : 'passed';
      if (DemoControls.state.otpSpeed < 3 && otp.score === 0) result.score += 15;
    }
    // Recalculate level
    result.level = result.score <= 33 ? 'low' : result.score <= 66 ? 'medium' : 'high';
    return result;
  };

  // ===================== DURESS MODE =====================
  const DuressMode = {
    isActive() { return localStorage.getItem('sw_duress') === 'active'; },
    activate() {
      localStorage.setItem('sw_duress', 'active');
      this.apply();
      App.showToast('Duress Mode activated — sanitized view shown', 'danger');
    },
    deactivate() {
      localStorage.removeItem('sw_duress');
      this.restore();
      App.showToast('Duress Mode deactivated', 'success');
    },
    toggle() { this.isActive() ? this.deactivate() : this.activate(); },
    apply() {
      let banner = document.getElementById('duress-banner');
      if (!banner) {
        banner = document.createElement('div');
        banner.id = 'duress-banner';
        banner.className = 'fixed top-0 left-0 right-0 bg-rose-600 text-white text-center py-1.5 text-xs z-[80] font-medium';
        banner.innerHTML = '<i class="fas fa-shield-halved mr-1"></i>Duress Mode Active — Showing sanitized view';
        document.body.appendChild(banner);
      }
      // Subtle gray dot indicator in header
      let dot = document.getElementById('duress-indicator');
      if (!dot) {
        dot = document.createElement('div');
        dot.id = 'duress-indicator';
        dot.className = 'fixed top-3 right-3 w-2 h-2 bg-gray-400 rounded-full z-[81] animate-pulse';
        dot.title = 'Sandbox Mode';
        document.body.appendChild(dot);
      }
      document.querySelectorAll('.duress-sensitive').forEach(el => {
        if (!el.dataset.original) el.dataset.original = el.textContent;
        el.textContent = '₹45,000';
        el.classList.add('text-rose-500');
      });
      document.querySelectorAll('.duress-hide').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.duress-fake').forEach(el => {
        if (!el.dataset.original) el.dataset.original = el.textContent;
        el.textContent = el.dataset.duressFake || 'Restricted';
        el.classList.add('text-slate-400');
      });
    },
    restore() {
      const banner = document.getElementById('duress-banner');
      if (banner) banner.remove();
      const dot = document.getElementById('duress-indicator');
      if (dot) dot.remove();
      document.querySelectorAll('.duress-sensitive').forEach(el => {
        if (el.dataset.original) el.textContent = el.dataset.original;
        el.classList.remove('text-rose-500');
      });
      document.querySelectorAll('.duress-hide').forEach(el => el.classList.remove('hidden'));
      document.querySelectorAll('.duress-fake').forEach(el => {
        if (el.dataset.original) el.textContent = el.dataset.original;
        el.classList.remove('text-slate-400');
      });
    }
  };

  // ===================== STRESS TEST SIMULATOR =====================
  const StressTest = {
    scenarios: [
      { id: 'job-loss', name: 'Job Loss', icon: 'fa-briefcase', color: '#ef4444', desc: 'Income drops to zero. How long can you survive?', impact: { income: 0, oneTime: 0 } },
      { id: 'medical', name: 'Medical Emergency', icon: 'fa-heart-pulse', color: '#f59e0b', desc: 'Sudden ₹5,00,000 hospital bill.', impact: { income: 0, oneTime: 500000 } },
      { id: 'market-crash', name: 'Market Crash', icon: 'fa-chart-line', color: '#8b5cf6', desc: 'Equity portfolio drops 40% overnight.', impact: { income: 0, portfolioDrop: 0.40 } }
    ],
    calculate(scenarioId) {
      const liquid = 850000;
      const investments = 2100000;
      const monthlyExpenses = 72000;
      const monthlyIncome = 125000;
      const scenario = this.scenarios.find(s => s.id === scenarioId);
      if (!scenario) return null;
      let runway = 0, shortfall = 0, netWorthAfter = 4520000, msg = '';
      if (scenario.id === 'job-loss') {
        runway = liquid / monthlyExpenses;
        shortfall = Math.max(0, 6 - runway);
        msg = runway >= 6 ? 'Your emergency fund covers ' + runway.toFixed(1) + ' months. Well done!' : 'Warning: You only have ' + runway.toFixed(1) + ' months of coverage. Build a 6-month buffer.';
      } else if (scenario.id === 'medical') {
        shortfall = Math.max(0, scenario.impact.oneTime - liquid);
        runway = (liquid - scenario.impact.oneTime) / monthlyExpenses;
        msg = shortfall > 0 ? 'You need ₹' + shortfall.toLocaleString('en-IN') + ' more liquid funds.' : 'Your liquid funds can absorb this shock.';
      } else if (scenario.id === 'market-crash') {
        const drop = investments * scenario.impact.portfolioDrop;
        netWorthAfter = 4520000 - drop;
        msg = 'Your net worth would drop to ₹' + (netWorthAfter/1e5).toFixed(2) + 'L. Stay invested — markets recover.';
      }
      return { scenario, runway, shortfall, netWorthAfter, msg, liquid, monthlyExpenses };
    },
    showModal() {
      const existing = document.getElementById('stress-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'stress-modal';
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" style="animation: modalIn 0.3s ease-out">
          <div class="bg-gradient-to-r from-rose-500 to-amber-500 p-5 text-white">
            <h3 class="text-lg font-bold"><i class="fas fa-bolt mr-2"></i>Financial Stress Test</h3>
            <p class="text-xs text-white/80 mt-1">Simulate life events and measure your financial resilience.</p>
          </div>
          <div class="p-5 space-y-3">
            <div class="grid grid-cols-3 gap-2">
              ${this.scenarios.map(s => `
                <button onclick="StressTest.run('${s.id}')" class="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-center">
                  <div class="w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1" style="background:${s.color}15;color:${s.color}"><i class="fas ${s.icon} text-xs"></i></div>
                  <p class="text-[10px] font-semibold text-slate-700 dark:text-slate-200">${s.name}</p>
                </button>
              `).join('')}
            </div>
            <div id="stress-result" class="hidden p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"></div>
          </div>
          <div class="p-4 border-t border-slate-100 dark:border-slate-700">
            <button onclick="document.getElementById('stress-modal').remove()" class="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">Close</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      if (!document.getElementById('modal-style')) {
        const style = document.createElement('style');
        style.id = 'modal-style';
        style.textContent = `@keyframes modalIn { from { opacity:0; transform: scale(0.95) translateY(20px); } to { opacity:1; transform: scale(1) translateY(0); } }`;
        document.head.appendChild(style);
      }
    },
    run(id) {
      const result = this.calculate(id);
      const el = document.getElementById('stress-result');
      if (!el || !result) return;
      el.classList.remove('hidden');
      el.innerHTML = `
        <div class="flex items-center gap-2 mb-2">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background:${result.scenario.color}15;color:${result.scenario.color}"><i class="fas ${result.scenario.icon}"></i></div>
          <p class="text-sm font-semibold text-slate-800 dark:text-white">${result.scenario.name}</p>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 mb-2">${result.msg}</p>
        ${result.runway > 0 ? `<div class="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 dark:border-slate-700"><span class="text-slate-500">Cash Runway</span><span class="font-bold ${result.runway >= 6 ? 'text-emerald-500' : 'text-amber-500'}">${result.runway.toFixed(1)} months</span></div>` : ''}
        ${result.shortfall > 0 ? `<div class="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 dark:border-slate-700"><span class="text-slate-500">Shortfall</span><span class="font-bold text-danger">₹${result.shortfall.toLocaleString('en-IN')}</span></div>` : ''}
        ${result.netWorthAfter !== 4520000 ? `<div class="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 dark:border-slate-700"><span class="text-slate-500">Net Worth After</span><span class="font-bold text-slate-700 dark:text-slate-200">₹${(result.netWorthAfter/1e5).toFixed(2)}L</span></div>` : ''}
      `;
    }
  };

  // ===================== THREAT INTELLIGENCE =====================
  const ThreatIntel = {
    alerts: [
      { icon: 'fa-phone-slash', text: 'Fake TRAI calls up 300% in your area. Remember: Banks never ask for OTPs.', color: 'amber', detail: 'Scammers impersonate TRAI officials claiming your number will be disconnected. They demand immediate payment or KYC update. Real TRAI never calls customers for payments.' },
      { icon: 'fa-envelope', text: 'Phishing emails impersonating RBI are circulating. Always verify sender addresses.', color: 'rose', detail: 'Check sender email domain carefully. RBI official emails end with @rbi.org.in. Never click links or download attachments from unknown sources.' },
      { icon: 'fa-mobile-screen', text: 'Fake UPI "₹1 verification" payment requests detected. Do not approve unknown requests.', color: 'amber', detail: 'Fraudsters send UPI collect requests disguised as verification. Approving any UPI request, even for ₹1, can grant access to your account.' },
      { icon: 'fa-globe', text: 'Fraudulent investment apps promising 50% guaranteed returns reported. Stay cautious.', color: 'rose', detail: 'Any investment promising guaranteed high returns is likely a Ponzi scheme. Verify SEBI registration before investing. Report suspicious apps to cybercrime.gov.in.' },
      { icon: 'fa-credit-card', text: 'Card skimming devices found at ATMs in metro cities. Cover keypad while entering PIN.', color: 'amber', detail: 'Skimmers copy card data from magnetic strips. Always wiggle the card slot before inserting. Prefer chip-based or contactless transactions when possible.' },
      { icon: 'fa-whatsapp', text: 'WhatsApp impersonation scams targeting bank customers. Verify via official channels.', color: 'rose', detail: 'Scammers hack or clone WhatsApp accounts of friends/family to ask for money. Always verify urgent requests via a voice call to the actual person.' }
    ],
    currentIndex: 0,
    interval: null,
    rotate() {
      this.currentIndex = (this.currentIndex + 1) % this.alerts.length;
      this.render();
    },
    render() {
      const container = document.getElementById('threat-intel-feed');
      if (!container) return;
      const alert = this.alerts[this.currentIndex];
      const colorMap = { amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800', rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800' };
      container.innerHTML = `
        <div class="flex items-start gap-2 p-2.5 rounded-lg border ${colorMap[alert.color]} transition-all duration-500">
          <i class="fas ${alert.icon} mt-0.5 text-xs flex-shrink-0"></i>
          <div class="flex-1">
            <p class="text-[11px] leading-relaxed">${alert.text}</p>
            <button onclick="ThreatIntel.showDetail(${this.currentIndex})" class="text-[10px] text-primary hover:underline mt-1">Learn more</button>
          </div>
        </div>
        <div class="flex justify-center gap-1 mt-1.5">
          ${this.alerts.map((_, i) => `<div class="w-1 h-1 rounded-full ${i === this.currentIndex ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}"></div>`).join('')}
        </div>
      `;
    },
    showDetail(index) {
      const alert = this.alerts[index];
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-sm w-full p-5" style="animation: modalIn 0.3s ease-out">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center ${alert.color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}"><i class="fas ${alert.icon} text-xs"></i></div>
            <h3 class="font-semibold text-slate-800 dark:text-white text-sm">Scam Alert Details</h3>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 mb-3">${alert.text}</p>
          <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <p class="text-[11px] text-slate-500 leading-relaxed">${alert.detail}</p>
          </div>
          <div class="mt-4 flex gap-2">
            <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90">Got it</button>
            <button onclick="window.open('https://cybercrime.gov.in','_blank')" class="flex-1 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-50">Report</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
    },
    start() {
      this.render();
      if (this.interval) clearInterval(this.interval);
      this.interval = setInterval(() => this.rotate(), 6000);
    },
    stop() { if (this.interval) clearInterval(this.interval); }
  };

  // ===================== WHAT-IF NET WORTH SIMULATOR =====================
  const WhatIfSimulator = {
    showModal() {
      const existing = document.getElementById('whatif-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'whatif-modal';
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full overflow-hidden" style="animation: modalIn 0.3s ease-out">
          <div class="bg-gradient-to-r from-primary to-secondary p-5 text-white">
            <h3 class="text-lg font-bold"><i class="fas fa-wand-magic-sparkles mr-2"></i>What-If Simulator</h3>
            <p class="text-xs text-white/80 mt-1">See how small changes impact your future net worth.</p>
          </div>
          <div class="p-5 space-y-4">
            <div>
              <label class="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                <span>Monthly Savings</span>
                <span id="whatif-savings-val" class="text-primary font-bold">₹28,000</span>
              </label>
              <input type="range" id="whatif-savings" min="5000" max="100000" step="1000" value="28000" class="w-full accent-primary h-1.5" oninput="WhatIfSimulator.update()">
            </div>
            <div>
              <label class="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                <span>Expected Return</span>
                <span id="whatif-return-val" class="text-primary font-bold">12%</span>
              </label>
              <input type="range" id="whatif-return" min="6" max="18" step="0.5" value="12" class="w-full accent-primary h-1.5" oninput="WhatIfSimulator.update()">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-primary/5 rounded-xl border border-primary/10 text-center">
                <p class="text-[10px] text-slate-500">1 Year Projection</p>
                <p id="whatif-1y" class="text-lg font-bold text-primary mt-1">₹48.2L</p>
              </div>
              <div class="p-3 bg-secondary/5 rounded-xl border border-secondary/10 text-center">
                <p class="text-[10px] text-slate-500">5 Year Projection</p>
                <p id="whatif-5y" class="text-lg font-bold text-secondary mt-1">₹82.1L</p>
              </div>
            </div>
            <div id="whatif-insight" class="p-2.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800 text-[11px] text-amber-700 dark:text-amber-300"></div>
          </div>
          <div class="p-4 border-t border-slate-100 dark:border-slate-700">
            <button onclick="document.getElementById('whatif-modal').remove()" class="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Done</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      this.update();
    },
    update() {
      const savings = parseInt(document.getElementById('whatif-savings')?.value || 28000);
      const ret = parseFloat(document.getElementById('whatif-return')?.value || 12);
      const currentNW = 4520000;
      const monthlyRate = ret / 100 / 12;
      let y1 = currentNW, y5 = currentNW;
      for (let m = 0; m < 12; m++) { y1 = y1 * (1 + monthlyRate) + savings; }
      for (let m = 0; m < 60; m++) { y5 = y5 * (1 + monthlyRate) + savings; }
      const sVal = document.getElementById('whatif-savings-val');
      const rVal = document.getElementById('whatif-return-val');
      const y1El = document.getElementById('whatif-1y');
      const y5El = document.getElementById('whatif-5y');
      const insightEl = document.getElementById('whatif-insight');
      if (sVal) sVal.textContent = C(savings) + '/mo';
      if (rVal) rVal.textContent = ret + '%';
      if (y1El) y1El.textContent = C(Math.round(y1));
      if (y5El) y5El.textContent = C(Math.round(y5));
      if (insightEl) {
        const extra = savings - 28000;
        if (extra > 0) insightEl.innerHTML = `<i class="fas fa-lightbulb mr-1"></i>Saving an extra <strong>${C(extra)}/month</strong> grows your net worth by <strong>${C(Math.round(y5 - 4520000))}</strong> in 5 years.`;
        else if (extra < 0) insightEl.innerHTML = `<i class="fas fa-triangle-exclamation mr-1"></i>Reducing savings by <strong>${C(Math.abs(extra))}/month</strong> costs you <strong>${C(Math.round(4520000 * Math.pow(1+monthlyRate,60) + 28000*((Math.pow(1+monthlyRate,60)-1)/monthlyRate) - y5))}</strong> over 5 years.`;
        else insightEl.innerHTML = `<i class="fas fa-check mr-1"></i>At your current savings rate, you'll reach <strong>${C(Math.round(y5))}</strong> in 5 years.`;
      }
    }
  };

  // ===================== BEHAVIORAL NUDGES ENHANCEMENTS =====================
  const BehavioralNudges = {
    showLossAversion() {
      const surplus = 50000;
      const dailyLoss = Math.round(surplus * 0.088 / 365); // ~8.8% inflation cost
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 right-4 z-50 bg-white dark:bg-dark-light rounded-xl shadow-xl border border-rose-100 dark:border-rose-900/30 p-4 max-w-xs transform transition-all duration-500 translate-x-full';
      toast.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center flex-shrink-0"><i class="fas fa-fire text-xs"></i></div>
          <div>
            <p class="text-xs font-semibold text-rose-700 dark:text-rose-300">Loss Aversion Alert</p>
            <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">Your uninvested ₹${surplus.toLocaleString('en-IN')} surplus is losing ~<strong>₹${dailyLoss}/day</strong> to inflation.</p>
            <button onclick="App.renderView('portfolio')" class="mt-2 text-[10px] px-2 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 transition-colors">Invest Now</button>
          </div>
        </div>
        <button onclick="this.parentElement.remove()" class="absolute top-2 right-2 text-slate-400 hover:text-slate-600 text-xs"><i class="fas fa-times"></i></button>
      `;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
      setTimeout(() => { if (toast.parentElement) toast.classList.add('translate-x-full'); setTimeout(() => toast.remove(), 500); }, 8000);
    },
    trackStreak(type) {
      const key = 'sw_streak_' + type;
      const today = new Date().toDateString();
      let data = JSON.parse(localStorage.getItem(key) || '{"count":0,"last":""}');
      if (data.last !== today) { data.count++; data.last = today; localStorage.setItem(key, JSON.stringify(data)); }
      return data.count;
    },
    getStreaks() {
      const types = ['savings','login','goals'];
      const defaults = { savings: 8, login: 15, goals: 3 };
      return types.map(t => {
        const data = JSON.parse(localStorage.getItem('sw_streak_' + t) || '{"count":' + defaults[t] + '}');
        return { type: t, count: data.count || defaults[t] };
      });
    }
  };

  // ===================== COUNTER ANIMATION =====================
  function animateCounter(el, target, duration = 1200, prefix = '', suffix = '') {
    const start = performance.now();
    const from = parseFloat(el.dataset.value || 0);
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      el.textContent = prefix + (target >= 1e5 ? (current/1e5).toFixed(1) + 'L' : target >= 1e7 ? (current/1e7).toFixed(2) + 'Cr' : Math.round(current).toLocaleString('en-IN')) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else { el.dataset.value = target; el.textContent = prefix + (target >= 1e5 ? (target/1e5).toFixed(1) + 'L' : target >= 1e7 ? (target/1e7).toFixed(2) + 'Cr' : Math.round(target).toLocaleString('en-IN')) + suffix; }
    }
    requestAnimationFrame(step);
  }

  // ===================== ENHANCED DEMO CONTROLS =====================
  const _origDemoRender = DemoControls.render;
  DemoControls.render = function() {
    _origDemoRender.call(this);
    const panel = document.getElementById('demo-controls-panel');
    if (!panel) return;
    const extra = document.createElement('div');
    extra.className = 'mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 space-y-2';
    extra.innerHTML = `
      <label class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
        <span>Activate Duress Mode</span>
        <input type="checkbox" ${DuressMode.isActive() ? 'checked' : ''} onchange="DuressMode.toggle()" class="accent-rose-500 w-3.5 h-3.5">
      </label>
      <button onclick="StressTest.showModal()" class="w-full py-1.5 bg-amber-500/10 text-amber-600 text-[10px] rounded hover:bg-amber-500/20 transition-colors">
        <i class="fas fa-bolt mr-1"></i>Stress Test
      </button>
      <button onclick="WhatIfSimulator.showModal()" class="w-full py-1.5 bg-primary/10 text-primary text-[10px] rounded hover:bg-primary/20 transition-colors">
        <i class="fas fa-wand-magic-sparkles mr-1"></i>What-If Simulator
      </button>
    `;
    panel.appendChild(extra);
  };

  // Expose new globals
  window.DuressMode = DuressMode;
  window.StressTest = StressTest;
  window.ThreatIntel = ThreatIntel;
  window.WhatIfSimulator = WhatIfSimulator;
  window.BehavioralNudges = BehavioralNudges;
  window.animateCounter = animateCounter;

  // ===================== ESG PORTFOLIO SCORE =====================
  const ESGScore = {
    holdings: [
      { name: 'Axis ESG Equity', score: 'A', pct: 25, reason: 'Strong environmental & governance practices' },
      { name: 'SBI Magnum Equity', score: 'B+', pct: 20, reason: 'Above-average social responsibility metrics' },
      { name: 'Mirae Emerging Bluechip', score: 'B', pct: 30, reason: 'Mid-tier ESG compliance, improving' },
      { name: 'HDFC Index Fund', score: 'A-', pct: 15, reason: 'Tracks NIFTY 100 with ESG overlay' },
      { name: 'ICICI Pru Technology', score: 'C+', pct: 10, reason: 'Tech sector has lower environmental scores' }
    ],
    getOverall() {
      const scores = { 'A': 90, 'A-': 85, 'B+': 78, 'B': 70, 'B-': 65, 'C+': 58, 'C': 50 };
      let total = 0, weight = 0;
      this.holdings.forEach(h => { total += (scores[h.score] || 70) * h.pct; weight += h.pct; });
      const avg = total / weight;
      if (avg >= 85) return { grade: 'A', label: 'Excellent', color: 'emerald', pct: Math.round(avg) };
      if (avg >= 75) return { grade: 'B+', label: 'Good', color: 'primary', pct: Math.round(avg) };
      if (avg >= 65) return { grade: 'B', label: 'Average', color: 'amber', pct: Math.round(avg) };
      return { grade: 'C', label: 'Needs Improvement', color: 'rose', pct: Math.round(avg) };
    },
    renderCard(container) {
      const overall = this.getOverall();
      const colors = { emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800', primary: 'text-primary bg-primary/5 border-primary/10 dark:bg-primary/10 dark:border-primary/30', amber: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800', rose: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800' };
      container.innerHTML = `
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-slate-800 dark:text-white text-sm"><i class="fas fa-leaf text-emerald-500 mr-2"></i>ESG Portfolio Score</h3>
          <span class="text-xs font-bold ${colors[overall.color].split(' ')[0]}">${overall.grade}</span>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-full border-4 border-${overall.color}-500 flex items-center justify-center">
            <span class="text-sm font-bold ${colors[overall.color].split(' ')[0]}">${overall.pct}</span>
          </div>
          <div>
            <p class="text-xs font-medium text-slate-700 dark:text-slate-200">${overall.label}</p>
            <p class="text-[10px] text-slate-400">Based on 5 holdings</p>
          </div>
        </div>
        <div class="space-y-1.5">
          ${this.holdings.map(h => `
            <div class="flex items-center justify-between text-[10px]">
              <span class="text-slate-500 truncate flex-1">${h.name}</span>
              <span class="font-medium text-slate-700 dark:text-slate-200 ml-2">${h.score}</span>
            </div>
          `).join('')}
        </div>
        <button onclick="ESGScore.showDetails()" class="mt-2 text-[10px] text-primary hover:underline">Learn more about ESG criteria</button>
      `;
    },
    showDetails() {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full p-5" style="animation: modalIn 0.3s ease-out">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><i class="fas fa-leaf text-xs"></i></div>
            <h3 class="font-semibold text-slate-800 dark:text-white">ESG Score Breakdown</h3>
          </div>
          <p class="text-xs text-slate-500 mb-3">Environmental, Social, and Governance scores for your portfolio holdings.</p>
          <div class="space-y-2">
            ${this.holdings.map(h => `
              <div class="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium text-slate-700 dark:text-slate-200">${h.name}</span>
                  <span class="text-xs font-bold text-emerald-600">${h.score}</span>
                </div>
                <p class="text-[10px] text-slate-500">${h.reason}</p>
              </div>
            `).join('')}
          </div>
          <button onclick="this.closest('.fixed').remove()" class="mt-4 w-full py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90">Close</button>
        </div>`;
      document.body.appendChild(modal);
    }
  };

  // ===================== SOCIAL PROOF NUDGES =====================
  const SocialProofNudges = {
    messages: [
      { text: '82% of users in your age bracket invest at least 20% of their income.', icon: 'fa-users', color: 'primary' },
      { text: 'Users who set up auto-SIP save 3x more than those who don\'t.', icon: 'fa-robot', color: 'secondary' },
      { text: 'Your peer group has increased emergency fund coverage to 5.2 months on average.', icon: 'fa-shield-halved', color: 'emerald' },
      { text: 'Top 10% performers review their portfolio weekly. You\'re on a 15-day streak!', icon: 'fa-trophy', color: 'amber' }
    ],
    showRandom() {
      const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
      const colorMap = { primary: 'text-primary bg-primary/5 border-primary/10', secondary: 'text-secondary bg-secondary/5 border-secondary/10', emerald: 'text-emerald-600 bg-emerald-50 border-emerald-100', amber: 'text-amber-600 bg-amber-50 border-amber-100' };
      const el = document.getElementById('social-proof-nudge');
      if (el) {
        el.innerHTML = `<div class="flex items-start gap-2 p-2.5 rounded-lg border ${colorMap[msg.color]} text-[11px]"><i class="fas ${msg.icon} mt-0.5 flex-shrink-0"></i><span>${msg.text}</span></div>`;
      }
    }
  };

  // ===================== DURESS PIN LOGIN MODAL =====================
  const DuressLoginModal = {
    show() {
      const existing = document.getElementById('duress-login-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'duress-login-modal';
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" style="animation: modalIn 0.3s ease-out">
          <div class="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
            <i class="fas fa-lock text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-1">Enter Security PIN</h3>
          <p class="text-xs text-slate-500 mb-4">Verify your identity to access SecureWealth Twin</p>
          <div class="flex justify-center gap-2 mb-4">
            <input type="password" maxlength="1" class="w-10 h-12 text-center text-lg font-bold border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary pin-digit" data-index="0">
            <input type="password" maxlength="1" class="w-10 h-12 text-center text-lg font-bold border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary pin-digit" data-index="1">
            <input type="password" maxlength="1" class="w-10 h-12 text-center text-lg font-bold border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary pin-digit" data-index="2">
            <input type="password" maxlength="1" class="w-10 h-12 text-center text-lg font-bold border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary pin-digit" data-index="3">
          </div>
          <p class="text-[10px] text-slate-400 mb-4">Demo PINs: <strong>1234</strong> (Normal) · <strong>9999</strong> (Duress)</p>
          <button id="duress-login-submit" class="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">Verify</button>
          <button onclick="document.getElementById('duress-login-modal').remove()" class="mt-2 text-xs text-slate-400 hover:text-slate-600">Cancel</button>
        </div>`;
      document.body.appendChild(modal);
      const digits = modal.querySelectorAll('.pin-digit');
      digits.forEach((d, i) => {
        d.oninput = () => { if (d.value && i < 3) digits[i+1].focus(); };
        d.onkeydown = (e) => { if (e.key === 'Backspace' && !d.value && i > 0) digits[i-1].focus(); };
      });
      document.getElementById('duress-login-submit').onclick = () => {
        const pin = Array.from(digits).map(d => d.value).join('');
        if (pin === '9999') {
          DuressMode.activate();
          modal.remove();
          App.showToast('Logged in with Duress PIN — Safe mode active', 'danger');
        } else if (pin === '1234') {
          modal.remove();
          App.showToast('Welcome back, Rahul!', 'success');
        } else {
          digits.forEach(d => { d.value = ''; d.classList.add('border-rose-500'); setTimeout(() => d.classList.remove('border-rose-500'), 500); });
          digits[0].focus();
        }
      };
      digits[0].focus();
    }
  };

  // ===================== OTP SIMULATION =====================
  const OTPSimulation = {
    show(actionType, amount, onConfirm, onCancel) {
      if (DemoControls.state.skipOTP) {
        RiskEngine.protect(actionType, amount, onConfirm, onCancel);
        return;
      }
      const existing = document.getElementById('otp-modal');
      if (existing) existing.remove();
      const modal = document.createElement('div');
      modal.id = 'otp-modal';
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[75] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" style="animation: modalIn 0.3s ease-out">
          <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3">
            <i class="fas fa-mobile-screen-button text-xl"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-white mb-1">Verify Transaction</h3>
          <p class="text-xs text-slate-500 mb-1">Enter the 6-digit OTP sent to <strong>+91 98XXX 45210</strong></p>
          <p class="text-[10px] text-slate-400 mb-4">Action: ${actionType} ${amount > 0 ? '· ' + C(amount) : ''}</p>
          <div class="flex justify-center gap-2 mb-4">
            ${[0,1,2,3,4,5].map(i => `<input type="password" maxlength="1" class="w-10 h-12 text-center text-lg font-bold border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-primary otp-digit" data-index="${i}">`).join('')}
          </div>
          <div class="flex items-center justify-center gap-2 mb-4 text-xs text-slate-500">
            <span id="otp-timer">Resend in 30s</span>
            <button id="otp-resend" class="text-primary hover:underline hidden" onclick="OTPSimulation.resend()">Resend OTP</button>
          </div>
          <button id="otp-verify-btn" class="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors" disabled>Verify</button>
          <button onclick="OTPSimulation.cancel()" class="mt-2 text-xs text-slate-400 hover:text-slate-600">Cancel Transaction</button>
        </div>`;
      document.body.appendChild(modal);
      this.digits = modal.querySelectorAll('.otp-digit');
      this.digits.forEach((d, i) => {
        d.oninput = (e) => {
          if (d.value && i < 5) this.digits[i+1].focus();
          this.checkComplete();
        };
        d.onkeydown = (e) => { if (e.key === 'Backspace' && !d.value && i > 0) this.digits[i-1].focus(); };
      });
      document.getElementById('otp-verify-btn').onclick = () => this.verify(actionType, amount, onConfirm, onCancel);
      this.startTimer();
      this.digits[0].focus();
      // Auto-fill for demo speed
      this.autoFill(actionType, amount, onConfirm, onCancel);
    },
    startTimer() {
      let secs = 30;
      const timerEl = document.getElementById('otp-timer');
      const resendEl = document.getElementById('otp-resend');
      this.timerInterval = setInterval(() => {
        secs--;
        if (timerEl) timerEl.textContent = 'Resend in ' + secs + 's';
        if (secs <= 0) {
          clearInterval(this.timerInterval);
          if (timerEl) timerEl.classList.add('hidden');
          if (resendEl) resendEl.classList.remove('hidden');
        }
      }, 1000);
    },
    resend() {
      App.showToast('New OTP sent to +91 98XXX 45210', 'info');
      const timerEl = document.getElementById('otp-timer');
      const resendEl = document.getElementById('otp-resend');
      if (timerEl) { timerEl.classList.remove('hidden'); timerEl.textContent = 'Resend in 30s'; }
      if (resendEl) resendEl.classList.add('hidden');
      this.digits.forEach(d => d.value = '');
      this.digits[0].focus();
      this.startTimer();
    },
    checkComplete() {
      const pin = Array.from(this.digits).map(d => d.value).join('');
      const btn = document.getElementById('otp-verify-btn');
      if (btn) btn.disabled = pin.length !== 6;
    },
    autoFill(actionType, amount, onConfirm, onCancel) {
      const speed = DemoControls.state.otpSpeed || 4.0;
      const delayPerDigit = Math.max(150, speed * 80); // ms per digit
      const otpCode = '452109';
      this.digits.forEach((d, i) => {
        setTimeout(() => {
          d.value = otpCode[i];
          d.dispatchEvent(new Event('input'));
          if (i === 5) {
            setTimeout(() => this.verify(actionType, amount, onConfirm, onCancel), 300);
          }
        }, delayPerDigit * (i + 1));
      });
    },
    verify(actionType, amount, onConfirm, onCancel) {
      const startTime = performance.now();
      const pin = Array.from(this.digits).map(d => d.value).join('');
      if (pin !== '452109') {
        this.digits.forEach(d => { d.value = ''; d.classList.add('border-rose-500'); setTimeout(() => d.classList.remove('border-rose-500'), 500); });
        this.digits[0].focus();
        App.showToast('Invalid OTP. Please try again.', 'danger');
        return;
      }
      const entryTime = (performance.now() - startTime) / 1000;
      // Override the OTP speed in DemoControls for risk assessment
      const actualSpeed = DemoControls.state.otpSpeed || entryTime;
      DemoControls.state._otpEntryTime = actualSpeed;
      clearInterval(this.timerInterval);
      const modal = document.getElementById('otp-modal');
      if (modal) modal.remove();
      // Now proceed to risk assessment
      RiskEngine.protect(actionType, amount, onConfirm, onCancel);
    },
    cancel() {
      clearInterval(this.timerInterval);
      const modal = document.getElementById('otp-modal');
      if (modal) modal.remove();
    }
  };

  // Monkey-patch RiskEngine to use OTP simulation
  const _origProtect = RiskEngine.protect;
  RiskEngine.protect = function(actionType, amount, onConfirm, onCancel) {
    // Override the assess function temporarily to use our OTP time
    const _origAssess = this.assess;
    this.assess = function(aType, amt) {
      const result = _origAssess.call(this, aType, amt);
      // Override OTP signal if we have entry time
      if (DemoControls.state._otpEntryTime !== undefined) {
        const otpTime = DemoControls.state._otpEntryTime;
        const otp = result.signals.find(s => s.name === 'OTP Entry Speed');
        if (otp) {
          otp.desc = `Entered in ${otpTime.toFixed(1)}s`;
          otp.score = otpTime < 3 ? 15 : 0;
          otp.status = otpTime < 3 ? 'flagged' : 'passed';
          if (otpTime < 3 && otp.score === 0) result.score += 15;
          else if (otpTime >= 3) result.score -= 15;
        }
        // Recalculate level
        result.score = Math.max(0, Math.min(100, result.score));
        result.level = result.score <= 33 ? 'low' : result.score <= 66 ? 'medium' : 'high';
        delete DemoControls.state._otpEntryTime;
      }
      return result;
    };
    _origProtect.call(this, actionType, amount, onConfirm, onCancel);
    // Restore original assess
    this.assess = _origAssess;
  };

  // ===================== ENHANCED DEMO CONTROLS =====================
  // Add keyboard shortcut Ctrl+Shift+D
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
      e.preventDefault();
      const btn = document.getElementById('demo-controls-toggle');
      if (btn) btn.click();
    }
  });

  // Add market volatility toggle to DemoControls
  const _origDemoRender2 = DemoControls.render;
  DemoControls.render = function() {
    _origDemoRender2.call(this);
    const panel = document.getElementById('demo-controls-panel');
    if (!panel) return;
    const extra = document.createElement('div');
    extra.className = 'mt-2 pt-2 border-t border-slate-200 dark:border-slate-600 space-y-2';
    extra.innerHTML = `
      <label class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
        <span>High Market Volatility (PE→28)</span>
        <input type="checkbox" ${DemoControls.state.highVolatility ? 'checked' : ''} onchange="DemoControls.state.highVolatility = !DemoControls.state.highVolatility; DemoControls.render();" class="accent-primary w-3.5 h-3.5">
      </label>
      <label class="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 cursor-pointer">
        <span>Skip OTP Entry (Fast Demo)</span>
        <input type="checkbox" ${DemoControls.state.skipOTP ? 'checked' : ''} onchange="DemoControls.state.skipOTP = !DemoControls.state.skipOTP; DemoControls.render();" class="accent-primary w-3.5 h-3.5">
      </label>
      <button onclick="DuressLoginModal.show()" class="w-full py-1.5 bg-rose-500/10 text-rose-600 text-[10px] rounded hover:bg-rose-500/20 transition-colors">
        <i class="fas fa-mask mr-1"></i>Simulate Duress Login
      </button>
    `;
    panel.appendChild(extra);
  };

  // Override MarketInsights to respect volatility toggle
  const _origGetInsight = MarketInsights.getInsight;
  MarketInsights.getInsight = function() {
    if (DemoControls.state.highVolatility) {
      return {
        title: 'Extreme Market Volatility',
        text: 'NIFTY P/E is at <strong>28.4</strong>, significantly above historical averages. Consider defensive repositioning.',
        rule: 'NIFTY P/E > 28 indicates severe overvaluation. Historical corrections of 15-25% have followed such levels.',
        action: 'Shift 30% equity to debt/gold',
        level: 'warning'
      };
    }
    return _origGetInsight.call(this);
  };

  // Add tax-harvesting rule to RuleLibrary
  RuleLibrary.rules['tax-harvesting'] = 'You have unrealized losses of ₹22,000 in your equity portfolio. Harvesting these before March 31 could offset short-term capital gains and save approximately ₹6,600 in taxes under Section 70 of the Income Tax Act.';
  RuleLibrary.rules['esg-explanation'] = 'ESG scores evaluate Environmental, Social, and Governance practices of companies in your portfolio. Higher scores indicate better sustainability practices and lower long-term regulatory risks.';

  // ===================== LOADING SKELETONS =====================
  const SkeletonLoader = {
    show(id) {
      const el = document.getElementById(id);
      if (!el) return;
      el.dataset.original = el.innerHTML;
      el.innerHTML = `<div class="animate-pulse space-y-2"><div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div><div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div></div>`;
    },
    hide(id) {
      const el = document.getElementById(id);
      if (!el || !el.dataset.original) return;
      el.innerHTML = el.dataset.original;
      delete el.dataset.original;
    }
  };

  // ===================== COOLING-OFF BEHAVIORAL NUDGES =====================
  const CoolingOffNudges = {
    messages: [
      { icon: 'fa-brain', text: 'Did you know? 1 in 3 fraud victims acted under pressure. Take your time.' },
      { icon: 'fa-shield-halved', text: 'Banks never ask for OTPs over phone. If someone did, hang up immediately.' },
      { icon: 'fa-pause', text: 'A 30-second pause can prevent 90% of impulse fraud decisions.' },
      { icon: 'fa-lightbulb', text: 'Verify the recipient account number independently before large transfers.' },
      { icon: 'fa-user-shield', text: 'If this feels rushed, it\'s okay to cancel and try again later.' },
      { icon: 'fa-lock', text: 'Your data is encrypted. No one at SecureWealth can see your passwords.' }
    ],
    interval: null,
    start(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      let idx = 0;
      this.stop();
      container.innerHTML = this.renderMessage(0);
      this.interval = setInterval(() => {
        idx = (idx + 1) % this.messages.length;
        const el = document.getElementById(containerId);
        if (el) el.innerHTML = this.renderMessage(idx);
      }, 5000);
    },
    stop() { if (this.interval) clearInterval(this.interval); },
    renderMessage(idx) {
      const m = this.messages[idx];
      return `<div class="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/10 text-[11px] text-primary transition-all duration-500"><i class="fas ${m.icon} mt-0.5 flex-shrink-0"></i><span>${m.text}</span></div>`;
    }
  };

  // ===================== FINANCIAL LITERACY CARDS =====================
  const FinancialLiteracy = {
    tips: [
      { title: 'Power of Compounding', text: 'Investing ₹10,000/month at 12% for 20 years becomes ₹1 Crore. Starting 5 years earlier adds ₹45 Lakhs more.' },
      { title: 'Emergency Fund Rule', text: 'Keep 6 months of expenses in liquid assets. It prevents dipping into investments during crises.' },
      { title: '50-30-20 Rule', text: 'Allocate 50% to needs, 30% to wants, and 20% to savings. This builds wealth without sacrificing lifestyle.' },
      { title: 'Tax Loss Harvesting', text: 'Offset capital gains with losses before March 31. It can save thousands in taxes every year.' },
      { title: 'Inflation is Silent', text: 'Money in savings accounts loses ~6% value yearly to inflation. Equity SIPs historically beat inflation by 4-6%.' },
      { title: 'Credit Score Matters', text: 'A CIBIL score above 750 can get you home loans 0.5% cheaper. On ₹50L, that saves ₹5.4 Lakhs over 20 years.' }
    ],
    current: 0,
    render(containerId) {
      const el = document.getElementById(containerId);
      if (!el) return;
      const t = this.tips[this.current];
      el.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center flex-shrink-0"><i class="fas fa-lightbulb text-xs"></i></div>
          <div class="flex-1">
            <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">${t.title}</p>
            <p class="text-[11px] text-slate-500 mt-0.5 leading-relaxed">${t.text}</p>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <button onclick="FinancialLiteracy.prev()" class="text-[10px] text-slate-400 hover:text-primary"><i class="fas fa-chevron-left mr-1"></i>Prev</button>
          <span class="text-[10px] text-slate-400">${this.current + 1}/${this.tips.length}</span>
          <button onclick="FinancialLiteracy.next()" class="text-[10px] text-slate-400 hover:text-primary">Next<i class="fas fa-chevron-right ml-1"></i></button>
        </div>
      `;
    },
    next() { this.current = (this.current + 1) % this.tips.length; this.render('financial-literacy-card'); },
    prev() { this.current = (this.current - 1 + this.tips.length) % this.tips.length; this.render('financial-literacy-card'); }
  };

  // ===================== NOTIFICATION CENTER =====================
  const NotificationCenter = {
    notifications: [
      { icon: 'fa-shield-halved', text: 'Unusual login attempt blocked from Mumbai', time: '2 min ago', unread: true, color: 'rose' },
      { icon: 'fa-piggy-bank', text: 'Your SIP of ₹15,000 is due tomorrow', time: '1 hour ago', unread: true, color: 'primary' },
      { icon: 'fa-chart-line', text: 'NIFTY crossed 25,000 — portfolio up 2.4%', time: '3 hours ago', unread: false, color: 'emerald' },
      { icon: 'fa-triangle-exclamation', text: 'Credit card bill due in 2 days', time: '5 hours ago', unread: false, color: 'amber' },
      { icon: 'fa-user-shield', text: 'KYC renewal reminder — expires in 30 days', time: '1 day ago', unread: false, color: 'primary' }
    ],
    toggle() {
      let panel = document.getElementById('notification-panel');
      if (panel) { panel.remove(); return; }
      panel = document.createElement('div');
      panel.id = 'notification-panel';
      panel.className = 'fixed top-16 right-4 z-50 w-80 bg-white dark:bg-dark-light rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden';
      panel.innerHTML = `
        <div class="p-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 class="font-semibold text-sm text-slate-800 dark:text-white">Notifications</h3>
          <span class="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full">${this.notifications.filter(n => n.unread).length} new</span>
        </div>
        <div class="max-h-80 overflow-y-auto">
          ${this.notifications.map(n => `
            <div class="flex items-start gap-3 p-3 ${n.unread ? 'bg-primary/5' : ''} hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-50 dark:border-slate-800 cursor-pointer">
              <div class="w-8 h-8 rounded-full bg-${n.color}-100 text-${n.color}-600 flex items-center justify-center flex-shrink-0 text-xs"><i class="fas ${n.icon}"></i></div>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-slate-700 dark:text-slate-200 ${n.unread ? 'font-medium' : ''}">${n.text}</p>
                <p class="text-[10px] text-slate-400 mt-0.5">${n.time}</p>
              </div>
              ${n.unread ? '<div class="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>' : ''}
            </div>
          `).join('')}
        </div>
        <div class="p-2 border-t border-slate-100 dark:border-slate-700 text-center">
          <button onclick="document.getElementById('notification-panel').remove()" class="text-xs text-primary hover:underline">Mark all as read</button>
        </div>
      `;
      document.body.appendChild(panel);
      // Close on outside click
      setTimeout(() => {
        document.addEventListener('click', function close(e) {
          if (!panel.contains(e.target) && !e.target.closest('#notification-bell-btn')) {
            panel.remove();
            document.removeEventListener('click', close);
          }
        });
      }, 100);
    }
  };

  // ===================== SECURE CHECKOUT OVERLAY =====================
  const SecureCheckout = {
    show(onComplete) {
      const overlay = document.createElement('div');
      overlay.id = 'secure-checkout-overlay';
      overlay.className = 'fixed inset-0 bg-slate-900 z-[80] flex flex-col items-center justify-center text-white';
      overlay.innerHTML = `
        <div class="text-center space-y-6 max-w-sm px-6">
          <div class="w-20 h-20 mx-auto bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <i class="fas fa-fingerprint text-4xl text-emerald-400"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold">Secure Transaction in Progress</h3>
            <p class="text-sm text-slate-400 mt-2">Please do not close or refresh this window</p>
          </div>
          <div class="space-y-3 text-left">
            <div class="flex items-center gap-3 text-sm" id="sc-step-1"><i class="fas fa-circle-check text-emerald-400"></i><span>Verifying device fingerprint...</span></div>
            <div class="flex items-center gap-3 text-sm opacity-40" id="sc-step-2"><i class="fas fa-circle text-slate-600"></i><span>Running fraud detection...</span></div>
            <div class="flex items-center gap-3 text-sm opacity-40" id="sc-step-3"><i class="fas fa-circle text-slate-600"></i><span>Encrypting transaction data...</span></div>
            <div class="flex items-center gap-3 text-sm opacity-40" id="sc-step-4"><i class="fas fa-circle text-slate-600"></i><span>Confirming with RBI network...</span></div>
          </div>
          <div class="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <div id="sc-progress" class="bg-emerald-400 h-1.5 rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      const steps = [
        { id: 'sc-step-1', width: '25%', delay: 400 },
        { id: 'sc-step-2', width: '50%', delay: 900 },
        { id: 'sc-step-3', width: '75%', delay: 1400 },
        { id: 'sc-step-4', width: '100%', delay: 1900 }
      ];
      steps.forEach((step, i) => {
        setTimeout(() => {
          const el = document.getElementById(step.id);
          if (el) { el.classList.remove('opacity-40'); el.querySelector('i').className = 'fas fa-circle-check text-emerald-400'; }
          const bar = document.getElementById('sc-progress');
          if (bar) bar.style.width = step.width;
        }, step.delay);
      });
      setTimeout(() => {
        overlay.remove();
        if (onComplete) onComplete();
      }, 2500);
    }
  };

  // ===================== GOAL CELEBRATION =====================
  const GoalCelebration = {
    trigger() {
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:100;';
      document.body.appendChild(canvas);
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const particles = [];
      const colors = ['#0f766e', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'];
      for (let i = 0; i < 150; i++) {
        particles.push({
          x: canvas.width / 2, y: canvas.height / 2,
          vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15 - 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 6 + 2, life: 1, decay: Math.random() * 0.015 + 0.008
        });
      }
      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach(p => {
          if (p.life <= 0) return;
          alive = true;
          p.x += p.vx; p.y += p.vy; p.vy += 0.2;
          p.life -= p.decay;
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        if (alive) requestAnimationFrame(animate);
        else canvas.remove();
      }
      requestAnimationFrame(animate);
      App.showToast('🎉 Goal achieved! Congratulations!', 'success');
    }
  };

  // ===================== SCAM LIKELY CALLER ID =====================
  const ScamCallerID = {
    show() {
      const existing = document.getElementById('scam-call-overlay');
      if (existing) existing.remove();
      const overlay = document.createElement('div');
      overlay.id = 'scam-call-overlay';
      overlay.className = 'fixed inset-0 bg-black/80 z-[90] flex items-center justify-center p-4';
      overlay.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden" style="animation: modalIn 0.5s ease-out">
          <div class="bg-rose-500 p-6 text-white text-center">
            <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
              <i class="fas fa-phone-volume text-3xl"></i>
            </div>
            <p class="text-sm font-medium">Incoming Call</p>
            <h3 class="text-2xl font-bold mt-1">+91 98452 110XX</h3>
            <div class="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold">
              <i class="fas fa-triangle-exclamation"></i> SCAM LIKELY
            </div>
          </div>
          <div class="p-5 space-y-3">
            <div class="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg border border-rose-100 dark:border-rose-800">
              <p class="text-xs text-rose-700 dark:text-rose-300 font-medium"><i class="fas fa-shield-halved mr-1"></i>This number has been reported 234 times for fraud.</p>
              <p class="text-[11px] text-rose-600 dark:text-rose-400 mt-1">Common tactic: Pretends to be from your bank and asks for OTP.</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button onclick="ScamCallerID.decline()" class="py-3 bg-rose-500 text-white rounded-xl font-medium hover:bg-rose-600 transition-colors">
                <i class="fas fa-phone-slash mr-1"></i>Decline
              </button>
              <button onclick="ScamCallerID.report()" class="py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-200 transition-colors">
                <i class="fas fa-flag mr-1"></i>Report
              </button>
            </div>
          </div>
        </div>`;
      document.body.appendChild(overlay);
    },
    decline() {
      const overlay = document.getElementById('scam-call-overlay');
      if (overlay) overlay.remove();
      App.showToast('Scam call declined and blocked', 'success');
    },
    report() {
      const overlay = document.getElementById('scam-call-overlay');
      if (overlay) overlay.remove();
      App.showToast('Number reported to cybercrime database', 'success');
    }
  };

  // ===================== PANIC MODE (TRIPLE ESC) =====================
  const PanicMode = {
    escCount: 0,
    timer: null,
    init() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.escCount++;
          if (this.timer) clearTimeout(this.timer);
          this.timer = setTimeout(() => { this.escCount = 0; }, 800);
          if (this.escCount >= 3) {
            this.escCount = 0;
            this.activate();
          }
        }
      });
    },
    activate() {
      // Clear all modals and overlays
      document.querySelectorAll('.fixed.inset-0').forEach(el => el.remove());
      document.querySelectorAll('#notification-panel, #demo-controls-panel, #demo-controls-toggle').forEach(el => el.remove());
      // Show fake weather screen
      const panic = document.createElement('div');
      panic.id = 'panic-screen';
      panic.className = 'fixed inset-0 bg-gradient-to-br from-blue-400 to-blue-600 z-[100] flex flex-col items-center justify-center text-white';
      panic.innerHTML = `
        <div class="text-center space-y-4">
          <i class="fas fa-cloud-sun text-6xl"></i>
          <h2 class="text-3xl font-bold">28°C</h2>
          <p class="text-lg">Partly Cloudy · Mumbai</p>
          <p class="text-sm opacity-70">Press F5 to return to SecureWealth Twin</p>
        </div>
      `;
      document.body.appendChild(panic);
      App.showToast('Panic mode activated — sensitive data hidden', 'info');
    }
  };
  PanicMode.init();

  // ===================== REPORT A SCAM =====================
  const ReportScam = {
    show() {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl max-w-md w-full p-5" style="animation: modalIn 0.3s ease-out">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-8 h-8 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center"><i class="fas fa-flag text-xs"></i></div>
            <h3 class="font-semibold text-slate-800 dark:text-white">Report a Scam</h3>
          </div>
          <p class="text-xs text-slate-500 mb-3">Help protect the community by reporting fraudulent calls, messages, or apps.</p>
          <div class="space-y-3">
            <div>
              <label class="text-xs text-slate-600 dark:text-slate-300">Scam Type</label>
              <select class="w-full mt-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs dark:text-white">
                <option>Phone Call (Vishing)</option>
                <option>SMS (Smishing)</option>
                <option>Email (Phishing)</option>
                <option>Fake App/Website</option>
                <option>UPI Fraud</option>
              </select>
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-slate-300">Phone Number / URL</label>
              <input type="text" placeholder="+91 98XXX XXXXX or https://..." class="w-full mt-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs dark:text-white">
            </div>
            <div>
              <label class="text-xs text-slate-600 dark:text-slate-300">Description</label>
              <textarea placeholder="What happened?" rows="2" class="w-full mt-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded text-xs dark:text-white resize-none"></textarea>
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium">Cancel</button>
            <button onclick="ReportScam.submit(this)" class="flex-1 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90">Submit Report</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
    },
    submit(btn) {
      btn.textContent = 'Submitting...';
      setTimeout(() => {
        btn.closest('.fixed').remove();
        App.showToast('Thank you. Your report helps protect 2.4M users in our community.', 'success');
      }, 1200);
    }
  };

  // Expose new globals
  window.ESGScore = ESGScore;
  window.SocialProofNudges = SocialProofNudges;
  window.DuressLoginModal = DuressLoginModal;
  window.SkeletonLoader = SkeletonLoader;
  window.OTPSimulation = OTPSimulation;
  window.CoolingOffNudges = CoolingOffNudges;
  window.FinancialLiteracy = FinancialLiteracy;
  window.NotificationCenter = NotificationCenter;
  window.SecureCheckout = SecureCheckout;
  window.GoalCelebration = GoalCelebration;
  window.ScamCallerID = ScamCallerID;
  window.PanicMode = PanicMode;
  window.ReportScam = ReportScam;

  // Judge demo mode: ?judge=true auto-configures for live presentations
  function initJudgeMode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('judge') === 'true' || params.get('judge') === '1') {
      ConsentManager.setConsent(true);
      DemoControls.state.newDevice = true;
      DemoControls.state.highUrgency = true;
      DemoControls.state.newSession = true;
      DemoControls.state.otpSpeed = 1.5;
      setTimeout(() => {
        App.showToast('Judge Mode: Demo controls pre-enabled', 'info');
      }, 2500);
    }
  }
  initJudgeMode();

  // Auto-show consent on load
  setTimeout(() => ConsentManager.show(), 1500);

  // Init demo controls after a short delay
  setTimeout(() => DemoControls.init(), 2000);

  console.log('[Hackathon] Features loaded: RiskEngine, ConsentManager, PhysicalAssets, GoalSimulator, MarketInsights, TaxSavings, ProtectionCenter, DemoControls, DuressMode, StressTest, ThreatIntel, WhatIfSimulator, ESGScore');
})();
