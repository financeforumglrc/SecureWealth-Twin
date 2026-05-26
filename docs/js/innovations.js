/**
 * ═══════════════════════════════════════════════════════════════
 *  INNOVATIONS.js — Integration Layer for All New Features
 * ═══════════════════════════════════════════════════════════════
 *
 *  This file integrates the 6 innovative modules into the existing
 *  SecureWealth Twin dashboard. It patches the App object to add
 *  new view handlers, sidebar items, and global utility functions.
 *
 *  New Modules:
 *  - TransactionSentinel: Cross-platform price comparison
 *  - BioOTP: Behavioral typing rhythm OTP protection
 *  - SalaryFortress: Auto-lock salary + payday fraud shield
 *  - SubTrackAI: Subscription tracking from messages
 *  - AccountAggregator: Multi-bank consolidated view
 *  - WealthGuardianID: 3-factor secure login
 */

(function() {
  'use strict';

  // Wait for App to be available
  function waitForApp(callback, retries) {
    retries = retries || 50;
    if (window.App && window.App.renderView) {
      callback();
    } else if (retries > 0) {
      setTimeout(function() { waitForApp(callback, retries - 1); }, 100);
    } else {
      console.warn('[Innovations] App not found after retries — features may not load');
    }
  }

  waitForApp(function() {
    console.log('[Innovations] Initializing all 6 innovative modules...');

    // Patch App.renderView to handle new views
    var originalRenderView = App.renderView.bind(App);
    App.renderView = function(view) {
      var container = document.getElementById('main-content');
      if (!container) return originalRenderView(view);

      switch (view) {
        case 'sentinel':
          renderSentinel(container);
          break;
        case 'guardian':
          renderGuardian(container);
          break;
        case 'bio-otp':
          renderBioOTP(container);
          break;
        case 'salary-shield':
          renderSalaryShield(container);
          break;
        case 'subtrack':
          renderSubTrack(container);
          break;
        case 'aggregator':
          renderAggregator(container);
          break;
        // Premium Features
        case 'wellness':
          renderWellnessScore(container);
          break;
        case 'green-wealth':
          renderGreenWealth(container);
          break;
        case 'autopilot':
          renderAutoPilot(container);
          break;
        case 'bank-compass':
          renderBankCompass(container);
          break;
        case 'fraudwalk':
          renderFraudWalk(container);
          break;
        case 'family-fort':
          renderFamilyFort(container);
          break;
        case 'digital-vault':
          renderDigitalVault(container);
          break;
        default:
          originalRenderView(view);
          return;
      }

      // Highlight active sidebar item
      document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
        if (item.dataset.view === view) item.classList.add('active');
      });
      document.getElementById('page-title').textContent = getViewTitle(view);
    };

    // Add new sidebar nav items
    addSidebarItems();

    console.log('[Innovations] All 6 modules integrated successfully.');
  });

  // ─── View Titles ─────────────────────────────────────────

  function getViewTitle(view) {
    var titles = {
      sentinel: 'Transaction Sentinel',
      guardian: 'Wealth Guardian ID',
      'bio-otp': 'BioOTP Shield',
      'salary-shield': 'Salary Fortress',
      subtrack: 'SubTrack AI',
      aggregator: 'Account Aggregator',
      // Premium
      wellness: 'Financial Wellness Score',
      'green-wealth': 'Green Wealth Index',
      autopilot: 'AutoPilot Rules',
      'bank-compass': 'BankCompass',
      fraudwalk: 'FraudWalk Simulator',
      'family-fort': 'FamilyFort',
      'digital-vault': 'Digital Vault'
    };
    return titles[view] || view;
  }

  // ─── Sidebar Items ───────────────────────────────────────

  function addSidebarItems() {
    var nav = document.querySelector('aside nav');
    if (!nav) return;

    // Check if already added
    if (document.querySelector('[data-view="sentinel"]')) return;

    // Insert divider
    var divider = document.createElement('div');
    divider.className = 'px-4 pt-4 pb-1';
    divider.innerHTML = '<span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Innovations</span>';
    nav.appendChild(divider);

    var newItems = [
      { view: 'sentinel', icon: 'fa-magnifying-glass-dollar', label: 'Transaction Sentinel', badge: 'NEW', badgeColor: 'accent' },
      { view: 'guardian', icon: 'fa-fingerprint', label: 'Wealth Guardian ID', badge: '3-FA', badgeColor: 'secondary' },
      { view: 'bio-otp', icon: 'fa-keyboard', label: 'BioOTP Shield', badge: 'AI', badgeColor: 'primary' },
      { view: 'salary-shield', icon: 'fa-vault', label: 'Salary Fortress', badge: 'AUTO', badgeColor: 'success' },
      { view: 'subtrack', icon: 'fa-magnifying-glass-chart', label: 'SubTrack AI', badge: 'SMS', badgeColor: 'warning' },
      { view: 'aggregator', icon: 'fa-building-columns', label: 'Account Aggregator', badge: 'AA', badgeColor: 'danger' }
    ];

    newItems.forEach(function(item) {
      var a = document.createElement('a');
      a.href = '#';
      a.dataset.view = item.view;
      a.className = 'nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors';
      a.innerHTML =
        '<i class="fas ' + item.icon + ' w-5"></i>' +
        '<span class="flex-1">' + item.label + '</span>' +
        '<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-' + item.badgeColor + '/10 text-' + item.badgeColor + ' font-bold">' + item.badge + '</span>';
      a.addEventListener('click', function(e) {
        e.preventDefault();
        App.renderView(item.view);
      });
      nav.appendChild(a);
    });

    // Premium features divider + items
    var premDivider = document.createElement('div');
    premDivider.className = 'px-4 pt-4 pb-1';
    premDivider.innerHTML = '<span class="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Premium</span>';
    nav.appendChild(premDivider);

    var premiumItems = [
      { view: 'wellness', icon: 'fa-heart-pulse', label: 'Wellness Score', badge: 'BANK', badgeColor: 'success' },
      { view: 'green-wealth', icon: 'fa-leaf', label: 'Green Wealth Index', badge: 'ESG', badgeColor: 'primary' },
      { view: 'autopilot', icon: 'fa-robot', label: 'AutoPilot Rules', badge: 'AI', badgeColor: 'secondary' },
      { view: 'bank-compass', icon: 'fa-compass', label: 'BankCompass', badge: 'SAVE', badgeColor: 'accent' },
      { view: 'fraudwalk', icon: 'fa-person-walking', label: 'FraudWalk Simulator', badge: 'DEMO', badgeColor: 'danger' },
      { view: 'family-fort', icon: 'fa-people-group', label: 'FamilyFort', badge: 'FAM', badgeColor: 'primary' },
      { view: 'digital-vault', icon: 'fa-vault', label: 'Digital Vault', badge: 'LOCK', badgeColor: 'warning' }
    ];

    premiumItems.forEach(function(item) {
      var a = document.createElement('a');
      a.href = '#';
      a.dataset.view = item.view;
      a.className = 'nav-item flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors';
      a.innerHTML =
        '<i class="fas ' + item.icon + ' w-5"></i>' +
        '<span class="flex-1">' + item.label + '</span>' +
        '<span class="text-[10px] px-1.5 py-0.5 rounded-full bg-' + item.badgeColor + '/10 text-' + item.badgeColor + ' font-bold">' + item.badge + '</span>';
      a.addEventListener('click', function(e) {
        e.preventDefault();
        App.renderView(item.view);
      });
      nav.appendChild(a);
    });
  }

  // ═══════════════════════════════════════════════════════
  //  VIEW RENDERERS
  // ═══════════════════════════════════════════════════════

  // ─── 1. Transaction Sentinel ────────────────────────────

  function renderSentinel(container) {
    var insights = TransactionSentinel.getInsights();

    var html = '<div class="space-y-6 animate-fade-in">';

    // Header
    html += '<div class="card p-6 gradient-dark text-white">';
    html += '<div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-magnifying-glass-dollar text-2xl"></i></div>';
    html += '<div><h2 class="text-xl font-bold">Transaction Sentinel AI</h2><p class="text-sm text-slate-300">Cross-Platform Price Guardian — Compare before you pay</p></div></div>';
    html += '</div>';

    // Stats cards
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">';
    html += statCard('Total Analyzed', (insights ? insights.totalTransactions : 0), 'transactions', 'fa-chart-bar', 'primary');
    html += statCard('Potential Savings', '₹' + (insights ? insights.totalPotentialSavings.toLocaleString() : 0), '', 'fa-piggy-bank', 'success');
    html += statCard('Savings Rate', (insights ? insights.savingsRate : 0) + '%', '', 'fa-percent', 'secondary');
    html += statCard('Top Platform', insights ? insights.topSavingPlatform || 'N/A' : 'N/A', '', 'fa-trophy', 'accent');
    html += '</div>';

    // Demo: Simulate a transaction comparison
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">🔍 Simulate a Transaction Check</h3>';
    html += '<div class="grid grid-cols-1 md:grid-cols-4 gap-3">';

    // Food delivery buttons
    html += simButton('food', 'Chicken Biryani (Full)', 349, 'Swiggy', '#fc8019');
    html += simButton('grocery', 'Amul Butter (500g)', 280, 'Blinkit', '#f7c600');
    html += simButton('food', 'Butter Chicken + Rice', 399, 'Zomato', '#e23744');
    html += simButton('shopping', 'Wireless Earbuds', 1699, 'Amazon', '#ff9900');

    html += '</div></div>';

    // Recent comparisons
    if (insights && insights.recentTransactions && insights.recentTransactions.length > 0) {
      html += '<div class="card p-6">';
      html += '<h3 class="font-semibold text-lg mb-4">📋 Recent Comparisons</h3>';
      html += '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b border-slate-200 dark:border-slate-700 text-left text-slate-500"><th class="pb-3">Date</th><th class="pb-3">Merchant</th><th class="pb-3">Amount</th><th class="pb-3">Cheapest</th><th class="pb-3">Savings</th></tr></thead><tbody>';
      insights.recentTransactions.forEach(function(t) {
        var date = new Date(t.timestamp).toLocaleDateString('en-IN');
        html += '<tr class="border-b border-slate-100 dark:border-slate-800">';
        html += '<td class="py-2 text-slate-500">' + date + '</td>';
        html += '<td class="py-2 font-medium">' + t.merchant + '</td>';
        html += '<td class="py-2">₹' + t.amount.toLocaleString() + '</td>';
        html += '<td class="py-2 text-success">' + t.cheapestPlatform + '</td>';
        html += '<td class="py-2 ' + (t.savings > 0 ? 'text-success' : 'text-slate-400') + '">' + (t.savings > 0 ? '₹' + t.savings : '—') + '</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div></div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  function simButton(category, item, amount, merchant, color) {
    return '<button onclick="window.runSentinelDemo(\'' + category + '\',\'' + item + '\',' + amount + ',\'' + merchant + '\')" ' +
      'class="p-4 rounded-xl border border-slate-200 hover:shadow-lg transition-all text-center group" ' +
      'style="border-left: 3px solid ' + color + '">' +
      '<p class="text-sm font-medium">' + item + '</p>' +
      '<p class="text-xs text-slate-400">₹' + amount + ' on ' + merchant + '</p>' +
      '<i class="fas fa-arrow-right text-slate-300 group-hover:text-primary mt-1"></i>' +
      '</button>';
  }

  window.runSentinelDemo = function(category, item, amount, merchant) {
    var result = TransactionSentinel.analyzeTransaction({
      amount: amount,
      merchant: merchant,
      category: category,
      item: item
    });

    if (!result.analyzed) {
      App.showToast(result.message, 'warning');
      return;
    }

    // Build comparison HTML and show as modal
    var html = '<div class="space-y-4">';
    html += '<div class="flex items-center gap-2 mb-2"><i class="fas fa-store text-slate-400"></i><span class="font-semibold">' + result.userPlatform.name + '</span><span class="text-slate-400">— ₹' + result.userPlatform.finalPrice + '</span></div>';

    html += '<div class="space-y-2">';
    result.comparison.forEach(function(p) {
      var isUser = p.isUserPlatform;
      var isCheapest = p.platform === result.cheapest.platform;
      html += '<div class="flex items-center justify-between p-3 rounded-lg ' + (isUser ? 'bg-primary/5 border border-primary/20' : 'bg-slate-50 dark:bg-slate-800') + '">';
      html += '<div class="flex items-center gap-2"><i class="fas ' + p.icon + '" style="color:' + p.color + '"></i><span class="font-medium text-sm">' + p.platform + '</span>';
      if (isCheapest) html += '<span class="text-[10px] bg-success/10 text-success px-1.5 rounded">CHEAPEST</span>';
      if (isUser) html += '<span class="text-[10px] bg-primary/10 text-primary px-1.5 rounded">YOU</span>';
      html += '</div>';
      html += '<div class="text-right"><p class="font-bold text-sm">₹' + p.finalPrice + '</p><p class="text-[10px] text-slate-400">' + p.deliveryTime + '</p></div>';
      html += '</div>';
    });
    html += '</div>';

    // Recommendation
    var rec = result.recommendation;
    html += '<div class="p-4 rounded-xl bg-' + rec.color + '/10 border border-' + rec.color + '/30">';
    html += '<div class="flex items-center gap-2"><i class="fas ' + rec.icon + ' text-' + rec.color + '"></i>';
    html += '<span class="font-semibold text-sm">' + rec.message + '</span></div>';
    if (rec.action) html += '<p class="text-xs text-slate-500 mt-1">💡 ' + rec.action + '</p>';
    html += '</div>';

    showModal('Transaction Sentinel Report', html);
  };

  // ─── 2. Wealth Guardian ID ──────────────────────────────

  function renderGuardian(container) {
    var status = WealthGuardianID.getSecurityStatus();

    var html = '<div class="space-y-6 animate-fade-in">';

    html += '<div class="card p-6 gradient-dark text-white">';
    html += '<div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-fingerprint text-2xl"></i></div>';
    html += '<div><h2 class="text-xl font-bold">Wealth Guardian ID</h2><p class="text-sm text-slate-300">3-Factor Authentication — ID + Password + Behavioral OTP</p></div></div>';
    html += '</div>';

    // Login section
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">🔐 Secure Login Simulation</h3>';
    html += '<div class="max-w-md space-y-4">';

    html += '<div><label class="block text-sm font-medium mb-1">Username</label>';
    html += '<input type="text" id="guardian-username" value="rahul.sharma" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"></div>';

    html += '<div><label class="block text-sm font-medium mb-1">Password</label>';
    html += '<input type="password" id="guardian-password" value="sw_demo_2026" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20"></div>';

    html += '<button onclick="window.guardianLogin()" class="w-full py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">';
    html += '<i class="fas fa-lock mr-2"></i>Login with Wealth Guardian ID</button>';

    html += '<p class="text-xs text-slate-400 text-center">Demo: username <b>rahul.sharma</b> · password <b>sw_demo_2026</b> · OTP <b>248163</b></p>';
    html += '</div></div>';

    // Security status
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">🛡️ Security Status</h3>';
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">';
    html += statCard('Auth Method', status.authMethod, '', 'fa-shield-halved', 'primary');
    html += statCard('Known Devices', status.knownDevices, '', 'fa-laptop', 'secondary');
    html += statCard('Failed Today', status.failedAttemptsToday, '', 'fa-triangle-exclamation', status.failedAttemptsToday > 0 ? 'danger' : 'success');
    html += statCard('Status', status.isLoggedIn ? 'Secured' : 'Logged Out', '', 'fa-circle-check', status.isLoggedIn ? 'success' : 'warning');
    html += '</div></div>';

    // Card Payment OTP Simulation
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">💳 Credit Card Payment OTP Demo</h3>';
    html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-3">';
    html += cardPayButton(1499, 'Amazon', '4567');
    html += cardPayButton(5500, 'Flipkart', '8901');
    html += cardPayButton(75000, 'Jewelry Store', '1234');
    html += '</div></div>';

    html += '</div>';
    container.innerHTML = html;
  }

  function cardPayButton(amount, merchant, last4) {
    return '<button onclick="window.simCardPayment(' + amount + ',\'' + merchant + '\',\'' + last4 + '\')" ' +
      'class="p-4 rounded-xl border border-slate-200 hover:shadow-lg transition-all text-center">' +
      '<p class="font-semibold text-sm">₹' + amount.toLocaleString() + '</p>' +
      '<p class="text-xs text-slate-400">' + merchant + ' · Card **' + last4 + '</p>' +
      '<i class="fas fa-credit-card text-slate-300 mt-1"></i></button>';
  }

  window.guardianLogin = function() {
    var username = document.getElementById('guardian-username').value;
    var password = document.getElementById('guardian-password').value;
    var result = WealthGuardianID.attemptLogin(username, password);

    var html = '<div class="space-y-3">';
    if (result.success && result.requiresOTP) {
      html += '<div class="p-3 bg-warning/10 rounded-lg text-sm"><i class="fas fa-triangle-exclamation text-warning mr-2"></i>' + result.message + '</div>';
      html += '<div><label class="block text-sm font-medium mb-1">Enter OTP (demo: 248163)</label>';
      html += '<input type="text" id="modal-otp-input" maxlength="6" class="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm text-center text-lg tracking-widest" placeholder="******">';
      html += '</div>';
      html += '<button onclick="window.verifyGuardianOTP()" class="w-full py-2.5 bg-primary text-white rounded-lg font-semibold">Verify OTP</button>';
    } else if (result.success) {
      html += '<div class="p-3 bg-success/10 rounded-lg text-sm text-success"><i class="fas fa-check-circle mr-2"></i>' + result.message + '</div>';
    } else {
      html += '<div class="p-3 bg-danger/10 rounded-lg text-sm text-danger"><i class="fas fa-ban mr-2"></i>' + result.message + '</div>';
    }
    html += '</div>';

    showModal('Wealth Guardian ID — Login', html);
  };

  window.verifyGuardianOTP = function() {
    var otp = document.getElementById('modal-otp-input').value;
    var result = WealthGuardianID.verifyOTP(otp);

    var html = '<div class="space-y-3">';
    if (result.success) {
      html += '<div class="p-4 bg-success/10 rounded-lg"><i class="fas fa-check-circle text-success text-2xl mr-2"></i><span class="font-semibold">' + result.message + '</span></div>';
      if (result.bioOtpPassed) html += '<p class="text-xs text-slate-500">BioOTP typing pattern matched ✅</p>';
    } else {
      html += '<div class="p-4 bg-danger/10 rounded-lg"><i class="fas fa-ban text-danger text-2xl mr-2"></i><span class="font-semibold">' + result.message + '</span></div>';
    }
    html += '</div>';
    showModal('OTP Verification', html);
  };

  window.simCardPayment = function(amount, merchant, last4) {
    var result = WealthGuardianID.simulateCardPayment(amount, merchant, last4);

    var html = '<div class="space-y-4">';
    html += '<div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">';
    html += '<p class="text-lg font-bold">₹' + amount.toLocaleString() + '</p>';
    html += '<p class="text-sm text-slate-500">To: ' + merchant + ' · Card: ****' + last4 + '</p>';
    html += '</div>';

    html += '<div class="p-4 bg-primary/5 rounded-lg text-center">';
    html += '<p class="text-xs text-slate-400 mb-1">Your OTP</p>';
    html += '<p class="text-3xl font-mono font-bold text-primary tracking-[0.5em]">' + result.otpGenerated + '</p>';
    html += '<p class="text-xs text-slate-400 mt-1">Expires in 2 minutes</p>';
    html += '</div>';

    html += '<div class="p-3 bg-' + result.riskAssessment.decisionColor + '/10 rounded-lg">';
    html += '<p class="text-sm font-semibold">Risk: ' + result.riskAssessment.level.toUpperCase() + '</p>';
    html += '<p class="text-xs text-slate-500">' + result.message + '</p>';
    html += '</div>';

    if (result.requiresBioOTP) {
      html += '<div class="p-3 bg-secondary/10 rounded-lg text-xs"><i class="fas fa-keyboard mr-1"></i>BioOTP typing analysis will be applied for this high-value transaction</div>';
    }

    html += '</div>';
    showModal('Card Payment OTP Protection', html);
  };

  // ─── 3. BioOTP Shield ──────────────────────────────────

  function renderBioOTP(container) {
    var baseline = BioOTP.baseline;

    var html = '<div class="space-y-6 animate-fade-in">';
    html += '<div class="card p-6 gradient-dark text-white">';
    html += '<div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-keyboard text-2xl"></i></div>';
    html += '<div><h2 class="text-xl font-bold">BioOTP Shield</h2><p class="text-sm text-slate-300">Behavioral Biometric OTP — Your typing is your password</p></div></div>';
    html += '</div>';

    // Baseline info
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">🧬 Your Typing Baseline</h3>';
    html += '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">';
    html += statCard('Avg Key Hold', baseline.averageKeyHold.toFixed(0) + 'ms', '', 'fa-clock', 'primary');
    html += statCard('Avg Key Gap', baseline.averageKeyGap.toFixed(0) + 'ms', '', 'fa-arrow-right', 'secondary');
    html += statCard('Samples Collected', baseline.sampleCount, '', 'fa-database', 'accent');
    html += '</div>';
    html += '<p class="text-xs text-slate-400 mt-4">Your typing rhythm is as unique as a fingerprint. BioOTP learns your pattern over time.</p>';
    html += '</div>';

    // Demo OTP simulator
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">⌨️ BioOTP Simulator</h3>';
    html += '<div class="text-center p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">';
    html += '<p class="text-xs text-slate-400 mb-2">Simulated OTP Code</p>';
    html += '<p class="text-4xl font-mono font-bold text-primary tracking-[0.5em] mb-4" id="biootp-code">' + BioOTP.generateOTP() + '</p>';
    html += '<p class="text-xs text-slate-400 mb-6">Type this code into the box below. We\'ll analyze your typing rhythm.</p>';

    html += '<div class="flex justify-center gap-3 mb-4">';
    for (var i = 0; i < 6; i++) {
      html += '<input type="text" maxlength="1" class="biootp-input w-12 h-14 text-center text-xl font-mono font-bold border border-slate-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20" data-index="' + i + '">';
    }
    html += '</div>';

    html += '<button onclick="window.runBioOTPDemo()" class="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">Analyze My Typing</button>';
    html += '</div></div>';

    html += '</div>';
    container.innerHTML = html;
  }

  window.runBioOTPDemo = function() {
    BioOTP.resetSession();
    var inputs = document.querySelectorAll('.biootp-input');
    var code = '';
    inputs.forEach(function(inp) { code += inp.value; });

    // Simulate keystroke timings
    var now = Date.now();
    for (var i = 0; i < code.length; i++) {
      var downTime = now + i * (150 + Math.random() * 100);
      var upTime = downTime + (70 + Math.random() * 80);
      BioOTP.recordKeystroke(code[i], downTime, upTime);
    }

    var result = BioOTP.analyzeEntry();

    var html = '<div class="space-y-4">';
    html += '<div class="text-center p-4 rounded-xl bg-' + result.verdictColor + '/10">';
    html += '<i class="fas ' + result.verdictIcon + ' text-' + result.verdictColor + ' text-3xl mb-2"></i>';
    html += '<p class="text-lg font-bold text-' + result.verdictColor + '">' + result.verdict + '</p>';
    html += '<p class="text-sm text-slate-500 mt-1">Risk Score: ' + result.score + '/100</p>';
    html += '</div>';

    html += '<div class="space-y-2">';
    result.signals.forEach(function(s) {
      html += '<div class="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800">';
      html += '<span class="text-sm">' + s.label + '</span>';
      html += '<span class="text-xs px-2 py-0.5 rounded-full bg-' + s.status + '/10 text-' + s.status + ' font-medium">' + s.message + '</span>';
      html += '</div>';
    });
    html += '</div>';

    html += '<div class="text-xs text-slate-400">';
    html += 'Total time: ' + result.metrics.totalTime + 'ms | ';
    html += 'Avg hold: ' + result.metrics.averageHold.toFixed(0) + 'ms | ';
    html += 'Baseline samples: ' + result.metrics.baselineSamples;
    html += '</div>';

    html += '</div>';
    showModal('BioOTP Analysis Results', html);
  };

  // ─── 4. Salary Fortress ────────────────────────────────

  function renderSalaryShield(container) {
    var status = SalaryFortress.getStatus();

    var html = '<div class="space-y-6 animate-fade-in">';
    html += '<div class="card p-6 gradient-dark text-white">';
    html += '<div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-vault text-2xl"></i></div>';
    html += '<div><h2 class="text-xl font-bold">Salary Fortress</h2><p class="text-sm text-slate-300">Auto-lock salary · Payday fraud shield · 50/30/20 allocation</p></div></div>';
    html += '</div>';

    // Status cards
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">';
    html += statCard('Fortress Balance', '₹' + status.fortressBalance.toLocaleString(), '', 'fa-shield-halved', 'primary');
    html += statCard('Last Salary', status.lastSalaryDate || 'N/A', '₹' + (status.lastSalaryAmount ? status.lastSalaryAmount.toLocaleString() : '0'), 'fa-money-bill-wave', 'secondary');
    html += statCard('Payday Window', status.isPaydayWindow ? 'ACTIVE 🔴' : 'Inactive 🟢', '', 'fa-clock', status.isPaydayWindow ? 'danger' : 'success');
    html += statCard('Auto-Lock', status.autoLockPercent + '%', '', 'fa-lock', 'accent');
    html += '</div>';

    // Simulate salary credit
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">💰 Simulate Salary Credit</h3>';
    html += '<button onclick="window.simSalary()" class="px-6 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90">';
    html += '<i class="fas fa-money-bill-wave mr-2"></i>Credit Salary (₹' + (status.expectedSalary || 125000).toLocaleString() + ')</button>';
    html += '</div>';

    // Allocation breakdown
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">📊 50/30/20 Allocation Rule</h3>';
    html += '<div class="grid grid-cols-3 gap-4 text-center">';
    html += '<div class="p-4 bg-primary/5 rounded-xl"><p class="text-2xl font-bold text-primary">' + status.allocation.essentials + '%</p><p class="text-xs text-slate-500">Essentials</p></div>';
    html += '<div class="p-4 bg-warning/5 rounded-xl"><p class="text-2xl font-bold text-warning">' + status.allocation.discretionary + '%</p><p class="text-xs text-slate-500">Discretionary</p></div>';
    html += '<div class="p-4 bg-success/5 rounded-xl"><p class="text-2xl font-bold text-success">' + status.allocation.savings + '%</p><p class="text-xs text-slate-500">Savings</p></div>';
    html += '</div></div>';

    // Salary history
    if (status.salaryHistory && status.salaryHistory.length > 0) {
      html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">📅 Salary History</h3>';
      html += '<div class="space-y-2">';
      status.salaryHistory.slice().reverse().forEach(function(s) {
        var d = new Date(s.date);
        html += '<div class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">';
        html += '<span class="text-sm">' + d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) + '</span>';
        html += '<span class="text-xs text-slate-400">' + s.dayOfWeek + '</span>';
        html += '<span class="font-bold">₹' + s.amount.toLocaleString() + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  window.simSalary = function() {
    var result = SalaryFortress.simulateSalaryCredit();
    var html = '<div class="space-y-4">';
    html += '<div class="p-4 bg-success/10 rounded-lg"><i class="fas fa-check-circle text-success text-2xl mr-2"></i><span class="font-semibold">' + result.message + '</span></div>';
    html += '<div class="grid grid-cols-3 gap-3 text-center">';
    html += '<div class="p-3 bg-slate-50 rounded-lg"><p class="text-xs text-slate-400">Fortress Locked</p><p class="font-bold text-primary">₹' + result.fortressLocked.toLocaleString() + '</p></div>';
    html += '<div class="p-3 bg-slate-50 rounded-lg"><p class="text-xs text-slate-400">Unlocks At</p><p class="font-bold">' + result.fortressUnlockDate + '</p></div>';
    html += '<div class="p-3 bg-slate-50 rounded-lg"><p class="text-xs text-slate-400">Payday Shield</p><p class="font-bold text-warning">ACTIVE 48h</p></div>';
    html += '</div>';
    html += '</div>';
    showModal('Salary Fortress — Credit Received', html);
    setTimeout(function() { App.renderView('salary-shield'); }, 1500);
  };

  // ─── 5. SubTrack AI ────────────────────────────────────

  function renderSubTrack(container) {
    var insights = SubTrackAI.getInsights();
    var calendar = SubTrackAI.getCalendarView();

    var html = '<div class="space-y-6 animate-fade-in">';
    html += '<div class="card p-6 gradient-dark text-white">';
    html += '<div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-magnifying-glass-chart text-2xl"></i></div>';
    html += '<div><h2 class="text-xl font-bold">SubTrack AI</h2><p class="text-sm text-slate-300">Auto-detect subscriptions from SMS · Ghost detection · Cancellation coach</p></div></div>';
    html += '</div>';

    // Summary stats
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">';
    html += statCard('Active Subs', insights.totalSubscriptions, '', 'fa-rotate', 'primary');
    html += statCard('Monthly Spend', '₹' + (insights.totalMonthlySpend || 0).toLocaleString(), '', 'fa-indian-rupee-sign', 'secondary');
    html += statCard('Yearly Cost', '₹' + (insights.totalYearlyProjection || 0).toLocaleString(), '', 'fa-calendar', 'accent');
    html += statCard('Ghost Subs', insights.ghostSubscriptions.length, '₹' + (insights.ghostMonthlyWaste || 0).toLocaleString() + '/mo waste', 'fa-ghost', 'danger');
    html += '</div>';

    // Ghost alerts
    if (insights.ghostSubscriptions.length > 0) {
      html += '<div class="card p-6 border-l-4 border-danger">';
      html += '<h3 class="font-semibold text-lg mb-3">👻 Ghost Subscriptions Detected</h3>';
      html += '<p class="text-sm text-slate-500 mb-4">You rarely use these services but they drain ₹' + (insights.ghostMonthlyWaste || 0).toLocaleString() + '/month!</p>';
      insights.ghostSubscriptions.forEach(function(sub) {
        html += '<div class="flex items-center justify-between p-3 bg-danger/5 rounded-lg mb-2">';
        html += '<div class="flex items-center gap-2"><i class="fas ' + (sub.merchantInfo ? sub.merchantInfo.icon : 'fa-circle') + '" style="color:' + (sub.merchantInfo ? sub.merchantInfo.color : '#999') + '"></i>';
        html += '<span class="font-medium text-sm">' + (sub.merchantName || 'Unknown') + '</span></div>';
        html += '<div class="text-right"><p class="font-bold text-sm">₹' + (sub.amount || 0).toLocaleString() + '/' + (sub.frequency || 'mo') + '</p>';
        html += '<p class="text-[10px] text-slate-400">Usage: ' + sub.usageScore + '%</p></div>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Subscription list
    html += '<div class="card p-6">';
    html += '<h3 class="font-semibold text-lg mb-4">📋 All Subscriptions</h3>';
    html += '<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b text-left text-slate-500"><th class="pb-3">Service</th><th class="pb-3">Category</th><th class="pb-3">Amount</th><th class="pb-3">Next Renewal</th><th class="pb-3">Usage</th></tr></thead><tbody>';
    (insights.allSubscriptions || []).forEach(function(sub) {
      var renewal = new Date(sub.nextRenewal);
      var daysLeft = Math.ceil((renewal - new Date()) / 86400000);
      html += '<tr class="border-b border-slate-100 dark:border-slate-800">';
      html += '<td class="py-2 font-medium"><i class="fas ' + (sub.merchantInfo ? sub.merchantInfo.icon : 'fa-circle') + ' mr-2" style="color:' + (sub.merchantInfo ? sub.merchantInfo.color : '#999') + '"></i>' + (sub.merchantName || 'Unknown') + '</td>';
      html += '<td class="py-2 text-slate-500">' + (sub.merchantInfo ? sub.merchantInfo.category : 'Other') + '</td>';
      html += '<td class="py-2 font-semibold">₹' + (sub.amount || 0).toLocaleString() + '</td>';
      html += '<td class="py-2 ' + (daysLeft <= 7 ? 'text-danger' : 'text-slate-500') + '">' + renewal.toLocaleDateString('en-IN') + (daysLeft <= 7 ? ' ⚠️' : '') + '</td>';
      html += '<td class="py-2"><div class="w-16 h-1.5 bg-slate-200 rounded-full"><div class="h-full rounded-full" style="width:' + sub.usageScore + '%; background:' + (sub.merchantInfo ? sub.merchantInfo.color : '#999') + '"></div></div></td>';
      html += '</tr>';
    });
    html += '</tbody></table></div></div>';

    // Calendar preview
    html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">📅 Upcoming 7 Days</h3><div class="grid grid-cols-7 gap-2">';
    calendar.slice(0, 7).forEach(function(day) {
      var hasRenewal = day.renewals.length > 0;
      html += '<div class="p-2 rounded-lg text-center ' + (day.isToday ? 'bg-primary text-white' : hasRenewal ? 'bg-warning/10' : 'bg-slate-50 dark:bg-slate-800') + '">';
      html += '<p class="text-[10px] font-semibold">' + day.dayName + '</p>';
      html += '<p class="text-sm font-bold">' + day.dayOfMonth + '</p>';
      if (hasRenewal) html += '<p class="text-[10px] text-warning">₹' + day.totalAmount.toLocaleString() + '</p>';
      html += '</div>';
    });
    html += '</div></div>';

    html += '</div>';
    container.innerHTML = html;
  };

  // ─── 6. Account Aggregator ─────────────────────────────

  function renderAggregator(container) {
    var view = AccountAggregator.getConsolidatedView();

    var html = '<div class="space-y-6 animate-fade-in">';
    html += '<div class="card p-6 gradient-dark text-white">';
    html += '<div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-building-columns text-2xl"></i></div>';
    html += '<div><h2 class="text-xl font-bold">Account Aggregator Hub</h2><p class="text-sm text-slate-300">Multi-bank consolidated view via AA framework</p></div></div>';
    html += '</div>';

    // Totals
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">';
    html += statCard('Total Balance', '₹' + view.totalBalance.toLocaleString(), '', 'fa-wallet', 'primary');
    html += statCard('Linked Banks', view.linkedBanks, '', 'fa-building-columns', 'secondary');
    html += statCard('Active Consents', view.activeConsents, '', 'fa-file-signature', 'success');
    html += statCard('Spending Power', view.spendingPower + '/100', '', 'fa-bolt', 'accent');
    html += '</div>';

    // Bank cards
    html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-4">';
    view.bankWise.forEach(function(bank) {
      html += '<div class="card p-5" style="border-top: 3px solid ' + (AccountAggregator.availableBanks.find(function(b) { return b.id === bank.bankId; }) || { color: '#999' }).color + '">';
      html += '<div class="flex items-center justify-between mb-3">';
      html += '<span class="font-semibold">' + bank.bankName + '</span>';
      html += '<span class="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">' + bank.type + '</span>';
      html += '</div>';
      html += '<p class="text-2xl font-bold">₹' + bank.balance.toLocaleString() + '</p>';
      html += '<div class="flex justify-between mt-2 text-xs text-slate-400">';
      html += '<span>' + bank.accountNumber + '</span><span>Interest: ' + bank.interestRate + '%</span>';
      html += '</div>';
      html += '<p class="text-[10px] text-slate-400 mt-2">Annual Interest: ₹' + (bank.annualInterest || 0).toLocaleString() + '</p>';
      html += '</div>';
    });
    html += '</div>';

    // Recommendations
    if (view.recommendations.length > 0) {
      html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">💡 Smart Recommendations</h3>';
      view.recommendations.forEach(function(rec) {
        html += '<div class="p-4 mb-3 rounded-lg bg-' + rec.priority + '/5 border border-' + rec.priority + '/20">';
        html += '<div class="flex items-center gap-2 mb-1"><span class="text-[10px] px-2 py-0.5 rounded-full bg-' + rec.priority + '/10 text-' + rec.priority + ' font-bold">' + rec.priority.toUpperCase() + '</span><span class="font-semibold text-sm">' + rec.title + '</span></div>';
        html += '<p class="text-sm text-slate-500">' + rec.description + '</p>';
        html += '<p class="text-xs text-success mt-1">💰 ' + rec.potentialBenefit + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Link new bank button
    html += '<div class="card p-6 text-center">';
    html += '<p class="text-sm text-slate-500 mb-3">Link more accounts via Account Aggregator framework</p>';
    html += '<div class="flex flex-wrap justify-center gap-2">';
    AccountAggregator.availableBanks.slice(0, 4).forEach(function(bank) {
      html += '<button onclick="window.linkBank(\'' + bank.id + '\')" class="px-4 py-2 rounded-lg border border-slate-200 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">';
      html += '<i class="fas fa-plus text-xs mr-1"></i>' + bank.name + '</button>';
    });
    html += '</div></div>';

    html += '</div>';
    container.innerHTML = html;
  }

  window.linkBank = function(bankId) {
    var result = AccountAggregator.linkAccount(bankId);
    if (result.success) {
      App.showToast(result.message, 'success');
      setTimeout(function() { App.renderView('aggregator'); }, 500);
    } else {
      App.showToast(result.message, 'warning');
    }
  };

  // ─── Utility Functions ──────────────────────────────────

  function statCard(label, value, subtitle, icon, color) {
    var clr = color || 'primary';
    return '<div class="card p-5"><div class="flex items-center justify-between mb-3">' +
      '<span class="text-sm text-slate-500 font-medium">' + label + '</span>' +
      '<div class="w-8 h-8 rounded-lg bg-' + clr + '/10 flex items-center justify-center">' +
      '<i class="fas ' + icon + ' text-' + clr + ' text-sm"></i></div></div>' +
      '<p class="text-2xl font-bold text-slate-800">' + value + '</p>' +
      (subtitle ? '<p class="text-xs text-slate-400 mt-1">' + subtitle + '</p>' : '') +
      '</div>';
  }

  function showModal(title, bodyHtml) {
    var modal = document.getElementById('risk-modal');
    var content = document.getElementById('risk-analysis-content');
    if (!modal || !content) {
      alert(title + '\n\n' + bodyHtml.replace(/<[^>]*>/g, ''));
      return;
    }
    document.querySelector('#risk-modal h3').textContent = title;
    content.innerHTML = bodyHtml;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.getElementById('risk-modal-content').classList.add('scale-100', 'opacity-100');
  }

  window.closeRiskModal = function() {
    var modal = document.getElementById('risk-modal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
  };

})();

  // ═══════════════════════════════════════════════════════
  //  PREMIUM FEATURE RENDERERS
  // ═══════════════════════════════════════════════════════

  function renderWellnessScore(container) {
    var score = FinancialWellnessScore.calculate();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-heart-pulse text-2xl"></i></div><div><h2 class="text-xl font-bold">Financial Wellness Score</h2><p class="text-sm text-slate-300">12-Factor Bank-Grade Health Assessment</p></div></div></div>';
    html += '<div class="card p-6 text-center"><p class="text-sm text-slate-500 mb-2">Your Wellness Score</p><div class="text-6xl font-bold text-' + score.tierColor + ' mb-2">' + score.score + '</div><p class="text-lg font-semibold">' + score.tierEmoji + ' ' + score.tier + '</p><p class="text-xs text-slate-400">Out of ' + score.maxScore + ' · Top ' + (100 - score.peerPercentile) + '%</p></div>';
    html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">Factor Breakdown</h3>';
    score.breakdown.forEach(function(f) { var barColor = f.score >= 8 ? 'success' : f.score >= 5 ? 'warning' : 'danger'; html += '<div class="mb-3"><div class="flex justify-between text-xs mb-1"><span><i class="fas ' + f.icon + ' mr-1"></i>' + f.label + '</span><span class="font-bold">' + f.score + '/10</span></div><div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full"><div class="h-full bg-' + barColor + ' rounded-full" style="width:' + (f.score * 10) + '%"></div></div></div>'; });
    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderGreenWealth(container) {
    var green = GreenWealthIndex.calculate();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-leaf text-2xl"></i></div><div><h2 class="text-xl font-bold">Green Wealth Index</h2><p class="text-sm text-slate-300">ESG-Conscious Banking · Carbon Tracking</p></div></div></div>';
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' + statCard('Green Score', green.greenScore + '/100', green.level, 'fa-leaf', green.levelColor) + statCard('Yearly CO₂', green.yearlyCO2.toLocaleString() + ' kg', 'vs 7,000 kg avg', 'fa-cloud', 'warning') + statCard('Trees Needed', green.treesNeeded, 'to offset', 'fa-tree', 'success') + statCard('ESG Investments', green.esgInvestments.length, 'green funds', 'fa-chart-line', 'primary') + '</div>';
    html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">Green Investment Options</h3>';
    green.greenInvestmentsSuggested.forEach(function(inv) { html += '<div class="p-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex justify-between"><div><p class="font-semibold text-sm">' + inv.name + '</p><p class="text-xs text-slate-400">' + inv.type + '</p></div><div class="text-right"><p class="font-bold text-success">' + inv.returns + '%</p></div></div>'; });
    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderAutoPilot(container) {
    var status = AutoPilotEngine.getStatus();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-robot text-2xl"></i></div><div><h2 class="text-xl font-bold">AutoPilot Rules</h2><p class="text-sm text-slate-300">If-Then Financial Automation</p></div></div></div>';
    html += '<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">' + statCard('Active', status.activeCount, '/' + status.totalTemplates, 'fa-gear', 'primary') + statCard('Auto-Saved', '₹' + status.totalAutomatedSavings.toLocaleString(), '', 'fa-piggy-bank', 'success') + statCard('Templates', status.totalTemplates, 'available', 'fa-list', 'secondary') + '</div>';
    html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">Available Templates</h3>';
    status.inactiveTemplates.forEach(function(t) { html += '<div class="flex justify-between p-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-800"><div><p class="font-semibold text-sm"><i class="fas ' + t.icon + ' mr-2"></i>' + t.name + '</p><p class="text-xs text-slate-400">' + t.description + '</p></div><button onclick="AutoPilotEngine.activateRule(\'' + t.id + '\');setTimeout(function(){App.renderView(\'autopilot\')},300)" class="px-3 py-1 bg-primary text-white rounded-lg text-xs">Activate</button></div>'; });
    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderBankCompass(container) {
    var analysis = BankCompass.analyze();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-compass text-2xl"></i></div><div><h2 class="text-xl font-bold">BankCompass</h2><p class="text-sm text-slate-300">Compare banks · Save money</p></div></div></div>';
    html += '<div class="card p-6 bg-success/5 border border-success/20"><p class="text-lg font-bold text-success">' + analysis.topRecommendation + '</p><p class="text-xs text-slate-500">10-year benefit: ₹' + analysis.lifetimeBenefit.toLocaleString() + '</p></div>';
    html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">All Banks Compared</h3><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr class="border-b text-left text-slate-500"><th class="pb-3">Bank</th><th class="pb-3">Savings %</th><th class="pb-3">FD Rate</th><th class="pb-3">Digital</th><th class="pb-3">Yearly Benefit</th></tr></thead><tbody>';
    analysis.analysis.forEach(function(b) { html += '<tr class="border-b"><td class="py-2 font-medium">' + b.bank + '</td><td class="py-2">' + b.savingsRate + '%</td><td class="py-2">' + b.fdRate + '%</td><td class="py-2">' + b.digitalRating + '/5</td><td class="py-2 ' + (b.totalYearlyBenefit > 0 ? 'text-success' : 'text-danger') + '">₹' + b.totalYearlyBenefit.toLocaleString() + '</td></tr>'; });
    html += '</tbody></table></div></div></div>';
    container.innerHTML = html;
  }

  function renderFraudWalk(container) {
    var scenarios = FraudWalkSimulator.getScenarios();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-person-walking text-2xl"></i></div><div><h2 class="text-xl font-bold">FraudWalk Simulator</h2><p class="text-sm text-slate-300">See exactly how protection layers respond to threats</p></div></div></div>';
    scenarios.forEach(function(sc) { html += '<div class="card p-5 cursor-pointer hover:shadow-lg transition-shadow mb-3" onclick="window.runFraudWalkDemo(\'' + sc.id + '\')" style="border-left:4px solid var(--' + (sc.riskLevel === 'critical'||sc.riskLevel==='high'?'danger':'warning') + ')"><div class="flex items-center gap-3"><span class="text-2xl">' + sc.emoji + '</span><div class="flex-1"><h3 class="font-semibold">' + sc.title + '</h3><p class="text-xs text-slate-400">' + sc.description.slice(0,80) + '...</p></div><div class="text-right"><span class="text-xs px-2 py-0.5 rounded-full bg-' + (sc.riskLevel==='critical'?'danger':'warning') + '/10 text-' + (sc.riskLevel==='critical'?'danger':'warning') + '">' + sc.riskLevel.toUpperCase() + '</span><p class="text-sm font-bold text-success mt-1">' + sc.protectionScore + '%</p></div></div></div>'; });
    html += '</div>';
    container.innerHTML = html;
    window.runFraudWalkDemo = function(id) { var sc = FraudWalkSimulator.runScenario(id); if(!sc)return; var h='<div class="space-y-3"><h3 class="font-bold text-lg">'+sc.emoji+' '+sc.title+'</h3><p class="text-sm text-slate-500">'+sc.description+'</p>'; sc.steps.forEach(function(s){ h+='<div class="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800"><div class="w-8 h-8 rounded-full bg-'+s.color+'/10 flex items-center justify-center text-'+s.color+' font-bold text-xs">'+s.step+'</div><div><p class="font-semibold text-sm">'+s.title+' <span class="text-[10px] text-slate-400">('+s.time+')</span></p><p class="text-xs text-slate-500">'+s.description+'</p></div></div>'; }); h+='</div>'; showModal('FraudWalk: '+sc.title, h); };
  }

  function renderFamilyFort(container) {
    var family = FamilyFort.getFamilyOverview();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-people-group text-2xl"></i></div><div><h2 class="text-xl font-bold">FamilyFort</h2><p class="text-sm text-slate-300">Family Wealth · Permission Tiers · Elder Protection</p></div></div></div>';
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' + statCard('Members', family.totalMembers, '', 'fa-users', 'primary') + statCard('Family Income', '₹' + family.totalFamilyIncome.toLocaleString(), '/month', 'fa-money-bill-wave', 'secondary') + statCard('Family Wealth', '₹' + family.totalFamilyWealth.toLocaleString(), '', 'fa-gem', 'accent') + statCard('Accounts', family.totalLinkedAccounts, 'linked', 'fa-building-columns', 'success') + '</div>';
    html += '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
    family.members.forEach(function(m) { var rb = m.role==='admin'?'bg-primary/10 text-primary':m.role==='senior'?'bg-warning/10 text-warning':m.role==='child'?'bg-success/10 text-success':'bg-slate-100 text-slate-500'; html += '<div class="card p-5"><div class="flex items-center justify-between mb-3"><span class="font-semibold">'+m.name+'</span><span class="text-[10px] px-2 py-0.5 rounded-full '+rb+'">'+m.relation+'</span></div><p class="text-sm text-slate-500">Income: ₹'+(m.income||0).toLocaleString()+'/mo</p><p class="text-sm text-slate-500">Accounts: '+(m.linkedAccounts||0)+' linked</p>'+ (m.spendingLimit?'<p class="text-xs text-slate-400 mt-1">Limit: ₹'+m.spendingLimit.toLocaleString()+'</p>':'') + '</div>'; });
    html += '</div></div>';
    container.innerHTML = html;
  }

  function renderDigitalVault(container) {
    var vault = DigitalVault.getVaultSummary();
    var html = '<div class="space-y-6 animate-fade-in"><div class="card p-6 gradient-dark text-white"><div class="flex items-center gap-4"><div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center"><i class="fas fa-vault text-2xl"></i></div><div><h2 class="text-xl font-bold">Digital Vault</h2><p class="text-sm text-slate-300">Secure Documents · Nominees · Inheritance</p></div></div></div>';
    html += '<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">' + statCard('Documents', vault.totalDocuments, 'encrypted', 'fa-file-shield', 'primary') + statCard('Nominees', vault.totalNominees, 'designated', 'fa-user-check', 'secondary') + statCard('Estate', '₹' + (vault.totalEstateValue||0).toLocaleString(), '', 'fa-gem', 'accent') + statCard('Complete', vault.completenessScore + '%', vault.completenessScore>=70?'On track':'Needs items', 'fa-circle-check', vault.completenessScore>=70?'success':'warning') + '</div>';
    html += '<div class="card p-6"><h3 class="font-semibold text-lg mb-4">Documents</h3>';
    vault.documents.forEach(function(d) { html += '<div class="flex justify-between p-3 mb-2 rounded-lg bg-slate-50 dark:bg-slate-800"><div><p class="font-semibold text-sm"><i class="fas fa-lock text-success mr-2"></i>'+d.name+'</p><p class="text-xs text-slate-400">'+d.type+' · '+d.provider+'</p></div><span class="text-xs">₹'+(d.value||0).toLocaleString()+'</span></div>'; });
    html += '</div></div>';
    container.innerHTML = html;
  }