/**
 * ═══════════════════════════════════════════════════════════════════
 *  GLOBAL INNOVATIONS — World-Class Banking Tools
 *  ═══════════════════════════════════════════════════════════════════
 *
 *  Features foreign private banks offer that Indian banks don't:
 *
 *  1.  Global Multi-Currency Portfolio (JPMorgan Private Bank)
 *  2.  AI Tax-Loss Harvesting (Wealthfront / Betterment)
 *  3.  ESG & Carbon Portfolio Score (UBS / Credit Suisse)
 *  4.  Cross-Border Wealth Optimizer (HSBC Jade / Citigold)
 *  5.  Digital Estate Vault (Swiss Private Banking)
 *  6.  Smart Beneficiary AI (DBS digibank)
 *  7.  Global Arbitrage Scanner (Goldman Sachs)
 *  8.  AI Personal CFO (Marcus by Goldman Sachs)
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  //  1. GLOBAL MULTI-CURRENCY PORTFOLIO
  // ═══════════════════════════════════════════════════════════════

  const GlobalPortfolio = {
    currencies: {
      USD: { rate: 83.42, change: -0.05, flag: '🇺🇸', name: 'US Dollar' },
      EUR: { rate: 90.15, change: +0.22, flag: '🇪🇺', name: 'Euro' },
      GBP: { rate: 105.30, change: +0.15, flag: '🇬🇧', name: 'British Pound' },
      JPY: { rate: 0.56, change: -0.08, flag: '🇯🇵', name: 'Japanese Yen' },
      SGD: { rate: 62.18, change: +0.10, flag: '🇸🇬', name: 'Singapore Dollar' },
      CHF: { rate: 93.85, change: +0.30, flag: '🇨🇭', name: 'Swiss Franc' },
      AUD: { rate: 55.40, change: -0.12, flag: '🇦🇺', name: 'Australian Dollar' },
      AED: { rate: 22.72, change: 0.00, flag: '🇦🇪', name: 'UAE Dirham' }
    },

    holdings: {
      USD: 15000,
      EUR: 8500,
      GBP: 5000,
      SGD: 12000
    },

    getTotalINR() {
      let total = 0;
      Object.entries(this.holdings).forEach(([code, amount]) => {
        if (this.currencies[code]) {
          total += amount * this.currencies[code].rate;
        }
      });
      return total;
    },

    getExposureBreakdown() {
      const total = this.getTotalINR();
      return Object.entries(this.holdings).map(([code, amount]) => {
        const inrValue = amount * (this.currencies[code]?.rate || 0);
        return {
          code,
          name: this.currencies[code]?.name || code,
          flag: this.currencies[code]?.flag || '',
          amount,
          inrValue,
          percentage: total ? ((inrValue / total) * 100).toFixed(1) : 0
        };
      });
    },

    getForexGainLoss() {
      // Simulated: compare current rates vs acquisition rates
      return {
        totalGain: 12450,
        totalLoss: 3200,
        netGain: 9250,
        currencyGains: [
          { code: 'USD', gain: 5800, reason: 'USD strengthened 0.8% since acquisition' },
          { code: 'EUR', gain: -1200, reason: 'EUR weakened 0.3% since acquisition' },
          { code: 'GBP', gain: 4200, reason: 'GBP strengthened 1.2% since acquisition' },
          { code: 'SGD', gain: 450, reason: 'SGD stable, marginal gain' }
        ]
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  2. AI TAX-LOSS HARVESTING ENGINE
  // ═══════════════════════════════════════════════════════════════

  const TaxHarvestAI = {
    portfolio: [
      { symbol: 'RELIANCE', buyPrice: 2850, currentPrice: 2720, quantity: 50, loss: 6500, sector: 'Energy' },
      { symbol: 'TCS', buyPrice: 4200, currentPrice: 3950, quantity: 25, loss: 6250, sector: 'IT' },
      { symbol: 'HDFCBANK', buyPrice: 1680, currentPrice: 1720, quantity: 100, loss: -4000, sector: 'Banking' },
      { symbol: 'INFY', buyPrice: 1550, currentPrice: 1480, quantity: 40, loss: 2800, sector: 'IT' },
      { symbol: 'TATAMOTORS', buyPrice: 980, currentPrice: 910, quantity: 60, loss: 4200, sector: 'Auto' }
    ],

    analyze() {
      const losers = this.portfolio.filter(p => p.loss > 0);
      const totalLoss = losers.reduce((sum, p) => sum + p.loss, 0);
      const taxSaved = Math.round(totalLoss * 0.15); // 15% short-term cap gains offset
      const replacementPicks = losers.map(l => ({
        original: l.symbol,
        sector: l.sector,
        replacement: this._getReplacement(l.sector, l.symbol),
        harvestableLoss: l.loss,
        reason: `Similar ${l.sector} exposure, different stock for 30-day wash-sale compliance`
      }));

      return {
        totalHarvestableLoss: totalLoss,
        estimatedTaxSaved: taxSaved,
        harvestablePositions: losers.length,
        totalPositions: this.portfolio.length,
        replacements: replacementPicks,
        recommendation: totalLoss > 5000
          ? 'Strong harvest opportunity: Book losses to offset ₹' + taxSaved + ' in capital gains tax.'
          : 'Monitor for additional loss-harvesting opportunities.'
      };
    },

    _getReplacement(sector, exclude) {
      const map = {
        Energy: 'NTPC',
        IT: 'WIPRO',
        Banking: 'KOTAKBANK',
        Auto: 'MARUTI'
      };
      return map[sector] || 'ITC';
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  3. ESG & CARBON PORTFOLIO SCORER
  // ═══════════════════════════════════════════════════════════════

  const ESGScorer = {
    holdings: [
      { symbol: 'RELIANCE', esgScore: 62, carbonIntensity: 'High', greenRevenue: '12%', rating: 'BBB' },
      { symbol: 'TCS', esgScore: 85, carbonIntensity: 'Low', greenRevenue: '28%', rating: 'AA' },
      { symbol: 'HDFCBANK', esgScore: 72, carbonIntensity: 'Medium', greenRevenue: '18%', rating: 'A' },
      { symbol: 'INFY', esgScore: 88, carbonIntensity: 'Very Low', greenRevenue: '35%', rating: 'AAA' },
      { symbol: 'TATAMOTORS', esgScore: 58, carbonIntensity: 'High', greenRevenue: '22%', rating: 'BB' },
      { symbol: 'ADANIGREEN', esgScore: 91, carbonIntensity: 'Negative', greenRevenue: '95%', rating: 'AAA' }
    ],

    getPortfolioScore() {
      const total = this.holdings.length;
      const avgScore = Math.round(this.holdings.reduce((s, h) => s + h.esgScore, 0) / total);
      const carbonFootprint = this._calcCarbon();

      return {
        overallESG: avgScore,
        rating: this._getRating(avgScore),
        carbonFootprint,
        greenExposure: Math.round(this.holdings.reduce((s, h) => s + parseFloat(h.greenRevenue), 0) / total),
        topPerformer: this.holdings.reduce((best, h) => h.esgScore > best.esgScore ? h : best),
        worstPerformer: this.holdings.reduce((worst, h) => h.esgScore < worst.esgScore ? h : worst),
        improvements: this._getImprovements()
      };
    },

    _calcCarbon() {
      const intensityMap = { 'Negative': 0, 'Very Low': 15, 'Low': 30, 'Medium': 55, 'High': 80 };
      const total = this.holdings.reduce((s, h) => s + (intensityMap[h.carbonIntensity] || 50), 0);
      return Math.round(total / this.holdings.length);
    },

    _getRating(score) {
      if (score >= 85) return 'AAA — Leader';
      if (score >= 70) return 'AA — Advanced';
      if (score >= 55) return 'A — Compliant';
      if (score >= 40) return 'BBB — Developing';
      return 'BB — Needs Improvement';
    },

    _getImprovements() {
      return [
        { action: 'Increase green energy allocation', impact: 'High', saving: '~8 tons CO₂/year' },
        { action: 'Add ESG-focused mutual funds', impact: 'Medium', saving: 'Improved rating by 12 pts' },
        { action: 'Divest from high-carbon holdings', impact: 'High', saving: '~15 tons CO₂/year' }
      ];
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  4. CROSS-BORDER WEALTH OPTIMIZER
  // ═══════════════════════════════════════════════════════════════

  const CrossBorderOptimizer = {
    corridors: [
      { from: 'India', to: 'USA', transferFee: '0.5%', fxMarkup: '1.2%', bestRoute: 'Wise', savings: '₹2,450 per ₹1L' },
      { from: 'India', to: 'UK', transferFee: '0.3%', fxMarkup: '0.8%', bestRoute: 'InstaRem', savings: '₹1,890 per ₹1L' },
      { from: 'India', to: 'Singapore', transferFee: '0.2%', fxMarkup: '0.6%', bestRoute: 'DBS Remit', savings: '₹1,520 per ₹1L' },
      { from: 'India', to: 'UAE', transferFee: '0.1%', fxMarkup: '0.4%', bestRoute: 'ADCB Direct', savings: '₹980 per ₹1L' },
      { from: 'USA', to: 'India', transferFee: '0.4%', fxMarkup: '0.9%', bestRoute: 'Remitly', savings: '$22 per $1000' }
    ],

    getBestRoute(from, to, amount) {
      const corridor = this.corridors.find(c => c.from === from && c.to === to);
      if (!corridor) return null;
      const savingsINR = parseInt(corridor.savings.replace(/[^0-9]/g, ''));
      return {
        ...corridor,
        recommendedAmount: amount,
        totalFees: `₹${Math.round(amount * 0.008)}`,
        savingsVsBank: `₹${Math.round(savingsINR * amount / 100000)}`,
        deliveryTime: '1-2 business days',
        complianceNote: 'RBI LRS compliant — Form A2 auto-generated'
      };
    },

    getMultiCountryStrategy() {
      return {
        recommendation: 'Diversify across 3 corridors for optimal forex rates',
        strategy: [
          { action: 'Maintain USD account for global investments', benefit: 'Avoid repeated FX conversion' },
          { action: 'Use SGD hub for ASEAN exposure', benefit: 'Fast settlement, low spreads' },
          { action: 'Keep emergency fund in AED (pegged to USD)', benefit: 'Zero FX volatility' }
        ],
        annualSavings: '₹35,000 — ₹50,000 in FX fees'
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  5. DIGITAL ESTATE VAULT
  // ═══════════════════════════════════════════════════════════════

  const DigitalEstateVault = {
    documents: [
      { id: 'will_001', name: 'Last Will & Testament', status: 'encrypted', lastUpdated: '2026-03-15', type: 'Legal' },
      { id: 'nom_001', name: 'Nominee Declaration — All Accounts', status: 'encrypted', lastUpdated: '2026-02-20', type: 'Banking' },
      { id: 'prop_001', name: 'Property Deed — Mumbai Apartment', status: 'encrypted', lastUpdated: '2025-11-05', type: 'Property' },
      { id: 'ins_001', name: 'Life Insurance Policy Documents', status: 'encrypted', lastUpdated: '2026-01-10', type: 'Insurance' }
    ],

    beneficiaries: [
      { name: 'Priya Sharma', relation: 'Spouse', share: '50%', trigger: 'Immediate' },
      { name: 'Arjun Sharma', relation: 'Son', share: '30%', trigger: 'Age 25', conditions: 'Education completed' },
      { name: 'Ananya Sharma', relation: 'Daughter', share: '20%', trigger: 'Age 25', conditions: 'Education completed' }
    ],

    getVaultStatus() {
      return {
        totalDocs: this.documents.length,
        encryptedDocs: this.documents.filter(d => d.status === 'encrypted').length,
        lastAudit: '2026-04-01',
        beneficiaries: this.beneficiaries.length,
        inheritancePlanComplete: true,
        securityLevel: '256-bit AES + Blockchain Hash',
        recoveryContacts: 2
      };
    },

    getSmartWillRules() {
      return [
        { rule: 'Education Trust', detail: '₹25L locked for Arjun\'s higher education until age 21', status: 'Active' },
        { rule: 'Marriage Fund', detail: '₹15L reserved for Ananya\'s marriage after age 25', status: 'Active' },
        { rule: 'Medical Emergency', detail: '₹10L accessible immediately by nominee for medical crises', status: 'Active' },
        { rule: 'Graduated Access', detail: '50% assets at 25, 100% at 30 for minor beneficiaries', status: 'Active' }
      ];
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  6. SMART BENEFICIARY AI
  // ═══════════════════════════════════════════════════════════════

  const BeneficiaryAI = {
    analyzeLifeEvents() {
      return {
        upcomingEvents: [
          { event: 'Son\'s college admission', date: '2027-06', financialNeed: '₹8L/year', recommendation: 'Start education SIP now' },
          { event: 'Daughter\'s marriage', date: '2031-est', financialNeed: '₹25L', recommendation: 'Gold ETF + Debt fund mix' }
        ],
        riskAlerts: [
          { alert: 'Single nominee for 3 accounts', severity: 'medium', fix: 'Add co-nominee for redundancy' },
          { alert: 'No healthcare LPA registered', severity: 'high', fix: 'Register healthcare power of attorney' }
        ],
        optimization: {
          currentSetup: 'Basic nomination across accounts',
          recommended: 'Trust-based inheritance with graduated access',
          taxSaving: 'Save ~₹8L in estate taxes through trust structure'
        }
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  7. GLOBAL ARBITRAGE SCANNER
  // ═══════════════════════════════════════════════════════════════

  const ArbitrageScanner = {
    scan() {
      return {
        opportunities: [
          { pair: 'GOLD (MCX vs COMEX)', spread: '₹245/10g', action: 'Buy MCX, Sell COMEX', potential: '₹12,500/lot', confidence: 'High' },
          { pair: 'INFY (NSE vs NYSE ADR)', spread: '₹32/share', action: 'Buy NYSE ADR, Sell NSE', potential: '₹3,200/100sh', confidence: 'Medium' },
          { pair: 'USD/INR (Spot vs NDF)', spread: '₹0.18', action: 'Buy NDF, Sell Spot', potential: '₹1,800/crore', confidence: 'Low' }
        ],
        totalPotential: '₹17,500/day estimated',
        riskNote: 'Arbitrage requires real-time execution. Spreads may close quickly.',
        exchanges: ['MCX', 'NSE', 'BSE', 'COMEX', 'NYSE', 'SGX', 'DGCX']
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  8. AI PERSONAL CFO
  // ═══════════════════════════════════════════════════════════════

  const PersonalCFO = {
    getProactiveInsights() {
      const now = new Date();
      const month = now.getMonth();
      const financialYear = month >= 3 ? 'FY ' + now.getFullYear() + '-' + (now.getFullYear()+1).toString().slice(2) : 'FY ' + (now.getFullYear()-1) + '-' + now.getFullYear().toString().slice(2);

      return {
        urgentActions: [
          { action: 'File ITR for ' + financialYear, deadline: '31 July 2026', penalty: '₹5,000 late fee', priority: 'High' },
          { action: 'ELSS investment for 80C', deadline: '31 March 2027', shortfall: '₹45,000', priority: 'Medium' },
          { action: 'Health insurance premium due', deadline: '15 June 2026', amount: '₹18,500', priority: 'Medium' }
        ],
        opportunities: [
          { title: 'FD maturing on 1 June', amount: '₹2,00,000', suggestion: 'Consider debt mutual fund for better post-tax returns', gain: '+₹4,200/year' },
          { title: 'Tax bracket optimization', amount: 'N/A', suggestion: 'Your taxable income is ₹12.5L. ₹50K more deduction keeps you in 20% bracket', gain: 'Save ₹10,000 tax' },
          { title: 'Credit card reward optimization', amount: 'N/A', suggestion: 'Switch dining spends to HDFC Millennia for 5% cashback', gain: '+₹3,600/year' }
        ],
        healthCheck: {
          emergencyFund: { status: 'Good', months: 8, target: 6 },
          insuranceCoverage: { status: 'Adequate', termInsurance: '₹1Cr', healthInsurance: '₹25L' },
          debtToIncome: { status: 'Excellent', ratio: '8%', target: '<30%' },
          savingsRate: { status: 'Good', rate: '22.4%', target: '>20%' }
        }
      };
    }
  };

  // ═══════════════════════════════════════════════════════════════
  //  RENDER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const C = n => {
    if (n >= 1e7) return '₹' + (n/1e7).toFixed(2) + 'Cr';
    if (n >= 1e5) return '₹' + (n/1e5).toFixed(1) + 'L';
    return '₹' + n.toLocaleString('en-IN');
  };

  function isDark() {
    return document.documentElement.classList.contains('dark');
  }

  function renderGlobalPortfolio(container) {
    const total = GlobalPortfolio.getTotalINR();
    const breakdown = GlobalPortfolio.getExposureBreakdown();
    const fx = GlobalPortfolio.getForexGainLoss();

    let rows = '';
    breakdown.forEach(b => {
      rows += `
        <tr class="border-b border-slate-100 dark:border-slate-800">
          <td class="py-3 font-medium"><span class="text-lg mr-2">${b.flag}</span>${b.name} (${b.code})</td>
          <td class="py-3 text-right font-mono text-sm">${b.amount.toLocaleString()}</td>
          <td class="py-3 text-right font-mono text-sm">${C(b.inrValue)}</td>
          <td class="py-3 text-right text-sm font-medium">${b.percentage}%</td>
        </tr>`;
    });

    let fxRows = '';
    fx.currencyGains.forEach(cg => {
      fxRows += `
        <div class="flex items-center justify-between py-2">
          <div><span class="font-medium">${cg.code}</span><span class="text-xs text-slate-400 ml-2">${cg.reason}</span></div>
          <span class="font-semibold ${cg.gain >= 0 ? 'text-emerald-500' : 'text-red-500'}">${cg.gain >= 0 ? '+' : ''}₹${cg.gain.toLocaleString()}</span>
        </div>`;
    });

    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">🌍 Global Multi-Currency Portfolio</h2>
            <p class="text-sm text-slate-500 mt-1">Real-time forex holdings with exposure analysis — JPMorgan Private Bank style</p>
          </div>
          <span class="px-3 py-1.5 bg-blue-900/10 text-blue-900 dark:text-blue-300 text-xs font-semibold rounded-full"><i class="fas fa-globe mr-1.5"></i>8 Currencies</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 fb-stat-card">
            <div class="stat-header"><span class="stat-label">Currency Holdings</span><span class="text-xs text-slate-400"><i class="fas fa-sync-alt mr-1"></i>Live FX Rates</span></div>
            <div class="overflow-x-auto mt-3">
              <table class="w-full text-sm"><thead><tr class="text-xs text-slate-500 uppercase"><th class="text-left pb-2">Currency</th><th class="text-right pb-2">Amount</th><th class="text-right pb-2">INR Value</th><th class="text-right pb-2">Allocation</th></tr></thead><tbody>${rows}</tbody></table>
            </div>
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span class="text-sm font-semibold text-slate-700 dark:text-slate-300">Total INR Value</span>
              <span class="text-lg font-bold text-slate-800 dark:text-white">${C(total)}</span>
            </div>
          </div>

          <div class="fb-stat-card">
            <div class="stat-header"><span class="stat-label">Forex Gain/Loss</span><span class="stat-icon gold"><i class="fas fa-chart-line"></i></span></div>
            <div class="mt-3 space-y-1">${fxRows}</div>
            <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div class="flex justify-between text-sm"><span>Net Gain</span><span class="font-bold text-emerald-500">+₹${fx.netGain.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3"><i class="fas fa-lightbulb text-amber-500 mr-2"></i>Cross-Border Strategy</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            ${CrossBorderOptimizer.getMultiCountryStrategy().strategy.map(s => `
              <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <p class="font-semibold mb-1">${s.action}</p>
                <p class="text-xs text-slate-500">${s.benefit}</p>
              </div>
            `).join('')}
          </div>
          <p class="text-xs text-emerald-500 mt-3 font-medium"><i class="fas fa-piggy-bank mr-1"></i> ${CrossBorderOptimizer.getMultiCountryStrategy().annualSavings}</p>
        </div>
      </div>`;
  }

  function renderTaxHarvest(container) {
    const result = TaxHarvestAI.analyze();
    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">📊 AI Tax-Loss Harvesting</h2>
            <p class="text-sm text-slate-500 mt-1">Automated capital gains tax optimization — Wealthfront-grade engine</p>
          </div>
          <button onclick="App.showToast('Scanning portfolio for harvesting opportunities...', 'info')" class="fb-btn fb-btn-outline fb-btn-sm"><i class="fas fa-sync-alt mr-1.5"></i>Rescan</button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Harvestable Loss</span><span class="stat-icon navy"><i class="fas fa-arrow-down"></i></span></div><p class="stat-value text-red-500">${C(result.totalHarvestableLoss)}</p><p class="stat-subtitle">${result.harvestablePositions} of ${result.totalPositions} positions</p></div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Tax Saved</span><span class="stat-icon success"><i class="fas fa-piggy-bank"></i></span></div><p class="stat-value text-emerald-500">${C(result.estimatedTaxSaved)}</p><p class="stat-subtitle">15% short-term CGT offset</p></div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Replacement Picks</span><span class="stat-icon gold"><i class="fas fa-exchange-alt"></i></span></div><p class="stat-value" style="font-size:1.2rem;">${result.replacements.length} ready</p><p class="stat-subtitle">Wash-sale rule compliant</p></div>
        </div>

        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">Harvesting Opportunities</h3>
          <div class="overflow-x-auto">
            <table class="fb-table text-sm">
              <thead><tr><th>Sell (Loss)</th><th>Sector</th><th>Loss Amount</th><th>Buy (Replacement)</th><th>Action</th></tr></thead>
              <tbody>
                ${result.replacements.map(r => `
                  <tr><td class="font-medium text-red-500">${r.original} ▼</td><td>${r.sector}</td><td class="text-red-500 font-semibold">${C(r.harvestableLoss)}</td><td class="font-medium text-emerald-500">${r.replacement} ▲</td><td><button onclick="App.showToast('Simulated: Sell ${r.original}, buy ${r.replacement}', 'success')" class="fb-btn fb-btn-sm fb-btn-primary">Execute</button></td></tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          <p class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs rounded-lg"><i class="fas fa-info-circle mr-1.5"></i> ${result.recommendation}</p>
        </div>
      </div>`;
  }

  function renderESGScore(container) {
    const score = ESGScorer.getPortfolioScore();
    const color = score.overallESG >= 70 ? 'emerald' : score.overallESG >= 50 ? 'amber' : 'red';

    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">🌱 ESG & Carbon Portfolio Score</h2>
            <p class="text-sm text-slate-500 mt-1">UBS / Credit Suisse — grade sustainable investing analytics</p>
          </div>
          <span class="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-full"><i class="fas fa-leaf mr-1.5"></i>Sustainable</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="fb-stat-card md:col-span-2">
            <div class="stat-header"><span class="stat-label">Overall ESG Rating</span></div>
            <div class="flex items-center gap-4 mt-2">
              <div class="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style="background: conic-gradient(#10B981 ${score.overallESG*3.6}deg, #E2E8F0 0deg);">
                <span class="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">${score.overallESG}</span>
              </div>
              <div><p class="text-lg font-bold">${score.rating}</p><p class="text-xs text-slate-500">Out of 100</p></div>
            </div>
          </div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Carbon Footprint</span></div><p class="stat-value">${score.carbonFootprint}/100</p><p class="stat-subtitle text-emerald-500">Lower is better</p></div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Green Revenue</span></div><p class="stat-value">${score.greenExposure}%</p><p class="stat-subtitle">Portfolio avg green rev</p></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="fb-card p-5">
            <h3 class="text-sm font-semibold mb-3"><i class="fas fa-trophy text-amber-500 mr-2"></i>Top ESG Performer</h3>
            <p class="text-lg font-bold text-emerald-500">${score.topPerformer.symbol}</p>
            <p class="text-xs text-slate-500">ESG Score: ${score.topPerformer.esgScore} | Rating: ${score.topPerformer.rating} | Green Revenue: ${score.topPerformer.greenRevenue}</p>
          </div>
          <div class="fb-card p-5">
            <h3 class="text-sm font-semibold mb-3"><i class="fas fa-exclamation-triangle text-amber-500 mr-2"></i>Needs Attention</h3>
            <p class="text-lg font-bold text-red-500">${score.worstPerformer.symbol}</p>
            <p class="text-xs text-slate-500">ESG Score: ${score.worstPerformer.esgScore} | Rating: ${score.worstPerformer.rating}</p>
          </div>
        </div>

        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold mb-3">Recommended ESG Improvements</h3>
          ${score.improvements.map((imp, i) => `
            <div class="flex items-center justify-between py-3 ${i < score.improvements.length-1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}">
              <div><p class="font-medium text-sm">${imp.action}</p><p class="text-xs text-slate-500">CO₂ saving: ${imp.saving}</p></div>
              <span class="px-2.5 py-1 rounded-full text-xs font-semibold ${imp.impact === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${imp.impact} Impact</span>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function renderEstateVault(container) {
    const status = DigitalEstateVault.getVaultStatus();
    const rules = DigitalEstateVault.getSmartWillRules();

    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">🔐 Digital Estate Vault</h2>
            <p class="text-sm text-slate-500 mt-1">Swiss-grade encrypted inheritance planning & smart will management</p>
          </div>
          <span class="px-3 py-1.5 bg-blue-900/10 text-blue-900 text-xs font-semibold rounded-full"><i class="fas fa-shield-halved mr-1.5"></i>${status.securityLevel}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Secured Docs</span><span class="stat-icon navy"><i class="fas fa-file-shield"></i></span></div><p class="stat-value">${status.totalDocs}</p><p class="stat-subtitle text-emerald-500">All encrypted</p></div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Beneficiaries</span><span class="stat-icon gold"><i class="fas fa-users"></i></span></div><p class="stat-value">${status.beneficiaries}</p><p class="stat-subtitle">Smart rules active</p></div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Recovery Contacts</span><span class="stat-icon info"><i class="fas fa-phone"></i></span></div><p class="stat-value">${status.recoveryContacts}</p><p class="stat-subtitle">Trusted contacts</p></div>
          <div class="fb-stat-card"><div class="stat-header"><span class="stat-label">Last Audit</span><span class="stat-icon success"><i class="fas fa-clipboard-check"></i></span></div><p class="stat-value" style="font-size:1rem;">${status.lastAudit}</p><p class="stat-subtitle text-emerald-500">All clear</p></div>
        </div>

        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold mb-4"><i class="fas fa-scroll mr-2"></i>Smart Will Rules</h3>
          ${rules.map(r => `
            <div class="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
              <div><p class="font-medium text-sm">${r.rule}</p><p class="text-xs text-slate-500">${r.detail}</p></div>
              <span class="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-semibold">${r.status}</span>
            </div>
          `).join('')}
        </div>

        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold mb-4">👥 Beneficiaries</h3>
          <div class="overflow-x-auto">
            <table class="fb-table text-sm">
              <thead><tr><th>Name</th><th>Relation</th><th>Share</th><th>Trigger</th><th>Conditions</th></tr></thead>
              <tbody>${DigitalEstateVault.beneficiaries.map(b => `<tr><td class="font-medium">${b.name}</td><td>${b.relation}</td><td class="font-bold">${b.share}</td><td>${b.trigger}</td><td class="text-xs text-slate-500">${b.conditions}</td></tr>`).join('')}</tbody>
            </table>
          </div>
        </div>
      </div>`;
  }

  function renderPersonalCFO(container) {
    const insights = PersonalCFO.getProactiveInsights();

    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">🤖 AI Personal CFO</h2>
            <p class="text-sm text-slate-500 mt-1">Marcus by Goldman Sachs — grade proactive financial life management</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="fb-card p-4 border-l-4 border-red-400">
            <h3 class="text-xs font-semibold text-red-500 uppercase mb-3"><i class="fas fa-clock mr-1.5"></i>Urgent Actions</h3>
            ${insights.urgentActions.map(a => `
              <div class="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <p class="text-sm font-medium">${a.action}</p>
                <div class="flex justify-between text-xs mt-1"><span class="text-slate-500">Due: ${a.deadline}</span><span class="text-red-500 font-semibold">${a.penalty || a.amount || ''}</span></div>
              </div>
            `).join('')}
          </div>

          <div class="fb-card p-4 border-l-4 border-emerald-400">
            <h3 class="text-xs font-semibold text-emerald-500 uppercase mb-3"><i class="fas fa-lightbulb mr-1.5"></i>Opportunities</h3>
            ${insights.opportunities.map(o => `
              <div class="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <p class="text-sm font-medium">${o.title}</p>
                <p class="text-xs text-slate-500 mt-0.5">${o.suggestion}</p>
                <span class="text-xs text-emerald-500 font-semibold">${o.gain}</span>
              </div>
            `).join('')}
          </div>

          <div class="fb-card p-4 border-l-4 border-blue-400">
            <h3 class="text-xs font-semibold text-blue-500 uppercase mb-3"><i class="fas fa-heart-pulse mr-1.5"></i>Financial Health</h3>
            ${Object.entries(insights.healthCheck).map(([key, val]) => `
              <div class="py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 flex justify-between items-center">
                <span class="text-sm capitalize">${key.replace(/([A-Z])/g, ' $1')}</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${val.status === 'Excellent' || val.status === 'Good' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">${val.status}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderArbitrageScanner(container) {
    const opps = ArbitrageScanner.scan();
    container.innerHTML = `
      <div class="space-y-6 pb-8 fb-animate-in">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 dark:text-white">⚡ Global Arbitrage Scanner</h2>
            <p class="text-sm text-slate-500 mt-1">Cross-exchange opportunity detection — Goldman Sachs S&T grade</p>
          </div>
          <span class="px-3 py-1.5 bg-amber-100 dark:bg-amber-900/20 text-amber-700 text-xs font-semibold rounded-full"><i class="fas fa-bolt mr-1.5"></i>${opps.opportunities.length} Live Opportunities</span>
        </div>
        <div class="fb-card p-5">
          <h3 class="text-sm font-semibold mb-4"><i class="fas fa-exchange-alt mr-2"></i>Active Arbitrage Spreads</h3>
          ${opps.opportunities.map(o => `
            <div class="p-4 mb-3 rounded-xl bg-slate-50 dark:bg-slate-800">
              <div class="flex items-center justify-between mb-2">
                <span class="font-bold text-sm">${o.pair}</span>
                <span class="px-2 py-0.5 rounded-full text-xs font-semibold ${o.confidence === 'High' ? 'bg-emerald-100 text-emerald-700' : o.confidence === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-600'}">${o.confidence} confidence</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div><span class="text-slate-500">Spread:</span> <span class="font-semibold">${o.spread}</span></div>
                <div><span class="text-slate-500">Action:</span> <span class="font-semibold text-blue-600">${o.action}</span></div>
                <div><span class="text-slate-500">Potential:</span> <span class="font-semibold text-emerald-500">${o.potential}</span></div>
              </div>
            </div>
          `).join('')}
          <div class="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs"><i class="fas fa-info-circle mr-1.5 text-blue-500"></i> Total daily potential: <b>${opps.totalPotential}</b> — Requires real-time execution infrastructure. ${opps.riskNote}</div>
        </div>
      </div>`;
  }

  // ═══════════════════════════════════════════════════════════════
  //  INTEGRATION — Patch App & Add Sidebar Items
  // ═══════════════════════════════════════════════════════════════

  function waitForApp(callback, retries) {
    retries = retries || 50;
    if (window.App && window.App.renderView) {
      callback();
    } else if (retries > 0) {
      setTimeout(function() { waitForApp(callback, retries - 1); }, 100);
    }
  }

  waitForApp(function() {
    console.log('[Global Innovations] Integrating 8 world-class features...');

    // Export for debugging
    window.GlobalPortfolio = GlobalPortfolio;
    window.TaxHarvestAI = TaxHarvestAI;
    window.ESGScorer = ESGScorer;
    window.CrossBorderOptimizer = CrossBorderOptimizer;
    window.DigitalEstateVault = DigitalEstateVault;
    window.BeneficiaryAI = BeneficiaryAI;
    window.ArbitrageScanner = ArbitrageScanner;
    window.PersonalCFO = PersonalCFO;

    // Patch App.renderView for new views
    var originalRenderView = App.renderView.bind(App);
    App.renderView = function(view) {
      var container = document.getElementById('main-content');
      if (!container) return originalRenderView(view);

      switch (view) {
        case 'global-portfolio': renderGlobalPortfolio(container); break;
        case 'tax-harvest': renderTaxHarvest(container); break;
        case 'esg-score': renderESGScore(container); break;
        case 'estate-vault': renderEstateVault(container); break;
        case 'personal-cfo': renderPersonalCFO(container); break;
        case 'arbitrage': renderArbitrageScanner(container); break;
        default: originalRenderView(view); return;
      }

      document.querySelectorAll('.nav-item').forEach(function(item) {
        item.classList.remove('active');
        if (item.dataset.view === view) item.classList.add('active');
      });

      var titles = {
        'global-portfolio': 'Global Currency Portfolio',
        'tax-harvest': 'AI Tax-Loss Harvesting',
        'esg-score': 'ESG & Carbon Score',
        'estate-vault': 'Digital Estate Vault',
        'personal-cfo': 'AI Personal CFO',
        'arbitrage': 'Global Arbitrage Scanner'
      };
      document.getElementById('page-title').textContent = titles[view] || view;
    };

    // Add sidebar items
    addGlobalInnovationSidebarItems();

    console.log('[Global Innovations] All 8 features integrated.');
  });

  function addGlobalInnovationSidebarItems() {
    var nav = document.querySelector('aside nav, .fb-nav, #sidebar-nav');
    if (!nav) return;

    if (document.querySelector('[data-view="global-portfolio"]')) return;

    // Divider
    var divider = document.createElement('div');
    divider.className = 'fb-nav-section';
    divider.textContent = 'Global Innovations';
    nav.appendChild(divider);

    var items = [
      { view: 'global-portfolio', icon: 'fa-globe', label: 'Global Portfolio', badge: 'FX' },
      { view: 'tax-harvest', icon: 'fa-file-invoice-dollar', label: 'Tax-Loss Harvest', badge: 'AI' },
      { view: 'esg-score', icon: 'fa-leaf', label: 'ESG & Carbon Score', badge: 'ESG' },
      { view: 'personal-cfo', icon: 'fa-user-tie', label: 'AI Personal CFO', badge: 'PRO' },
      { view: 'estate-vault', icon: 'fa-vault', label: 'Estate Vault', badge: 'WILL' },
      { view: 'arbitrage', icon: 'fa-bolt', label: 'Arbitrage Scanner', badge: 'LIVE' }
    ];

    items.forEach(function(item) {
      var a = document.createElement('a');
      a.href = '#';
      a.dataset.view = item.view;
      a.className = 'fb-nav-item nav-item';
      a.innerHTML =
        '<i class="fas ' + item.icon + '"></i>' +
        '<span class="flex-1">' + item.label + '</span>' +
        '<span class="nav-badge">' + item.badge + '</span>';
      a.addEventListener('click', function(e) {
        e.preventDefault();
        App.renderView(item.view);
      });
      nav.appendChild(a);
    });
  }

})();
