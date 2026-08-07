import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const { screen, setScreen } = useApp();

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '24px 60px',
        background: 'transparent',
      }}
    >
      {/* Brand Logo matching reference */}
      <div 
        onClick={() => setScreen('dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #60a5fa)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px rgba(168, 85, 247, 0.6)',
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />
        </div>
        <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 18, color: '#ffffff', letterSpacing: '-0.02em' }}>
          Finns <span style={{ fontSize: 11, color: '#a855f7', opacity: 0.8, marginLeft: 4 }}>PulseBudget</span>
        </span>
      </div>

      {/* Nav Center Links Pill */}
      <div style={{
        display: 'flex', gap: 32, alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        padding: '8px 28px', borderRadius: 99,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
      }}>
        <button
          onClick={() => setScreen('dashboard')}
          style={{
            background: screen === 'dashboard' ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', color: screen === 'dashboard' ? '#fff' : '#94a3b8',
            fontSize: 13, fontWeight: 400, padding: '4px 14px', borderRadius: 99, cursor: 'pointer',
          }}
        >
          Home
        </button>
        <button
          onClick={() => setScreen('onboard')}
          style={{
            background: screen === 'onboard' ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', color: screen === 'onboard' ? '#fff' : '#94a3b8',
            fontSize: 13, fontWeight: 400, padding: '4px 14px', borderRadius: 99, cursor: 'pointer',
          }}
        >
          Consent
        </button>
        <button
          onClick={() => setScreen('alerts')}
          style={{
            background: screen === 'alerts' ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', color: screen === 'alerts' ? '#fff' : '#94a3b8',
            fontSize: 13, fontWeight: 400, padding: '4px 14px', borderRadius: 99, cursor: 'pointer',
          }}
        >
          Alerts
        </button>
        <button
          onClick={() => setScreen('notif')}
          style={{
            background: screen === 'notif' ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', color: screen === 'notif' ? '#fff' : '#94a3b8',
            fontSize: 13, fontWeight: 400, padding: '4px 14px', borderRadius: 99, cursor: 'pointer',
          }}
        >
          Preferences
        </button>
        <button
          onClick={() => setScreen('privacy')}
          style={{
            background: screen === 'privacy' ? 'rgba(255,255,255,0.12)' : 'transparent',
            border: 'none', color: screen === 'privacy' ? '#fff' : '#94a3b8',
            fontSize: 13, fontWeight: 400, padding: '4px 14px', borderRadius: 99, cursor: 'pointer',
          }}
        >
          My Data
        </button>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <span style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>Eng ˅</span>
        <button
          onClick={() => setScreen('alerts')}
          style={{
            padding: '10px 24px', borderRadius: 99,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#ffffff', fontSize: 13, fontWeight: 500, cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
          }}
        >
          Start now
        </button>
      </div>
    </motion.nav>
  );
}
