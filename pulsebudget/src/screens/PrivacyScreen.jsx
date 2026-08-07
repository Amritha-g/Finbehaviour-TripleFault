import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CATS, CAT_NAMES, allStats } from '../data/engine';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

export default function PrivacyScreen() {
  const { txs, consent, wipe } = useApp();
  const stats = useMemo(() => allStats(txs), [txs]);
  const [wiped, setWiped] = useState(false);
  const [wiping, setWiping] = useState(false);

  const bytes = new Blob([JSON.stringify(txs)]).size;
  const kb = (bytes / 1024).toFixed(1);

  const handleWipe = () => {
    if (!window.confirm('⚠️ This will permanently delete all data. Are you sure?')) return;
    setWiping(true);
    setTimeout(() => { wipe(); setWiping(false); setWiped(true); }, 700);
  };

  const handleExport = () => {
    const data = { exported: new Date().toISOString(), note: 'Stored only on your device.', transactions: txs, consent };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'pulsebudget-export.json'; a.click();
  };

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      style={{ maxWidth: 900, margin: '0 auto', padding: '100px 32px 60px' }}
    >
      <motion.div variants={fadeUp}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg,#fff,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>
          Privacy Dashboard
        </h1>
        <p style={{ color: '#8892b0', fontSize: 14, marginBottom: 36 }}>Everything stored on your device — nothing else</p>
      </motion.div>

      {/* Hero privacy card */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 36, backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 32 }}>
          <motion.div
            animate={{ rotateY: [0, 15, 0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            style={{ fontSize: 52 }}
          >🔐</motion.div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Your data. Your device.</div>
            <div style={{ fontSize: 13, color: '#8892b0' }}>
              All budget data lives in{' '}
              <code style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 7px', borderRadius: 5, fontSize: 12 }}>localStorage</code>{' '}
              — never transmitted to any server.
            </div>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: 'flex', fontSize: 11, color: '#4a5568', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
          <div style={{ flex: 1 }}>Category</div>
          <div style={{ width: 70 }}>Txns</div>
          <div style={{ width: 120 }}>Total Stored</div>
          <div style={{ width: 80 }}>Status</div>
        </div>

        <AnimatePresence>
          {wiping ? (
            <motion.div key="wiping" exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5 }}>
              {CAT_NAMES.map(cat => (
                <motion.div
                  key={cat}
                  animate={{ opacity: [1, 0], x: [0, 20] }}
                  transition={{ duration: 0.5, delay: CAT_NAMES.indexOf(cat) * 0.08 }}
                  style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                    <span>{CATS[cat].icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{cat}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            CAT_NAMES.map((cat, i) => {
              const s = stats[cat];
              const txCount = txs.filter(t => t.cat === cat).length;
              return (
                <motion.div
                  key={cat}
                  variants={fadeUp}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '14px 0',
                    borderBottom: i < CAT_NAMES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: CATS[cat].color + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                      border: `1px solid ${CATS[cat].color}30`,
                      boxShadow: `0 0 10px ${CATS[cat].glow}`,
                    }}>{CATS[cat].icon}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{cat}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Merchant names, dates, amounts</div>
                    </div>
                  </div>
                  <div style={{ width: 70, fontSize: 13, color: '#8892b0' }}>{txCount}</div>
                  <div style={{ width: 120, fontSize: 14, fontWeight: 600 }}>₹{s.spent.toLocaleString('en-IN')}</div>
                  <div style={{ width: 80 }}>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 6,
                      background: consent[cat] ? 'rgba(16,185,129,0.12)' : 'rgba(107,114,128,0.12)',
                      color: consent[cat] ? '#10b981' : '#9ca3af',
                      border: `1px solid ${consent[cat] ? 'rgba(16,185,129,0.25)' : 'rgba(107,114,128,0.2)'}`,
                    }}>
                      {consent[cat] ? 'Active' : 'Paused'}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        {[
          { val: txs.length, label: 'Transactions Stored', color: '#a855f7' },
          { val: `${kb}KB`, label: 'Local Storage Used', color: '#06b6d4' },
        ].map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '24px 28px', textAlign: 'center',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 34, fontWeight: 800, color: m.color }}>{m.val}</div>
            <div style={{ fontSize: 12, color: '#8892b0', marginTop: 8 }}>{m.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <motion.button
          onClick={handleWipe}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(239,68,68,0.5)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '14px 32px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg,#dc2626,#ef4444)',
            color: '#fff', fontWeight: 700, fontSize: 15,
            boxShadow: '0 4px 20px rgba(239,68,68,0.3)',
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          🗑️ Wipe My Data
        </motion.button>
        <motion.button
          onClick={handleExport}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '14px 32px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)',
            color: '#f0f2ff', fontWeight: 600, fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          📤 Export JSON
        </motion.button>
      </motion.div>

      {wiped && (
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: 20, fontSize: 14, color: '#10b981', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          ✅ All data wiped. localStorage cleared. Your device is clean.
        </motion.div>
      )}
    </motion.div>
  );
}
