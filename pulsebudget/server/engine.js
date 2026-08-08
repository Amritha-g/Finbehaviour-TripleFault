// ═══════════════════════════════════════════
// PULSEBUDGET — BACKEND PREDICTION ENGINE
// ═══════════════════════════════════════════

export const CATS = {
  Food:          { budget: 6000,  icon: '🍔', color: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  Transport:     { budget: 3000,  icon: '🚗', color: '#3b82f6', glow: 'rgba(59,130,246,0.4)'  },
  Shopping:      { budget: 4000,  icon: '🛍️', color: '#a855f7', glow: 'rgba(168,85,247,0.4)'  },
  Subscriptions: { budget: 1500,  icon: '📱', color: '#06b6d4', glow: 'rgba(6,182,212,0.4)'   },
  Bills:         { budget: 5000,  icon: '🏠', color: '#10b981', glow: 'rgba(16,185,129,0.4)'  },
};
export const CAT_NAMES = Object.keys(CATS);

export const MERCHANTS = {
  Food:          ['Zomato','Swiggy','BigBasket','Dominos',"McDonald's",'Blinkit','NOSC Cafe','Starbucks','KFC','Haldirams','FreshMenu'],
  Transport:     ['Ola','Uber','BMTC','Rapido','Namma Metro','IndiGo','Petrol Station','Parking','RedBus'],
  Shopping:      ['Amazon','Myntra','Flipkart','Ajio','Nykaa','Decathlon','Croma','IKEA','Meesho'],
  Subscriptions: ['Netflix','Spotify','Amazon Prime','YouTube Premium','Notion','iCloud','Hotstar','Apple Music'],
  Bills:         ['Bescom','Airtel','Tata Power','BWSSB','LIC','Society Fee','Jio','HDFC EMI'],
};

export function generateSeedTransactions() {
  const BASE = new Date(2026, 7, 7); // Aug 7 2026
  const counts = { Food: 22, Transport: 13, Shopping: 12, Subscriptions: 8, Bills: 6 };
  const txs = [];

  CAT_NAMES.forEach(cat => {
    const n = counts[cat], B = CATS[cat].budget, mrs = MERCHANTS[cat];
    for (let i = 0; i < n; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const d = new Date(BASE); d.setDate(d.getDate() - daysAgo);
      let amt;
      if (cat === 'Food') {
        // Bias: recent 10 days spend 1.7–2.3× heavier → reliably triggers alert
        const r = daysAgo < 10 ? 1.7 + Math.random() * 0.6 : 0.4 + Math.random() * 0.6;
        amt = Math.round((B / n) * r * (0.7 + Math.random() * 0.8));
      } else {
        amt = Math.round((B / n) * (0.5 + Math.random() * 1.0));
      }
      amt = Math.max(60, Math.min(amt, Math.round(B * 0.7)));
      txs.push({
        merchant: mrs[Math.floor(Math.random() * mrs.length)],
        cat,
        amt,
        date: d.toISOString().split('T')[0],
        daysAgo,
      });
    }
  });
  return txs.sort((a, b) => a.daysAgo - b.daysAgo);
}

export function computeStats(cat, txs) {
  const B = CATS[cat].budget;
  const catTxs = txs.filter(t => t.cat === cat);

  // Build daily spend map
  const daily = {};
  catTxs.forEach(t => { if (t.daysAgo >= 0 && t.daysAgo < 30) daily[t.daysAgo] = (daily[t.daysAgo] || 0) + t.amt; });

  // EWMA α=0.3 (low daysAgo = recent = higher weight)
  const alpha = 0.3;
  let ewma = null;
  for (let d = 29; d >= 0; d--) {
    const v = daily[d] || 0;
    ewma = ewma === null ? v : alpha * v + (1 - alpha) * ewma;
  }

  // Mean & std of daily spend
  const vals = Array.from({ length: 30 }, (_, d) => daily[d] || 0);
  const mean = vals.reduce((a, b) => a + b, 0) / 30;
  const variance = vals.reduce((a, v) => a + (v - mean) ** 2, 0) / 30;
  const std = Math.sqrt(variance);
  const threshold = mean + 1.5 * std; // adaptive

  const spent = catTxs.reduce((a, t) => a + t.amt, 0);
  const remaining = B - spent;
  const pct = spent / B;
  const dailyPace = Math.max(ewma || 1, 1);

  // Days until breach
  const daysUntilBreach = remaining > 0 ? Math.ceil(remaining / dailyPace) : 0;

  // Streak: consecutive days under threshold from today
  let streak = 0;
  for (let d = 0; d < 30; d++) {
    if ((daily[d] || 0) <= threshold) streak++;
    else break;
  }

  const alertTriggered = daysUntilBreach <= 5 && pct > 0.45;
  const projectedSpend = spent + dailyPace * (daysUntilBreach + 5);
  const overage = Math.max(0, Math.round(projectedSpend - B));

  let breachDate = null;
  if (daysUntilBreach > 0) {
    const bd = new Date(2026, 7, 7);
    bd.setDate(bd.getDate() + daysUntilBreach);
    breachDate = bd.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  }

  return { spent, remaining, pct, mean, std, threshold, ewma, dailyPace, daysUntilBreach, streak, alertTriggered, overage, breachDate, txCount: catTxs.length };
}

export function allStats(txs) {
  return Object.fromEntries(CAT_NAMES.map(c => [c, computeStats(c, txs)]));
}
