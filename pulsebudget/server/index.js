import express from 'express';
import cors from 'cors';
import { initDb, dbAll, dbRun, dbGet } from './db.js';
import { allStats, CAT_NAMES } from './engine.js';

const app = express();
const PORT = process.env.PORT || 5005;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Initialize Database
await initDb();

// ─── ENDPOINTS ───

// 1. Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM transactions ORDER BY daysAgo ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 2. Add a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { merchant, cat, amt, date, daysAgo } = req.body;
    if (!merchant || !cat || amt === undefined) {
      return res.status(400).json({ error: 'Missing required transaction fields' });
    }

    const id = req.body.id || Math.random().toString(36).slice(2);
    const txDate = date || new Date().toISOString().split('T')[0];
    const txDaysAgo = daysAgo !== undefined ? daysAgo : 0;

    await dbRun(
      'INSERT INTO transactions (id, merchant, cat, amt, date, daysAgo) VALUES (?, ?, ?, ?, ?, ?)',
      [id, merchant, cat, parseFloat(amt), txDate, parseInt(txDaysAgo)]
    );

    const newTx = { id, merchant, cat, amt: parseFloat(amt), date: txDate, daysAgo: parseInt(txDaysAgo) };
    res.status(201).json(newTx);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// 3. Wipe all data (and reset to initial seeds)
app.post('/api/transactions/wipe', async (req, res) => {
  try {
    console.log('🧹 Wiping database tables...');
    await dbRun('DELETE FROM transactions');
    await dbRun('DELETE FROM consent');
    await dbRun('DELETE FROM preferences');

    // Re-initialize tables and seed data
    await initDb();

    res.json({ message: 'Database successfully wiped and reset' });
  } catch (error) {
    console.error('Error wiping database:', error);
    res.status(500).json({ error: 'Failed to wipe database' });
  }
});

// 4. Get category consent settings
app.get('/api/consent', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM consent');
    const consent = {};
    CAT_NAMES.forEach(cat => {
      const match = rows.find(r => r.cat === cat);
      consent[cat] = match ? match.enabled === 1 : true;
    });
    res.json(consent);
  } catch (error) {
    console.error('Error fetching consent settings:', error);
    res.status(500).json({ error: 'Failed to fetch consent settings' });
  }
});

// 5. Update consent settings
app.post('/api/consent', async (req, res) => {
  try {
    const consentObj = req.body; // e.g. { Food: true, Transport: false }
    if (!consentObj) {
      return res.status(400).json({ error: 'Consent configuration payload required' });
    }

    await dbRun('BEGIN TRANSACTION');
    try {
      for (const [cat, enabled] of Object.entries(consentObj)) {
        await dbRun(
          'INSERT OR REPLACE INTO consent (cat, enabled) VALUES (?, ?)',
          [cat, enabled ? 1 : 0]
        );
      }
      await dbRun('COMMIT');
    } catch (e) {
      await dbRun('ROLLBACK');
      throw e;
    }

    res.json({ message: 'Consent configuration updated successfully', consent: consentObj });
  } catch (error) {
    console.error('Error updating consent settings:', error);
    res.status(500).json({ error: 'Failed to update consent settings' });
  }
});

// 6. Get notification preferences
app.get('/api/preferences', async (req, res) => {
  try {
    const row = await dbGet('SELECT value FROM preferences WHERE key = ?', ['notifMode']);
    const notifMode = row ? row.value : 'critical';
    res.json({ notifMode });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// 7. Update notification preferences
app.post('/api/preferences', async (req, res) => {
  try {
    const { notifMode } = req.body;
    if (!notifMode) {
      return res.status(400).json({ error: 'notifMode parameter is required' });
    }

    await dbRun(
      'INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)',
      ['notifMode', notifMode]
    );

    res.json({ message: 'Notification preferences updated successfully', notifMode });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// 8. Get computed EWMA and adaptive threshold stats
app.get('/api/stats', async (req, res) => {
  try {
    const txs = await dbAll('SELECT * FROM transactions');
    const stats = allStats(txs);
    res.json(stats);
  } catch (error) {
    console.error('Error computing stats:', error);
    res.status(500).json({ error: 'Failed to compute predictive analytics' });
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(`🚀 PulseBudget backend server listening on http://localhost:${PORT}`);
});
