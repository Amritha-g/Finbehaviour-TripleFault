import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CATS, CAT_NAMES, allStats, computeStats } from '../data/engine';

const FOOD_MERCHANTS = ['Zomato', 'Swiggy', 'Blinkit', "McDonald's", 'KFC', 'Dominos', 'Starbucks'];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

export default function AlertsScreen() {
  const { txs, addTransaction, showToast } = useApp();
  const stats = useMemo(() => allStats(txs), [txs]);
  const [simLog, setSimLog] = useState('');
  const [simming, setSimming] = useState(false);

  const triggered = CAT_NAMES.filter(c => stats[c].alertTriggered);
  const mainCat = triggered[0] || null;

  const simulate = async () => {
    setSimming(true);
    const amt = 420 + Math.floor(Math.random() * 220);
    const merchant = FOOD_MERCHANTS[Math.floor(Math.random() * FOOD_MERCHANTS.length)];
    const tx = { id: Math.random().toString(36).slice(2), merchant, cat: 'Food', amt, date: '2026-08-07', daysAgo: 0 };
    
    const savedTx = await addTransaction(tx);
    const resolvedTx = savedTx || tx;
    
    const newTxs = [...txs.filter(t => t.id !== resolvedTx.id), resolvedTx];
    const s = computeStats('Food', newTxs);
    setSimLog(`✓ Added ₹${amt} at ${merchant} · Food: ₹${s.spent.toLocaleString('en-IN')} (${Math.round(s.pct * 100)}%) · EWMA ₹${Math.round(s.ewma)}/day · Threshold ₹${Math.round(s.threshold)}/day`);
    showToast(
      '⚠️ Budget Alert — Food',
      `At this pace you'll exceed your Food budget by ₹${s.overage.toLocaleString('en-IN')} in ${s.daysUntilBreach} days — ${s.streak}-day streak at risk!`
    );
    setTimeout(() => setSimming(false), 600);
  };

  return (
    <motion.div
      variants={stagger} initial="hidden" animate="show"
      style={{ maxWidth: 1000, margin: '0 auto', padding: '100px 32px 60px' }}
    >
      <motion.div variants={fadeUp}>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 32, fontWeight: 800, background: 'linear-gradient(135deg,#fff,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>
          Predictive Alerts
        </h1>
        <p style={{ color: '#8892b0', fontSize: 14, marginBottom: 32 }}>Loss-framed warnings before you breach your budget</p>
      </motion.div>

      {/* Main Alert Card */}
      <motion.div variants={fadeUp}>
        <AnimatePresence mode="wait">
          {mainCat ? (
            <motion.div
              key="alert"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, rgba(220,38,38,0.14), rgba(239,68,68,0.07))',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 28, padding: '40px 44px',
                position: 'relative', overflow: 'hidden',
                marginBottom: 28,
                boxShadow: '0 0 0 0 rgba(239,68,68,0.1), 0 12px 48px rgba(0,0,0,0.4)',
              }}
            >
              {/* Animated glow */}
              <motion.div
                animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.3), transparent 70%)', pointerEvents: 'none' }}
              />

              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ fontSize: 48, marginBottom: 20 }}
              >⚠️</motion.div>

              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 800, lineHeight: 1.3, color: '#fff', marginBottom: 14 }}>
                At this pace you'll exceed your{' '}
                <span style={{ color: '#f87171' }}>{mainCat}</span> budget<br />
                by <span style={{ color: '#f87171' }}>₹{stats[mainCat].overage.toLocaleString('en-IN')}</span>{' '}
                in <span style={{ color: '#f87171' }}>{stats[mainCat].daysUntilBreach} day{stats[mainCat].daysUntilBreach !== 1 ? 's' : ''}</span>
              </h2>

              <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.7, marginBottom: 28 }}>
                Your daily {mainCat} spend{' '}
                <strong style={{ color: '#e5e7eb' }}>(₹{Math.round(stats[mainCat].dailyPace).toLocaleString('en-IN')}/day EWMA)</strong>{' '}
                is above the adaptive threshold of{' '}
                <strong style={{ color: '#e5e7eb' }}>₹{Math.round(stats[mainCat].threshold).toLocaleString('en-IN')}/day</strong>.{' '}
                Projected breach: <strong style={{ color: '#fca5a5' }}>{stats[mainCat].breachDate}</strong>
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <motion.div
                  animate={{ boxShadow: ['0 0 0 0 rgba(245,158,11,0.3)', '0 0 0 8px rgba(245,158,11,0)', '0 0 0 0 rgba(245,158,11,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                    borderRadius: 99, padding: '10px 20px', fontSize: 14, fontWeight: 600, color: '#fbbf24',
                  }}
                >
                  🔥 {stats[mainCat].streak}-day under-budget streak at risk
                </motion.div>
                <span style={{ fontSize: 13, color: '#4a5568' }}>
                  Cut ₹{Math.round(Math.max(0, stats[mainCat].dailyPace - stats[mainCat].mean)).toLocaleString('en-IN')}/day in {mainCat} to stay safe
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="safe"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 28, padding: 48, textAlign: 'center', marginBottom: 28,
              }}
            >
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>All budgets on track</div>
              <div style={{ color: '#8892b0', fontSize: 14 }}>No breach predicted in the next 5 days. Keep it up!</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Simulator */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)',
        borderRadius: 24, padding: 36, marginBottom: 24,
        backdropFilter: 'blur(20px)',
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
          🧪 Live Demo Simulator
        </h3>
        <p style={{ fontSize: 14, color: '#8892b0', marginBottom: 24, lineHeight: 1.6 }}>
          Inject a live Food transaction and watch the prediction engine recalculate in real-time.
        </p>
        <motion.button
          onClick={simulate}
          whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
          whileTap={{ scale: 0.97 }}
          animate={simming ? { scale: [1, 0.98, 1] } : {}}
          style={{
            padding: '16px 40px', borderRadius: 16, border: 'none', cursor: 'pointer',
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            color: '#fff', fontWeight: 700, fontSize: 16,
            boxShadow: '0 4px 24px rgba(59,130,246,0.35)',
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          ⚡ Simulate Food Transaction
        </motion.button>
        {simLog && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: 16, fontSize: 12, color: '#34d399', fontFamily: 'monospace' }}
          >
            {simLog}
          </motion.div>
        )}
      </motion.div>

      {/* All categories status */}
      <motion.div variants={fadeUp} style={{
        background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, padding: 32, backdropFilter: 'blur(24px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 24 }}>All Categories</h3>
        {CAT_NAMES.map((cat, i) => {
          const s = stats[cat];
          const statusColor = s.alertTriggered ? '#f87171' : s.pct > 0.85 ? '#fbbf24' : s.pct > 0.6 ? '#34d399' : '#6ee7b7';
          const statusLabel = s.alertTriggered ? '🔴 Alert' : s.pct > 0.85 ? '🟡 Warning' : s.pct > 0.6 ? '🟢 Watch' : '✅ Safe';
          return (
            <div key={cat} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '16px 0', borderBottom: i < CAT_NAMES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 13,
                  background: CATS[cat].color + '20',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                  border: `1px solid ${CATS[cat].color}30`,
                  boxShadow: `0 0 12px ${CATS[cat].glow}`,
                }}>{CATS[cat].icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{cat}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                    EWMA: ₹{Math.round(s.ewma).toLocaleString('en-IN')}/day · Threshold: ₹{Math.round(s.threshold).toLocaleString('en-IN')}/day
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: statusColor }}>{statusLabel}</div>
                <div style={{ fontSize: 11, color: '#4a5568', marginTop: 2 }}>{Math.round(s.pct * 100)}% of budget</div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
