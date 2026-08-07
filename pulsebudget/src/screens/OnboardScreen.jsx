import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CATS, CAT_NAMES } from '../data/engine';

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function OnboardScreen() {
  const { consent, setConsent, setScreen } = useApp();

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      style={{ minHeight: '100vh', paddingTop: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      {/* Hero */}
      <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: 48 }}>
        <motion.div
          animate={{ y: [0, -10, 0], rotateY: [0, 8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: 90, height: 90, borderRadius: 28, margin: '0 auto 28px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40,
            boxShadow: '0 0 50px rgba(124,58,237,0.6), 0 0 100px rgba(124,58,237,0.2)',
          }}
        >⚡</motion.div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900,
          background: 'linear-gradient(135deg, #fff 30%, #c084fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: 16, lineHeight: 1.15,
        }}>
          Take Control<br />of Your Finances
        </h1>
        <p style={{ fontSize: 17, color: '#8892b0', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Predictive budget intelligence that warns you <em>before</em> you overspend — powered entirely on your device. No cloud. No tracking.
        </p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
            borderRadius: 99, padding: '10px 24px', fontSize: 14, color: '#10b981',
          }}
        >
          🔒 You control what's tracked. Revoke anytime.
        </motion.div>
      </motion.div>

      {/* Consent Card */}
      <motion.div variants={fadeUp} style={{ width: '100%', maxWidth: 760, padding: '0 24px', marginBottom: 40 }}>
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 28, padding: 40,
          backdropFilter: 'blur(30px)',
          boxShadow: '0 8px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Data Consent</h2>
              <p style={{ fontSize: 13, color: '#8892b0' }}>Choose which categories PulseBudget monitors</p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 8, padding: '6px 14px', fontSize: 12, color: '#10b981',
            }}>🔐 AES-256 · On-device only</div>
          </div>

          {CAT_NAMES.map((cat, i) => (
            <motion.div
              key={cat}
              variants={fadeUp}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '18px 0',
                borderBottom: i < CAT_NAMES.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: CATS[cat].color + '20',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                border: `1px solid ${CATS[cat].color}30`,
                boxShadow: `0 0 16px ${CATS[cat].glow}`,
              }}>{CATS[cat].icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{cat}</div>
                <div style={{ fontSize: 12, color: '#8892b0', marginTop: 3 }}>
                  Budget: ₹{CATS[cat].budget.toLocaleString('en-IN')} / month
                </div>
              </div>

              {/* Toggle */}
              <motion.div
                onClick={() => setConsent(prev => ({ ...prev, [cat]: !prev[cat] }))}
                animate={{ background: consent[cat] ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'rgba(255,255,255,0.08)' }}
                style={{
                  width: 54, height: 30, borderRadius: 15, cursor: 'pointer',
                  position: 'relative', border: `1px solid ${consent[cat] ? '#7c3aed' : 'rgba(255,255,255,0.12)'}`,
                  boxShadow: consent[cat] ? '0 0 14px rgba(124,58,237,0.5)' : 'none',
                  flexShrink: 0,
                }}
              >
                <motion.div
                  animate={{ left: consent[cat] ? 26 : 3 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  style={{
                    position: 'absolute', top: 3, width: 22, height: 22,
                    borderRadius: '50%', background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}
                />
              </motion.div>
            </motion.div>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '24px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: '#6b7280', maxWidth: 400, lineHeight: 1.6 }}>
              ℹ️ All data is stored in your browser's localStorage. Nothing leaves your device.
            </p>
            <motion.button
              onClick={() => setScreen('dashboard')}
              whileHover={{ scale: 1.06, boxShadow: '0 0 30px rgba(124,58,237,0.6)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '14px 36px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: '#fff', fontWeight: 700, fontSize: 15,
                boxShadow: '0 4px 24px rgba(124,58,237,0.4)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Start Now →
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
