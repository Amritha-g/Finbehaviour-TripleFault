import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { CATS, CAT_NAMES, allStats } from '../data/engine';
import SpatialCard from '../components/SpatialCard';
import Scene3D from '../components/Scene3D';

export default function DashboardScreen() {
  const { txs, setScreen } = useApp();
  const [activeSatellite, setActiveSatellite] = useState(null);
  const stats = useMemo(() => allStats(txs), [txs]);

  const totalBudget = CAT_NAMES.reduce((a, c) => a + CATS[c].budget, 0);
  const totalSpent = CAT_NAMES.reduce((a, c) => a + stats[c].spent, 0);
  const foodStats = stats['Food'];

  // Orbital Satellites Data (Floating 3D Nodes around the Collision Engine)
  const satellites = [
    {
      id: 'sat-1',
      label: '+ ₹22,500 Salary Inflow',
      color: '#ec4899',
      top: '18%',
      left: '12%',
      detail: 'Monthly Salary received from Acme Corp. Automated 20% routed to Savings Goal.',
      accent: 'magenta',
    },
    {
      id: 'sat-2',
      label: '⚡ AI Optimization: Save ₹1,450',
      color: '#a855f7',
      top: '22%',
      right: '12%',
      detail: 'Pulse AI detected recurring unused streaming subscriptions. Tap to auto-cancel.',
      accent: 'purple',
    },
    {
      id: 'sat-3',
      label: '- ₹4,200 Dining Expense',
      color: '#06b6d4',
      bottom: '16%',
      left: '15%',
      detail: 'Food category spent 78% of allocated budget. 4 days until recommended cap.',
      accent: 'cyan',
    },
    {
      id: 'sat-4',
      label: '🎯 Vacation Fund: 75% Achieved',
      color: '#38bdf8',
      bottom: '20%',
      right: '14%',
      detail: 'You are ₹1,050 away from your Bali Vacation target! Target completion: Aug 24.',
      accent: 'cyan',
    },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 100,
      paddingBottom: 60,
      boxSizing: 'border-box',
    }}>
      {/* 3D COLLISION ENGINE BACKGROUND */}
      <Scene3D />

      {/* ─── 1. HERO TITLE & START FREE BUTTON (Exact match to reference shot typography) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: 24, zIndex: 10 }}
      >
        <h1 style={{
          fontFamily: "'Space Grotesk', 'Inter', sans-serif",
          fontSize: 'clamp(46px, 5.8vw, 76px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          color: '#ffffff',
          marginBottom: 16,
        }}>
          Take Control<br />
          <span style={{
            fontWeight: 400,
            background: 'linear-gradient(135deg, #f472b6 0%, #c084fc 50%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            for your Finances
          </span>
        </h1>

        <p style={{
          fontSize: 15,
          color: '#94a3b8',
          fontWeight: 300,
          maxWidth: 440,
          margin: '0 auto 24px',
          lineHeight: 1.6,
        }}>
          Discover a user-friendly platform for tracking over 3,000 financial assets.
        </p>

        {/* Central Pill Button matching reference (Start free now →) */}
        <motion.button
          whileHover={{ scale: 1.06, boxShadow: '0 0 45px rgba(236, 72, 153, 0.5)' }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setScreen('alerts')}
          style={{
            padding: '11px 26px',
            borderRadius: 99,
            border: '1px solid rgba(255, 255, 255, 0.25)',
            background: 'rgba(12, 10, 26, 0.7)',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            backdropFilter: 'blur(24px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
          }}
        >
          <span>Start free now</span>
          <span style={{
            width: 22, height: 22, borderRadius: '50%',
            background: '#ffffff', color: '#000000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>→</span>
        </motion.button>
      </motion.div>

      {/* ─── 2. FLOATING 3D ORBITAL SATELLITE CHIPS ─── */}
      {satellites.map((sat, idx) => (
        <motion.div
          key={sat.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -8, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.3 + idx * 0.15 },
            scale: { duration: 0.6, delay: 0.3 + idx * 0.15 },
            y: { duration: 4 + idx, repeat: Infinity, ease: 'easeInOut' },
          }}
          whileHover={{ scale: 1.1, zIndex: 50 }}
          onClick={() => setActiveSatellite(sat)}
          style={{
            position: 'absolute',
            top: sat.top,
            left: sat.left,
            right: sat.right,
            bottom: sat.bottom,
            zIndex: 25,
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: 99,
            background: 'rgba(12, 11, 28, 0.65)',
            border: `1px solid ${sat.color}80`,
            backdropFilter: 'blur(20px)',
            boxShadow: `0 10px 30px rgba(0,0,0,0.5), 0 0 20px ${sat.color}40`,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 11,
            fontWeight: 500,
            color: '#ffffff',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: sat.color, boxShadow: `0 0 10px ${sat.color}` }} />
          <span>{sat.label}</span>
        </motion.div>
      ))}

      {/* ─── 3. SPATIAL COMPOSITION CONTAINER (Left Widgets - Center Balance Card - Right Widgets) ─── */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 1280,
        minHeight: 480,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: '0 24px',
        boxSizing: 'border-box',
      }}>

        {/* ─── LEFT POPPING GLASS INFORMATION BOXES ─── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          zIndex: 20,
        }}>
          {/* Box 1: Expenses Report with Circular SVG Gauge */}
          <SpatialCard accentColor="magenta" delay={0.15}>
            <div style={{ width: 220, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500, marginBottom: 14 }}>Expenses Report</div>
              <div style={{ position: 'relative', width: 105, height: 105, margin: '0 auto 12px' }}>
                <svg width="105" height="105" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke="url(#ringGradMagenta)"
                    strokeWidth="8"
                    strokeDasharray="251.3"
                    strokeDashoffset={251.3 * (1 - totalSpent / totalBudget)}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="ringGradMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>₹{totalSpent.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: 9, color: '#94a3b8' }}>Total expenses</span>
                </div>
              </div>
              <div style={{ fontSize: 9, color: '#64748b', textAlign: 'center' }}>Updated real-time</div>
            </div>
          </SpatialCard>

          {/* Box 2: Saving Budget */}
          <SpatialCard accentColor="purple" delay={0.25}>
            <div style={{ width: 220, padding: 18 }}>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6 }}>Saving Budget</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
                ₹{Math.max(0, totalBudget - totalSpent).toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: 9, color: '#a855f7', fontWeight: 500 }}>+14.2% optimized by AI</div>
            </div>
          </SpatialCard>
        </div>


        {/* ─── CENTER PROMINENT FLOATING BALANCE CARD (Held in Event Horizon Pinch) ─── */}
        <SpatialCard
          accentColor="purple"
          delay={0.1}
          style={{
            zIndex: 30,
            width: 390,
            background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.75) 0%, rgba(15, 12, 38, 0.85) 50%, rgba(14, 116, 144, 0.75) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 0 60px rgba(168, 85, 247, 0.4)',
          }}
        >
          <div style={{ padding: 32 }}>
            {/* Card Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 400 }}>Total Balance</span>
              <span style={{ fontSize: 14, color: '#94a3b8', cursor: 'pointer' }}>👁</span>
            </div>

            {/* Main Big Amount (₹19,500.00 / $5,237.34) */}
            <div style={{
              fontFamily: "'Space Grotesk', 'Inter', sans-serif",
              fontSize: 44,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              marginBottom: 32,
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}>
              ₹{totalBudget.toLocaleString('en-IN')}.00
            </div>

            {/* Income & Expense Split Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              paddingTop: 18,
              borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            }}>
              <div>
                <div style={{ fontSize: 11, color: '#f472b6', marginBottom: 4, fontWeight: 500 }}>Income</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>₹{totalBudget.toLocaleString('en-IN')}.00</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#38bdf8', marginBottom: 4, fontWeight: 500 }}>Expense</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>₹{totalSpent.toLocaleString('en-IN')}.00</div>
              </div>
            </div>
          </div>
        </SpatialCard>


        {/* ─── RIGHT POPPING GLASS INFORMATION BOXES ─── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          zIndex: 20,
        }}>
          {/* Box 1: Targets Progress List */}
          <SpatialCard accentColor="cyan" delay={0.2}>
            <div style={{ width: 230, padding: 20 }}>
              <div style={{ fontSize: 12, color: '#cbd5e1', fontWeight: 500, marginBottom: 14 }}>Targets</div>
              {[
                { name: 'Save for a Car', pct: 30, val: '₹1,500' },
                { name: 'Save for Education', pct: 50, val: '₹2,350' },
                { name: 'Vacation Fund', pct: 75, val: '₹2,950' },
              ].map((t) => (
                <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#e2e8f0', fontWeight: 500 }}>{t.name}</div>
                    <div style={{ fontSize: 9, color: '#64748b' }}>{t.val}</div>
                  </div>
                  <div style={{
                    width: 26, height: 26, borderRadius: '50%',
                    border: '2px solid #06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 8, color: '#ffffff', fontWeight: 600,
                  }}>{t.pct}%</div>
                </div>
              ))}
            </div>
          </SpatialCard>

          {/* Box 2: You Goals & Pulse AI Alert Badge */}
          <SpatialCard
            accentColor={foodStats?.alertTriggered ? 'amber' : 'cyan'}
            delay={0.3}
            onClick={() => setScreen('alerts')}
          >
            <div style={{ width: 230, padding: 18 }}>
              <div style={{
                fontSize: 11,
                color: foodStats?.alertTriggered ? '#f87171' : '#a855f7',
                fontWeight: 600,
                marginBottom: 4,
              }}>
                {foodStats?.alertTriggered ? '⚡ Food Breach Alert' : 'You Goals'}
              </div>
              <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 600 }}>
                {foodStats?.alertTriggered ? `Breach in ${foodStats.daysUntilBreach} days!` : 'House by the Sea'}
              </div>
              <div style={{ fontSize: 9, color: foodStats?.alertTriggered ? '#fca5a5' : '#94a3b8', marginTop: 6 }}>
                {foodStats?.alertTriggered ? 'Click to view EWMA analytics →' : '₹5,352.22 / ₹10,000'}
              </div>
            </div>
          </SpatialCard>
        </div>
      </div>

      {/* ─── 4. INTERACTIVE SATELLITE POPUP MODAL ─── */}
      <AnimatePresence>
        {activeSatellite && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSatellite(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(4, 3, 12, 0.75)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.85, y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 420,
                background: 'linear-gradient(135deg, rgba(20, 15, 45, 0.9) 0%, rgba(10, 8, 25, 0.95) 100%)',
                border: `1px solid ${activeSatellite.color}`,
                borderRadius: 28,
                padding: 28,
                boxShadow: `0 30px 90px rgba(0,0,0,0.8), 0 0 50px ${activeSatellite.color}50`,
                color: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: activeSatellite.color,
                }}>
                  Quantum Satellite Insight
                </span>
                <button
                  onClick={() => setActiveSatellite(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 18, cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 10 }}>{activeSatellite.label}</h3>
              <p style={{ fontSize: 13, color: '#cbd5e1', lineHeight: 1.6, marginBottom: 24 }}>{activeSatellite.detail}</p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setActiveSatellite(null)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 99,
                    border: `1px solid ${activeSatellite.color}`,
                    background: activeSatellite.color,
                    color: '#000000',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Apply AI Action
                </button>
                <button
                  onClick={() => setActiveSatellite(null)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 99,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
