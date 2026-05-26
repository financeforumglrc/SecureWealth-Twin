/**
 * ═══════════════════════════════════════════════════════════════
 *  PREMIUM BANK-GRADE FEATURES — SecureWealth Twin
 * ═══════════════════════════════════════════════════════════════
 *
 *  7 revolutionary features no existing Indian banking app offers:
 *
 *  1. Financial Wellness Score™ — 12-factor health (CIBIL, savings rate, diversity, resilience)
 *  2. Green Wealth Index — ESG carbon tracking + green bond suggestions
 *  3. AutoPilot Rules Engine — If-then financial automation
 *  4. BankCompass — Competitive bank switching analyzer
 *  5. FraudWalk Simulator — Interactive fraud scenario walkthroughs
 *  6. FamilyFort™ — Family-level wealth with permission tiers
 *  7. Digital Vault — Secure document locker + nominee + inheritance
 */

// ═══════════════════════════════════════════════════════════
// 1. FINANCIAL WELLNESS SCORE™
// ═══════════════════════════════════════════════════════════

const FinancialWellnessScore = {
  factors: {
    savingsRate:       { weight: 15, label: 'Savings Discipline',     icon: 'fa-piggy-bank',     tip: 'Save ≥25% of income' },
    emergencyFund:     { weight: 12, label: 'Emergency Readiness',    icon: 'fa-umbrella',        tip: '6-12 months expenses covered' },
    debtToIncome:      { weight: 12, label: 'Debt Management',        icon: 'fa-credit-card',     tip: 'Keep EMIs under 40% of income' },
    investmentDivers:  { weight: 10, label: 'Portfolio Diversity',    icon: 'fa-layer-group',     tip: 'Spread across equity, debt, gold, real estate' },
    cibilScore:        { weight: 10, label: 'Credit Health',          icon: 'fa-star',            tip: 'Maintain CIBIL above 750' },
    insuranceCoverage: { weight: 8,  label: 'Insurance Adequacy',     icon: 'fa-shield-halved',   tip: 'Term insurance 10x income + health cover' },
    taxEfficiency:     { weight: 8,  label: 'Tax Optimization',       icon: 'fa-file-invoice',    tip: 'Max out 80C, 80D, NPS benefits' },
    subscriptionHealth:{ weight: 6,  label: 'Subscription Hygiene',   icon: 'fa-rotate',          tip: 'Cancel unused subscriptions' },
    fraudResilience:   { weight: 7,  label: 'Fraud Preparedness',     icon: 'fa-shield-virus',    tip: 'Enable all security layers' },
    retirementReadiness:{ weight: 6,  label: 'Retirement Planning',   icon: 'fa-person-cane',     tip: 'Start retirement corpus early' },
    spendingDiscipline:{ weight: 4,  label: 'Spending Control',       icon: 'fa-chart-line',      tip: 'Keep discretionary under 30%' },
    goalProgress:      { weight: 2,  label: 'Goal Achievement',       icon: 'fa-bullseye',        tip: 'Hit goal milestones on time' }
  },

  /**
   * Calculate comprehensive wellness score (0-1000)
   */
  calculate() {
    const scores = {};
    let totalScore = 0;
    const maxScore = Object.values(this.factors).reduce((s, f) => s + f.weight * 10, 0);

    // 1. Savings Rate (0-10 based on %)
    const savingsRate = WealthEngine.user.monthlySavings / WealthEngine.user.income * 100;
    scores.savingsRate = Math.min(10, Math.round(savingsRate / 2.5));

    // 2. Emergency Fund
    const emergencyGoal = WealthEngine.goals.find(g => g.type === 'safety');
    const emergencyPct = emergencyGoal ? emergencyGoal.current / emergencyGoal.target * 100 : 0;
    scores.emergencyFund = Math.min(10, Math.round(emergencyPct / 10));

    // 3. Debt to Income
    const estimatedEMI = 15000; // Simulated
    const dtiRatio = estimatedEMI / WealthEngine.user.income * 100;
    scores.debtToIncome = Math.min(10, Math.round((40 - Math.min(40, dtiRatio)) / 4));

    // 4. Investment Diversity (0-10 based on allocation spread)
    const alloc = WealthEngine.portfolio.allocation;
    const diversityCount = Object.values(alloc).filter(v => v > 5).length;
    scores.investmentDivers = Math.min(10, diversityCount * 2);

    // 5. CIBIL Score
    const simulatedCIBIL = 760; // Simulated
    scores.cibilScore = Math.min(10, Math.round((simulatedCIBIL - 300) / 60));

    // 6. Insurance Coverage
    const insuranceCoverage = 0.65; // 65% covered
    scores.insuranceCoverage = Math.round(insuranceCoverage * 10);

    // 7. Tax Efficiency
    const taxUsed = 100000; // Simulated ₹1L of 80C used
    const taxMax = 150000;
    scores.taxEfficiency = Math.min(10, Math.round(taxUsed / taxMax * 10));

    // 8. Subscription Health
    const subInsights = typeof SubTrackAI !== 'undefined' ? SubTrackAI.getInsights() : { ghostSubscriptions: [] };
    const ghostCount = subInsights.ghostSubscriptions ? subInsights.ghostSubscriptions.length : 0;
    scores.subscriptionHealth = Math.max(0, 10 - ghostCount * 2);

    // 9. Fraud Resilience
    const protectionScore = 85; // Simulated from RiskEngine
    scores.fraudResilience = Math.round(protectionScore / 10);

    // 10. Retirement Readiness
    const retirementGoal = WealthEngine.goals.find(g => g.type === 'retirement');
    const retirementPct = retirementGoal ? retirementGoal.current / retirementGoal.target * 100 : 0;
    scores.retirementReadiness = Math.min(10, Math.round(retirementPct / 10));

    // 11. Spending Discipline
    const discretionaryPct = 28;
    scores.spendingDiscipline = Math.min(10, Math.round((50 - Math.min(50, discretionaryPct)) / 5));

    // 12. Goal Progress
    const goalProgress = WealthEngine.goals.reduce((s, g) => s + (g.current / g.target), 0) / WealthEngine.goals.length * 100;
    scores.goalProgress = Math.min(10, Math.round(goalProgress / 10));

    // Weighted total
    for (const [key, factor] of Object.entries(this.factors)) {
      totalScore += (scores[key] || 5) * factor.weight;
    }

    const finalScore = Math.round(totalScore / maxScore * 1000);

    // Determine tier
    let tier, tierColor, tierEmoji;
    if (finalScore >= 800) { tier = 'Exceptional'; tierColor = 'success'; tierEmoji = '🏆'; }
    else if (finalScore >= 650) { tier = 'Excellent'; tierColor = 'primary'; tierEmoji = '⭐'; }
    else if (finalScore >= 500) { tier = 'Good'; tierColor = 'secondary'; tierEmoji = '👍'; }
    else if (finalScore >= 350) { tier = 'Fair'; tierColor = 'warning'; tierEmoji = '📈'; }
    else { tier = 'Needs Attention'; tierColor = 'danger'; tierEmoji = '🔧'; }

    // Generate recommendations
    const recommendations = [];
    for (const [key, factor] of Object.entries(this.factors)) {
      if ((scores[key] || 0) < 5) {
        recommendations.push({
          factor: factor.label,
          score: scores[key],
          icon: factor.icon,
          tip: factor.tip,
          priority: scores[key] <= 2 ? 'critical' : 'improve'
        });
      }
    }
    recommendations.sort((a, b) => a.score - b.score);

    // Trend (simulated: comparing to last month)
    const previousScore = Math.max(300, finalScore - Math.floor(Math.random() * 60) + 15);
    const trend = finalScore - previousScore;

    return {
      score: finalScore,
      tier,
      tierColor,
      tierEmoji,
      maxScore: 1000,
      trend,
      previousScore,
      breakdown: Object.entries(this.factors).map(([key, f]) => ({
        key,
        label: f.label,
        icon: f.icon,
        score: scores[key] || 5,
        weight: f.weight,
        weighted: (scores[key] || 5) * f.weight
      })),
      recommendations: recommendations.slice(0, 5),
      peerPercentile: Math.min(95, Math.round(finalScore / 10 + Math.random() * 10)),
      nextMilestone: finalScore < 800 ? Math.ceil(finalScore / 100) * 100 : 1000,
      pointsToNext: finalScore < 800 ? Math.ceil(finalScore / 100) * 100 - finalScore : 0
    };
  }
};

// ═══════════════════════════════════════════════════════════
// 2. GREEN WEALTH INDEX — ESG Tracking
// ═══════════════════════════════════════════════════════════

const GreenWealthIndex = {
  // Carbon footprint per ₹1000 spent in different categories
  carbonFactors: {
    'housing':      { kgCO2: 0.8,  label: 'Housing & Utilities' },
    'food':         { kgCO2: 1.2,  label: 'Food & Dining' },
    'transport':    { kgCO2: 2.5,  label: 'Transportation' },
    'entertainment':{ kgCO2: 0.5,  label: 'Entertainment' },
    'shopping':     { kgCO2: 1.8,  label: 'Shopping' },
    'utilities':    { kgCO2: 3.0,  label: 'Utilities (Electricity/Gas)' },
    'travel':       { kgCO2: 8.0,  label: 'Air/Rail Travel' }
  },

  greenInvestments: [
    { name: 'SBI ESG Exclusionary Fund', type: 'ESG Mutual Fund', returns: 12.8, risk: 'Moderate', minInvestment: 1000, color: '#2e7d32' },
    { name: 'Sovereign Green Bonds 2030', type: 'Government Bond', returns: 7.5, risk: 'Low', minInvestment: 10000, color: '#1b5e20' },
    { name: 'Axis ESG Equity Fund', type: 'ESG Mutual Fund', returns: 14.2, risk: 'High', minInvestment: 500, color: '#4caf50' },
    { name: 'Aditya Birla Sun Life ESG', type: 'Thematic Fund', returns: 11.5, risk: 'Moderate', minInvestment: 1000, color: '#66bb6a' },
    { name: 'Green Fixed Deposit (SBI)', type: 'Fixed Deposit', returns: 7.1, risk: 'Very Low', minInvestment: 5000, color: '#81c784' }
  ],

  /**
   * Calculate green wealth score and carbon footprint
   */
  calculate() {
    const spending = WealthEngine.spending;

    // Calculate monthly carbon footprint
    let totalCO2 = 0;
    const footprintByCategory = spending.categories.map(cat => {
      const factor = this.carbonFactors[cat.name.toLowerCase()] || { kgCO2: 0.5, label: cat.name };
      const monthlyCO2 = (cat.amount / 1000) * factor.kgCO2;
      totalCO2 += monthlyCO2;
      return {
        category: cat.name,
        amount: cat.amount,
        kgCO2: Math.round(monthlyCO2 * 10) / 10,
        factor: factor.kgCO2
      };
    });

    const yearlyCO2 = Math.round(totalCO2 * 12);
    const treesNeeded = Math.ceil(yearlyCO2 / 21); // 1 tree absorbs ~21 kg CO2/year

    // Calculate green score (0-100)
    // Based on: low carbon, green investments, sustainable choices
    const avgCO2PerIncome = yearlyCO2 / (WealthEngine.user.income * 12 / 1000);
    const carbonScore = Math.max(0, Math.min(50, Math.round((5 - Math.min(5, avgCO2PerIncome)) * 10)));

    // Check if any investments are ESG
    const esgInvestments = WealthEngine.assets.investments.filter(inv =>
      inv.name.toLowerCase().includes('esg') || inv.name.toLowerCase().includes('green')
    );
    const esgScore = Math.min(30, esgInvestments.length * 15);

    // Lifestyle score (simulated)
    const lifeStyleScore = Math.floor(Math.random() * 15) + 5;

    const greenScore = carbonScore + esgScore + lifeStyleScore;

    // Determine level
    let level, levelColor;
    if (greenScore >= 80) { level = 'Planet Protector 🌍'; levelColor = 'success'; }
    else if (greenScore >= 55) { level = 'Eco-Conscious 🌱'; levelColor = 'primary'; }
    else if (greenScore >= 35) { level = 'Getting Started 🌿'; levelColor = 'warning'; }
    else { level = 'Room for Improvement 🏭'; levelColor = 'danger'; }

    // Suggestions
    const suggestions = [];
    if (esgInvestments.length < 2) {
      suggestions.push({ text: 'Allocate 10% portfolio to ESG funds', impact: 'high', icon: 'fa-leaf' });
    }
    if (footprintByCategory.find(f => f.category === 'transport')?.kgCO2 > 20) {
      suggestions.push({ text: 'Use public transport 2x/week — save 50kg CO₂/month', impact: 'high', icon: 'fa-bus' });
    }
    suggestions.push({ text: 'Switch to renewable energy provider', impact: 'medium', icon: 'fa-solar-panel' });
    suggestions.push({ text: 'Go paperless for all bank statements', impact: 'low', icon: 'fa-file-pdf' });

    return {
      greenScore,
      level,
      levelColor,
      yearlyCO2,
      monthlyCO2: Math.round(totalCO2),
      treesNeeded,
      treesNeededToOffset: treesNeeded,
      footprintByCategory,
      esgInvestments,
      greenInvestmentsSuggested: this.greenInvestments.slice(0, 3),
      suggestions,
      carbonVsAverage: Math.round(yearlyCO2 / 7000 * 100), // 7000kg = avg Indian yearly
      peerComparison: greenScore > 60 ? 'Above 72% of peers' : 'Below average — let\'s improve!'
    };
  }
};

// ═══════════════════════════════════════════════════════════
// 3. AUTOPILOT RULES ENGINE
// ═══════════════════════════════════════════════════════════

const AutoPilotEngine = {
  rules: [],

  // Predefined rule templates
  templates: [
    {
      id: 'auto_sweep',
      name: 'Auto-Sweep Surplus',
      description: 'Automatically move funds above threshold to higher-yield account',
      icon: 'fa-arrow-right-arrow-left',
      category: 'savings',
      config: { trigger: 'balance_above', threshold: 100000, action: 'invest_surplus', target: 'liquid_fund', amount: 50000 }
    },
    {
      id: 'buy_dip',
      name: 'Buy The Dip',
      description: 'Auto-invest when NIFTY drops by specified percentage in a week',
      icon: 'fa-chart-line',
      category: 'investment',
      config: { trigger: 'market_drop', index: 'NIFTY50', dropPercent: 5, action: 'invest', amount: 25000, fund: 'NIFTY50 Index' }
    },
    {
      id: 'sip_topup',
      name: 'Annual SIP Step-Up',
      description: 'Automatically increase SIP amount by X% every year',
      icon: 'fa-arrow-trend-up',
      category: 'investment',
      config: { trigger: 'annual_date', date: '04-01', action: 'increase_sip', increasePercent: 10 }
    },
    {
      id: 'tax_harvest',
      name: 'Tax-Loss Harvesting',
      description: 'Book losses in March to offset capital gains for tax savings',
      icon: 'fa-file-invoice-dollar',
      category: 'tax',
      config: { trigger: 'calendar_month', month: 3, action: 'harvest_losses', maxLoss: 25000 }
    },
    {
      id: 'salary_split',
      name: 'Salary Day Auto-Split',
      description: 'On salary day, auto-allocate to essentials, investments, and savings',
      icon: 'fa-money-bill-transfer',
      category: 'savings',
      config: { trigger: 'salary_credit', action: 'split_allocate', splits: { essentials: 50, investments: 30, savings: 20 } }
    },
    {
      id: 'goal_boost',
      name: 'Goal Progress Booster',
      description: 'If a goal is behind schedule, auto-invest extra amount monthly',
      icon: 'fa-bullseye',
      category: 'goals',
      config: { trigger: 'goal_behind', maxExtra: 10000, action: 'boost_goal' }
    },
    {
      id: 'fraud_freezing',
      name: 'Suspicious Activity Freeze',
      description: 'Auto-freeze card/account on multiple failed OTP attempts',
      icon: 'fa-shield-virus',
      category: 'security',
      config: { trigger: 'failed_otp', threshold: 3, action: 'freeze_account', duration: 3600000 }
    },
    {
      id: 'rebalance',
      name: 'Quarterly Portfolio Rebalance',
      description: 'Auto-rebalance to target allocation every quarter',
      icon: 'fa-scale-balanced',
      category: 'investment',
      config: { trigger: 'quarterly', action: 'rebalance', driftThreshold: 5 }
    }
  ],

  activeRules: [],

  init() {
    this.loadRules();
    // Seed with some active rules for demo
    if (this.activeRules.length === 0) {
      this.activeRules = [
        { ...this.templates[0], status: 'active', activatedAt: new Date().toISOString(), runCount: 12, lastRun: new Date(Date.now() - 7 * 86400000).toISOString() },
        { ...this.templates[1], status: 'active', activatedAt: new Date().toISOString(), runCount: 3, lastRun: new Date(Date.now() - 14 * 86400000).toISOString() },
        { ...this.templates[4], status: 'active', activatedAt: new Date().toISOString(), runCount: 8, lastRun: new Date(Date.now() - 30 * 86400000).toISOString() },
        { ...this.templates[2], status: 'active', activatedAt: new Date().toISOString(), runCount: 2, lastRun: new Date(Date.now() - 90 * 86400000).toISOString() }
      ];
      this.saveRules();
    }
  },

  activateRule(templateId, customConfig) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) return { success: false, message: 'Rule template not found' };

    const existing = this.activeRules.find(r => r.id === templateId);
    if (existing) return { success: false, message: 'Rule already active' };

    const rule = {
      ...template,
      config: { ...template.config, ...customConfig },
      status: 'active',
      activatedAt: new Date().toISOString(),
      runCount: 0,
      lastRun: null
    };

    this.activeRules.push(rule);
    this.saveRules();
    return { success: true, rule, message: `"${template.name}" activated successfully!` };
  },

  deactivateRule(templateId) {
    const idx = this.activeRules.findIndex(r => r.id === templateId);
    if (idx === -1) return { success: false, message: 'Rule not found' };
    this.activeRules.splice(idx, 1);
    this.saveRules();
    return { success: true, message: 'Rule deactivated' };
  },

  getStatus() {
    const categories = {};
    this.activeRules.forEach(r => {
      if (!categories[r.category]) categories[r.category] = [];
      categories[r.category].push(r);
    });

    const totalSaved = this.activeRules.reduce((s, r) => s + r.runCount * 1500, 0); // Simulated savings

    return {
      activeCount: this.activeRules.length,
      totalTemplates: this.templates.length,
      categories,
      totalAutomatedSavings: totalSaved,
      recentActivity: this.activeRules
        .filter(r => r.lastRun)
        .sort((a, b) => new Date(b.lastRun) - new Date(a.lastRun))
        .slice(0, 5),
      inactiveTemplates: this.templates.filter(t => !this.activeRules.find(r => r.id === t.id))
    };
  },

  saveRules() {
    try { localStorage.setItem('sw_autopilot_rules', JSON.stringify(this.activeRules)); } catch (e) {}
  },
  loadRules() {
    try {
      const data = localStorage.getItem('sw_autopilot_rules');
      if (data) this.activeRules = JSON.parse(data);
    } catch (e) {}
  }
};

// ═══════════════════════════════════════════════════════════
// 4. BANKCOMPASS — Competitive Bank Analyzer
// ═══════════════════════════════════════════════════════════

const BankCompass = {
  currentBank: {
    name: 'State Bank of India',
    type: 'PSB',
    savingsRate: 2.70,
    fdRate1Yr: 6.80,
    fdRate5Yr: 6.50,
    minBalance: 3000,
    annualFee: 0,
    upiSuccess: 98.5,
    branchCount: 22000,
    digitalRating: 4.2,
    lockerAvailable: true,
    loanRate: 9.15
  },

  competitors: [
    { name: 'HDFC Bank', type: 'Private', savingsRate: 3.50, fdRate1Yr: 7.10, fdRate5Yr: 7.00, minBalance: 10000, annualFee: 600, upiSuccess: 99.2, branchCount: 8000, digitalRating: 4.7, lockerAvailable: true, loanRate: 9.50 },
    { name: 'ICICI Bank', type: 'Private', savingsRate: 3.25, fdRate1Yr: 7.00, fdRate5Yr: 6.90, minBalance: 10000, annualFee: 500, upiSuccess: 99.0, branchCount: 6000, digitalRating: 4.6, lockerAvailable: true, loanRate: 9.60 },
    { name: 'Kotak Mahindra', type: 'Private', savingsRate: 3.50, fdRate1Yr: 7.25, fdRate5Yr: 6.80, minBalance: 5000, annualFee: 350, upiSuccess: 98.8, branchCount: 1800, digitalRating: 4.5, lockerAvailable: false, loanRate: 9.25 },
    { name: 'IDFC FIRST', type: 'Private', savingsRate: 4.00, fdRate1Yr: 7.30, fdRate5Yr: 7.10, minBalance: 0, annualFee: 0, upiSuccess: 98.0, branchCount: 800, digitalRating: 4.3, lockerAvailable: false, loanRate: 9.80 },
    { name: 'Axis Bank', type: 'Private', savingsRate: 3.00, fdRate1Yr: 7.00, fdRate5Yr: 6.85, minBalance: 12000, annualFee: 750, upiSuccess: 99.1, branchCount: 5000, digitalRating: 4.5, lockerAvailable: true, loanRate: 9.40 },
    { name: 'Bank of Baroda', type: 'PSB', savingsRate: 2.70, fdRate1Yr: 6.75, fdRate5Yr: 6.50, minBalance: 2000, annualFee: 0, upiSuccess: 97.8, branchCount: 9500, digitalRating: 3.9, lockerAvailable: true, loanRate: 9.20 }
  ],

  /**
   * Analyze if switching banks would save money
   */
  analyze() {
    const user = WealthEngine.user;
    const avgBalance = 250000; // Simulated average savings balance
    const fdAmount = 500000; // Simulated FD

    const analysis = this.competitors.map(bank => {
      // Calculate yearly impact
      const savingsExtra = Math.round(avgBalance * (bank.savingsRate - this.currentBank.savingsRate) / 100);
      const fdExtra = Math.round(fdAmount * (bank.fdRate1Yr - this.currentBank.fdRate1Yr) / 100);
      const feeDifference = bank.annualFee - this.currentBank.annualFee;
      const totalYearlyBenefit = savingsExtra + fdExtra - feeDifference;

      // Digital experience score
      const digitalGain = bank.digitalRating - this.currentBank.digitalRating;

      return {
        bank: bank.name,
        type: bank.type,
        savingsRate: bank.savingsRate,
        fdRate: bank.fdRate1Yr,
        minBalance: bank.minBalance,
        annualFee: bank.annualFee,
        extraSavingsInterest: savingsExtra,
        extraFDInterest: fdExtra,
        feeImpact: -feeDifference,
        totalYearlyBenefit,
        digitalRating: bank.digitalRating,
        digitalGain,
        upiSuccess: bank.upiSuccess,
        loanRate: bank.loanRate,
        switchRecommendation: totalYearlyBenefit > 2000 ? 'Recommended ✅' : totalYearlyBenefit > 0 ? 'Consider 🤔' : 'Stay 🏠',
        switchScore: Math.min(100, Math.round(50 + totalYearlyBenefit / 100 + digitalGain * 10))
      };
    });

    // Sort by total benefit
    analysis.sort((a, b) => b.totalYearlyBenefit - a.totalYearlyBenefit);

    const bestOption = analysis[0];
    const lifetimeBenefit = bestOption.totalYearlyBenefit * 10; // 10 years

    return {
      currentBank: this.currentBank,
      analysis,
      bestOption,
      lifetimeBenefit,
      topRecommendation: bestOption.totalYearlyBenefit > 2000
        ? `Switch to ${bestOption.bank} — save ₹${bestOption.totalYearlyBenefit.toLocaleString()}/year`
        : 'Your current bank is competitive. No urgent need to switch.',
      comparisonPoints: [
        { label: 'Savings Interest', current: this.currentBank.savingsRate + '%', best: bestOption.savingsRate + '%', winner: bestOption.savingsRate > this.currentBank.savingsRate ? 'competitor' : 'current' },
        { label: 'FD Rate (1Yr)', current: this.currentBank.fdRate1Yr + '%', best: bestOption.fdRate1Yr + '%', winner: bestOption.fdRate1Yr > this.currentBank.fdRate1Yr ? 'competitor' : 'current' },
        { label: 'Digital Rating', current: this.currentBank.digitalRating + '/5', best: bestOption.digitalRating + '/5', winner: bestOption.digitalRating > this.currentBank.digitalRating ? 'competitor' : 'current' },
        { label: 'Annual Fee', current: '₹' + this.currentBank.annualFee, best: '₹' + bestOption.annualFee, winner: bestOption.annualFee < this.currentBank.annualFee ? 'competitor' : 'current' },
        { label: 'UPI Success Rate', current: this.currentBank.upiSuccess + '%', best: bestOption.upiSuccess + '%', winner: bestOption.upiSuccess > this.currentBank.upiSuccess ? 'competitor' : 'current' },
        { label: 'Home Loan Rate', current: this.currentBank.loanRate + '%', best: bestOption.loanRate + '%', winner: bestOption.loanRate < this.currentBank.loanRate ? 'competitor' : 'current' }
      ]
    };
  }
};

// ═══════════════════════════════════════════════════════════
// 5. FRAUDWALK SIMULATOR — Interactive Scenario Trainer
// ═══════════════════════════════════════════════════════════

const FraudWalkSimulator = {
  scenarios: [
    {
      id: 'phone_stolen',
      title: 'Phone Stolen with Banking Apps',
      emoji: '📱',
      threat: 'Phone theft',
      riskLevel: 'high',
      description: 'Your phone is stolen while you\'re traveling. The thief has access to your unlocked phone with banking apps.',
      steps: [
        { step: 1, title: 'SIM Card Deactivated', description: 'Wealth Guardian ID detects SIM swap within 30 seconds and locks all apps.', icon: 'fa-sim-card', color: 'primary', time: '0-30s' },
        { step: 2, title: 'Device Fingerprint Mismatch', description: 'New device detected. BioOTP fails — typing pattern doesn\'t match yours.', icon: 'fa-fingerprint', color: 'danger', time: '30s-1min' },
        { step: 3, title: 'Account Auto-Freeze', description: 'Salary Fortress activates: all accounts frozen, ₹25K auto-locked in vault.', icon: 'fa-snowflake', color: 'danger', time: '1-2min' },
        { step: 4, title: 'Panic Mode Triggered', description: 'Duress PIN entered → silent alert to bank + police. Camera captures photo.', icon: 'fa-triangle-exclamation', color: 'accent', time: '2-3min' },
        { step: 5, title: 'Recovery Initiated', description: 'Backup codes emailed. Visit nearest branch with ID proof to restore access.', icon: 'fa-rotate-left', color: 'success', time: '3-30min' }
      ],
      preventionTips: ['Enable biometric lock on all banking apps', 'Set up duress PIN', 'Keep branch contact numbers handy'],
      protectionScore: 92
    },
    {
      id: 'otp_scam',
      title: 'OTP Phishing Call',
      emoji: '📞',
      threat: 'Social engineering',
      riskLevel: 'medium',
      description: 'Someone calls claiming to be from your bank, asking for OTP to "verify your account".',
      steps: [
        { step: 1, title: 'Scam Caller ID Detection', description: 'SubTrack AI identifies number as "Suspected Scam" from community database.', icon: 'fa-phone-slash', color: 'primary', time: 'Instant' },
        { step: 2, title: 'OTP Protection Activates', description: 'Even if you share OTP, BioOTP detects coercion through typing pattern analysis.', icon: 'fa-keyboard', color: 'warning', time: 'During call' },
        { step: 3, title: 'Transaction Blocked', description: 'Risk score → HIGH. Transaction blocked. Cooling-off period of 30 minutes enforced.', icon: 'fa-ban', color: 'danger', time: 'Immediate' },
        { step: 4, title: 'Bank Alert + Education', description: 'You receive alert explaining this was a scam. Anti-phishing tips displayed.', icon: 'fa-graduation-cap', color: 'success', time: 'Post-incident' }
      ],
      preventionTips: ['Never share OTP over phone', 'Bank never asks for OTP', 'Report scam calls to 1930'],
      protectionScore: 85
    },
    {
      id: 'upi_fraud',
      title: 'Fake UPI Payment Request',
      emoji: '💸',
      threat: 'UPI fraud',
      riskLevel: 'high',
      description: 'You receive a "payment request" from what appears to be a known merchant, but it\'s a fraudster.',
      steps: [
        { step: 1, title: 'Transaction Sentinel Check', description: 'AI compares merchant details against known database. Flags mismatch in UPI ID.', icon: 'fa-magnifying-glass', color: 'primary', time: 'Pre-payment' },
        { step: 2, title: 'Amount Anomaly Detection', description: '₹15,000 request is 5x your average UPI transaction. Warning triggered.', icon: 'fa-chart-line', color: 'warning', time: 'Pre-payment' },
        { step: 3, title: 'Cooling-Off Enforced', description: '30-second cooling-off with fraud warning overlay. "Are you sure?" with scam indicators highlighted.', icon: 'fa-hourglass-half', color: 'accent', time: '30 seconds' },
        { step: 4, title: 'Payment Reversed', description: 'If payment goes through, AI initiates chargeback within 60 seconds. Funds recovered.', icon: 'fa-undo', color: 'success', time: 'Post-payment' }
      ],
      preventionTips: ['Verify UPI ID before paying', 'Check merchant name carefully', 'Use QR code scanning instead of manual entry'],
      protectionScore: 88
    },
    {
      id: 'salary_fraud',
      title: 'Payday Salary Drain',
      emoji: '💰',
      threat: 'Automated fraud',
      riskLevel: 'critical',
      description: 'On salary day, multiple rapid withdrawal attempts are made from a new device in a different city.',
      steps: [
        { step: 1, title: 'Salary Fortress Activates', description: 'Salary detected. 25% auto-locked in fortress vault. Payday shield ON for 48h.', icon: 'fa-vault', color: 'primary', time: 'Instant' },
        { step: 2, title: 'Location + Device Mismatch', description: 'Transaction from Mumbai, but you\'re in Bangalore. New device detected.', icon: 'fa-location-dot', color: 'danger', time: 'Real-time' },
        { step: 3, title: 'All Transactions Blocked', description: 'Payday limit exceeded. Multiple rapid attempts. Full account lockdown initiated.', icon: 'fa-lock', color: 'danger', time: 'Immediate' },
        { step: 4, title: '₹0 Lost — Fortress Protected', description: 'All funds safe. Fortress vault untouched. Notification sent with full incident report.', icon: 'fa-shield-check', color: 'success', time: 'Resolution' }
      ],
      preventionTips: ['Enable Salary Fortress', 'Set low payday withdrawal limits', 'Use app-based 2FA'],
      protectionScore: 98
    }
  ],

  getScenarios() {
    return this.scenarios;
  },

  runScenario(scenarioId) {
    return this.scenarios.find(s => s.id === scenarioId) || null;
  }
};

// ═══════════════════════════════════════════════════════════
// 6. FAMILYFORT™ — Family Wealth Management
// ═══════════════════════════════════════════════════════════

const FamilyFort = {
  members: [],

  init() {
    this.loadMembers();
    if (this.members.length === 0) {
      this.seedDemoFamily();
    }
  },

  seedDemoFamily() {
    this.members = [
      {
        id: 'mem_001',
        name: 'Rahul Sharma',
        relation: 'Self (Admin)',
        age: 32,
        role: 'admin',
        income: 125000,
        linkedAccounts: 3,
        permissions: ['full_access', 'manage_all', 'view_all'],
        lastActive: 'Online now',
        spendingLimit: null,
        alertOnOverspend: false
      },
      {
        id: 'mem_002',
        name: 'Priya Sharma',
        relation: 'Spouse',
        age: 30,
        role: 'co_admin',
        income: 95000,
        linkedAccounts: 2,
        permissions: ['view_own', 'transact_own', 'view_family_summary'],
        lastActive: '2 hours ago',
        spendingLimit: 50000,
        alertOnOverspend: true
      },
      {
        id: 'mem_003',
        name: 'Aarav Sharma',
        relation: 'Child',
        age: 8,
        role: 'child',
        income: 0,
        linkedAccounts: 1,
        permissions: ['pocket_money', 'view_own_balance'],
        lastActive: 'Yesterday',
        spendingLimit: 500,
        alertOnOverspend: true,
        pocketMoney: 1000,
        pocketMoneyFrequency: 'monthly',
        choreRewards: [
          { task: 'Make bed', reward: 20, completed: 15 },
          { task: 'Do homework', reward: 30, completed: 18 },
          { task: 'Clean room', reward: 25, completed: 10 }
        ]
      },
      {
        id: 'mem_004',
        name: 'Rajesh Sharma',
        relation: 'Father (Senior)',
        age: 68,
        role: 'senior',
        income: 35000,
        linkedAccounts: 1,
        permissions: ['view_own', 'transact_limited', 'senior_protection'],
        lastActive: '3 days ago',
        spendingLimit: 10000,
        alertOnOverspend: true,
        seniorProtection: {
          enabled: true,
          largeWithdrawalAlert: true,
          scamCallProtection: true,
          healthEmergencyContact: '+91-98765-43210',
          trustedContacts: ['Rahul Sharma', 'Priya Sharma']
        }
      }
    ];
    this.saveMembers();
  },

  getFamilyOverview() {
    const totalFamilyIncome = this.members.reduce((s, m) => s + (m.income || 0), 0);
    const totalFamilyWealth = this.members.reduce((s, m) => s + ((m.linkedAccounts || 0) * 200000), 0);
    const alerts = [];

    this.members.forEach(m => {
      if (m.role === 'senior' && m.lastActive && new Date(m.lastActive) !== 'Online now') {
        const daysSince = Math.floor((Date.now() - new Date(m.lastActive).getTime()) / 86400000);
        if (daysSince > 2) {
          alerts.push({
            member: m.name,
            type: 'inactivity',
            severity: 'warning',
            message: `${m.name} hasn't logged in for ${daysSince} days. Check on them.`
          });
        }
      }
      if (m.role === 'child' && m.alertOnOverspend && m.pocketMoney) {
        const spent = (m.choreRewards || []).reduce((s, c) => s + c.completed * c.reward, 0);
        if (spent > m.pocketMoney * 0.8) {
          alerts.push({
            member: m.name,
            type: 'spending',
            severity: 'info',
            message: `${m.name} has used ${Math.round(spent / m.pocketMoney * 100)}% of monthly pocket money.`
          });
        }
      }
    });

    return {
      totalMembers: this.members.length,
      totalFamilyIncome,
      totalFamilyWealth,
      totalLinkedAccounts: this.members.reduce((s, m) => s + (m.linkedAccounts || 0), 0),
      members: this.members,
      alerts,
      familyGoals: [
        { goal: 'Family Vacation 2026', target: 300000, current: 120000, contributors: ['Rahul', 'Priya'] },
        { goal: 'Aarav\'s Education Fund', target: 2000000, current: 320000, contributors: ['Rahul'] },
        { goal: 'Parents\' Health Corpus', target: 500000, current: 280000, contributors: ['Rahul', 'Rajesh'] }
      ]
    };
  },

  addMember(member) {
    member.id = 'mem_' + Date.now();
    this.members.push(member);
    this.saveMembers();
    return { success: true, member };
  },

  togglePermission(memberId, permission) {
    const member = this.members.find(m => m.id === memberId);
    if (!member) return { success: false };
    if (member.permissions.includes(permission)) {
      member.permissions = member.permissions.filter(p => p !== permission);
    } else {
      member.permissions.push(permission);
    }
    this.saveMembers();
    return { success: true, member };
  },

  saveMembers() {
    try { localStorage.setItem('sw_family_members', JSON.stringify(this.members)); } catch (e) {}
  },
  loadMembers() {
    try {
      const data = localStorage.getItem('sw_family_members');
      if (data) this.members = JSON.parse(data);
    } catch (e) {}
  }
};

// ═══════════════════════════════════════════════════════════
// 7. DIGITAL VAULT — Document Locker + Nominee + Inheritance
// ═══════════════════════════════════════════════════════════

const DigitalVault = {
  documents: [],
  nominees: [],
  inheritancePlan: {},

  init() {
    this.loadState();
    if (this.documents.length === 0) this.seedDemoData();
  },

  seedDemoData() {
    this.documents = [
      { id: 'doc_001', name: 'Life Insurance Policy', type: 'Insurance', provider: 'LIC', policyNo: '123456789', value: 5000000, nominee: 'Priya Sharma', expiryDate: '2045-03-15', uploadedAt: new Date().toISOString(), encrypted: true },
      { id: 'doc_002', name: 'Home Loan Agreement', type: 'Loan', provider: 'SBI', accountNo: 'HL-98765', value: 3500000, nominee: null, expiryDate: '2035-06-20', uploadedAt: new Date().toISOString(), encrypted: true },
      { id: 'doc_003', name: 'Will & Testament', type: 'Legal', provider: 'LegalDesk', value: null, nominee: 'Priya Sharma', expiryDate: null, uploadedAt: new Date().toISOString(), encrypted: true },
      { id: 'doc_004', name: 'Property Papers - Apartment', type: 'Property', provider: 'Registrar', value: 4500000, nominee: 'Aarav Sharma', expiryDate: null, uploadedAt: new Date().toISOString(), encrypted: true }
    ];

    this.nominees = [
      { id: 'nom_001', name: 'Priya Sharma', relation: 'Spouse', share: 60, documents: ['doc_001', 'doc_003'], contactNumber: '+91-98765-43211', email: 'priya@email.com' },
      { id: 'nom_002', name: 'Aarav Sharma', relation: 'Son', share: 30, documents: ['doc_004'], contactNumber: null, email: null, guardian: 'Priya Sharma' },
      { id: 'nom_003', name: 'Rajesh Sharma', relation: 'Father', share: 10, documents: [], contactNumber: '+91-98765-43212', email: 'rajesh@email.com' }
    ];

    this.inheritancePlan = {
      totalEstateValue: 15000000,
      willRegistered: true,
      willLastUpdated: '2025-11-15',
      executorName: 'Priya Sharma',
      alternateExecutor: 'Rajesh Sharma',
      specialInstructions: 'Education corpus for Aarav until age 25. Health fund for parents.',
      assetDistribution: [
        { asset: 'Apartment (Mumbai)', value: 4500000, beneficiary: 'Priya Sharma' },
        { asset: 'LIC Policy', value: 5000000, beneficiary: 'Priya Sharma' },
        { asset: 'Mutual Funds', value: 2500000, beneficiary: 'Aarav Sharma', guardian: 'Priya Sharma' },
        { asset: 'Gold & Jewelry', value: 800000, beneficiary: 'Priya Sharma' },
        { asset: 'Savings & FD', value: 2200000, beneficiary: 'Split: 60-30-10' }
      ]
    };

    this.saveState();
  },

  getVaultSummary() {
    return {
      totalDocuments: this.documents.length,
      totalNominees: this.nominees.length,
      totalEstateValue: this.inheritancePlan.totalEstateValue || 0,
      willRegistered: this.inheritancePlan.willRegistered || false,
      documents,
      nominees: this.nominees,
      inheritancePlan: this.inheritancePlan,
      completenessScore: this._calculateCompleteness(),
      missingItems: this._getMissingItems()
    };
  },

  _calculateCompleteness() {
    let score = 0;
    if (this.documents.length >= 4) score += 30;
    else score += this.documents.length * 7;
    if (this.nominees.length >= 2) score += 25;
    else score += this.nominees.length * 12;
    if (this.inheritancePlan.willRegistered) score += 25;
    if (this.inheritancePlan.assetDistribution && this.inheritancePlan.assetDistribution.length >= 3) score += 20;
    return Math.min(100, score);
  },

  _getMissingItems() {
    const missing = [];
    if (this.documents.length < 4) missing.push('Upload insurance, property, and loan documents');
    if (this.nominees.length < 2) missing.push('Add at least 2 nominees for your assets');
    if (!this.inheritancePlan.willRegistered) missing.push('Register a digital will');
    if (!this.inheritancePlan.executorName) missing.push('Designate an executor for your estate');
    return missing;
  },

  addDocument(doc) {
    doc.id = 'doc_' + Date.now();
    doc.uploadedAt = new Date().toISOString();
    doc.encrypted = true;
    this.documents.push(doc);
    this.saveState();
    return { success: true, document: doc };
  },

  saveState() {
    try {
      localStorage.setItem('sw_vault_state', JSON.stringify({
        documents: this.documents,
        nominees: this.nominees,
        inheritancePlan: this.inheritancePlan
      }));
    } catch (e) {}
  },

  loadState() {
    try {
      const data = localStorage.getItem('sw_vault_state');
      if (data) {
        const parsed = JSON.parse(data);
        this.documents = parsed.documents || [];
        this.nominees = parsed.nominees || [];
        this.inheritancePlan = parsed.inheritancePlan || {};
      }
    } catch (e) {}
  }
};

// Init all
AutoPilotEngine.init();
FamilyFort.init();
DigitalVault.init();

console.log('[PremiumFeatures] 7 premium bank-grade features loaded.');
