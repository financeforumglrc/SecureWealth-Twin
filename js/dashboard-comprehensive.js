/**
 * Comprehensive Dashboard Module
 * Bulletproof override — intercepts App.init to guarantee patch applies AFTER setup
 */
(function() {
  'use strict';

  const C = n => {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  };

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function gridColor() {
    return isDark() ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  }

  function textColor() {
    return isDark() ? '#94a3b8' : '#64748b';
  }

  function borderColor() {
    return isDark() ? '#1e293b' : '#ffffff';
  }

  function destroyCharts() {
    try {
      const charts = (typeof App !== 'undefined' && App.charts) ? App.charts : {};
      Object.values(charts).forEach(c => c && typeof c.destroy === 'function' && c.destroy());
      if (typeof App !== 'undefined') App.charts = {};
    } catch (e) {
      console.warn('[Dashboard] destroyCharts error:', e);
    }
  }

  function renderDashboard(container) {
    if (!container) {
      container = document.getElementById('main-content');
    }
    if (!container) {
      console.error('[Dashboard] main-content not found');
      return;
    }

    destroyCharts();

    const physicalTotal = (typeof PhysicalAssets !== 'undefined') ? PhysicalAssets.getTotal() : 0;
    const netWorth = 4520000 + physicalTotal;
    const income = 125000;
    const expenses = 72000;
    const savings = 28000;
    const healthScore = 78;
    const protectionScore = 94;

    container.innerHTML = `
      <div class="space-y-6 pb-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here's your complete financial picture</p>
          </div>
          <div class="flex items-center gap-2">
            <span id="protection-score-badge" class="px-3 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
              <i class="fas fa-shield-halved mr-1"></i>Protection: ${protectionScore}/100
            </span>
            <button onclick="RiskEngine.protect('dashboard-simulate', 100000, () => { NudgeEngine.show('Transaction simulation completed', 'success'); })" class="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow">
              <i class="fas fa-play mr-1.5"></i>Simulate
            </button>
          </div>
        </div>

        <!-- Live Stock Ticker -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div id="stock-ticker" class="flex items-center gap-6 px-4 py-2.5 text-xs whitespace-nowrap overflow-hidden">
            <span class="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"><i class="fas fa-tower-broadcast text-emerald-500"></i>Live Markets</span>
            <span class="text-slate-500">NIFTY 50 <span class="text-emerald-500 font-semibold">▲ 24,850.30 +0.45%</span></span>
            <span class="text-slate-500">SENSEX <span class="text-emerald-500 font-semibold">▲ 81,450.15 +0.38%</span></span>
            <span class="text-slate-500">NIFTY Bank <span class="text-rose-500 font-semibold">▼ 52,120.40 -0.12%</span></span>
            <span class="text-slate-500">GOLD <span class="text-emerald-500 font-semibold">▲ ₹72,850 +0.28%</span></span>
            <span class="text-slate-500">USD/INR <span class="text-rose-500 font-semibold">▼ ₹83.42 -0.05%</span></span>
            <span class="text-slate-500">BTC/INR <span class="text-emerald-500 font-semibold">▲ ₹58,20,000 +1.2%</span></span>
          </div>
        </div>

        <!-- Stat Cards -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div class="bg-white dark:bg-dark-light rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Net Worth</span>
              <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><i class="fas fa-wallet text-sm"></i></div>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white duress-sensitive">${C(netWorth)}</p>
            <p class="text-xs text-emerald-500 mt-1.5 font-medium"><i class="fas fa-arrow-trend-up mr-1"></i>+12.5% YoY</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Income</span>
              <div class="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500"><i class="fas fa-money-bill-wave text-sm"></i></div>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white duress-sensitive">${C(income)}</p>
            <p class="text-xs text-slate-400 mt-1.5 duress-fake" data-duress-fake="Monthly in-hand">Monthly in-hand</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Savings</span>
              <div class="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500"><i class="fas fa-piggy-bank text-sm"></i></div>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white duress-sensitive">${C(savings)}</p>
            <p class="text-xs text-emerald-500 mt-1.5 font-medium duress-fake" data-duress-fake="+0% this month"><i class="fas fa-arrow-trend-up mr-1"></i>+5% this month</p>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Health Score</span>
              <div class="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-500"><i class="fas fa-heart-pulse text-sm"></i></div>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white duress-fake" data-duress-fake="45/100">${healthScore}<span class="text-sm font-normal text-slate-400">/100</span></p>
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2">
              <div class="bg-violet-500 h-1.5 rounded-full transition-all duration-1000" style="width:0%" data-width="${healthScore}%"></div>
            </div>
          </div>
          <div class="bg-white dark:bg-dark-light rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">CIBIL Score</span>
              <div class="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500"><i class="fas fa-credit-card text-sm"></i></div>
            </div>
            <p class="text-xl font-bold text-slate-800 dark:text-white">780<span class="text-sm font-normal text-slate-400">/900</span></p>
            <p class="text-xs text-emerald-500 mt-1.5 font-medium"><i class="fas fa-check-circle mr-1"></i>Excellent</p>
          </div>
        </div>

        <!-- Main Charts Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Spending Trend -->
          <div class="lg:col-span-2 bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800 dark:text-white">Spending vs Income Trend</h3>
              <span class="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded font-medium">12 Months</span>
            </div>
            <div class="relative" style="height:18rem">
              <canvas id="dash-spending-chart"></canvas>
            </div>
          </div>

          <!-- Expense Breakdown -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Expense Breakdown</h3>
            <div class="relative" style="height:14rem">
              <canvas id="dash-expense-chart"></canvas>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex items-center justify-between text-xs"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#0f766e]"></span>Housing</span><span class="font-medium text-slate-600 dark:text-slate-300">₹25,000</span></div>
              <div class="flex items-center justify-between text-xs"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#14b8a6]"></span>Food</span><span class="font-medium text-slate-600 dark:text-slate-300">₹12,000</span></div>
              <div class="flex items-center justify-between text-xs"><span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-[#f59e0b]"></span>Transport</span><span class="font-medium text-slate-600 dark:text-slate-300">₹8,000</span></div>
            </div>
          </div>
        </div>

        <!-- Middle Row: Goals + Portfolio + Health -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Goals -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800 dark:text-white">Active Goals</h3>
              <button onclick="App.renderView('goals')" class="text-xs text-primary hover:underline">View All</button>
            </div>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1.5"><span class="text-slate-700 dark:text-slate-200 font-medium">Emergency Fund</span><span class="text-primary font-semibold">85%</span></div>
                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-primary h-2 rounded-full transition-all duration-1000" style="width:0%" data-width="85%"></div></div>
                <p class="text-[10px] text-slate-400 mt-1">₹3,00,000 target · ₹2,55,000 saved</p>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1.5"><span class="text-slate-700 dark:text-slate-200 font-medium">Home Down Payment</span><span class="text-secondary font-semibold">42%</span></div>
                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-secondary h-2 rounded-full transition-all duration-1000" style="width:0%" data-width="42%"></div></div>
                <p class="text-[10px] text-slate-400 mt-1">₹20,00,000 target · ₹8,40,000 saved</p>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1.5"><span class="text-slate-700 dark:text-slate-200 font-medium">Child Education</span><span class="text-amber-500 font-semibold">28%</span></div>
                <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2"><div class="bg-amber-500 h-2 rounded-full transition-all duration-1000" style="width:0%" data-width="28%"></div></div>
                <p class="text-[10px] text-slate-400 mt-1">₹15,00,000 target · ₹4,20,000 saved</p>
              </div>
            </div>
          </div>

          <!-- Portfolio -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800 dark:text-white">Portfolio Allocation</h3>
              <button onclick="App.renderView('portfolio')" class="text-xs text-primary hover:underline">Details</button>
            </div>
            <div class="relative" style="height:12rem">
              <canvas id="dash-portfolio-chart"></canvas>
            </div>
            <div class="mt-3 grid grid-cols-2 gap-2 text-[10px]">
              <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#0f766e]"></span><span class="text-slate-600 dark:text-slate-300">Equity 35%</span></div>
              <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#14b8a6]"></span><span class="text-slate-600 dark:text-slate-300">Debt 28%</span></div>
              <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#f59e0b]"></span><span class="text-slate-600 dark:text-slate-300">Real Estate 25%</span></div>
              <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-[#ef4444]"></span><span class="text-slate-600 dark:text-slate-300">Gold 7%</span></div>
            </div>
          </div>

          <!-- Health Gauge -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Financial Health</h3>
            <div class="flex flex-col items-center">
              <div class="relative" style="width:8rem;height:8rem">
                <canvas id="dash-health-gauge"></canvas>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-2xl font-bold text-slate-800 dark:text-white">${healthScore}</span>
                  <span class="text-[10px] text-slate-400">Good</span>
                </div>
              </div>
            </div>
            <div class="mt-4 space-y-2">
              <div class="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-700"><span class="text-slate-500">Savings Rate</span><span class="font-semibold text-emerald-500">22.4%</span></div>
              <div class="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-700"><span class="text-slate-500">Debt-to-Income</span><span class="font-semibold text-emerald-500">0%</span></div>
              <div class="flex items-center justify-between text-xs py-2"><span class="text-slate-500">Emergency Coverage</span><span class="font-semibold text-amber-500">6 months</span></div>
            </div>
          </div>
        </div>

        <!-- Bottom Row: AI Insights + Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-xl border border-primary/10 p-5">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0"><i class="fas fa-wand-magic-sparkles"></i></div>
              <div class="flex-1">
                <h4 class="font-semibold text-slate-800 dark:text-white mb-1">AI-Powered Insights</h4>
                <div class="space-y-3 mt-3">
                  <div class="flex items-start gap-2 text-sm">
                    <i class="fas fa-lightbulb text-amber-500 mt-0.5 text-xs flex-shrink-0"></i>
                    <div>
                      <p class="text-slate-600 dark:text-slate-300">You could save an additional <strong class="text-primary">₹8,500/month</strong> by optimizing subscriptions and dining expenses.</p>
                      <button onclick="Explainability.show('overspending-dining')" class="text-[10px] text-primary hover:underline mt-0.5"><i class="fas fa-circle-info mr-0.5"></i>Why this?</button>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 text-sm">
                    <i class="fas fa-arrow-trend-up text-emerald-500 mt-0.5 text-xs flex-shrink-0"></i>
                    <div>
                      <p class="text-slate-600 dark:text-slate-300">Your SIPs are performing at <strong class="text-emerald-500">14.2% CAGR</strong> — beating inflation by 9%.</p>
                      <button onclick="Explainability.show('sip-performance')" class="text-[10px] text-primary hover:underline mt-0.5"><i class="fas fa-circle-info mr-0.5"></i>Why this?</button>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 text-sm">
                    <i class="fas fa-shield-halved text-primary mt-0.5 text-xs flex-shrink-0"></i>
                    <div>
                      <p class="text-slate-600 dark:text-slate-300">All 6 fraud protection checks are active. Your last 10 transactions were clean.</p>
                      <button onclick="Explainability.show('protection-active')" class="text-[10px] text-primary hover:underline mt-0.5"><i class="fas fa-circle-info mr-0.5"></i>Why this?</button>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2 mt-4">
                  <button onclick="App.renderView('wealth-twin')" class="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90">Explore Wealth Twin</button>
                  <button onclick="App.renderView('tax')" class="px-3 py-1.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 text-xs rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600">Tax Optimizer</button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
              <div class="grid grid-cols-2 gap-2">
                <button onclick="App.renderView('calculators')" class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-colors text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-calculator text-primary text-lg"></i>Calculators</button>
                <button onclick="App.renderView('transactions')" class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-colors text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-list text-secondary text-lg"></i>Transactions</button>
                <button onclick="showNotifications()" class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-colors text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-bell text-amber-500 text-lg"></i>Alerts</button>
                <button onclick="toggleDarkMode()" class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-colors text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-moon text-violet-500 text-lg"></i>Theme</button>
                <button onclick="StressTest.showModal()" class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-bolt text-rose-500 text-lg"></i>Stress Test</button>
                <button onclick="WhatIfSimulator.showModal()" class="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-primary/5 transition-colors text-xs text-slate-600 dark:text-slate-300"><i class="fas fa-wand-magic-sparkles text-primary text-lg"></i>What-If</button>
              </div>
            </div>
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <div class="flex items-center justify-between mb-3">
                <h3 class="font-semibold text-slate-800 dark:text-white text-sm">Your Streaks</h3>
                <span class="text-xs text-amber-500 font-medium"><i class="fas fa-fire mr-1"></i>15 days</span>
              </div>
              <div class="flex gap-3">
                <div class="flex-1 text-center p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg"><i class="fas fa-piggy-bank text-emerald-500 text-sm mb-1"></i><p class="text-xs font-bold text-slate-700 dark:text-white">8</p><p class="text-[10px] text-slate-400">Savings</p></div>
                <div class="flex-1 text-center p-2 bg-primary/5 dark:bg-primary/10 rounded-lg"><i class="fas fa-calendar-check text-primary text-sm mb-1"></i><p class="text-xs font-bold text-slate-700 dark:text-white">15</p><p class="text-[10px] text-slate-400">Login</p></div>
                <div class="flex-1 text-center p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg"><i class="fas fa-bullseye text-amber-500 text-sm mb-1"></i><p class="text-xs font-bold text-slate-700 dark:text-white">3</p><p class="text-[10px] text-slate-400">Goals</p></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hackathon Features Row: Connected Accounts + Physical Assets + Tax Savings + Market Insights + ESG -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Connected Accounts (AA) -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-slate-800 dark:text-white text-sm">Connected Accounts</h3>
              <span class="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">Account Aggregator</span>
            </div>
            <div class="space-y-2 mb-3">
              <div class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-blue-500/10 rounded flex items-center justify-center text-blue-500 text-xs"><i class="fas fa-building-columns"></i></div>
                  <div>
                    <p class="text-xs font-medium text-slate-700 dark:text-slate-200">HDFC Bank Savings</p>
                    <p class="text-[10px] text-slate-400">****4521</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">${C(124500)}</span>
              </div>
              <div class="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-red-500/10 rounded flex items-center justify-center text-red-500 text-xs"><i class="fas fa-credit-card"></i></div>
                  <div>
                    <p class="text-xs font-medium text-slate-700 dark:text-slate-200">ICICI Credit Card</p>
                    <p class="text-[10px] text-slate-400">****8834</p>
                  </div>
                </div>
                <span class="text-xs font-bold text-danger">-${C(18200)}</span>
              </div>
            </div>
            <button onclick="if(window.AAModal) AAModal.open(); else alert('Account Aggregator: Link a new bank account via RBI-approved AA framework')" class="w-full py-2 bg-primary/10 text-primary text-xs rounded-lg hover:bg-primary/20 transition-colors font-medium">
              <i class="fas fa-plus mr-1"></i>Link New Account via AA
            </button>
            <p class="text-[10px] text-slate-400 mt-2 text-center">RBI Account Aggregator compliant · Encrypted · Consent-based</p>
          </div>
          <!-- Physical Assets -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 duress-hide">
            <div id="physical-assets-panel"></div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Tax Savings -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-slate-800 dark:text-white text-sm">Tax Savings</h3>
              <span class="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">Save ₹78,000</span>
            </div>
            <div id="tax-savings-panel" class="space-y-2"></div>
          </div>
          <!-- Market Insights -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-slate-800 dark:text-white text-sm">Market Insights</h3>
              <span class="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">Live</span>
            </div>
            <div id="market-insights-panel"></div>
          </div>
          <!-- ESG Portfolio Score -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div id="esg-score-panel" class="group relative"></div>
            <div class="hidden group-hover:block absolute bottom-full left-0 mb-2 p-2 bg-slate-800 text-white text-[10px] rounded-lg w-48 z-10 shadow-xl">
              ESG scores evaluate Environmental, Social, and Governance practices of companies in your portfolio.
            </div>
          </div>
          <!-- Social Proof Nudge -->
          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <div class="flex items-center justify-between mb-3">
              <h3 class="font-semibold text-slate-800 dark:text-white text-sm"><i class="fas fa-chart-simple text-secondary mr-2"></i>Community Insights</h3>
            </div>
            <div id="social-proof-nudge"></div>
          </div>
        </div>
        <!-- Financial Literacy Card -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-slate-800 dark:text-white text-sm"><i class="fas fa-graduation-cap text-amber-500 mr-2"></i>Did You Know?</h3>
            <span class="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">Financial Literacy</span>
          </div>
          <div id="financial-literacy-card"></div>
        </div>
        <!-- Threat Intelligence Feed -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 duress-hide">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-slate-800 dark:text-white text-sm"><i class="fas fa-tower-broadcast text-rose-500 mr-2"></i>Active Threat Intelligence</h3>
            <span class="text-[10px] px-2 py-0.5 bg-rose-100 text-rose-600 rounded font-medium animate-pulse">Live</span>
          </div>
          <div id="threat-intel-feed"></div>
        </div>
        <!-- SIP Step-Up Calculator -->
        <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-semibold text-slate-800 dark:text-white text-sm"><i class="fas fa-rocket text-secondary mr-2"></i>SIP Step-Up Calculator</h3>
            <span class="text-[10px] px-2 py-0.5 bg-secondary/10 text-secondary rounded font-medium">India Specific</span>
          </div>
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="text-[10px] text-slate-500">Current SIP</label>
              <input type="range" id="stepup-sip" min="5000" max="100000" step="1000" value="15000" class="w-full accent-primary h-1" oninput="window.updateStepUp()">
              <p class="text-xs font-bold text-primary mt-1" id="stepup-sip-val">₹15,000</p>
            </div>
            <div>
              <label class="text-[10px] text-slate-500">Annual Step-Up</label>
              <input type="range" id="stepup-rate" min="0" max="20" step="1" value="10" class="w-full accent-primary h-1" oninput="window.updateStepUp()">
              <p class="text-xs font-bold text-primary mt-1" id="stepup-rate-val">10%</p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
              <p class="text-[10px] text-slate-500">Fixed SIP (15Y)</p>
              <p class="text-sm font-bold text-slate-700 dark:text-slate-200" id="stepup-fixed">₹63.8L</p>
            </div>
            <div class="p-3 bg-secondary/5 rounded-lg text-center border border-secondary/10">
              <p class="text-[10px] text-slate-500">Step-Up SIP (15Y)</p>
              <p class="text-sm font-bold text-secondary" id="stepup-result">₹1.04Cr</p>
            </div>
          </div>
          <p class="text-[10px] text-slate-400 mt-2 text-center" id="stepup-insight">Step-up SIP creates <strong>63% more</strong> wealth</p>
        </div>
      </div>
    `;

    // Initialize charts after DOM update
    setTimeout(() => {
      initCharts(healthScore);
      animateBars();
      // Initialize hackathon feature panels
      const paPanel = document.getElementById('physical-assets-panel');
      if (paPanel && window.PhysicalAssets) PhysicalAssets.renderManager(paPanel);
      const tsPanel = document.getElementById('tax-savings-panel');
      if (tsPanel && window.TaxSavings) {
        const recs = TaxSavings.getRecommendations();
        tsPanel.innerHTML = recs.slice(0, 3).map(r => `
          <div class="flex items-start gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div class="w-7 h-7 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 text-xs"><i class="fas ${r.icon}"></i></div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-slate-700 dark:text-slate-200">${r.title} <span class="text-[10px] text-slate-400">(${r.section})</span></p>
              <p class="text-[10px] text-slate-500 truncate">${r.desc}</p>
              <p class="text-[10px] font-bold text-emerald-500">Save ${C(r.taxSaved)}</p>
            </div>
          </div>
        `).join('');
      }
      const miPanel = document.getElementById('market-insights-panel');
      if (miPanel && window.MarketInsights) {
        const insight = MarketInsights.getInsight();
        miPanel.innerHTML = `
          <div class="p-3 ${insight.level === 'warning' ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800' : insight.level === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700'} rounded-lg">
            <p class="text-xs font-medium ${insight.level === 'warning' ? 'text-amber-700 dark:text-amber-300' : insight.level === 'success' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'}">${insight.title}</p>
            <p class="text-[10px] text-slate-500 mt-1">${insight.text}</p>
            <div class="flex items-center gap-1 mt-2">
              <button onclick="this.nextElementSibling.classList.toggle('hidden')" class="text-[10px] text-primary hover:underline">Why this?</button>
              <span class="hidden text-[10px] text-slate-400 bg-white dark:bg-slate-700 p-1.5 rounded mt-1">${insight.rule}</span>
            </div>
          </div>
        `;
      }
      // Start threat intel feed
      if (window.ThreatIntel) ThreatIntel.start();
      // Show loss aversion nudge once per session
      if (window.BehavioralNudges && !window.__lossNudgeShown) {
        window.__lossNudgeShown = true;
        setTimeout(() => BehavioralNudges.showLossAversion(), 4000);
      }
      // Apply duress mode if active
      if (window.DuressMode && DuressMode.isActive()) DuressMode.apply();
      // Render ESG Score
      const esgPanel = document.getElementById('esg-score-panel');
      if (esgPanel && window.ESGScore) ESGScore.renderCard(esgPanel);
      // Show social proof nudge
      if (window.SocialProofNudges) SocialProofNudges.showRandom();
      // Animate stat card counters
      if (window.animateCounter) {
        const nwEl = document.querySelector('.duress-sensitive');
        if (nwEl && !nwEl.dataset.animated) { nwEl.dataset.animated = '1'; animateCounter(nwEl, netWorth, 1200, '', ''); }
      }
      // Animate stock ticker
      const ticker = document.getElementById('stock-ticker');
      if (ticker) {
        const items = ticker.querySelectorAll('span.text-slate-500');
        items.forEach((item, i) => {
          setInterval(() => {
            const spans = item.querySelectorAll('span');
            spans.forEach(s => {
              const isUp = s.classList.contains('text-emerald-500');
              const baseVal = parseFloat(s.textContent.replace(/[▼▲,%₹\s]/g, '')) || 0;
              const change = (Math.random() - 0.5) * 0.3;
              const newVal = Math.max(0, baseVal + change);
              s.textContent = (isUp ? '▲ ' : '▼ ') + s.textContent.replace(/[▼▲]\s/, '').replace(/[\d,.]+/, newVal.toFixed(2));
            });
          }, 5000 + i * 800);
        });
      }
      // Init Financial Literacy card
      const litCard = document.getElementById('financial-literacy-card');
      if (litCard && window.FinancialLiteracy) FinancialLiteracy.render('financial-literacy-card');
      // Init SIP Step-Up calculator
      window.updateStepUp = function() {
        const sip = parseInt(document.getElementById('stepup-sip')?.value || 15000);
        const rate = parseInt(document.getElementById('stepup-rate')?.value || 10);
        const annualReturn = 0.12;
        const years = 15;
        let fixedCorpus = 0, stepUpCorpus = 0;
        let currentSIP = sip;
        for (let y = 0; y < years; y++) {
          for (let m = 0; m < 12; m++) {
            fixedCorpus = fixedCorpus * (1 + annualReturn / 12) + sip;
            stepUpCorpus = stepUpCorpus * (1 + annualReturn / 12) + currentSIP;
          }
          currentSIP = currentSIP * (1 + rate / 100);
        }
        const fixedEl = document.getElementById('stepup-fixed');
        const resultEl = document.getElementById('stepup-result');
        const insightEl = document.getElementById('stepup-insight');
        const sipVal = document.getElementById('stepup-sip-val');
        const rateVal = document.getElementById('stepup-rate-val');
        if (sipVal) sipVal.textContent = C(sip) + '/mo';
        if (rateVal) rateVal.textContent = rate + '%/yr';
        if (fixedEl) fixedEl.textContent = C(Math.round(fixedCorpus));
        if (resultEl) resultEl.textContent = C(Math.round(stepUpCorpus));
        if (insightEl) {
          const extra = Math.round(((stepUpCorpus - fixedCorpus) / fixedCorpus) * 100);
          insightEl.innerHTML = `At <strong>${rate}%</strong> annual step-up, you create <strong>${extra}% more</strong> wealth in ${years} years`;
        }
      };
      window.updateStepUp();
    }, 50);
  }

  function initCharts(healthScore) {
    if (typeof Chart === 'undefined') {
      console.warn('[Dashboard] Chart.js not loaded, retrying...');
      setTimeout(() => initCharts(healthScore), 300);
      return;
    }

    const gc = gridColor();
    const tc = textColor();
    const bc = borderColor();

    // 1. Spending Trend (line)
    const sCanvas = document.getElementById('dash-spending-chart');
    if (sCanvas) {
      try {
        const sWrap = sCanvas.parentElement;
        if (sWrap && sWrap.clientWidth > 0 && sWrap.clientHeight > 0) {
          sCanvas.width = sWrap.clientWidth;
          sCanvas.height = sWrap.clientHeight;
        }
        App.charts.spending = new Chart(sCanvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: MONTHS,
            datasets: [
              {
                label: 'Expenses',
                data: [65000, 68000, 72000, 70000, 75000, 72000, 69000, 71000, 74000, 72000, 68000, 72000],
                borderColor: '#0f766e',
                backgroundColor: 'rgba(15,118,110,0.08)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 7,
                borderWidth: 2.5
              },
              {
                label: 'Income',
                data: [100000, 100000, 105000, 100000, 100000, 110000, 100000, 100000, 115000, 100000, 100000, 125000],
                borderColor: '#14b8a6',
                backgroundColor: 'transparent',
                borderDash: [6, 4],
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5,
                borderWidth: 2
              }
            ]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { position: 'top', align: 'end', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 }, color: tc } }
            },
            scales: {
              y: { beginAtZero: true, grid: { color: gc }, ticks: { callback: v => '₹' + (v/1000) + 'K', font: { size: 10 }, color: tc } },
              x: { grid: { display: false }, ticks: { font: { size: 10 }, color: tc } }
            }
          }
        });
      } catch (e) {
        console.error('[Dashboard] Spending chart error:', e);
      }
    }

    // 2. Expense Breakdown (doughnut)
    const eCanvas = document.getElementById('dash-expense-chart');
    if (eCanvas) {
      try {
        const eWrap = eCanvas.parentElement;
        if (eWrap && eWrap.clientWidth > 0 && eWrap.clientHeight > 0) {
          eCanvas.width = eWrap.clientWidth;
          eCanvas.height = eWrap.clientHeight;
        }
        App.charts.expense = new Chart(eCanvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Housing','Food','Transport','Utilities','Entertainment','Shopping','Others'],
            datasets: [{
              data: [25000, 12000, 8000, 5000, 10000, 12000, 4000],
              backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#94a3b8'],
              borderWidth: 2,
              borderColor: bc,
              hoverOffset: 8
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            cutout: '68%',
            plugins: { legend: { display: false } }
          }
        });
      } catch (e) {
        console.error('[Dashboard] Expense chart error:', e);
      }
    }

    // 3. Portfolio Allocation (doughnut)
    const pCanvas = document.getElementById('dash-portfolio-chart');
    if (pCanvas) {
      try {
        const pWrap = pCanvas.parentElement;
        if (pWrap && pWrap.clientWidth > 0 && pWrap.clientHeight > 0) {
          pCanvas.width = pWrap.clientWidth;
          pCanvas.height = pWrap.clientHeight;
        }
        App.charts.portfolio = new Chart(pCanvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Equity','Debt','Real Estate','Gold','Cash'],
            datasets: [{
              data: [35, 28, 25, 7, 5],
              backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#94a3b8'],
              borderWidth: 2,
              borderColor: bc,
              hoverOffset: 6
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            cutout: '65%',
            plugins: { legend: { display: false } }
          }
        });
      } catch (e) {
        console.error('[Dashboard] Portfolio chart error:', e);
      }
    }

    // 4. Health Gauge (semi-circle doughnut)
    const hCanvas = document.getElementById('dash-health-gauge');
    if (hCanvas) {
      try {
        const hWrap = hCanvas.parentElement;
        if (hWrap && hWrap.clientWidth > 0 && hWrap.clientHeight > 0) {
          hCanvas.width = hWrap.clientWidth;
          hCanvas.height = hWrap.clientHeight;
        }
        App.charts.health = new Chart(hCanvas.getContext('2d'), {
          type: 'doughnut',
          data: {
            labels: ['Score', 'Remaining'],
            datasets: [{
              data: [healthScore, 100 - healthScore],
              backgroundColor: [healthScore >= 75 ? '#10b981' : healthScore >= 50 ? '#f59e0b' : '#ef4444', isDark() ? '#334155' : '#e2e8f0'],
              borderWidth: 0,
              circumference: 180,
              rotation: 270
            }]
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: { duration: 0 },
            cutout: '80%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
          }
        });
      } catch (e) {
        console.error('[Dashboard] Health gauge error:', e);
      }
    }

    console.log('[Dashboard] All charts initialized');
  }

  function animateBars() {
    document.querySelectorAll('[data-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.getAttribute('data-width'); }, 100);
    });
  }

  // ==================== BULLETPROOF PATCH ====================
  let patchInterval = null;
  let _patchedRenderDashboard = null;
  function applyPatch(forceRerender) {
    if (typeof App === 'undefined' || !App.renderDashboard) {
      console.log('[Dashboard] App not ready, retrying in 100ms...');
      setTimeout(applyPatch, 100);
      return;
    }

    const originalInit = App.init;

    // Immediately replace the renderer
    _patchedRenderDashboard = function(container) {
      renderDashboard(container);
    };
    App.renderDashboard = _patchedRenderDashboard;

    // Wrap App.init for future page loads
    App.init = function() {
      App.renderDashboard = _patchedRenderDashboard;
      if (typeof originalInit === 'function') {
        originalInit.call(this);
      }
      App.renderDashboard = _patchedRenderDashboard;
    };

    // Re-render if dashboard is current or if forced
    if (forceRerender || App.currentView === 'dashboard' || !App.currentView) {
      const container = document.getElementById('main-content');
      if (container) {
        try {
          console.log('[Dashboard] Re-rendering dashboard...');
          renderDashboard(container);
        } catch (e) {
          console.error('[Dashboard] render error:', e);
        }
      }
    }

    window.__dashboardPatchApplied = true;
    console.log('[Dashboard] Patch applied');
  }

  // Aggressive re-application: old code may overwrite our patch via setTimeout/rAF
  function startGuard() {
    applyPatch(true);
    let checks = 0;
    patchInterval = setInterval(function() {
      checks++;
      // Re-apply patch if it was overwritten
      if (typeof App !== 'undefined' && App.renderDashboard !== _patchedRenderDashboard) {
        console.log('[Dashboard] Patch was overwritten, re-applying...');
        applyPatch(false);
      }
      // Stop after 5 seconds
      if (checks >= 10) {
        clearInterval(patchInterval);
        console.log('[Dashboard] Guard stopped');
      }
    }, 500);
  }

  // Apply immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGuard);
  } else {
    startGuard();
  }
})();
