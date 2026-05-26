/**
 * Enhanced Features Module
 * Account Aggregator · AI Explainability · Behavioral Nudges · Risk Audit Log · PDF Export
 */
(function() {
  'use strict';

  const C = n => {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  };

  // ===================== 1. BEHAVIORAL NUDGE TOASTS =====================
  const NudgeEngine = {
    queue: [],
    showing: false,

    init() {
      setTimeout(() => this.show({
        icon: 'fa-utensils',
        color: '#f59e0b',
        title: 'Spending Alert',
        message: 'You spent ₹2,400 on dining this week — 40% above average.',
        action: 'View Budget'
      }), 4000);
      setTimeout(() => this.show({
        icon: 'fa-piggy-bank',
        color: '#0f766e',
        title: 'Savings Opportunity',
        message: 'Increase your SIP by ₹1,000 to reach your home goal 6 months earlier.',
        action: 'Adjust SIP'
      }), 12000);
    },

    show(data) {
      this.queue.push(data);
      if (!this.showing) this._renderNext();
    },

    _renderNext() {
      if (this.queue.length === 0) { this.showing = false; return; }
      this.showing = true;
      const data = this.queue.shift();
      const el = document.createElement('div');
      el.className = 'fixed bottom-4 right-4 z-50 max-w-sm bg-white dark:bg-dark-light rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 transform translate-y-20 opacity-0 transition-all duration-500';
      el.innerHTML = `
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style="background:${data.color}15;color:${data.color}">
            <i class="fas ${data.icon}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-800 dark:text-white">${data.title}</p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">${data.message}</p>
            <button class="mt-2 text-xs font-medium hover:underline" style="color:${data.color}">${data.action} →</button>
          </div>
          <button class="nudge-close text-slate-400 hover:text-slate-600 text-xs"><i class="fas fa-times"></i></button>
        </div>
      `;
      document.body.appendChild(el);
      requestAnimationFrame(() => { el.classList.remove('translate-y-20', 'opacity-0'); });

      el.querySelector('.nudge-close').addEventListener('click', () => {
        el.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => { el.remove(); this._renderNext(); }, 500);
      });
      setTimeout(() => {
        if (el.parentNode) {
          el.classList.add('translate-y-20', 'opacity-0');
          setTimeout(() => { el.remove(); this._renderNext(); }, 500);
        }
      }, 7000);
    }
  };

  // ===================== 2. ACCOUNT AGGREGATOR MODAL =====================
  const AAModal = {
    show() {
      const existing = document.getElementById('aa-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'aa-modal';
      modal.className = 'fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm';
      modal.innerHTML = `
        <div class="bg-white dark:bg-dark-light rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg mx-4 overflow-hidden transform scale-95 opacity-0 transition-all duration-300" id="aa-modal-content">
          <div class="p-6 border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><i class="fas fa-link"></i></div>
                <div><h3 class="font-bold text-slate-800 dark:text-white">Account Aggregator</h3><p class="text-xs text-slate-500">Link accounts from other banks</p></div>
              </div>
              <button onclick="document.getElementById('aa-modal').remove()" class="text-slate-400 hover:text-slate-600"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div class="p-6 space-y-4">
            <div class="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20">
              <p class="text-xs text-amber-700 dark:text-amber-300"><i class="fas fa-triangle-exclamation mr-1"></i><strong>Consent Required:</strong> You must explicitly approve data sharing. You can revoke access anytime.</p>
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 cursor-pointer transition-colors aa-bank" data-bank="hdfc">
                <div class="flex items-center gap-3"><div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">HDFC</div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">HDFC Bank</span></div>
                <span class="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">Link</span>
              </div>
              <div class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 cursor-pointer transition-colors aa-bank" data-bank="sbi">
                <div class="flex items-center gap-3"><div class="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white text-xs font-bold">SBI</div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">State Bank of India</span></div>
                <span class="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">Link</span>
              </div>
              <div class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-primary/50 cursor-pointer transition-colors aa-bank" data-bank="icici">
                <div class="flex items-center gap-3"><div class="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">ICICI</div><span class="text-sm font-medium text-slate-700 dark:text-slate-200">ICICI Bank</span></div>
                <span class="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">Link</span>
              </div>
            </div>
            <label class="flex items-start gap-2 text-xs text-slate-500 cursor-pointer">
              <input type="checkbox" class="mt-0.5" id="aa-consent">
              <span>I consent to fetch my account information via Account Aggregator framework. Data will be encrypted and used only for net worth calculation.</span>
            </label>
          </div>
          <div class="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button id="aa-link-btn" class="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed" disabled>Link Selected Accounts</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      requestAnimationFrame(() => {
        const content = document.getElementById('aa-modal-content');
        if (content) { content.classList.remove('scale-95', 'opacity-0'); }
      });

      // Consent toggle
      const consent = modal.querySelector('#aa-consent');
      const btn = modal.querySelector('#aa-link-btn');
      consent.addEventListener('change', () => {
        btn.disabled = !consent.checked;
        btn.classList.toggle('opacity-50', !consent.checked);
        btn.classList.toggle('cursor-not-allowed', !consent.checked);
      });

      // Bank selection
      let selected = [];
      modal.querySelectorAll('.aa-bank').forEach(row => {
        row.addEventListener('click', () => {
          const bank = row.dataset.bank;
          const badge = row.querySelector('span:last-child');
          if (selected.includes(bank)) {
            selected = selected.filter(b => b !== bank);
            row.classList.remove('border-primary', 'bg-primary/5');
            badge.textContent = 'Link';
            badge.className = 'text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded';
          } else {
            selected.push(bank);
            row.classList.add('border-primary', 'bg-primary/5');
            badge.textContent = 'Selected';
            badge.className = 'text-xs px-2 py-1 bg-primary text-white rounded';
          }
        });
      });

      btn.addEventListener('click', () => {
        if (selected.length === 0) return;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-2"></i>Connecting...';
        setTimeout(() => {
          modal.remove();
          this._showSuccess(selected);
        }, 2000);
      });
    },

    _showSuccess(banks) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 z-[100] max-w-sm bg-emerald-500 text-white rounded-xl shadow-lg p-4 transform translate-x-full transition-all duration-500';
      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <i class="fas fa-check-circle text-xl"></i>
          <div>
            <p class="font-semibold text-sm">Accounts Linked!</p>
            <p class="text-xs text-emerald-100">${banks.length} bank(s) connected. Net worth updated.</p>
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
      setTimeout(() => { toast.classList.add('translate-x-full'); setTimeout(() => toast.remove(), 500); }, 5000);

      // Update net worth stat if visible
      setTimeout(() => {
        if (window.App && window.App.renderDashboard) {
          window.App.renderView('dashboard');
        }
      }, 600);
    }
  };

  // ===================== 3. AI EXPLAINABILITY TOOLTIP =====================
  const Explainability = {
    attach() {
      document.addEventListener('click', e => {
        const btn = e.target.closest('.explain-btn');
        if (!btn) return;
        e.stopPropagation();
        const text = btn.dataset.explain || 'This recommendation is based on your historical data and current market conditions.';
        this.show(btn, text);
      });
      document.addEventListener('click', () => {
        const existing = document.getElementById('explain-popup');
        if (existing) existing.remove();
      });
    },

    show(anchor, text) {
      const existing = document.getElementById('explain-popup');
      if (existing) existing.remove();

      const popup = document.createElement('div');
      popup.id = 'explain-popup';
      popup.className = 'fixed z-[90] max-w-xs bg-slate-800 text-white text-xs rounded-lg shadow-xl p-3';
      popup.innerHTML = `
        <div class="flex items-start gap-2">
          <i class="fas fa-circle-info text-primary mt-0.5"></i>
          <p class="leading-relaxed">${text}</p>
        </div>
        <div class="mt-2 pt-2 border-t border-slate-700 text-[10px] text-slate-400">Powered by SecureWealth AI · Responsible recommendations</div>
      `;
      document.body.appendChild(popup);

      const rect = anchor.getBoundingClientRect();
      popup.style.left = Math.min(rect.left, window.innerWidth - 240) + 'px';
      popup.style.top = (rect.bottom + 8) + 'px';
    }
  };

  // ===================== 4. RISK AUDIT LOG VIEWER =====================
  const AuditLog = {
    data: [
      { time: '18 Apr, 10:23 AM', action: 'SIP Payment', amount: 5000, riskScore: 12, level: 'Low', device: 'Trusted', signals: ['Device Trust: Pass', 'Amount: Normal', 'Behavior: Normal'] },
      { time: '17 Apr, 09:15 AM', action: 'Salary Credit', amount: 125000, riskScore: 5, level: 'Low', device: 'Trusted', signals: ['Device Trust: Pass', 'Amount: Normal'] },
      { time: '14 Apr, 03:45 PM', action: 'Mutual Fund Lump Sum', amount: 25000, riskScore: 42, level: 'Medium', device: 'Trusted', signals: ['Device Trust: Pass', 'Amount: 2.5x average', 'First-time: Review applied'] },
      { time: '12 Apr, 11:30 AM', action: 'Rent Transfer', amount: 25000, riskScore: 15, level: 'Low', device: 'Trusted', signals: ['Device Trust: Pass', 'Pattern: Recurring'] },
      { time: '10 Apr, 02:10 PM', action: 'Large Transfer Attempt', amount: 500000, riskScore: 78, level: 'High', device: 'New', signals: ['Device Trust: FAIL', 'Amount: 10x average', 'OTP: 3 attempts', 'Action: BLOCKED'] },
    ],

    render() {
      const container = document.getElementById('main-content');
      if (!container) return;
      window.App && window.App.charts && Object.values(window.App.charts).forEach(c => c && c.destroy && c.destroy());

      container.innerHTML = `
        <div class="space-y-6 pb-8">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Risk Audit Log</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Complete transaction history with fraud risk analysis</p>
            </div>
            <div class="flex gap-2">
              <select class="px-3 py-2 bg-white dark:bg-dark-light border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                <option>All Risk Levels</option><option>Low</option><option>Medium</option><option>High</option>
              </select>
              <button onclick="window.print()" class="px-3 py-2 bg-primary text-white text-sm rounded-lg"><i class="fas fa-download mr-1"></i>Export</button>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-emerald-500">${this.data.filter(d => d.level === 'Low').length}</p>
              <p class="text-xs text-slate-500">Low Risk</p>
            </div>
            <div class="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-amber-500">${this.data.filter(d => d.level === 'Medium').length}</p>
              <p class="text-xs text-slate-500">Medium Risk</p>
            </div>
            <div class="bg-rose-500/5 border border-rose-500/20 rounded-xl p-4 text-center">
              <p class="text-2xl font-bold text-rose-500">${this.data.filter(d => d.level === 'High').length}</p>
              <p class="text-xs text-slate-500">High Risk / Blocked</p>
            </div>
          </div>

          <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-500 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    <th class="px-5 py-3 font-medium">Time</th>
                    <th class="px-5 py-3 font-medium">Action</th>
                    <th class="px-5 py-3 font-medium text-right">Amount</th>
                    <th class="px-5 py-3 font-medium text-center">Risk Score</th>
                    <th class="px-5 py-3 font-medium">Decision</th>
                    <th class="px-5 py-3 font-medium">Signals</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.data.map(row => `
                    <tr class="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td class="px-5 py-3 text-slate-500 whitespace-nowrap">${row.time}</td>
                      <td class="px-5 py-3 font-medium text-slate-800 dark:text-white">${row.action}</td>
                      <td class="px-5 py-3 text-right font-medium">${C(row.amount)}</td>
                      <td class="px-5 py-3 text-center">
                        <div class="inline-flex items-center gap-1.5">
                          <div class="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div class="h-1.5 rounded-full ${row.riskScore >= 60 ? 'bg-rose-500' : row.riskScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width:${Math.min(row.riskScore, 100)}%"></div>
                          </div>
                          <span class="text-xs font-bold ${row.riskScore >= 60 ? 'text-rose-500' : row.riskScore >= 30 ? 'text-amber-500' : 'text-emerald-500'}">${row.riskScore}</span>
                        </div>
                      </td>
                      <td class="px-5 py-3">
                        <span class="px-2 py-1 rounded-full text-xs font-medium ${row.level === 'High' ? 'bg-rose-100 text-rose-700' : row.level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}">
                          ${row.level === 'High' ? 'Blocked' : row.level === 'Medium' ? 'Warning' : 'Allowed'}
                        </span>
                      </td>
                      <td class="px-5 py-3 text-xs text-slate-500">
                        ${row.signals.map(s => `<div class="flex items-center gap-1"><i class="fas fa-check text-[8px] ${s.includes('FAIL') || s.includes('BLOCKED') ? 'text-rose-500' : 'text-emerald-500'}"></i>${s}</div>`).join('')}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }
  };

  // ===================== 5. PDF REPORT EXPORT =====================
  const PDFExport = {
    generate() {
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) { alert('Please allow popups to generate the report'); return; }

      const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Financial Health Report - Rahul Sharma</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Segoe UI',Arial,sans-serif; color:#1e293b; line-height:1.6; padding:40px; max-width:800px; margin:0 auto; }
    .header { text-align:center; border-bottom:3px solid #0f766e; padding-bottom:20px; margin-bottom:30px; }
    .header h1 { color:#0f766e; font-size:28px; }
    .header p { color:#64748b; font-size:14px; margin-top:5px; }
    .section { margin-bottom:30px; }
    .section h2 { color:#0f766e; font-size:18px; border-bottom:1px solid #e2e8f0; padding-bottom:8px; margin-bottom:15px; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:15px; }
    .card { background:#f8fafc; border-radius:8px; padding:15px; border:1px solid #e2e8f0; }
    .card-label { font-size:12px; color:#64748b; text-transform:uppercase; letter-spacing:0.5px; }
    .card-value { font-size:22px; font-weight:bold; color:#0f766e; margin-top:5px; }
    .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
    .badge-green { background:#d1fae5; color:#065f46; }
    .badge-amber { background:#fef3c7; color:#92400e; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th, td { padding:10px; text-align:left; border-bottom:1px solid #e2e8f0; }
    th { background:#f1f5f9; font-weight:600; color:#475569; }
    .footer { margin-top:40px; padding-top:20px; border-top:1px solid #e2e8f0; text-align:center; font-size:11px; color:#94a3b8; }
    .print-btn { position:fixed; top:20px; right:20px; padding:10px 20px; background:#0f766e; color:#fff; border:none; border-radius:6px; cursor:pointer; font-size:14px; }
    @media print { .print-btn { display:none; } body { padding:20px; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()"><i class="fas fa-print"></i> Print / Save as PDF</button>
  <div class="header">
    <h1>🏦 SecureWealth Twin</h1>
    <p>Financial Health Report · Generated on ${new Date().toLocaleDateString('en-IN')}</p>
    <p style="margin-top:10px; font-weight:600;">Rahul Sharma · Age 32 · Risk Appetite: Moderate</p>
  </div>

  <div class="section">
    <h2>Executive Summary</h2>
    <div class="grid">
      <div class="card"><div class="card-label">Total Net Worth</div><div class="card-value">₹45.20 Lakhs</div></div>
      <div class="card"><div class="card-label">Financial Health Score</div><div class="card-value">78/100 <span class="badge badge-green">Good</span></div></div>
      <div class="card"><div class="card-label">Monthly Savings Rate</div><div class="card-value">22.4%</div></div>
      <div class="card"><div class="card-label">Protection Score</div><div class="card-value">94/100 <span class="badge badge-green">Excellent</span></div></div>
    </div>
  </div>

  <div class="section">
    <h2>Asset Breakdown</h2>
    <table>
      <tr><th>Category</th><th>Amount</th><th>% of Total</th></tr>
      <tr><td>Bank Accounts</td><td>₹8,50,000</td><td>18.8%</td></tr>
      <tr><td>Investments</td><td>₹21,30,000</td><td>47.1%</td></tr>
      <tr><td>Physical Assets</td><td>₹15,40,000</td><td>34.1%</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Goals Progress</h2>
    <table>
      <tr><th>Goal</th><th>Target</th><th>Current</th><th>Progress</th></tr>
      <tr><td>Emergency Fund</td><td>₹3,00,000</td><td>₹2,55,000</td><td>85%</td></tr>
      <tr><td>Home Down Payment</td><td>₹20,00,000</td><td>₹8,40,000</td><td>42%</td></tr>
      <tr><td>Retirement Corpus</td><td>₹5,00,00,000</td><td>₹24,00,000</td><td>4.8%</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>AI Recommendations</h2>
    <ul style="padding-left:20px; font-size:14px; color:#475569;">
      <li>Increase monthly SIP by ₹1,000 to reach home goal 6 months earlier</li>
      <li>Invest remaining ₹50,000 in ELSS for Section 80C benefit</li>
      <li>Consider shifting 5% from equity to debt given current market highs</li>
      <li>Emergency fund at 85% — prioritize completing before new investments</li>
    </ul>
  </div>

  <div class="section">
    <h2>Disclaimer</h2>
    <p style="font-size:12px; color:#64748b;">
      This report is generated for demonstration purposes only. All data is simulated. 
      SecureWealth Twin does not provide guaranteed investment returns. KYC is required before real investments. 
      Please consult a SEBI-registered investment advisor before making financial decisions.
    </p>
  </div>

  <div class="footer">
    <p>SecureWealth Twin · PSBs Hackathon Series-2026</p>
    <p>Built by Deepanshu Sharma · deepanshu.sharma8@s.amity.edu</p>
  </div>
</body>
</html>`;
      reportWindow.document.write(html);
      reportWindow.document.close();
    }
  };

  // ===================== 6. SME / BUSINESS MODE TOGGLE =====================
  const BusinessMode = {
    active: false,
    toggle() {
      this.active = !this.active;
      const badge = document.getElementById('business-mode-badge');
      if (badge) {
        badge.textContent = this.active ? 'Business Mode' : 'Retail Mode';
        badge.className = `px-2 py-1 rounded-full text-[10px] font-bold ${this.active ? 'bg-amber-500 text-white' : 'bg-primary/10 text-primary'}`;
      }
      if (this.active) {
        this._renderBusinessView();
      } else {
        if (window.App && window.App.renderView) window.App.renderView('dashboard');
      }
    },

    _renderBusinessView() {
      const container = document.getElementById('main-content');
      if (!container) return;
      Object.values(window.App?.charts || {}).forEach(c => c && c.destroy && c.destroy());

      container.innerHTML = `
        <div class="space-y-6 pb-8">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Sharma Enterprises</h2>
              <p class="text-sm text-slate-500 dark:text-slate-400">Business Wealth Management · GST: 07AABCS1234A1Z5</p>
            </div>
            <button onclick="BusinessMode.toggle()" class="px-4 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600">
              <i class="fas fa-repeat mr-1"></i>Switch to Retail
            </button>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <p class="text-xs text-slate-500 uppercase">Working Capital</p>
              <p class="text-xl font-bold text-slate-800 dark:text-white mt-1">${C(12500000)}</p>
            </div>
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <p class="text-xs text-slate-500 uppercase">Monthly Revenue</p>
              <p class="text-xl font-bold text-slate-800 dark:text-white mt-1">${C(8500000)}</p>
            </div>
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <p class="text-xs text-slate-500 uppercase">Cash Flow</p>
              <p class="text-xl font-bold text-emerald-500 mt-1">+${C(2300000)}</p>
            </div>
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <p class="text-xs text-slate-500 uppercase">Liquidity Ratio</p>
              <p class="text-xl font-bold text-slate-800 dark:text-white mt-1">2.4x</p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Cash Flow Forecast (6 Months)</h3>
              <div class="relative h-64"><canvas id="biz-cashflow-chart"></canvas></div>
            </div>
            <div class="bg-white dark:bg-dark-light rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
              <h3 class="font-semibold text-slate-800 dark:text-white mb-4">Surplus Fund Suggestions</h3>
              <div class="space-y-3">
                <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                  <p class="text-sm font-medium text-slate-800 dark:text-white">Liquid Funds</p>
                  <p class="text-xs text-slate-500">Park ₹50L surplus in overnight/liquid funds for 6-7% returns with same-day redemption</p>
                </div>
                <div class="p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10">
                  <p class="text-sm font-medium text-slate-800 dark:text-white">Arbitrage Funds</p>
                  <p class="text-xs text-slate-500">Tax-efficient option for 3+ month horizon. ~6.5% returns, equity taxation.</p>
                </div>
                <div class="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-100 dark:border-amber-500/20">
                  <p class="text-sm font-medium text-slate-800 dark:text-white">T-Bills / G-Secs</p>
                  <p class="text-xs text-slate-500">Zero-risk government securities for 91-364 days. ~6.8% yield.</p>
                </div>
              </div>
            </div>
          </div>
        </div>`;

      setTimeout(() => {
        const ctx = document.getElementById('biz-cashflow-chart');
        if (ctx && window.Chart) {
          const wrap = ctx.parentElement;
          if (wrap && wrap.clientWidth > 0 && wrap.clientHeight > 0) {
            ctx.width = wrap.clientWidth;
            ctx.height = wrap.clientHeight;
          }
          new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
              labels: ['May','Jun','Jul','Aug','Sep','Oct'],
              datasets: [
                { label: 'Inflow', data: [85,88,92,87,95,98].map(v => v * 100000), backgroundColor: '#0f766e', borderRadius: 4 },
                { label: 'Outflow', data: [62,65,68,64,70,72].map(v => v * 100000), backgroundColor: '#ef4444', borderRadius: 4 }
              ]
            },
            options: {
              responsive: false, maintainAspectRatio: false, animation: { duration: 0 },
              plugins: { legend: { position: 'top' } },
              scales: {
                y: { grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { callback: v => '₹' + (v/1e5).toFixed(0) + 'L' } },
                x: { grid: { display: false } }
              }
            }
          });
        }
      }, 100);
    }
  };
  window.BusinessMode = BusinessMode;

  // ===================== EXPOSE GLOBALS =====================
  window.AAModal = AAModal;
  window.AuditLog = AuditLog;
  window.PDFExport = PDFExport;
  window.Explainability = Explainability;

  // ===================== INIT =====================
  document.addEventListener('DOMContentLoaded', () => {
    NudgeEngine.init();
    Explainability.attach();

    // Add Business Mode badge to header if not exists
    setTimeout(() => {
      const header = document.querySelector('header') || document.getElementById('app');
      if (header && !document.getElementById('business-mode-badge')) {
        const badge = document.createElement('button');
        badge.id = 'business-mode-badge';
        badge.className = 'px-2 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary';
        badge.innerHTML = '<i class="fas fa-building mr-1"></i>Retail Mode';
        badge.onclick = () => BusinessMode.toggle();
        const target = header.querySelector('.flex') || header;
        if (target) target.appendChild(badge);
      }
    }, 2000);
  });
})();
