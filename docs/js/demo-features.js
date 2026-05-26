/**
 * ═══════════════════════════════════════════════════════════════════
 *  DEMO FEATURES — Salary, Credit Card, Food Comparison,
 *  Subscription Manager, Cult Fit Location, Innovation Showcase
 *  ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // Safe clipboard helper (works in non-HTTPS / Capacitor WebView)
  window.copyTextSafe = function(text, toastMsg) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      if (App && App.showToast) App.showToast(toastMsg || 'Copied!', 'info');
    } catch (e) {
      if (App && App.showToast) App.showToast('Press Ctrl+C to copy', 'info');
    }
  };

  const C = n => {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  };

  // ═══════════════════════════════════════════════════════════════
  //  1. ADD SALARY MODAL
  // ═══════════════════════════════════════════════════════════════

  window.showAddSalaryModal = function() {
    var modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
    modal.innerHTML = '<div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6" onclick="event.stopPropagation()">' +
      '<div class="flex items-center justify-between mb-5"><h3 class="text-lg font-bold"><i class="fas fa-sack-dollar mr-2 text-emerald-500"></i>Add Salary</h3><button onclick="this.closest(\'.fixed\').remove()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button></div>' +
      '<div class="space-y-4">' +
      '<div><label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">Monthly Salary (₹)</label><input type="number" id="salary-amount" placeholder="e.g. 125000" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500"></div>' +
      '<div><label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">Type</label><select id="salary-type" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm"><option value="recurring">Recurring (monthly)</option><option value="bonus">One-time bonus</option><option value="freelance">Freelance income</option></select></div>' +
      '<div><label class="text-xs font-semibold text-slate-500 uppercase mb-1 block">Description</label><input type="text" id="salary-desc" placeholder="e.g. May salary" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:border-emerald-500"></div>' +
      '<button onclick="window.addSalary()" class="w-full py-3 rounded-xl font-semibold text-sm text-white shadow-lg" style="background:linear-gradient(135deg,#0B1D3A,#132D52);"><i class="fas fa-plus mr-2"></i>Add Salary</button></div></div>';
    document.body.appendChild(modal);
    setTimeout(function() { var el = document.getElementById('salary-amount'); if (el) el.focus(); }, 100);
  };

  window.addSalary = function() {
    var amount = parseInt(document.getElementById('salary-amount')?.value || 0);
    var type = document.getElementById('salary-type')?.value || 'recurring';
    var desc = document.getElementById('salary-desc')?.value || type;
    if (!amount || amount < 1000) { App.showToast('Please enter a valid salary (min ₹1,000)', 'warning'); return; }
    var salaries = JSON.parse(localStorage.getItem('sw_salaries') || '[]');
    salaries.unshift({ amount: amount, type: type, desc: desc, date: new Date().toISOString() });
    if (salaries.length > 20) salaries.pop();
    localStorage.setItem('sw_salaries', JSON.stringify(salaries));
    var existing = parseFloat(localStorage.getItem('sw_monthly_income') || '0');
    localStorage.setItem('sw_monthly_income', type === 'recurring' ? amount : existing + amount);
    var modal = document.querySelector('.fixed.inset-0.bg-black\\/50');
    if (modal) modal.remove();
    App.showToast('💰 Salary of ' + C(amount) + ' added. Savings plan updated.', 'success');
    if (App.currentView === 'dashboard') App.renderView('dashboard');
  };

  // ═══════════════════════════════════════════════════════════════
  //  2. DEMO CREDIT CARD
  // ═══════════════════════════════════════════════════════════════

  function renderCreditCard(container) {
    container.innerHTML = '<div class="space-y-6 pb-8 fb-animate-in">' +
      '<div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold text-slate-800 dark:text-white">💳 Demo Credit Card</h2><p class="text-sm text-slate-500 mt-1">Virtual card for hackathon — no real transactions</p></div><span class="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 text-xs font-semibold rounded-full"><i class="fas fa-flask mr-1.5"></i>Demo Mode</span></div>' +
      '<div class="flex justify-center"><div class="w-full max-w-md h-56 rounded-2xl shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden" style="background:linear-gradient(135deg,#0B1D3A 0%,#132D52 40%,#1A3A66 100%);">' +
      '<div class="flex items-center justify-between"><div class="w-12 h-9 rounded-md" style="background:linear-gradient(135deg,#C4A962,#D4BD7C);"></div><i class="fas fa-wifi text-white/30 text-xl" style="transform:rotate(90deg);"></i></div>' +
      '<div class="space-y-1"><p class="text-white/60 text-[10px] uppercase tracking-widest">Card Number</p><p class="text-white font-mono text-xl tracking-wider">4111 1111 1111 1111</p></div>' +
      '<div class="flex gap-8"><div><p class="text-white/60 text-[10px] uppercase tracking-widest">Expiry</p><p class="text-white font-mono text-sm">12/28</p></div><div class="flex-1"><p class="text-white/60 text-[10px] uppercase tracking-widest">Cardholder</p><p class="text-white font-mono text-sm">RAHUL SHARMA</p></div><div class="w-16 h-10 rounded-md flex items-center justify-center" style="background:linear-gradient(135deg,#C4A962,#D4BD7C);"><span class="text-xs font-bold" style="color:#0B1D3A;">VISA</span></div></div></div></div>' +
      '<div class="fb-card p-5"><h3 class="text-sm font-semibold mb-4"><i class="fas fa-credit-card mr-2"></i>Card Details</h3>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">' +
      '<div><span class="text-xs text-slate-400 block mb-1">Card Number</span><span class="font-mono font-semibold">4111 1111 1111 1111</span></div>' +
      '<div><span class="text-xs text-slate-400 block mb-1">Expiry</span><span class="font-semibold">12/28</span></div>' +
      '<div><span class="text-xs text-slate-400 block mb-1">CVV</span><span class="font-mono font-semibold" id="cvv-display">•••</span><button onclick="var e=document.getElementById(\'cvv-display\');e.textContent=e.textContent===\'•••\'?\'123\':\'•••\'" class="ml-2 text-xs text-blue-600 hover:underline">Show/Hide</button></div>' +
      '<div><span class="text-xs text-slate-400 block mb-1">Card Type</span><span class="font-semibold">Visa Signature</span></div></div>' +
      '<div class="mt-4 flex gap-2"><button onclick="copyTextSafe(\'4111111111111111\',\'Card number copied (demo)\')" class="fb-btn fb-btn-outline fb-btn-sm"><i class="fas fa-copy mr-1.5"></i>Copy Number</button>' +
      '<button onclick="App.showToast(\'⚠️ Demo — no actual charges\',\'warning\')" class="fb-btn fb-btn-sm" style="background:#C4A962;color:#0B1D3A;"><i class="fas fa-exclamation-triangle mr-1.5"></i>Test Payment</button></div></div>' +
      '<div class="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 rounded-xl text-xs text-amber-700 dark:text-amber-300"><i class="fas fa-info-circle mr-1.5"></i><b>Disclaimer:</b> Demo card for hackathon. No actual charges.</div></div>';
  }

  // ═══════════════════════════════════════════════════════════════
  //  3. FOOD DELIVERY COMPARISON
  // ═══════════════════════════════════════════════════════════════

  var FoodComparison = {
    data: [
      { platform: 'Swiggy', orders: 14, total: 4850, avgOrder: 346, color: '#FC8019', icon: 'fa-utensils' },
      { platform: 'Zomato', orders: 11, total: 3580, avgOrder: 325, color: '#E23744', icon: 'fa-burger' },
      { platform: 'Zepto', orders: 8, total: 1920, avgOrder: 240, color: '#6C2BD9', icon: 'fa-bolt' },
      { platform: 'Blinkit', orders: 5, total: 1100, avgOrder: 220, color: '#F7C948', icon: 'fa-basket-shopping' }
    ],
    getSavings: function() {
      var diff = this.data[0].avgOrder - this.data[1].avgOrder;
      return { diff: diff, annualSaving: diff * 7 * 12, recommendation: diff > 0 ? 'You spend ₹' + diff + ' more per order on Swiggy vs Zomato. Switching 50% of orders could save ~₹' + Math.round(diff * 7 * 12).toLocaleString() + '/year.' : 'Spending is balanced across platforms.' };
    }
  };

  function renderFoodComparison(container) {
    var savings = FoodComparison.getSavings();
    var totalAll = FoodComparison.data.reduce(function(s, d) { return s + d.total; }, 0);
    var cards = '', bars = '';
    FoodComparison.data.forEach(function(d) {
      var pct = Math.round((d.total / totalAll) * 100);
      cards += '<div class="fb-stat-card" style="border-left:3px solid ' + d.color + ';">' +
        '<div class="stat-header"><span class="stat-label">' + d.platform + '</span><span class="stat-icon" style="background:' + d.color + '15;color:' + d.color + ';"><i class="fas ' + d.icon + '"></i></span></div>' +
        '<p class="stat-value" style="font-size:1.2rem;">' + C(d.total) + '</p>' +
        '<div class="flex justify-between text-xs mt-1"><span class="text-slate-400">' + d.orders + ' orders</span><span>Avg: ' + C(d.avgOrder) + '</span></div></div>';
      bars += '<div><div class="flex justify-between text-xs mb-1"><span class="font-medium">' + d.platform + '</span><span>' + C(d.total) + ' (' + pct + '%)</span></div>' +
        '<div class="fb-progress"><div class="fb-progress-fill" style="width:' + pct + '%;background:' + d.color + ';"></div></div></div>';
    });
    container.innerHTML = '<div class="space-y-6 pb-8 fb-animate-in">' +
      '<div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold text-slate-800 dark:text-white">🍔 Food Delivery Analysis</h2><p class="text-sm text-slate-500 mt-1">AI comparison across Swiggy, Zomato, Zepto & Blinkit</p></div><span class="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/20 text-orange-700 text-xs font-semibold rounded-full"><i class="fas fa-chart-bar mr-1.5"></i>This Month</span></div>' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">' + cards + '</div>' +
      '<div class="fb-card p-5"><h3 class="text-sm font-semibold mb-4">Spending by Platform</h3><div class="space-y-3">' + bars + '</div></div>' +
      '<div class="fb-card p-5 border-l-4 border-amber-400"><h3 class="text-sm font-semibold mb-2"><i class="fas fa-robot text-amber-500 mr-2"></i>AI Recommendation</h3><p class="text-sm text-slate-600 dark:text-slate-300">' + savings.recommendation + '</p>' +
      '<div class="mt-3 p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg text-xs text-emerald-700 dark:text-emerald-300"><i class="fas fa-piggy-bank mr-1.5"></i><b>Potential annual saving:</b> ~₹' + savings.annualSaving.toLocaleString() + '</div></div></div>';
  }

  // ═══════════════════════════════════════════════════════════════
  //  4. SUBSCRIPTION MANAGER + CULT FIT LOCATION
  // ═══════════════════════════════════════════════════════════════

  var SubscriptionManager = {
    subscriptions: [],
    init: function() {
      try { this.subscriptions = JSON.parse(localStorage.getItem('sw_subscriptions') || '[]'); } catch(e) { this.subscriptions = []; }
      if (this.subscriptions.length === 0) this._loadDefaults();
    },
    _loadDefaults: function() {
      this.subscriptions = [
        { id: 'sub_1', name: 'Netflix', icon: 'fa-tv', category: 'Entertainment', amount: 649, lastUsed: Date.now() - 432000000, usageFreq: 'Frequent', unusedDays: 5, color: '#E50914' },
        { id: 'sub_2', name: 'Cult Fit', icon: 'fa-dumbbell', category: 'Fitness', amount: 2499, lastUsed: Date.now() - 1814400000, usageFreq: 'Low', unusedDays: 21, color: '#FF6B35', gymLocation: 'Andheri Sports Complex, Mumbai', gymLat: 19.1136, gymLng: 72.8697 },
        { id: 'sub_3', name: 'Spotify', icon: 'fa-music', category: 'Music', amount: 119, lastUsed: Date.now() - 86400000, usageFreq: 'Daily', unusedDays: 1, color: '#1DB954' },
        { id: 'sub_4', name: 'Hotstar', icon: 'fa-film', category: 'Entertainment', amount: 299, lastUsed: Date.now() - 3888000000, usageFreq: 'Very Low', unusedDays: 45, color: '#1F80E0' },
        { id: 'sub_5', name: 'Amazon Prime', icon: 'fa-box', category: 'Shopping', amount: 1499, lastUsed: Date.now() - 259200000, usageFreq: 'Medium', unusedDays: 3, color: '#FF9900' }
      ];
      this.save();
    },
    save: function() { localStorage.setItem('sw_subscriptions', JSON.stringify(this.subscriptions)); },
    getAll: function() { return this.subscriptions; },
    cancel: function(id) { this.subscriptions = this.subscriptions.filter(function(s) { return s.id !== id; }); this.save(); },
    getWaste: function() {
      var totalWaste = 0, warnings = [], self = this;
      self.subscriptions.forEach(function(s) { if (s.unusedDays > 14) { totalWaste += s.amount; warnings.push({ name: s.name, amount: s.amount, unusedDays: s.unusedDays }); } });
      return { totalMonthlyWaste: totalWaste, annualWaste: totalWaste * 12, warnings: warnings };
    }
  };
  SubscriptionManager.init();

  function renderSubscriptionManager(container) {
    var subs = SubscriptionManager.getAll(), waste = SubscriptionManager.getWaste();
    var totalMonthly = subs.reduce(function(s, sub) { return s + sub.amount; }, 0);
    var subCards = '';
    subs.forEach(function(s) {
      subCards += '<div class="fb-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ' + (s.unusedDays > 14 ? 'border-l-4 border-red-400' : '') + '">' +
        '<div class="flex items-center gap-4"><div class="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg" style="background:' + s.color + ';"><i class="fas ' + s.icon + '"></i></div>' +
        '<div><p class="font-semibold text-sm">' + s.name + (s.unusedDays > 14 ? ' <span class="px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full text-[10px] font-bold">UNUSED</span>' : '') + '</p><p class="text-xs text-slate-500">' + s.category + ' · Last used ' + s.unusedDays + ' day(s) ago</p></div></div>' +
        '<div class="flex items-center gap-3"><div class="text-right"><p class="font-bold text-sm">₹' + s.amount + '/mo</p><p class="text-[10px] text-slate-400">' + (s.unusedDays > 14 ? '<span class="text-red-500">Wasting ₹' + (s.amount * 12) + '/yr</span>' : 'Active') + '</p></div>' +
        (s.name === 'Cult Fit' ? '<button onclick="window.checkCultFitLocation()" class="fb-btn fb-btn-outline fb-btn-sm" style="border-color:#FF6B35;color:#FF6B35;"><i class="fas fa-location-dot mr-1"></i>Check Gym</button>' : '') +
        '<button onclick="SubscriptionManager.cancel(\'' + s.id + '\');App.showToast(\'' + s.name + ' cancelled (simulated)\',\'info\');App.renderView(\'subscriptions\')" class="fb-btn fb-btn-sm text-red-500" style="background:transparent;border:1px solid #FECACA;"><i class="fas fa-ban mr-1"></i>Cancel</button></div></div>';
    });
    var wasteHtml = '';
    if (waste.warnings.length > 0) {
      wasteHtml = '<div class="fb-card p-5 border-l-4 border-red-400 bg-red-50/50 dark:bg-red-900/5"><h3 class="text-sm font-semibold mb-3 text-red-600"><i class="fas fa-robot mr-2"></i>AI Subscription Audit</h3>';
      waste.warnings.forEach(function(w) { wasteHtml += '<div class="flex justify-between py-2 text-sm"><span>' + w.name + ' — unused ' + w.unusedDays + ' days</span><span class="font-bold text-red-500">₹' + w.amount + '/mo</span></div>'; });
      wasteHtml += '<div class="mt-3 pt-3 border-t border-red-200 dark:border-red-900 flex justify-between"><span class="font-semibold text-sm">Total annual waste</span><span class="font-bold text-red-600">₹' + waste.annualWaste.toLocaleString() + '/year</span></div>' +
        '<p class="text-xs text-slate-500 mt-2">Cancelling unused subs would save <b>₹' + waste.annualWaste.toLocaleString() + '</b> annually.</p></div>';
    }
    container.innerHTML = '<div class="space-y-6 pb-8 fb-animate-in">' +
      '<div class="flex items-center justify-between"><div><h2 class="text-2xl font-bold text-slate-800 dark:text-white">📋 Subscription Manager</h2><p class="text-sm text-slate-500 mt-1">Track, analyze, and optimize recurring subscriptions</p></div><span class="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-700 text-xs font-semibold rounded-full"><i class="fas fa-exclamation-triangle mr-1.5"></i>₹' + waste.annualWaste.toLocaleString() + '/yr waste</span></div>' +
      '<div class="grid grid-cols-2 md:grid-cols-4 gap-3">' +
      '<div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Active Subs</span><span class="stat-icon navy"><i class="fas fa-layer-group"></i></span></div><p class="stat-value">' + subs.length + '</p></div>' +
      '<div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Monthly Cost</span><span class="stat-icon gold"><i class="fas fa-indian-rupee-sign"></i></span></div><p class="stat-value">' + C(totalMonthly) + '</p></div>' +
      '<div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Annual Cost</span><span class="stat-icon info"><i class="fas fa-calendar"></i></span></div><p class="stat-value">' + C(totalMonthly * 12) + '</p></div>' +
      '<div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Waste Alert</span><span class="stat-icon" style="background:#FEF2F2;color:#EF4444;"><i class="fas fa-trash"></i></span></div><p class="stat-value text-red-500">' + waste.warnings.length + '</p></div></div>' +
      '<div class="space-y-3">' + subCards + '</div>' + wasteHtml + '</div>';
  }

  window.checkCultFitLocation = function() {
    if (!navigator.geolocation) { App.showToast('Geolocation not supported', 'warning'); return; }
    App.showToast('📍 Requesting location...', 'info');
    navigator.geolocation.getCurrentPosition(function(pos) {
      var dist = window._calcDistance(pos.coords.latitude, pos.coords.longitude, 19.1136, 72.8697);
      if (dist < 0.5) {
        App.showToast('🏋️ You are at the gym! Check-in recorded.', 'success');
        var subs = SubscriptionManager.getAll(), cult = subs.find(function(s) { return s.name === 'Cult Fit'; });
        if (cult) { cult.lastUsed = Date.now(); cult.unusedDays = 0; SubscriptionManager.save(); }
      } else { App.showToast('⚠️ You are ' + dist.toFixed(1) + 'km from your Cult Fit center.', 'warning'); }
    }, function() { App.showToast('Location denied.', 'warning'); });
  };

  window._calcDistance = function(lat1, lng1, lat2, lng2) {
    var R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLng = (lng2 - lng1) * Math.PI / 180;
    var a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // ═══════════════════════════════════════════════════════════════
  //  5. INNOVATION SHOWCASE
  // ═══════════════════════════════════════════════════════════════

  function renderInnovationShowcase(container) {
    var features = [
      { title: '🛡️ Panic Mode / Anti-Coercion', desc: 'Reversed caller ID as OTP triggers silent alert. Dashboard shows fake reduced balances. All critical actions blocked. Real-world safety innovation.', badge: 'Security', color: 'red' },
      { title: '🔊 Voice OTP', desc: 'Web Speech API reads OTP aloud. Accessibility-focused. "Your SecureWealth OTP is 1 2 3 4 5 6. Do not share it."', badge: 'Accessibility', color: 'blue' },
      { title: '🔗 Magic Link (Passwordless)', desc: 'Email-based magic link that auto-authenticates without passwords or OTPs. Email preview with simulated login button.', badge: 'UX', color: 'emerald' },
      { title: '📍 Location-Based Auth', desc: 'Cult Fit: if near saved gym location, instant auth without OTP. Geolocation API with Haversine distance calculation.', badge: 'Innovation', color: 'purple' },
      { title: '🔐 On-Device AES-256-GCM', desc: 'Web Crypto API encryption. All financial data encrypted in browser. Keys never leave the device. Zero-knowledge architecture.', badge: 'Privacy', color: 'slate' },
      { title: '📊 AI Tax-Loss Harvesting', desc: 'Automated capital gains optimization. Identifies loss positions, suggests wash-sale-compliant replacements.', badge: 'AI', color: 'amber' },
      { title: '🌍 Global Multi-Currency', desc: 'Real-time forex portfolio with 8 currencies. FX gain/loss tracking. Cross-border transfer optimization.', badge: 'Global', color: 'indigo' },
      { title: '🌱 ESG Portfolio Score', desc: 'Carbon footprint + sustainability rating per holding. UBS-grade ESG analytics. Green revenue tracking.', badge: 'ESG', color: 'green' },
      { title: '📱 Session Manager', desc: 'Track all active login sessions. Remote revoke. Suspicious location alerts. Device fingerprinting on login.', badge: 'Security', color: 'orange' },
      { title: '🍔 Food Delivery AI', desc: 'Cross-platform spending: Swiggy vs Zomato vs Zepto. AI recommends platform switching for savings.', badge: 'AI', color: 'pink' },
      { title: '📋 Subscription Audit', desc: 'Auto-detects unused subscriptions. Annual waste calculator. Cult Fit gym proximity check. One-click cancel.', badge: 'Smart', color: 'cyan' },
      { title: '🛡️ Risk Sandbox', desc: 'Interactive risk sliders. Real-time scoring. Device trust, OTP retries, amount ratio, urgency level.', badge: 'Interactive', color: 'red' }
    ];
    var colorMap = { red: '#EF4444', blue: '#3B82F6', emerald: '#10B981', purple: '#8B5CF6', slate: '#64748B', amber: '#F59E0B', indigo: '#6366F1', green: '#059669', orange: '#F97316', pink: '#EC4899', cyan: '#06B6D4' };
    var cards = '';
    features.forEach(function(f) {
      var c = colorMap[f.color] || '#C4A962';
      cards += '<div class="fb-card p-5 border-l-4" style="border-left-color:' + c + ';">' +
        '<div class="flex items-start justify-between mb-2"><h3 class="font-bold text-sm">' + f.title + '</h3><span class="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style="background:' + c + ';">' + f.badge + '</span></div>' +
        '<p class="text-xs text-slate-500 leading-relaxed">' + f.desc + '</p></div>';
    });
    container.innerHTML = '<div class="space-y-6 pb-8 fb-animate-in">' +
      '<div><h2 class="text-2xl font-bold text-slate-800 dark:text-white">🏆 Innovation Showcase</h2><p class="text-sm text-slate-500 mt-1">All unique security and UX features — one page for judges</p></div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' + cards + '</div>' +
      '<div class="fb-card p-5 text-center"><p class="text-sm text-slate-500">All features simulated for hackathon. No real financial data processed.</p>' +
      '<button onclick="localStorage.clear();location.reload()" class="mt-2 fb-btn fb-btn-outline fb-btn-sm text-red-500"><i class="fas fa-undo mr-1.5"></i>Reset All Demo Data</button></div></div>';
  }

  // ═══════════════════════════════════════════════════════════════
  //  INTEGRATION
  // ═══════════════════════════════════════════════════════════════

  function waitForApp(cb, retries) {
    retries = retries || 100;
    if (window.App && window.App.renderView) cb();
    else if (retries > 0) setTimeout(function() { waitForApp(cb, retries - 1); }, 100);
  }

  waitForApp(function() {
    window.SubscriptionManager = SubscriptionManager;
    window.FoodComparison = FoodComparison;

    var origRender = App.renderView.bind(App);
    App.renderView = function(view) {
      var container = document.getElementById('main-content');
      if (!container) return origRender(view);
      switch (view) {
        case 'credit-card': renderCreditCard(container); break;
        case 'food-compare': renderFoodComparison(container); break;
        case 'subscriptions': renderSubscriptionManager(container); break;
        case 'innovation-showcase': renderInnovationShowcase(container); break;
        default: origRender(view); return;
      }
      document.querySelectorAll('.nav-item').forEach(function(el) {
        el.classList.remove('active');
        if (el.dataset.view === view) el.classList.add('active');
      });
      var titles = { 'credit-card': 'Demo Credit Card', 'food-compare': 'Food Delivery Analysis', 'subscriptions': 'Subscription Manager', 'innovation-showcase': 'Innovation Showcase' };
      document.getElementById('page-title').textContent = titles[view] || view;
    };

    function addNavItems() {
      var nav = document.querySelector('.fb-nav, #sidebar-nav');
      if (!nav || document.querySelector('[data-view="innovation-showcase"]')) return;
      var divider = document.createElement('div'); divider.className = 'fb-nav-section'; divider.textContent = 'Demo Features'; nav.appendChild(divider);
      [
        { view: 'credit-card', icon: 'fa-credit-card', label: 'Credit Card', badge: 'DEMO' },
        { view: 'food-compare', icon: 'fa-utensils', label: 'Food Compare', badge: 'AI' },
        { view: 'subscriptions', icon: 'fa-layer-group', label: 'Subscriptions', badge: 'SAVE' },
        { view: 'innovation-showcase', icon: 'fa-trophy', label: 'Innovations', badge: '🏆' }
      ].forEach(function(item) {
        var a = document.createElement('a'); a.href = '#'; a.dataset.view = item.view;
        a.className = 'fb-nav-item nav-item';
        a.innerHTML = '<i class="fas ' + item.icon + '"></i><span class="flex-1">' + item.label + '</span><span class="nav-badge">' + item.badge + '</span>';
        a.addEventListener('click', function(e) { e.preventDefault(); App.renderView(item.view); });
        nav.appendChild(a);
      });
    }
    setTimeout(addNavItems, 600);

    console.log('[DemoFeatures] Salary, Credit Card, Food Compare, Subscriptions, Innovations loaded.');
  });

})();
