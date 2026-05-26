import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile, Asset, Goal, ConsentRecord, Badge, Notification, MarketData, ViewType, Transaction, FamilyMember, RecurringBill, InvestmentTrigger, CibilFactor, Challenge, KidProfile, KidTask, SpendRequest, UncategorizedTx, CategoryRule, DuplicateGroup, Subscription, NRIAccount, Remittance, NRIInvestmentRule } from '../types';

interface WealthState {
  user: UserProfile;
  assets: Asset[];
  goals: Goal[];
  consents: ConsentRecord[];
  badges: Badge[];
  notifications: Notification[];
  marketData: MarketData;
  transactions: Transaction[];
  currentView: ViewType;
  isJudgeMode: boolean;
  darkMode: boolean;
  hasConsent: boolean;
  pitchModeActive: boolean;
  familyMode: boolean;
  familyMembers: FamilyMember[];
  familyDataSharing: Record<string, boolean>;
  quizResult: { name: string; score: number; date: string } | null;
  lockdownActive: boolean;
  coercedMode: boolean;
  includeInCommunityData: boolean;
  bills: RecurringBill[];
  triggers: InvestmentTrigger[];
  cibilScore: number;
  cibilFactors: CibilFactor[];
  isAuthenticated: boolean;
  authAttempts: number;
  authLockoutUntil: number | null;
  challenges: Challenge[];
  kidProfile: KidProfile | null;
  kidTasks: KidTask[];
  spendRequests: SpendRequest[];
  uncategorizedTxs: UncategorizedTx[];
  categoryRules: CategoryRule[];
  duplicateGroups: DuplicateGroup[];
  subscriptions: Subscription[];
  language: string;
  accessibilityMode: boolean;
  nriMode: boolean;
  nriAccounts: NRIAccount[];
  remittances: Remittance[];
  nriInvestmentRules: NRIInvestmentRule[];
  preferredCurrency: string;
  exchangeRates: Record<string, number>;
  exchangeRatesLastUpdated: string;
  seniorMode: boolean;
  kycVerified: boolean;
  demoModeActive: boolean;
  demoPhase: number;
  demoPaused: boolean;
  
  setView: (view: ViewType) => void;
  setLockdownActive: (val: boolean) => void;
  setCoercedMode: (val: boolean) => void;
  toggleCommunityData: () => void;
  setPitchModeActive: (val: boolean) => void;
  toggleFamilyMode: () => void;
  toggleFamilyDataSharing: (memberId: string) => void;
  setQuizResult: (result: { name: string; score: number; date: string }) => void;
  addAsset: (asset: Asset) => void;
  removeAsset: (id: string) => void;
  addGoal: (goal: Goal) => void;
  editGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (id: string, amount: number) => void;
  addConsent: (consent: ConsentRecord) => void;
  revokeConsent: (id: string) => void;
  addTransaction: (tx: Transaction) => void;
  toggleDarkMode: () => void;
  setHasConsent: (val: boolean) => void;
  markNotificationRead: (id: string) => void;
  unlockBadge: (id: string) => void;
  initJudgeMode: () => void;
  toggleBillPaid: (id: string) => void;
  payBill: (id: string) => void;
  toggleTrigger: (id: string) => void;
  dismissTrigger: (id: string) => void;
  fireTrigger: (id: string) => void;
  setCibilScore: (score: number) => void;
  authenticate: () => void;
  logout: () => void;
  incrementAuthAttempt: () => void;
  resetAuthLockout: () => void;
  setKidProfile: (profile: KidProfile) => void;
  toggleKidTask: (taskId: string) => void;
  addKidTask: (task: KidTask) => void;
  addSpendRequest: (req: SpendRequest) => void;
  updateSpendRequest: (id: string, status: 'approved' | 'rejected') => void;
  acceptAICategory: (id: string) => void;
  changeAICategory: (id: string, category: string) => void;
  createCategoryRule: (id: string) => void;
  resolveDuplicate: (id: string, action: 'merged' | 'kept' | 'not-duplicate') => void;
  cancelSubscription: (id: string) => void;
  pauseSubscription: (id: string) => void;
  setLanguage: (lang: string) => void;
  toggleAccessibilityMode: () => void;
  toggleNRIMode: () => void;
  setPreferredCurrency: (curr: string) => void;
  cycleCurrency: () => void;
  toggleSeniorMode: () => void;
  setKycVerified: (val: boolean) => void;
  setDemoModeActive: (val: boolean) => void;
  setDemoPhase: (phase: number) => void;
  toggleDemoPaused: () => void;
}

const mockAssets: Asset[] = [
  { id: '1', name: 'SBI Savings', type: 'bank', value: 450000, liquidity: 'high' },
  { id: '2', name: 'HDFC Savings', type: 'bank', value: 320000, liquidity: 'high' },
  { id: '3', name: 'Axis Bluechip Fund', type: 'mutualFund', value: 280000, liquidity: 'medium', returns: 14.2 },
  { id: '4', name: 'Nifty 50 ETF', type: 'stock', value: 150000, liquidity: 'high', returns: 12.8 },
  { id: '5', name: 'Physical Gold', type: 'gold', value: 200000, liquidity: 'medium' },
  { id: '6', name: 'Mumbai Apartment', type: 'property', value: 8500000, liquidity: 'low' },
];

const mockGoals: Goal[] = [
  { id: '1', name: 'Emergency Fund', type: 'emergency', targetAmount: 600000, currentAmount: 360000, deadline: '2026-12-31' },
  { id: '2', name: 'Dream Home', type: 'home', targetAmount: 2500000, currentAmount: 850000, deadline: '2030-06-30' },
  { id: '3', name: "Child's Education", type: 'education', targetAmount: 1500000, currentAmount: 420000, deadline: '2032-03-15' },
];

const mockBadges: Badge[] = [
  { id: '1', name: 'First SIP', desc: 'Started your first SIP', icon: 'fa-piggy-bank', unlocked: true, date: '2025-01-15' },
  { id: '2', name: 'Goal Setter', desc: 'Set 3 financial goals', icon: 'fa-bullseye', unlocked: true, date: '2025-02-01' },
  { id: '3', name: 'Diversified', desc: 'Hold 5+ asset types', icon: 'fa-layer-group', unlocked: true, date: '2025-03-10' },
  { id: '4', name: 'Tax Saver', desc: 'Invest ₹1.5L in 80C', icon: 'fa-receipt', unlocked: false },
  { id: '5', name: 'Wealth Builder', desc: 'Net worth crosses ₹50L', icon: 'fa-gem', unlocked: false },
  { id: '6', name: 'Security Pro', desc: '50 days without high-risk actions', icon: 'fa-shield-halved', unlocked: false },
  { id: 'personality', name: 'Personality Discovered', desc: 'Completed the investment personality quiz', icon: 'fa-clipboard-question', unlocked: false },
  { id: 'duplicate-guardian', name: 'Duplicate Guardian', desc: 'AI caught 3 duplicate charges this month', icon: 'fa-shield-halved', unlocked: false },
  { id: 'diwali-dhamaka', name: 'Diwali Dhamaka Saver', desc: 'Saved ₹50,000 during Diwali shopping with AI alerts', icon: 'fa-firework', unlocked: false },
  { id: 'new-year-investor', name: 'New Year Investor', desc: 'Started SIP on 1st January — a disciplined beginning', icon: 'fa-calendar-check', unlocked: false },
];

const mockNotifications: Notification[] = [
  { id: '1', icon: 'fa-shield-halved', text: 'Unusual login attempt blocked from Mumbai', time: '2 min ago', unread: true, color: 'rose' },
  { id: '2', icon: 'fa-piggy-bank', text: 'Your SIP of ₹15,000 is due tomorrow', time: '1 hour ago', unread: true, color: 'primary' },
  { id: '3', icon: 'fa-chart-line', text: 'NIFTY crossed 25,000 — portfolio up 2.4%', time: '3 hours ago', unread: false, color: 'emerald' },
  { id: '4', icon: 'fa-triangle-exclamation', text: 'Credit card bill due in 2 days', time: '5 hours ago', unread: false, color: 'amber' },
];

const mockMarketData: MarketData = {
  niftyPe: 23.4,
  repoRate: 6.5,
  inflation: 6.2,
  goldPrice: 78500,
  usdInr: 83.2,
  lastUpdated: new Date().toISOString(),
};

const mockTransactions: Transaction[] = [
  { id: 'tx-1', date: '2026-04-22', description: 'Salary Credit - Acme Corp', category: 'Income', amount: 125000, type: 'credit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-2', date: '2026-04-21', description: 'Grocery - BigBasket', category: 'Food', amount: 2400, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-3', date: '2026-04-21', description: 'Electricity Bill - Adani', category: 'Utilities', amount: 3200, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-4', date: '2026-04-20', description: 'Axis Bluechip SIP', category: 'Investment', amount: 15000, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-5', date: '2026-04-20', description: 'Rent Payment', category: 'Housing', amount: 25000, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-6', date: '2026-04-19', description: 'Blocked: ₹50,000 transfer to unknown payee', category: 'Transfer', amount: 50000, type: 'debit', status: 'BLOCKED', riskLevel: 'HIGH', score: 85, signals: { newDevice: true, rushedAction: true, unusualAmount: true, otpRetries: false, firstTimeInvest: false, abnormalBehavior: false }, decision: { level: 'HIGH', action: 'BLOCK', delay: 300, message: 'High cyber-risk detected. Action paused for security review.', referenceId: 'AUD-LX9KP2' } },
  { id: 'tx-7', date: '2026-04-18', description: 'Delayed: ₹2,50,000 to new payee', category: 'Transfer', amount: 250000, type: 'debit', status: 'DELAYED', riskLevel: 'MEDIUM', score: 70, signals: { newDevice: false, rushedAction: true, unusualAmount: true, otpRetries: false, firstTimeInvest: false, abnormalBehavior: false }, decision: { level: 'MEDIUM', action: 'WARN', cooldown: 30, message: 'Unusual pattern detected. Please review before proceeding.', referenceId: 'AUD-MQ7VN4' } },
  { id: 'tx-8', date: '2026-04-18', description: 'Dining - Zomato', category: 'Food', amount: 1200, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-9', date: '2026-04-17', description: 'Nifty 50 ETF SIP', category: 'Investment', amount: 10000, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-10', date: '2026-04-17', description: 'Fuel - Shell Petrol', category: 'Transport', amount: 3500, type: 'debit', status: 'ALLOWED', riskLevel: 'LOW' },
  { id: 'tx-11', date: '2026-04-16', description: 'Blocked: Rapid Clicks merchant ₹75,000', category: 'Shopping', amount: 75000, type: 'debit', status: 'BLOCKED', riskLevel: 'HIGH', score: 90, signals: { newDevice: true, rushedAction: true, unusualAmount: true, otpRetries: true, firstTimeInvest: false, abnormalBehavior: true }, decision: { level: 'HIGH', action: 'BLOCK', delay: 300, message: 'Multiple high-risk signals detected. Transaction blocked for your safety.', referenceId: 'AUD-RX3WT8' } },
  { id: 'tx-12', date: '2026-04-15', description: 'Dividend - HDFC Fund', category: 'Income', amount: 2800, type: 'credit', status: 'ALLOWED', riskLevel: 'LOW' },
];

export const useWealthStore = create<WealthState>()(
  persist(
    (set, get) => ({
      user: {
        name: 'Rahul Sharma',
        riskProfile: 'Moderate',
        taxBracket: 30,
        monthlyIncome: 125000,
        monthlySavings: 28000,
        monthlyExpenses: 72000,
      },
      assets: mockAssets,
      goals: mockGoals,
      consents: [],
      badges: mockBadges,
      notifications: mockNotifications,
      marketData: mockMarketData,
      transactions: mockTransactions,
      currentView: 'dashboard',
      isJudgeMode: false,
      darkMode: false,
      hasConsent: false,
      pitchModeActive: false,
      familyMode: false,
      familyDataSharing: { self: true, spouse: true, father: false, child: false },
      quizResult: null,
      lockdownActive: false,
      coercedMode: false,
      includeInCommunityData: true,
      bills: [
        { id: 'bill-1', name: 'House Rent', category: 'Housing', amount: 25000, dueDay: 1, icon: 'fa-house', color: 'bg-rose-500', status: 'upcoming', isRecurring: true, frequency: 'monthly', autoDetected: false, history: [25000, 25000, 25000] },
        { id: 'bill-2', name: 'Electricity Bill', category: 'Utilities', amount: 4800, predictedAmount: 3200, dueDay: 15, icon: 'fa-bolt', color: 'bg-amber-500', status: 'upcoming', isRecurring: true, frequency: 'monthly', autoDetected: true, history: [3100, 3300, 2900, 3200] },
        { id: 'bill-3', name: 'Monthly SIPs', category: 'Investment', amount: 25000, dueDay: 5, icon: 'fa-chart-line', color: 'bg-emerald-500', status: 'upcoming', isRecurring: true, frequency: 'monthly', autoDetected: false, history: [25000, 25000, 25000] },
        { id: 'bill-4', name: 'Credit Card Bill', category: 'Credit', amount: 12000, dueDay: 20, icon: 'fa-credit-card', color: 'bg-purple-500', status: 'upcoming', isRecurring: true, frequency: 'monthly', autoDetected: true, history: [11500, 12800, 10200, 12000] },
        { id: 'bill-5', name: 'Mobile & Broadband', category: 'Utilities', amount: 1299, dueDay: 28, icon: 'fa-wifi', color: 'bg-blue-500', status: 'upcoming', isRecurring: true, frequency: 'monthly', autoDetected: true, history: [1299, 1299, 1299] },
      ],
      triggers: [
        {
          id: 'trigger-1', name: 'Buy the Dip', description: 'When NIFTY drops > 3% in a week, suggest ₹10,000 additional SIP',
          condition: 'NIFTY weekly drop > 3%', action: 'Suggest ₹10,000 additional SIP', enabled: true, fired: false, dismissed: false,
          progress: 70, currentValue: 'NIFTY down 2.1%', targetValue: 'Drop > 3%', icon: 'fa-arrow-trend-down', color: 'bg-rose-500'
        },
        {
          id: 'trigger-2', name: 'Gold Hedge', description: 'When gold/silver ratio > 85, increase gold allocation',
          condition: 'Gold/Silver ratio > 85', action: 'Increase gold allocation by 5%', enabled: true, fired: false, dismissed: false,
          progress: 30, currentValue: 'Ratio at 82', targetValue: 'Ratio > 85', icon: 'fa-coins', color: 'bg-amber-500'
        },
        {
          id: 'trigger-3', name: 'FD Rate Alert', description: 'When any bank offers FD > 8%, notify me',
          condition: 'FD rate > 8%', action: 'Notify and show FD options', enabled: true, fired: true, dismissed: false,
          progress: 100, currentValue: 'IDFC First @ 8.1%', targetValue: 'Rate > 8%', icon: 'fa-building-columns', color: 'bg-emerald-500'
        },
      ],
      cibilScore: 748,
      isAuthenticated: false,
      authAttempts: 0,
      authLockoutUntil: null,
      cibilFactors: [
        { name: 'Payment History', weight: 35, score: 780, maxScore: 900, status: 'good', icon: 'fa-receipt', detail: 'No missed payments in 24 months' },
        { name: 'Credit Utilization', weight: 30, score: 680, maxScore: 900, status: 'warning', icon: 'fa-credit-card', detail: 'Using 65% of ₹2,00,000 limit (₹1,30,000)' },
        { name: 'Credit Age', weight: 15, score: 800, maxScore: 900, status: 'good', icon: 'fa-clock', detail: 'Oldest account: 8 years 3 months' },
        { name: 'Credit Mix', weight: 10, score: 700, maxScore: 900, status: 'good', icon: 'fa-layer-group', detail: '2 credit cards + 1 personal loan + 1 home loan' },
        { name: 'Recent Inquiries', weight: 10, score: 620, maxScore: 900, status: 'warning', icon: 'fa-magnifying-glass', detail: '3 hard inquiries in last 2 months' },
      ],
      challenges: [
        {
          id: 'chal-1', title: '30-Day No-Spend Challenge', description: 'Avoid dining out for 30 days. Save ₹6,000!',
          icon: 'fa-utensils', color: 'bg-rose-500', progress: 12, maxProgress: 30, progressLabel: 'Day 12/30',
          participants: 1247, userRank: 342, daysLeft: 18, status: 'active', reward: 'Frugal Fox Badge'
        },
        {
          id: 'chal-2', title: '₹5K Emergency Fund Sprint', description: 'Build a mini emergency fund in 60 days',
          icon: 'fa-piggy-bank', color: 'bg-emerald-500', progress: 3200, maxProgress: 5000, progressLabel: '₹3,200/₹5,000',
          participants: 3891, userRank: 156, daysLeft: 28, status: 'active', reward: 'Safety Net Badge'
        },
        {
          id: 'chal-3', title: 'SIP Streak Challenge', description: "Don't miss an SIP for 6 months",
          icon: 'fa-chart-line', color: 'bg-primary', progress: 4, maxProgress: 6, progressLabel: '4/6 months',
          participants: 2103, userRank: 89, daysLeft: 60, status: 'active', reward: 'SIP Champion Badge'
        },
      ],
      kidProfile: null,
      kidTasks: [
        { id: 'kt-1', title: 'Finish Homework', description: 'Complete all school assignments for the day', reward: 50, completed: false, approved: false },
        { id: 'kt-2', title: 'Help with Dishes', description: 'Wash and dry the dishes after dinner', reward: 30, completed: false, approved: false },
        { id: 'kt-3', title: 'Read for 30 mins', description: 'Read any book for at least 30 minutes', reward: 40, completed: true, approved: true },
        { id: 'kt-4', title: 'Clean your Room', description: 'Tidy up and organize your room', reward: 60, completed: false, approved: false },
        { id: 'kt-5', title: 'Practice Piano', description: 'Practice piano for 20 minutes', reward: 45, completed: true, approved: true },
      ],
      spendRequests: [
        { id: 'sr-1', amount: 250, reason: 'Cricket bat for school match', status: 'approved', date: '2026-04-15' },
        { id: 'sr-2', amount: 120, reason: 'Ice cream with friends', status: 'rejected', date: '2026-04-16' },
        { id: 'sr-3', amount: 500, reason: 'New sketchbook and colors', status: 'pending', date: '2026-04-18' },
      ],
      uncategorizedTxs: [
        { id: 'uc-1', description: 'Payment to Swiggy', amount: 450, date: '2026-04-22', aiCategory: 'Food & Dining', confidence: 95, category: null, ruleCreated: false },
        { id: 'uc-2', description: 'Amazon.in purchase', amount: 1299, date: '2026-04-21', aiCategory: 'Shopping', confidence: 88, category: null, ruleCreated: false },
        { id: 'uc-3', description: 'Ola Money transfer', amount: 230, date: '2026-04-20', aiCategory: 'Transport', confidence: 92, category: null, ruleCreated: false },
        { id: 'uc-4', description: 'Zerodha equity', amount: 15000, date: '2026-04-19', aiCategory: 'Investment', confidence: 97, category: null, ruleCreated: false },
        { id: 'uc-5', description: 'Cash withdrawal ICICI ATM', amount: 5000, date: '2026-04-18', aiCategory: 'Cash', confidence: 85, category: null, ruleCreated: false },
      ],
      categoryRules: [
        { id: 'rule-1', pattern: 'BigBasket', category: 'Food', count: 12 },
        { id: 'rule-2', pattern: 'Electricity Bill', category: 'Utilities', count: 8 },
      ],
      duplicateGroups: [
        {
          id: 'dup-1',
          txIds: ['dup-tx-1a', 'dup-tx-1b'],
          merchant: 'BigBasket',
          amount: 2400,
          confidence: 99,
          reason: 'Same merchant, same amount, 3-minute gap.',
          status: 'pending',
          date: '2026-04-21',
          timeGap: '3 minutes',
        },
        {
          id: 'dup-2',
          txIds: ['dup-tx-2a', 'dup-tx-2b'],
          merchant: 'Axis Bluechip SIP',
          amount: 15000,
          confidence: 85,
          reason: 'SIP usually once per month, but this appears twice in April.',
          status: 'pending',
          date: '2026-04-20',
          timeGap: '14 days',
        },
      ],
      subscriptions: [
        { id: 'sub-1', name: 'Netflix', icon: 'fa-play', color: 'bg-rose-500', amount: 649, frequency: 'monthly', status: 'active', nextRenewal: '2026-05-15', daysUntilRenewal: 27, category: 'Entertainment', autoDetected: true },
        { id: 'sub-2', name: 'Amazon Prime', icon: 'fa-box', color: 'bg-amber-500', amount: 1499, frequency: 'yearly', status: 'active', nextRenewal: '2026-06-02', daysUntilRenewal: 45, category: 'Shopping', autoDetected: true },
        { id: 'sub-3', name: 'Hotstar', icon: 'fa-star', color: 'bg-blue-500', amount: 899, frequency: 'quarterly', status: 'unused', nextRenewal: '2026-04-19', daysUntilRenewal: 1, lastUsed: '2026-02-18', daysSinceUsed: 60, category: 'Entertainment', autoDetected: true },
        { id: 'sub-4', name: 'Cult.fit Gym', icon: 'fa-dumbbell', color: 'bg-emerald-500', amount: 2000, frequency: 'monthly', status: 'unused', nextRenewal: '2026-05-01', daysUntilRenewal: 13, lastUsed: '2025-12-20', daysSinceUsed: 120, category: 'Health', autoDetected: false },
        { id: 'sub-5', name: 'Google One', icon: 'fa-cloud', color: 'bg-sky-500', amount: 130, frequency: 'monthly', status: 'active', nextRenewal: '2026-04-25', daysUntilRenewal: 7, category: 'Utilities', autoDetected: true },
        { id: 'sub-6', name: 'Spotify', icon: 'fa-music', color: 'bg-green-500', amount: 199, frequency: 'monthly', status: 'active', nextRenewal: '2026-04-28', daysUntilRenewal: 10, category: 'Entertainment', autoDetected: true },
      ],
      language: 'en',
      accessibilityMode: false,
      nriMode: false,
      nriAccounts: [
        { id: 'nre-1', name: 'HDFC NRE Savings', type: 'NRE', balance: 2500000, currency: 'INR', repatriable: true, interestRate: 3.5 },
        { id: 'nro-1', name: 'SBI NRO Savings', type: 'NRO', balance: 1500000, currency: 'INR', repatriable: false, repatriationLimit: '₹1L/year', interestRate: 3.0 },
        { id: 'fcnr-1', name: 'Axis FCNR Deposit', type: 'FCNR', balance: 25000, currency: 'USD', repatriable: true, interestRate: 4.8, maturityDate: '2027-04-15' },
      ],
      remittances: [
        { id: 'rem-1', amount: 2000, fromCurrency: 'USD', toCurrency: 'INR', rate: 83.5, fee: 15, date: '2026-04-15', status: 'completed' },
        { id: 'rem-2', amount: 3500, fromCurrency: 'USD', toCurrency: 'INR', rate: 83.2, fee: 12, date: '2026-03-20', status: 'completed' },
        { id: 'rem-3', amount: 1500, fromCurrency: 'USD', toCurrency: 'INR', rate: 83.8, fee: 10, date: '2026-04-20', status: 'completed' },
      ],
      nriInvestmentRules: [
        { id: 'rule-1', name: 'Mutual Funds', allowed: true, category: 'Allowed', note: 'Through NRE/NRO account' },
        { id: 'rule-2', name: 'Stocks (Equity)', allowed: true, category: 'Allowed', note: 'PIS account required' },
        { id: 'rule-3', name: 'NCDs / Bonds', allowed: true, category: 'Allowed', note: 'NRE/NRO both allowed' },
        { id: 'rule-4', name: 'Real Estate', allowed: true, category: 'Allowed', note: 'Residential only, no agricultural land' },
        { id: 'rule-5', name: 'PPF', allowed: false, category: 'Not Allowed', note: 'Cannot extend after 15 years' },
        { id: 'rule-6', name: 'NSC', allowed: false, category: 'Not Allowed', note: 'NRI cannot invest in NSC' },
        { id: 'rule-7', name: 'KVP', allowed: false, category: 'Not Allowed', note: 'NRI cannot invest in KVP' },
        { id: 'rule-8', name: 'Sukanya Samriddhi', allowed: false, category: 'Not Allowed', note: 'Only for resident Indians' },
      ],
      preferredCurrency: 'INR',
      exchangeRates: { INR: 1, USD: 0.0119, EUR: 0.0110, GBP: 0.0095, AED: 0.0438 },
      exchangeRatesLastUpdated: new Date().toISOString(),
      seniorMode: false,
      kycVerified: false,
      demoModeActive: false,
      demoPhase: 0,
      demoPaused: false,
      familyMembers: [
        {
          id: 'self', name: 'Rahul Sharma', relation: 'Self', avatar: 'RS', netWorth: 9520000,
          assets: [
            { name: 'SBI Savings', value: 450000, type: 'bank' },
            { name: 'Axis Bluechip', value: 280000, type: 'mutualFund' },
            { name: 'Mumbai Apartment', value: 8500000, type: 'property' },
            { name: 'Physical Gold', value: 200000, type: 'gold' },
          ],
          monthlyContribution: 28000,
        },
        {
          id: 'spouse', name: 'Priya Sharma', relation: 'Spouse', avatar: 'PS', netWorth: 3200000,
          assets: [
            { name: 'HDFC Savings', value: 320000, type: 'bank' },
            { name: 'Nifty 50 ETF', value: 150000, type: 'stock' },
            { name: 'FD - HDFC', value: 800000, type: 'bank' },
            { name: 'Car', value: 1200000, type: 'vehicle' },
            { name: 'Jewelry', value: 730000, type: 'gold' },
          ],
          monthlyContribution: 15000,
        },
        {
          id: 'father', name: 'Rajesh Sharma', relation: 'Father', avatar: 'RSr', netWorth: 1500000,
          assets: [
            { name: 'Pension Corpus', value: 900000, type: 'bank' },
            { name: 'Senior Citizen FD', value: 400000, type: 'bank' },
            { name: 'Gold Coins', value: 200000, type: 'gold' },
          ],
          monthlyContribution: 5000,
        },
        {
          id: 'child', name: 'Aarav Sharma', relation: 'Child', avatar: 'AS', netWorth: 280000,
          assets: [
            { name: 'Child Savings', value: 80000, type: 'bank' },
            { name: 'Sukanya Samriddhi', value: 150000, type: 'bank' },
            { name: 'Gift Bonds', value: 50000, type: 'other' },
          ],
          monthlyContribution: 2000,
        },
      ],

      setView: (view) => set({ currentView: view }),
      setPitchModeActive: (val) => set({ pitchModeActive: val }),
      toggleFamilyMode: () => set((s) => ({ familyMode: !s.familyMode })),
      toggleFamilyDataSharing: (memberId) => set((s) => ({
        familyDataSharing: { ...s.familyDataSharing, [memberId]: !s.familyDataSharing[memberId] }
      })),
      setQuizResult: (result) => set({ quizResult: result }),
      addAsset: (asset) => set((s) => ({ assets: [...s.assets, asset] })),
      removeAsset: (id) => set((s) => ({ assets: s.assets.filter((a) => a.id !== id) })),
      addGoal: (goal) => set((s) => ({ goals: [...s.goals, goal] })),
      editGoal: (id, updates) => set((s) => ({
        goals: s.goals.map((g) => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGoal: (id) => set((s) => ({ goals: s.goals.filter((g) => g.id !== id) })),
      updateGoal: (id, amount) => set((s) => ({
        goals: s.goals.map((g) => g.id === id ? { ...g, currentAmount: amount } : g)
      })),
      addConsent: (consent) => set((s) => ({ consents: [...s.consents, consent] })),
      revokeConsent: (id) => set((s) => ({
        consents: s.consents.map((c) => c.consentId === id ? { ...c, status: 'REVOKED' as const } : c)
      })),
      addTransaction: (tx) => set((s) => ({ transactions: [tx, ...s.transactions] })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setHasConsent: (val) => set({ hasConsent: val }),
      markNotificationRead: (id) => set((s) => ({
        notifications: s.notifications.map((n) => n.id === id ? { ...n, unread: false } : n)
      })),
      unlockBadge: (id) => set((s) => ({
        badges: s.badges.map((b) => b.id === id ? { ...b, unlocked: true, date: new Date().toISOString().split('T')[0] } : b)
      })),
      initJudgeMode: () => set({
        isJudgeMode: true,
        hasConsent: true,
        user: { ...get().user, riskProfile: 'Aggressive' },
      }),
      setLockdownActive: (val) => set({ lockdownActive: val }),
      setCoercedMode: (val) => set({ coercedMode: val }),
      toggleCommunityData: () => set((s) => ({ includeInCommunityData: !s.includeInCommunityData })),
      toggleBillPaid: (id) => set((s) => ({
        bills: s.bills.map((b) => b.id === id ? { ...b, status: b.status === 'paid' ? 'upcoming' : 'paid' as const } : b)
      })),
      payBill: (id) => set((s) => ({
        bills: s.bills.map((b) => b.id === id ? { ...b, status: 'paid' as const, lastPaid: new Date().toISOString().split('T')[0] } : b)
      })),
      toggleTrigger: (id) => set((s) => ({
        triggers: s.triggers.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t)
      })),
      dismissTrigger: (id) => set((s) => ({
        triggers: s.triggers.map((t) => t.id === id ? { ...t, dismissed: true, fired: false } : t)
      })),
      fireTrigger: (id) => set((s) => ({
        triggers: s.triggers.map((t) => t.id === id ? { ...t, fired: true, progress: 100 } : t)
      })),
      setCibilScore: (score) => set({ cibilScore: score }),
      authenticate: () => set({ isAuthenticated: true, authAttempts: 0, authLockoutUntil: null }),
      logout: () => set({ isAuthenticated: false, authAttempts: 0, authLockoutUntil: null }),
      incrementAuthAttempt: () => set((s) => ({ authAttempts: s.authAttempts + 1 })),
      resetAuthLockout: () => set({ authAttempts: 0, authLockoutUntil: null }),
      setKidProfile: (profile) => set({ kidProfile: profile }),
      toggleKidTask: (taskId) => set((s) => ({
        kidTasks: s.kidTasks.map((t) => {
          if (t.id !== taskId) return t;
          const newCompleted = !t.completed;
          return { ...t, completed: newCompleted, approved: newCompleted };
        }),
        kidProfile: s.kidProfile ? {
          ...s.kidProfile,
          currentSavings: s.kidProfile.currentSavings + (s.kidTasks.find(t => t.id === taskId)?.completed ? -s.kidTasks.find(t => t.id === taskId)!.reward : s.kidTasks.find(t => t.id === taskId)?.reward || 0),
        } : null,
      })),
      addKidTask: (task) => set((s) => ({ kidTasks: [...s.kidTasks, task] })),
      addSpendRequest: (req) => set((s) => ({ spendRequests: [req, ...s.spendRequests] })),
      updateSpendRequest: (id, status) => set((s) => ({
        spendRequests: s.spendRequests.map((r) => r.id === id ? { ...r, status } : r),
      })),
      acceptAICategory: (id) => set((s) => ({
        uncategorizedTxs: s.uncategorizedTxs.map((t) => t.id === id ? { ...t, category: t.aiCategory } : t),
      })),
      changeAICategory: (id, category) => set((s) => ({
        uncategorizedTxs: s.uncategorizedTxs.map((t) => t.id === id ? { ...t, category } : t),
      })),
      createCategoryRule: (id) => set((s) => {
        const tx = s.uncategorizedTxs.find((t) => t.id === id);
        if (!tx) return s;
        const pattern = tx.description.split(' ')[0];
        const existing = s.categoryRules.find((r) => r.pattern === pattern);
        return {
          uncategorizedTxs: s.uncategorizedTxs.map((t) => t.id === id ? { ...t, ruleCreated: true, category: t.category || t.aiCategory } : t),
          categoryRules: existing
            ? s.categoryRules.map((r) => r.pattern === pattern ? { ...r, count: r.count + 1 } : r)
            : [...s.categoryRules, { id: `rule-${Date.now()}`, pattern, category: tx.aiCategory, count: 1 }],
        };
      }),
      resolveDuplicate: (id, action) => set((s) => ({
        duplicateGroups: s.duplicateGroups.map((g) => g.id === id ? { ...g, status: action } : g),
        badges: action === 'merged'
          ? s.badges.map((b) => b.id === 'duplicate-guardian' ? { ...b, unlocked: true, date: new Date().toISOString().split('T')[0] } : b)
          : s.badges,
      })),
      cancelSubscription: (id) => set((s) => ({
        subscriptions: s.subscriptions.map((sub) => sub.id === id ? { ...sub, status: 'cancelled' as const } : sub),
      })),
      pauseSubscription: (id) => set((s) => ({
        subscriptions: s.subscriptions.map((sub) => sub.id === id ? { ...sub, status: sub.status === 'active' ? 'unused' as const : 'active' as const } : sub),
      })),
      setLanguage: (lang) => set({ language: lang }),
      toggleAccessibilityMode: () => set((s) => ({ accessibilityMode: !s.accessibilityMode })),
      toggleNRIMode: () => set((s) => ({ nriMode: !s.nriMode })),
      setPreferredCurrency: (curr) => set({ preferredCurrency: curr }),
      cycleCurrency: () => set((s) => {
        const currencies = ['INR', 'USD', 'EUR', 'GBP', 'AED'];
        const idx = currencies.indexOf(s.preferredCurrency);
        const next = currencies[(idx + 1) % currencies.length];
        return { preferredCurrency: next };
      }),
      toggleSeniorMode: () => set((s) => ({ seniorMode: !s.seniorMode })),
      setKycVerified: (val) => set({ kycVerified: val }),
      setDemoModeActive: (val) => set({ demoModeActive: val, demoPhase: val ? 0 : 0, demoPaused: false }),
      setDemoPhase: (phase) => set({ demoPhase: phase }),
      toggleDemoPaused: () => set((s) => ({ demoPaused: !s.demoPaused })),
    }),
    { 
      name: 'sw-wealth-store',
      partialize: (state) => {
        const { isAuthenticated, authAttempts, authLockoutUntil, ...rest } = state as any;
        return rest;
      }
    }
  )
);
