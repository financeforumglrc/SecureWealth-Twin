/**
 * ═══════════════════════════════════════════════════════════════
 *  ACCOUNT AGGREGATOR HUB — Multi-Bank Consolidated View
 * ═══════════════════════════════════════════════════════════════
 *
 *  INNOVATION: A full Account Aggregator (AA) implementation that
 *  connects to multiple bank accounts and provides a unified financial
 *  dashboard — tracking balances, transactions, and spending patterns
 *  across SBI, HDFC, ICICI, Axis, and other banks.
 *
 *  Unique features:
 *  - Multi-bank linking with simulated consent flow
 *  - Consolidated balance & net worth view
 *  - Cross-bank spending categorization
 *  - Intelligent fund movement suggestions (where to keep money)
 *  - Bank-level interest rate comparison
 *  - Sweep-in / auto-sweep recommendations
 */

const AccountAggregator = {
  // Linked bank accounts
  linkedAccounts: [],

  // Consent records (AA regulatory requirement)
  consents: [],

  // Available banks for linking
  availableBanks: [
    { id: 'sbi', name: 'State Bank of India', icon: 'fa-building-columns', color: '#1a237e', type: 'savings', interestRate: 2.70 },
    { id: 'hdfc', name: 'HDFC Bank', icon: 'fa-building-columns', color: '#004c8c', type: 'savings', interestRate: 3.50 },
    { id: 'icici', name: 'ICICI Bank', icon: 'fa-building-columns', color: '#f26522', type: 'savings', interestRate: 3.25 },
    { id: 'axis', name: 'Axis Bank', icon: 'fa-building-columns', color: '#97144d', type: 'savings', interestRate: 3.00 },
    { id: 'kotak', name: 'Kotak Mahindra', icon: 'fa-building-columns', color: '#ee1c25', type: 'savings', interestRate: 3.50 },
    { id: 'pnb', name: 'Punjab National Bank', icon: 'fa-building-columns', color: '#8b0045', type: 'savings', interestRate: 2.70 },
    { id: 'yes', name: 'Yes Bank', icon: 'fa-building-columns', color: '#00529b', type: 'savings', interestRate: 3.25 },
    { id: 'idfc', name: 'IDFC FIRST Bank', icon: 'fa-building-columns', color: '#e31837', type: 'savings', interestRate: 4.00 }
  ],

  /**
   * Initialize Account Aggregator
   */
  init() {
    this.loadState();
    if (this.linkedAccounts.length === 0) {
      this.seedDefaultAccounts();
    }
  },

  /**
   * Seed default linked accounts for demo
   */
  seedDefaultAccounts() {
    const defaults = [
      {
        id: 'acc_001',
        bankId: 'sbi',
        bankName: 'State Bank of India',
        accountNumber: '******1234',
        type: 'savings',
        balance: 450000,
        lastUpdated: new Date().toISOString(),
        consentId: 'cns_001',
        consentExpiry: new Date(Date.now() + 180 * 86400000).toISOString(),
        recentTransactions: 23,
        monthlyAvgBalance: 420000
      },
      {
        id: 'acc_002',
        bankId: 'hdfc',
        bankName: 'HDFC Bank',
        accountNumber: '******5678',
        type: 'savings',
        balance: 120000,
        lastUpdated: new Date().toISOString(),
        consentId: 'cns_002',
        consentExpiry: new Date(Date.now() + 90 * 86400000).toISOString(),
        recentTransactions: 45,
        monthlyAvgBalance: 98000
      },
      {
        id: 'acc_003',
        bankId: 'icici',
        bankName: 'ICICI Bank',
        accountNumber: '******9012',
        type: 'current',
        balance: 280000,
        lastUpdated: new Date().toISOString(),
        consentId: 'cns_003',
        consentExpiry: new Date(Date.now() + 120 * 86400000).toISOString(),
        recentTransactions: 12,
        monthlyAvgBalance: 250000
      }
    ];

    const consents = defaults.map(acc => ({
      id: acc.consentId,
      accountId: acc.id,
      bankId: acc.bankId,
      purpose: 'Wealth Management & Financial Planning',
      grantedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      expiresAt: acc.consentExpiry,
      dataTypes: ['balance', 'transactions', 'profile'],
      status: 'active'
    }));

    this.linkedAccounts = defaults;
    this.consents = consents;
    this.saveState();
  },

  /**
   * Link a new bank account (simulated AA consent flow)
   */
  linkAccount(bankId, accountNumber) {
    const bank = this.availableBanks.find(b => b.id === bankId);
    if (!bank) return { success: false, message: 'Bank not found' };

    // Check if already linked
    const existing = this.linkedAccounts.find(a => a.bankId === bankId);
    if (existing) return { success: false, message: `${bank.name} is already linked` };

    // Simulate AA consent flow
    const consent = {
      id: 'cns_' + Date.now(),
      accountId: 'acc_' + Date.now(),
      bankId,
      purpose: 'Wealth Management & Financial Planning',
      grantedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString(),
      dataTypes: ['balance', 'transactions', 'profile'],
      status: 'active'
    };

    const account = {
      id: consent.accountId,
      bankId,
      bankName: bank.name,
      accountNumber: '******' + (accountNumber || String(Math.floor(1000 + Math.random() * 9000))),
      type: bank.type || 'savings',
      balance: Math.floor(Math.random() * 500000) + 50000,
      lastUpdated: new Date().toISOString(),
      consentId: consent.id,
      consentExpiry: consent.expiresAt,
      recentTransactions: Math.floor(Math.random() * 50),
      monthlyAvgBalance: 0
    };

    // Calculate monthly average
    account.monthlyAvgBalance = Math.round(account.balance * (0.85 + Math.random() * 0.3));

    this.linkedAccounts.push(account);
    this.consents.push(consent);
    this.saveState();

    return {
      success: true,
      account,
      consent,
      message: `${bank.name} linked successfully via Account Aggregator!`
    };
  },

  /**
   * Revoke consent and unlink an account
   */
  unlinkAccount(accountId) {
    const idx = this.linkedAccounts.findIndex(a => a.id === accountId);
    if (idx === -1) return { success: false, message: 'Account not found' };

    const account = this.linkedAccounts[idx];
    this.linkedAccounts.splice(idx, 1);
    this.consents = this.consents.filter(c => c.accountId !== accountId);
    this.saveState();

    return {
      success: true,
      message: `${account.bankName} unlinked. Consent revoked.`
    };
  },

  /**
   * Get consolidated financial summary across all banks
   */
  getConsolidatedView() {
    const totalBalance = this.linkedAccounts.reduce((s, a) => s + a.balance, 0);
    const totalAvgBalance = this.linkedAccounts.reduce((s, a) => s + a.monthlyAvgBalance, 0);
    const activeConsents = this.consents.filter(c => c.status === 'active');
    const expiringConsents = activeConsents.filter(c => {
      const daysLeft = (new Date(c.expiresAt) - Date.now()) / 86400000;
      return daysLeft < 30;
    });

    // Bank-wise breakdown
    const bankWise = this.linkedAccounts.map(a => {
      const bank = this.availableBanks.find(b => b.id === a.bankId);
      return {
        ...a,
        interestRate: bank ? bank.interestRate : 0,
        annualInterest: Math.round(a.balance * (bank ? bank.interestRate : 0) / 100),
        percentageOfTotal: totalBalance > 0 ? Math.round(a.balance / totalBalance * 100) : 0
      };
    });

    // Spending power score
    const spendingPower = Math.round(totalBalance / 100000) * 10;

    // Recommendations
    const recommendations = this._generateRecommendations(bankWise);

    return {
      totalBalance,
      totalAvgBalance,
      linkedBanks: this.linkedAccounts.length,
      activeConsents: activeConsents.length,
      expiringConsents,
      bankWise,
      spendingPower: Math.min(100, spendingPower),
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  },

  /**
   * Generate intelligent fund management recommendations
   */
  _generateRecommendations(bankWise) {
    const recs = [];

    // Find highest interest rate among savings accounts
    const savingsAccts = bankWise.filter(a => a.type === 'savings');
    const bestRate = savingsAccts.sort((a, b) => b.interestRate - a.interestRate)[0];
    const lowestRate = savingsAccts.sort((a, b) => a.interestRate - b.interestRate)[0];

    if (bestRate && lowestRate && bestRate.interestRate > lowestRate.interestRate + 0.5) {
      recs.push({
        type: 'interest_optimization',
        priority: 'high',
        title: 'Optimize Interest Earnings',
        description: `Your ${lowestRate.bankName} account earns ${lowestRate.interestRate}% while ${bestRate.bankName} offers ${bestRate.interestRate}%. Moving ₹50,000 could earn ₹${Math.round(50000 * (bestRate.interestRate - lowestRate.interestRate) / 100)} more annually.`,
        action: 'Move Funds',
        potentialBenefit: `₹${Math.round(50000 * (bestRate.interestRate - lowestRate.interestRate) / 100)}/year`
      });
    }

    // Check for idle funds
    const totalSavings = savingsAccts.reduce((s, a) => s + a.balance, 0);
    if (totalSavings > 300000) {
      recs.push({
        type: 'idle_funds',
        priority: 'medium',
        title: 'Idle Funds Detected',
        description: `₹${(totalSavings - 200000).toLocaleString()} could be moved to higher-yield options like FDs or liquid funds.`,
        action: 'Explore Options',
        potentialBenefit: '5-7% returns vs 2.7-4% savings'
      });
    }

    // Consent renewal reminder
    const expiringConsents = bankWise.filter(a => {
      const daysLeft = (new Date(a.consentExpiry) - Date.now()) / 86400000;
      return daysLeft < 30 && daysLeft > 0;
    });
    if (expiringConsents.length > 0) {
      recs.push({
        type: 'consent_renewal',
        priority: 'high',
        title: 'Consent Expiring Soon',
        description: `${expiringConsents.length} account consent(s) expire within 30 days. Renew to maintain AA access.`,
        action: 'Renew Now',
        potentialBenefit: 'Uninterrupted financial tracking'
      });
    }

    return recs;
  },

  saveState() {
    try {
      localStorage.setItem('sw_aa_data', JSON.stringify({
        linkedAccounts: this.linkedAccounts,
        consents: this.consents
      }));
    } catch (e) {}
  },

  loadState() {
    try {
      const data = localStorage.getItem('sw_aa_data');
      if (data) {
        const parsed = JSON.parse(data);
        this.linkedAccounts = parsed.linkedAccounts || [];
        this.consents = parsed.consents || [];
      }
    } catch (e) {}
  }
};

AccountAggregator.init();
