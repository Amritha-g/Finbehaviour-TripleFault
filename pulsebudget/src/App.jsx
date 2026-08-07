import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import Scene3D from './components/Scene3D';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import OnboardScreen from './screens/OnboardScreen';
import DashboardScreen from './screens/DashboardScreen';
import AlertsScreen from './screens/AlertsScreen';
import NotifScreen from './screens/NotifScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import { allStats, CAT_NAMES } from './data/engine';

const SCREENS = {
  onboard:   OnboardScreen,
  dashboard: DashboardScreen,
  alerts:    AlertsScreen,
  notif:     NotifScreen,
  privacy:   PrivacyScreen,
};

function AppInner() {
  const { screen, txs, showToast } = useApp();
  const Screen = SCREENS[screen] || DashboardScreen;

  // Auto-alert on load if food is at risk
  useEffect(() => {
    const timer = setTimeout(() => {
      const stats = allStats(txs);
      const risky = CAT_NAMES.find(c => stats[c].alertTriggered);
      if (risky) {
        const s = stats[risky];
        showToast(
          `⚠️ PulseBudget — ${risky} Alert`,
          `Budget breach projected in ${s.daysUntilBreach} day${s.daysUntilBreach !== 1 ? 's' : ''} at current pace!`
        );
      }
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Three.js 3D Background */}
      <Scene3D />

      {/* Dark overlay to let content pop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 100% 60% at 50% 100%, rgba(124,58,237,0.08) 0%, rgba(4,5,13,0.0) 70%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <Screen />
          </motion.div>
        </AnimatePresence>
      </div>

      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
