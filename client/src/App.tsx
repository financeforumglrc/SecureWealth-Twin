import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWealthStore } from './store/wealthStore';
import { isJudgeMode } from './utils/demoMode';
import { usePanicMode } from './hooks/usePanicMode';
import { useDemoMode } from './hooks/useDemoMode';
import { useAuth } from './context/AuthContext';
import { SecurityProvider } from './context/SecurityContext';
// import { clearAuth } from './services/authService';
import NetWorthCard from './components/dashboard/NetWorthCard';
import KYCStatusCard from './components/dashboard/KYCStatusCard';
// import PhysicalAssetsPromo from './components/dashboard/PhysicalAssetsPromo';
import GoalTracker from './components/goals/GoalTracker';
import RecommendationCard from './components/ai/RecommendationCard';
import WealthChat from './components/ai/WealthChat';
import RiskMeter from './components/protection/RiskMeter';
import FraudSimulator from './components/protection/FraudSimulator';
import SecurityLog from './components/protection/SecurityLog';
import ThreatIntel from './components/protection/ThreatIntel';
import DuressModeToggle from './components/protection/DuressMode';
import PanicButton from './components/protection/PanicButton';
import LockdownOverlay from './components/protection/LockdownOverlay';
import BiometricAuth from './components/auth/BiometricAuth';
import NotificationDemo from './components/demo/NotificationDemo';
import DigitalGold from './components/gold/DigitalGold';
import ChallengesView from './components/challenges/ChallengesView';
import KidsMode from './components/kids/KidsMode';
import SubscriptionTracker from './components/subscriptions/SubscriptionTracker';
import ScamCallerID from './components/protection/ScamCallerID';
import BehavioralBiometrics from './components/protection/BehavioralBiometrics';
import FamilyDashboard from './components/family/FamilyDashboard';
import SystemArchitecture from './components/architecture/SystemArchitecture';
import ReportGeneratorModal from './components/report/ReportGeneratorModal';
import FinancialReport from './components/report/FinancialReport';
import StressTestSimulator from './components/protection/StressTestSimulator';
import OTPSimulation from './components/protection/OTPSimulation';
import SecureCheckout from './components/protection/SecureCheckout';
// import CoolingVaultModal from './components/protection/CoolingVaultModal';
import ConsentModal from './components/compliance/ConsentModal';
import PrivacyCenter from './components/compliance/PrivacyCenter';
import ComplianceBadges from './components/compliance/ComplianceBadges';
import DemoControls from './components/compliance/DemoControls';
import ScenarioSimulator from './components/forecast/ScenarioSimulator';
import WhatIfSimulator from './components/forecast/WhatIfSimulator';
// import BadgeStreak from './components/gamification/BadgeStreak';
import ManualAssetForm from './components/assets/ManualAssetForm';
import LinkAccountModal from './components/assets/LinkAccountModal';
import AccountAggregatorWidget from './components/assets/AccountAggregatorWidget';
import WealthTwinView from './components/ai/WealthTwinView';
import PortfolioView from './components/portfolio/PortfolioView';
import MarketView from './components/market/MarketView';
import TaxView from './components/tax/TaxView';
import CalculatorsView from './components/calculators/CalculatorsView';
import TransactionsView from './components/transactions/TransactionsView';
import BillCalendar from './components/bills/BillCalendar';
import CreditHealth from './components/credit/CreditHealth';
import PitchMode from './components/pitch/PitchMode';
// import NotificationCenter from './components/dashboard/NotificationCenter';
import WealthDNA from './components/dashboard/WealthDNA';
import WealthBenchmark from './components/dashboard/WealthBenchmark';
import FinancialWeather from './components/dashboard/FinancialWeather';
import QuickActions from './components/dashboard/QuickActions';
import InvestmentQuiz from './components/quiz/InvestmentQuiz';
import BehavioralNudges from './components/dashboard/BehavioralNudges';
import { useTranslation } from './hooks/useTranslation';
import { useVoiceNarration, numberToWords } from './hooks/useVoiceNarration';
import FinancialLiteracyCards from './components/ai/FinancialLiteracyCards';
import AIDecisionLog from './components/ai/AIDecisionLog';
import AccessibilitySettings from './components/accessibility/AccessibilitySettings';
import NRIMode from './components/nri/NRIMode';
import SeniorMode from './components/senior/SeniorMode';
import BusinessMode from './components/business/BusinessMode';
import DemoMode from './components/demo/DemoMode';
import AdaptiveInsight from './components/dashboard/AdaptiveInsight';
import MonthlyNarrative from './components/dashboard/MonthlyNarrative';
import EmotionCheckin from './components/transactions/EmotionCheckin';
import DuressPinSetup from './components/protection/DuressPinSetup';
import PaymentGuard from './components/protection/PaymentGuard';
import ValuesAlignment from './components/values/ValuesAlignment';
// import ELI5Tooltip from './components/ai/ELI5Tooltip';
import { NBAProvider } from './context/NBAContext';
import { RewardsProvider, useRewards } from './context/RewardsContext';
import NBAInsights from './components/dashboard/NBAInsights';
import FantasyLeague from './components/gamification/FantasyLeague';
import BoostsManager from './components/goals/BoostsManager';
import FinancialTwinChat from './components/ai/FinancialTwinChat';
import CoercedModeBanner from './components/protection/CoercedModeBanner';
import TpmAttestation from './components/security/TpmAttestation';
import EbpfMonitor from './components/security/EbpfMonitor';
import HoneytokenManager from './components/security/HoneytokenManager';
import PasskeyAuth from './components/security/PasskeyAuth';
import PostQuantumCrypto from './components/security/PostQuantumCrypto';
import SecureEnclaveCheck from './components/security/SecureEnclaveCheck';
import DecentralizedId from './components/security/DecentralizedId';
import TransactionTrap from './components/security/TransactionTrap';
import BlockchainAudit from './components/security/BlockchainAudit';
import ParametricInsurance from './components/insurance/ParametricInsurance';
import GhostMode from './components/security/GhostMode';
import DeadMansSwitch from './components/security/DeadMansSwitch';
import GigIncomeSmoother from './components/income/GigIncomeSmoother';
import SocialCollateralLoan from './components/loans/SocialCollateralLoan';
import LoginPage from './components/auth/LoginPage';
import PaymentsPage from './components/payments/PaymentsPage';
import RewardsDashboardCard from './components/payments/RewardsDashboardCard';
import PaymentHub from './components/payments/PaymentHub';
import FloatingPayButton from './components/payments/FloatingPayButton';
import BankHeader from './components/psb/BankHeader';
import TrustBanner from './components/psb/TrustBanner';
import WelcomeBanner from './components/psb/WelcomeBanner';
import QuickPayCard from './components/psb/QuickPayCard';
import RecentTransactionsTable from './components/psb/RecentTransactionsTable';
import PSBSchemesCard from './components/psb/PSBSchemesCard';
import SecurityHealthWidget from './components/psb/SecurityHealthWidget';
import AccessibleFooter from './components/psb/AccessibleFooter';
import AddSalaryModal, { getSalaryHistory } from './components/salary/AddSalaryModal';
import DemoCreditCard from './components/credit/DemoCreditCard';
import TransactionComparison from './components/transactions/TransactionComparison';
import AccountAggregatorFull from './components/aa/AccountAggregatorFull';
import { getStreak } from './services/streakService';
// import type { ViewType } from './types';

// Navigation items kept for reference but now handled by BankHeader
/* const NAV_ITEMS = [...]; const FOOTER_ITEMS = [...]; */

function DashboardView() {
  const user = useWealthStore((s) => s.user);
  const assets = useWealthStore((s) => s.assets);
  const coercedMode = useWealthStore((s) => s.coercedMode);
  const setCoercedMode = useWealthStore((s) => s.setCoercedMode);
  const netWorth = coercedMode ? 5000 : assets.reduce((sum, a) => sum + a.value, 0);
  const healthScore = coercedMode ? 15 : Math.min(Math.round((user.monthlySavings / user.monthlyIncome) * 200 + 40), 100);
  // const { t } = useTranslation();
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const salaryHistory = getSalaryHistory();
  const { cashbackBalance } = useRewards();
  const streak = getStreak();

  const openPaymentHub = () => {
    window.dispatchEvent(new CustomEvent('sw-open-payment-hub'));
  };

  return (
    <QuickActions>
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Coerced Mode Warning */}
      {coercedMode && (
        <div className="p-3 bg-rose-50 rounded-lg border-2 border-rose-200 flex items-center justify-between">
          <p className="text-xs text-rose-700 font-bold">
            <i className="fas fa-triangle-exclamation mr-1" /> Coerced Mode Active — Sanitized View
          </p>
          <button
            onClick={() => { setCoercedMode(false); localStorage.removeItem('sw_coerced_mode'); }}
            className="text-[10px] px-2 py-1 bg-rose-500 text-white rounded font-bold"
          >
            Restore Access
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[ 
          { label: 'Net Worth', value: coercedMode ? '₹5,000' : `₹${(netWorth / 1e7).toFixed(2)}Cr`, icon: 'fa-wallet', color: 'bg-primary-light text-primary', speakText: `Net worth ${numberToWords(netWorth)} rupees`, inrValue: netWorth, delay: 0 },
          { label: 'Monthly Savings', value: coercedMode ? '₹500' : `₹${user.monthlySavings.toLocaleString()}`, icon: 'fa-piggy-bank', color: 'bg-green-50 text-green-700', speakText: `Monthly savings ${numberToWords(user.monthlySavings)} rupees`, inrValue: user.monthlySavings, delay: 0.05 },
          { label: 'Health Score', value: `${healthScore}/100`, icon: 'fa-heart-pulse', color: 'bg-amber-50 text-amber-700', speakText: `Health score ${healthScore} out of 100`, delay: 0.1 },
          { label: 'Cashback Wallet', value: `₹${cashbackBalance.toFixed(0)}`, icon: 'fa-gift', color: 'bg-pink-50 text-pink-600', delay: 0.15 },
          { label: 'Login Streak', value: `${streak.days} days`, icon: 'fa-fire', color: 'bg-orange-50 text-orange-600', delay: 0.2 },
        ].map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: card.delay, ease: [0.4, 0, 0.2, 1] }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Quick Pay */}
      <QuickPayCard onExpand={openPaymentHub} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left + Center */}
        <div className="lg:col-span-2 space-y-6">
          <RecentTransactionsTable />
          <KYCStatusCard />
          <NBAInsights />
          <FinancialWeather />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WhatIfSimulator />
            <StressTestSimulator />
          </div>
          <TransactionComparison />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <NetWorthCard />
            <GoalTracker asWidget />
          </div>
          <WealthDNA />
          <WealthBenchmark />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountAggregatorWidget />
            <RecommendationCard />
          </div>
          <AccountAggregatorFull />
          <AIDecisionLog />
          <ComplianceBadges />
        </div>

        {/* Right Rail */}
        <div className="space-y-6">
          <SecurityHealthWidget />
          <PSBSchemesCard />
          <RewardsDashboardCard />
          <div className="card-psb bg-white">
            <h3 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
              <i className="fas fa-headset" /> Customer Support
            </h3>
            <div className="space-y-2">
              <button onClick={() => alert('Calling 1800-123-4567...')} className="w-full py-2 bg-primary text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary-dark">
                <i className="fas fa-phone" /> Call Toll Free
              </button>
              <button onClick={() => alert('AI Twin chat opening...')} className="w-full py-2 bg-primary-light text-primary rounded-md text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/10">
                <i className="fas fa-robot" /> Chat with AI Twin
              </button>
            </div>
          </div>
          <AdaptiveInsight />
          <MonthlyNarrative />
          <InvestmentQuiz />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button onClick={() => setShowSalaryModal(true)} className="card-psb text-left hover:shadow-md transition-shadow flex items-center gap-3">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
            <i className="fas fa-plus" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Add Salary</h3>
            <p className="text-[10px] text-gray-400">{salaryHistory.length > 0 ? `Last: ₹${salaryHistory[0].amount.toLocaleString()}` : 'Update monthly income'}</p>
          </div>
        </button>
        <DemoCreditCard />
        <div className="card-psb">
          <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-2">
            <i className="fas fa-trophy text-violet-500" /> Fantasy League
          </h3>
          <p className="text-xs text-gray-500 mb-2">Ranked #12 this week. Top: Priya M. (+3.2%)</p>
          <button onClick={() => useWealthStore.getState().setView('fantasy-league')} className="px-3 py-1.5 bg-violet-500 text-white text-xs font-bold rounded hover:bg-violet-600">
            View Leaderboard
          </button>
        </div>
      </div>

      <FinancialLiteracyCards />

      <AddSalaryModal show={showSalaryModal} onClose={() => setShowSalaryModal(false)} />
    </div>
    </QuickActions>
  );
}

/* CoolingOffCard moved to PaymentsPage */

function StatCard({ label, value, icon, color, speakText, inrValue }: { label: string; value: string; icon: string; color: string; speakText?: string; inrValue?: number }) {
  const { speak, stopSpeaking } = useVoiceNarration();
  const nriMode = useWealthStore((s) => s.nriMode);
  const exchangeRates = useWealthStore((s) => s.exchangeRates);
  const usdEquivalent = inrValue ? Math.round(inrValue * (exchangeRates['USD'] || 0.012)).toLocaleString() : null;

  return (
    <div
      className="bg-white border border-gray-200/80 rounded-lg p-4 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-default group"
      aria-label={`${label}: ${speakText || value}`}
      onMouseEnter={() => speakText && speak(speakText)}
      onMouseLeave={stopSpeaking}
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
          <i className={`fas ${icon} text-sm`} />
        </div>
      </div>
      <p className="text-xl font-extrabold text-gray-900 tracking-tight">{value}</p>
      {nriMode && usdEquivalent && (
        <p className="text-[10px] text-primary mt-1.5 font-medium">≈ ${usdEquivalent} USD</p>
      )}
    </div>
  );
}

function ProtectionView() {
  const [showOTP, setShowOTP] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentGuard, setShowPaymentGuard] = useState(false);
  const [payeeName, setPayeeName] = useState('');
  const [signals, setSignals] = useState({
    newDevice: false, rushedAction: false, unusualAmount: false,
    otpRetries: false, firstTimeInvest: false, abnormalBehavior: false,
  });
  const [auditTrigger, setAuditTrigger] = useState(0);
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskMeter signals={signals} />
        <FraudSimulator signals={signals} onSignalsChange={setSignals} onAudit={() => setAuditTrigger((n) => n + 1)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PanicButton />
        <DuressModeToggle />
        <ThreatIntel />
        <button onClick={() => setShowOTP(true)} className="card text-left hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary"><i className="fas fa-mobile-screen-button" /></div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{t('otpSimulation')}</h3>
              <p className="text-[10px] text-slate-400">{t('demoTransaction')}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t('simulatesOTP')}</p>
        </button>
        <DemoCreditCard />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StressTestSimulator />
        <ScamCallerID />
        <BehavioralBiometrics />
      </div>

      {/* Duress PIN Setup */}
      <DuressPinSetup />

      {/* Payment Guard Demo */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
            <i className="fas fa-shield-halved text-primary mr-2" /> Payment Guard
          </h3>
          <button
            onClick={() => setShowPaymentGuard(!showPaymentGuard)}
            className="text-xs px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            {showPaymentGuard ? 'Hide' : 'Test'}
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Real-time check against the national fraud database before processing payments.
        </p>
        {showPaymentGuard && (
          <div className="space-y-3 animate-fade-in">
            <input
              type="text"
              value={payeeName}
              onChange={(e) => setPayeeName(e.target.value)}
              placeholder="Enter payee name (try 'Quick Rich Scheme')..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
            />
            {payeeName.trim().length > 0 && (
              <PaymentGuard
                payeeName={payeeName}
                amount={50000}
                onAllow={() => { alert('Payment allowed (demo)'); setPayeeName(''); }}
                onBlock={() => setPayeeName('')}
              />
            )}
          </div>
        )}
      </div>
      <button onClick={() => setShowCheckout(true)} className="w-full card text-center py-4 hover:shadow-lg transition-shadow">
        <i className="fas fa-fingerprint text-2xl text-emerald-500 mb-2" />
        <h3 className="font-semibold text-slate-800 dark:text-white text-sm">{t('runSecureCheckout')}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('seeSecurityFlow')}</p>
      </button>
      <SecurityLog refreshTrigger={auditTrigger} />
      {showOTP && <OTPSimulation actionType="Transfer" amount={50000} onConfirm={() => setShowOTP(false)} onCancel={() => setShowOTP(false)} />}
      <SecureCheckout show={showCheckout} onComplete={() => setShowCheckout(false)} />
    </div>
  );
}

/* TrustScoreBadge now integrated into SecurityHealthWidget */

function InnovationLabView() {
  const [tab, setTab] = useState<'insurance' | 'ghost' | 'dms' | 'gig' | 'loan'>('insurance');
  const tabs = [
    { key: 'insurance' as const, label: 'Parametric Insurance', icon: 'fa-bolt', color: 'text-amber-500' },
    { key: 'ghost' as const, label: 'Ghost Mode', icon: 'fa-ghost', color: 'text-violet-500' },
    { key: 'dms' as const, label: "Dead Man's Switch", icon: 'fa-hourglass-half', color: 'text-rose-500' },
    { key: 'gig' as const, label: 'Income Smoother', icon: 'fa-wave-square', color: 'text-teal-500' },
    { key: 'loan' as const, label: 'Social Loans', icon: 'fa-people-group', color: 'text-orange-500' },
  ];
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-flask text-primary" /> Innovation Lab
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">5 world-first features no bank has built — insurance, security, income, lending reimagined</p>
        </div>
        <span className="text-[10px] px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
          <i className="fas fa-star mr-1" />Beta
        </span>
      </div>

      {/* Feature Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              tab === t.key ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <i className={`fas ${t.icon} ${tab === t.key ? '' : t.color}`} />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'insurance' && <ParametricInsurance />}
      {tab === 'ghost' && <GhostMode />}
      {tab === 'dms' && <DeadMansSwitch />}
      {tab === 'gig' && <GigIncomeSmoother />}
      {tab === 'loan' && <SocialCollateralLoan />}
    </div>
  );
}

function SecurityBeastView() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="fas fa-dragon text-rose-500" /> Security Beast
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">10-layer unbreakable security — zero trust, hardware attestation, AI deception, post-quantum crypto</p>
        </div>
        <span className="text-[10px] px-2 py-1 bg-rose-500/10 text-rose-600 rounded-full font-medium">
          <i className="fas fa-bolt mr-1" />Active Defense
        </span>
      </div>

      {/* Layer 1-2: Hardware Root + eBPF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TpmAttestation />
        <EbpfMonitor />
      </div>

      {/* Layer 3-4: Honeytokens + Passkeys */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HoneytokenManager />
        <PasskeyAuth />
      </div>

      {/* Layer 5-6: PQ Crypto + Behavioral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PostQuantumCrypto />
        <BehavioralBiometrics />
      </div>

      {/* Layer 7-8: DID + Transaction Trap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DecentralizedId />
        <TransactionTrap />
      </div>

      {/* Layer 9-10: Enclave + Blockchain */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecureEnclaveCheck />
        <BlockchainAudit />
      </div>
    </div>
  );
}

function AssetsView() {
  const assets = useWealthStore((s) => s.assets);
  const [showLinkModal, setShowLinkModal] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">All Assets</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLinkModal(true)}
            className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <i className="fas fa-link" /> Link Account
          </button>
          <ManualAssetForm />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => (
          <div key={asset.id} className="card relative">
            {asset.linkedViaAA && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-medium rounded-full">
                <i className="fas fa-link mr-1" />Linked via AA
              </span>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <i className={`fas fa-${asset.type === 'bank' ? 'building-columns' : asset.type === 'property' ? 'house' : asset.type === 'gold' ? 'coins' : asset.type === 'vehicle' ? 'car' : 'chart-pie'}`} />
              </div>
              <div>
                <p className="font-medium text-sm text-slate-800 dark:text-white">{asset.name}</p>
                <p className="text-xs text-slate-500 capitalize">{asset.type}</p>
              </div>
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-white">₹{asset.value.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Liquidity: {asset.liquidity}</p>
          </div>
        ))}
      </div>
      <LinkAccountModal show={showLinkModal} onClose={() => setShowLinkModal(false)} />
    </div>
  );
}

function ForecastView() {
  return (
    <div className="space-y-6">
      <ScenarioSimulator />
    </div>
  );
}

function PrivacyView() {
  return (
    <div className="space-y-6">
      <PrivacyCenter />
      <ComplianceBadges />
    </div>
  );
}

/* Language and sidebar helpers moved to BankHeader */

export default function App() {
  const { state: authState } = useAuth();
  const currentView = useWealthStore((s) => s.currentView);
  const darkMode = useWealthStore((s) => s.darkMode);
  const initJudgeMode = useWealthStore((s) => s.initJudgeMode);
  const _isJudge = useWealthStore((s) => s.isJudgeMode);
  const pitchModeActive = useWealthStore((s) => s.pitchModeActive);
  const familyMode = useWealthStore((s) => s.familyMode);
  /* toggleFamilyMode available via store */
  const language = useWealthStore((s) => s.language);
  const setLanguage = useWealthStore((s) => s.setLanguage);
  const accessibilityMode = useWealthStore((s) => s.accessibilityMode);
  /* nriMode, toggleNRIMode available via store */
  const seniorMode = useWealthStore((s) => s.seniorMode);
  /* toggleSeniorMode available via store */
  const [_showProfileMenu, _setShowProfileMenu] = useState(false);
  const [_showLangMenu, _setShowLangMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReportView, setShowReportView] = useState(false);
  const [reportFormat, setReportFormat] = useState<'pdf' | 'html'>('html');

  usePanicMode();
  useDemoMode();

  useEffect(() => {
    if (isJudgeMode()) {
      initJudgeMode();
    }
  }, []);

  // Sync coerced mode from localStorage on load
  useEffect(() => {
    if (localStorage.getItem('sw_coerced_mode') === 'true') {
      useWealthStore.getState().setCoercedMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (accessibilityMode) {
      document.documentElement.classList.add('a11y-mode');
    } else {
      document.documentElement.classList.remove('a11y-mode');
    }
  }, [accessibilityMode]);

  useEffect(() => {
    if (seniorMode) {
      document.documentElement.classList.add('senior-mode');
    } else {
      document.documentElement.classList.remove('senior-mode');
    }
  }, [seniorMode]);

  // Login gate
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <SecurityProvider>
    <NBAProvider>
    <RewardsProvider>
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-dark text-white' : 'bg-psb-bg text-psb-text'} ${accessibilityMode ? 'a11y-mode' : ''} ${seniorMode ? 'senior-mode' : ''}`}>
      {/* Demo Banner */}
      <div className="bg-primary-dark text-white text-center py-1.5 px-4 text-[11px]">
        <div className="flex items-center justify-center gap-2">
          <i className="fas fa-circle-info text-accent" />
          <span><strong>For Demonstration Only.</strong> KYC is required before real investments. Data is simulated for hackathon purposes.</span>
        </div>
      </div>

      {/* Language Banner */}
      {language !== 'en' && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-1.5 px-4 text-xs relative z-50 animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <i className="fas fa-language" />
            <span>More languages coming soon — we are building for Bharat. 🇮🇳</span>
            <button onClick={() => setLanguage('en')} className="underline hover:no-underline ml-2">Switch to English</button>
          </div>
        </div>
      )}

      {/* PSB Header */}
      <BankHeader />
      <TrustBanner />

      {/* Payment Hub Bar */}
      <PaymentHub />

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — ALL menu items */}
        <aside className="w-[220px] flex-shrink-0 hidden md:flex flex-col bg-white border-r border-gray-200/80 overflow-y-auto">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Banking Services</p>
          </div>
          <nav className="py-2 px-2 space-y-0.5">
            {[
              { view: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
              { view: 'wealth-twin', label: 'Wealth Twin', icon: 'fa-brain' },
              { view: 'goals', label: 'Goals', icon: 'fa-bullseye' },
              { view: 'portfolio', label: 'Portfolio', icon: 'fa-layer-group' },
              { view: 'assets', label: 'Assets', icon: 'fa-gem' },
              { view: 'market', label: 'Market', icon: 'fa-globe' },
              { view: 'forecast', label: 'Forecast', icon: 'fa-chart-line' },
              { view: 'payments', label: 'Payments', icon: 'fa-bolt' },
              { view: 'protection', label: 'Protection', icon: 'fa-shield-halved' },
              { view: 'security-beast', label: 'Security Beast', icon: 'fa-dragon' },
              { view: 'privacy', label: 'Privacy', icon: 'fa-lock' },
              { view: 'tax', label: 'Tax', icon: 'fa-file-invoice-dollar' },
              { view: 'calculators', label: 'Calculators', icon: 'fa-calculator' },
              { view: 'transactions', label: 'Transactions', icon: 'fa-list' },
              { view: 'bills', label: 'Bill Calendar', icon: 'fa-calendar-check' },
              { view: 'credit-health', label: 'Credit Health', icon: 'fa-file-invoice' },
              { view: 'digital-gold', label: 'Digital Gold', icon: 'fa-coins' },
              { view: 'challenges', label: 'Challenges', icon: 'fa-fire' },
              { view: 'fantasy-league', label: 'Fantasy League', icon: 'fa-trophy' },
              { view: 'boosts', label: 'Boosts', icon: 'fa-rocket' },
              { view: 'subscriptions', label: 'Subscriptions', icon: 'fa-calendar-xmark' },
              { view: 'values-alignment', label: 'Your Values', icon: 'fa-hand-holding-heart' },
              { view: 'innovation-lab', label: 'Innovation Lab', icon: 'fa-flask' },
              { view: 'kids-mode', label: 'Kids Mode', icon: 'fa-child' },
              { view: 'nri-mode', label: 'NRI Center', icon: 'fa-globe' },
              { view: 'business-mode', label: 'Business', icon: 'fa-building' },
              { view: 'notification-demo', label: 'Notifications', icon: 'fa-bell' },
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => useWealthStore.getState().setView(item.view as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-semibold transition-all duration-150 text-left ${
                  currentView === item.view
                    ? 'bg-primary text-white shadow-sm shadow-primary/20'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <i className={`fas ${item.icon} w-4 text-center ${currentView === item.view ? 'text-white' : 'text-gray-400'}`} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto px-2 pb-2">
            <div className="p-3 bg-primary-light/60 rounded-lg border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">Need Help?</p>
              <p className="text-[11px] text-gray-600">Call 1800-11-2211</p>
            </div>
          </div>
          <div className="p-2 border-t border-gray-100">
            <button
              onClick={() => useWealthStore.getState().setView('architecture')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-semibold transition-all duration-150 text-left ${
                currentView === 'architecture'
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <i className="fas fa-sitemap w-4 text-center" />
              System Architecture
            </button>
            <button
              onClick={() => useWealthStore.getState().setView('accessibility')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-semibold transition-all duration-150 text-left ${
                currentView === 'accessibility'
                  ? 'bg-primary text-white shadow-sm shadow-primary/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <i className="fas fa-universal-access w-4 text-center" />
              Accessibility
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-psb-bg">
          {/* View Content with Page Transitions */}
          <div className={`p-4 sm:p-6 lg:p-8 transition-all duration-500 max-w-7xl mx-auto ${pitchModeActive ? 'ring-4 ring-primary/40 ring-inset rounded-xl' : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView + (seniorMode ? '-senior' : '') + (familyMode ? '-family' : '')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                {seniorMode ? (
                  <SeniorMode />
                ) : (
                  <>
                    {currentView === 'dashboard' && (familyMode ? <FamilyDashboard /> : <DashboardView />)}
                    {currentView === 'wealth-twin' && <WealthTwinView />}
                    {currentView === 'goals' && <GoalTracker />}
                    {currentView === 'portfolio' && <PortfolioView />}
                    {currentView === 'assets' && <AssetsView />}
                    {currentView === 'market' && <MarketView />}
                    {currentView === 'forecast' && <ForecastView />}
                    {currentView === 'protection' && <ProtectionView />}
                    {currentView === 'privacy' && <PrivacyView />}
                    {currentView === 'tax' && <TaxView />}
                    {currentView === 'calculators' && <CalculatorsView />}
                    {currentView === 'transactions' && <TransactionsView />}
                    {currentView === 'architecture' && <SystemArchitecture />}
                    {currentView === 'bills' && <BillCalendar />}
                    {currentView === 'credit-health' && <CreditHealth />}
                    {currentView === 'notification-demo' && <NotificationDemo />}
                    {currentView === 'digital-gold' && <DigitalGold />}
                    {currentView === 'challenges' && <ChallengesView />}
                    {currentView === 'kids-mode' && <KidsMode />}
                    {currentView === 'subscriptions' && <SubscriptionTracker />}
                    {currentView === 'accessibility' && <AccessibilitySettings />}
                    {currentView === 'nri-mode' && <NRIMode />}
                    {currentView === 'business-mode' && <BusinessMode />}
                    {currentView === 'values-alignment' && <ValuesAlignment />}
                    {currentView === 'fantasy-league' && <FantasyLeague />}
                    {currentView === 'boosts' && <BoostsManager />}
                    {currentView === 'security-beast' && <SecurityBeastView />}
                    {currentView === 'innovation-lab' && <InnovationLabView />}
                    {currentView === 'payments' && <PaymentsPage />}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* PSB Footer */}
      <AccessibleFooter />

      <ConsentModal />
      <WealthChat />
      <BehavioralNudges />
      {_isJudge && <DemoControls />}
      <PitchMode />
      <ReportGeneratorModal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        onGenerate={(format) => { setReportFormat(format); setShowReportView(true); }}
      />
      {showReportView && <FinancialReport format={reportFormat} onClose={() => setShowReportView(false)} />}
      <LockdownOverlay />
      <BiometricAuth />
      <DemoMode />
      <EmotionCheckin />
      <FinancialTwinChat />
      <CoercedModeBanner />
      <FloatingPayButton />
    </div>
    </RewardsProvider>
    </NBAProvider>
    </SecurityProvider>
  );
}
