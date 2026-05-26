import { motion } from 'framer-motion';
import { useWealthStore } from '../../store/wealthStore';

export default function WelcomeBanner() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const familyMode = useWealthStore((s) => s.familyMode);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="relative overflow-hidden rounded-lg bg-primary text-white p-5 mb-5"
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg width="100%" height="100%">
          <defs><pattern id="psb-pattern" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="16" cy="16" r="1" fill="white"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#psb-pattern)" />
        </svg>
      </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary-dark opacity-90" />

      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] text-white/60 font-medium mb-1 tracking-wide">{today}</p>
            <h1 className="text-xl font-bold tracking-tight">
              {greeting()}{familyMode ? ', Family' : ', Mr. Rahul Sharma'}
            </h1>
            <p className="text-[13px] text-white/75 mt-1.5 max-w-lg">
              Your deposits are secured with DICGC insurance up to ₹5,00,000
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="px-3 py-1.5 bg-white/10 rounded-md text-[11px] font-bold border border-white/10 backdrop-blur-sm">
              <i className="fas fa-shield-check mr-1.5 text-secondary" /> DICGC Insured
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-md text-[11px] font-bold border border-white/10 backdrop-blur-sm">
              <i className="fas fa-building-columns mr-1.5 text-secondary" /> RBI Licensed
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
