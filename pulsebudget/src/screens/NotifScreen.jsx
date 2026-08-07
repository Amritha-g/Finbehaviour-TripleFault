import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CATS, CAT_NAMES } from '../data/engine';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const NOTIF_OPTS = [
  { id: 'critical', icon: '🔔', title: 'Critical (Push)', desc: 'Immediate push notification when a budget breach is projected within 5 days. Cuts through everything.' },
  { id: 'ambient',  icon: '🎨', title: 'Ambient Only (Color / Badge)', desc: 'Subtle color changes and badge indicators. No interruptions — just visual cues in your peripheral vision.' },
  { id: 'silent',   icon: '🔕', title: 'Silent (In-App Only)', desc: 'Alerts appear only when you open PulseBudget. Zero interruptions. Check on your schedule.' },
];

export default function NotifScreen() {
  const { notifMode, setNotifMode, consent, setConsent } = useApp();

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      style={{ maxWidth: 900, margin: '0 auto', padding: '100px 32px 60px' }}
    >
      <motion.div variants={fadeUp}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg,#fff,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>
          Notification Preferences
        </h1>
        <p style={{ color: '#8892b0', fontSize: 14, marginBottom: 36 }}>Control exactly how PulseBudget warns you</p>
      </motion.div>

      {/* Alert Mode */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 36, backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)', marginBottom: 24,
      }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Alert Mode</h2>
        {NOTIF_OPTS.map((opt, i) => (
          <motion.div
            key={opt.id}
            onClick={() => setNotifMode(opt.id)}
            whileHover={{ scale: 1.01, borderColor: 'rgba(124,58,237,0.4)' }}
            whileTap={{ scale: 0.99 }}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 18,
              padding: 22, borderRadius: 18, cursor: 'pointer',
              marginBottom: i < NOTIF_OPTS.length - 1 ? 12 : 0,
              background: notifMode === opt.id ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${notifMode === opt.id ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.25s',
              boxShadow: notifMode === opt.id ? '0 0 20px rgba(124,58,237,0.15), inset 0 0 0 1px rgba(124,58,237,0.2)' : 'none',
            }}
          >
            {/* Radio */}
            <div style={{
              width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 2,
              border: `2px solid ${notifMode === opt.id ? '#a855f7' : 'rgba(255,255,255,0.2)'}`,
              background: notifMode === opt.id ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: notifMode === opt.id ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
              transition: 'all 0.3s',
            }}>
              {notifMode === opt.id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <div style={{ fontSize: 26, marginTop: 0 }}>{opt.icon}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 5 }}>{opt.title}</div>
              <div style={{ fontSize: 13, color: '#9ca3af', lineHeight: 1.6 }}>{opt.desc}</div>
            </div>
          </motion.div>
        ))}

        <div style={{
          marginTop: 24, padding: '16px 20px',
          background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 14, fontSize: 13, color: '#9ca3af', lineHeight: 1.6,
        }}>
          ℹ️ <strong style={{ color: '#f0f2ff' }}>Rate limit:</strong> Max 1 alert per category per 48 hours — unless spending accelerates sharply (&gt;2× adaptive threshold).
        </div>
      </motion.div>

      {/* Per-category overrides */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 36, backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Category Alert Overrides</h2>
        {CAT_NAMES.map((cat, i) => (
          <div key={cat} style={{
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '16px 0',
            borderBottom: i < CAT_NAMES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: CATS[cat].color + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              border: `1px solid ${CATS[cat].color}30`,
              boxShadow: `0 0 12px ${CATS[cat].glow}`,
              flexShrink: 0,
            }}>{CATS[cat].icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{cat} Alerts</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Alert when {cat} breach projected within 5 days</div>
            </div>
            <motion.div
              onClick={() => setConsent(prev => ({ ...prev, [cat]: !prev[cat] }))}
              animate={{ background: consent[cat] ? 'linear-gradient(135deg,#7c3aed,#a855f7)' : 'rgba(255,255,255,0.08)' }}
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
                style={{ position: 'absolute', top: 3, width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.4)' }}
              />
            </motion.div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
