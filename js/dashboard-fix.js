/**
 * Dashboard Fix — Reconstructs renderDashboard with working charts
 * Original chart code was stripped by Terser unused-code elimination
 */
(function() {
  'use strict';

  function formatCurrency(n) {
    if (n >= 10000000) return '₹' + (n/10000000).toFixed(2) + 'Cr';
    if (n >= 100000) return '₹' + (n/100000).toFixed(2) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  }

  function renderDashboardFix() {
    const container = document.getElementById('main-content');
    if (!container) return;

    const netWorth = 4520000;
    const income = 120000;
    const savings = 25000;
    const healthScore = 78;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p class="text-sm text-slate-500">Welcome back! Here's your financial overview.</p>
          </div>
          <div class="flex items-center gap-3">
            <button onclick="simulateTransaction()" class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <i class="fas fa-play mr-2"></i>Simulate Action
            </button>
          </div>
        </div>

        <!-- Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-slate-500">Net Worth</span>
              <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><i class="fas fa-wallet text-sm"></i></div>
            </div>
            <p class="text-2xl font-bold text-slate-800">${formatCurrency(netWorth)}</p>
            <p class="text-xs text-success mt-1"><i class="fas fa-arrow-up mr-1"></i>+12.5% from last year</p>
          </div>
          <div class="card bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-slate-500">Monthly Income</span>
              <div class="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary"><i class="fas fa-money-bill-wave text-sm"></i></div>
            </div>
            <p class="text-2xl font-bold text-slate-800">${formatCurrency(income)}</p>
            <p class="text-xs text-slate-400 mt-1">After tax deductions</p>
          </div>
          <div class="card bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-slate-500">Monthly Savings</span>
              <div class="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center text-accent"><i class="fas fa-piggy-bank text-sm"></i></div>
            </div>
            <p class="text-2xl font-bold text-slate-800">${formatCurrency(savings)}</p>
            <p class="text-xs text-success mt-1"><i class="fas fa-arrow-up mr-1"></i>+5% this month</p>
          </div>
          <div class="card bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm text-slate-500">Financial Health</span>
              <div class="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center text-success"><i class="fas fa-heart-pulse text-sm"></i></div>
            </div>
            <p class="text-2xl font-bold text-slate-800">${healthScore}<span class="text-sm font-normal text-slate-400">/100</span></p>
            <div class="w-full bg-slate-100 rounded-full h-2 mt-2"><div class="bg-success h-2 rounded-full" style="width:${healthScore}%"></div></div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="dashboard-grid">
          <div class="card bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold text-slate-800">Spending Trend (12 Months)</h3>
              <span class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Last 12 months</span>
            </div>
            <div class="chart-container">
              <canvas id="spending-chart"></canvas>
            </div>
          </div>
          <div class="card bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 mb-4">Expense Breakdown</h3>
            <div class="chart-container">
              <canvas id="expense-chart"></canvas>
            </div>
          </div>
        </div>

        <!-- Goals + Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 card bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 mb-4">Active Goals</h3>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-slate-700">Emergency Fund (₹3L)</span><span class="font-medium text-primary">85%</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2.5"><div class="bg-primary h-2.5 rounded-full" style="width:85%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-slate-700">Home Down Payment (₹20L)</span><span class="font-medium text-secondary">42%</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2.5"><div class="bg-secondary h-2.5 rounded-full" style="width:42%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-slate-700">Child Education (₹15L)</span><span class="font-medium text-accent">28%</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2.5"><div class="bg-accent h-2.5 rounded-full" style="width:28%"></div></div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1"><span class="text-slate-700">Retirement Corpus (₹5Cr)</span><span class="font-medium text-slate-500">12%</span></div>
                <div class="w-full bg-slate-100 rounded-full h-2.5"><div class="bg-slate-400 h-2.5 rounded-full" style="width:12%"></div></div>
              </div>
            </div>
          </div>
          <div class="card bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 class="font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div class="space-y-2">
              <button onclick="App.renderView('calculators')" class="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-primary/5 transition-colors text-sm"><i class="fas fa-calculator text-primary mr-2"></i>Run Calculators</button>
              <button onclick="App.renderView('transactions')" class="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-primary/5 transition-colors text-sm"><i class="fas fa-list text-secondary mr-2"></i>View Transactions</button>
              <button onclick="showNotifications()" class="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-primary/5 transition-colors text-sm"><i class="fas fa-bell text-accent mr-2"></i>Check Notifications</button>
              <button onclick="toggleDarkMode()" class="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-primary/5 transition-colors text-sm"><i class="fas fa-moon text-dark mr-2"></i>Toggle Theme</button>
            </div>
          </div>
        </div>

        <!-- AI Insights -->
        <div class="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-5 border border-primary/10">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0"><i class="fas fa-wand-magic-sparkles"></i></div>
            <div>
              <h4 class="font-semibold text-slate-800 mb-1">AI Insight</h4>
              <p class="text-sm text-slate-600">Based on your spending pattern, you could save an additional <strong class="text-primary">₹8,500/month</strong> by optimizing your subscription services and dining expenses. Your emergency fund target is 85% complete — consider allocating your next SIP bonus here.</p>
            </div>
          </div>
        </div>
      </div>
    `;

    // Initialize charts after DOM insertion
    setTimeout(() => {
      initDashboardCharts();
    }, 100);
  }

  function initDashboardCharts() {
    if (typeof Chart === 'undefined') return;

    const spendingCanvas = document.getElementById('spending-chart');
    if (spendingCanvas && !spendingCanvas._chart) {
      spendingCanvas._chart = new Chart(spendingCanvas.getContext('2d'), {
        type: 'line',
        data: {
          labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
          datasets: [
            {
              label: 'Monthly Expenses',
              data: [52000,48000,55000,62000,58000,65000,61000,59000,64000,68000,72000,70000],
              borderColor: '#0f766e',
              backgroundColor: 'rgba(15,118,110,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 3,
              pointBackgroundColor: '#0f766e',
              borderWidth: 2
            },
            {
              label: 'Income',
              data: [100000,100000,105000,100000,100000,110000,100000,100000,115000,100000,100000,120000],
              borderColor: '#14b8a6',
              backgroundColor: 'transparent',
              borderDash: [5,5],
              tension: 0.4,
              pointRadius: 3,
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => '₹' + (v/1000).toFixed(0) + 'K', font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
          }
        }
      });
    }

    const expenseCanvas = document.getElementById('expense-chart');
    if (expenseCanvas && !expenseCanvas._chart) {
      expenseCanvas._chart = new Chart(expenseCanvas.getContext('2d'), {
        type: 'doughnut',
        data: {
          labels: ['Housing','Food','Transport','Utilities','Entertainment','Healthcare','Others'],
          datasets: [{
            data: [25000,12000,8000,6000,5000,4000,10000],
            backgroundColor: ['#0f766e','#14b8a6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#94a3b8'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 }, padding: 15 } }
          }
        }
      });
    }
  }

  // Patch App.renderDashboard
  function applyPatch() {
    if (window.App && window.App.renderDashboard) {
      window.App.renderDashboard = renderDashboardFix;
      console.log('[DashboardFix] Patched App.renderDashboard');
    } else {
      setTimeout(applyPatch, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPatch);
  } else {
    applyPatch();
  }
})();
