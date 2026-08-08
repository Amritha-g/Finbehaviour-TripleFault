import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import { generateSeedTransactions, CAT_NAMES } from './engine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'pulsebudget.db');

// Connect to SQLite DB
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('📦 Connected to SQLite database:', dbPath);
  }
});

// Wrap callback methods in Promise
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Initialize DB and Seed Data
export async function initDb() {
  console.log('🔄 Initializing database tables...');

  // Create tables
  await dbRun(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      merchant TEXT NOT NULL,
      cat TEXT NOT NULL,
      amt REAL NOT NULL,
      date TEXT NOT NULL,
      daysAgo INTEGER NOT NULL
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS consent (
      cat TEXT PRIMARY KEY,
      enabled INTEGER NOT NULL DEFAULT 1
    )
  `);

  await dbRun(`
    CREATE TABLE IF NOT EXISTS preferences (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Check if transactions are empty, and seed if so
  const txCheck = await dbGet('SELECT COUNT(*) as count FROM transactions');
  if (txCheck.count === 0) {
    console.log('🌱 Seeding database with initial transactions...');
    const seedTxs = generateSeedTransactions();
    
    // Begin transaction for faster insertion
    await dbRun('BEGIN TRANSACTION');
    try {
      for (const tx of seedTxs) {
        const id = Math.random().toString(36).slice(2);
        await dbRun(
          'INSERT INTO transactions (id, merchant, cat, amt, date, daysAgo) VALUES (?, ?, ?, ?, ?, ?)',
          [id, tx.merchant, tx.cat, tx.amt, tx.date, tx.daysAgo]
        );
      }
      await dbRun('COMMIT');
      console.log(`✅ Successfully seeded ${seedTxs.length} transactions.`);
    } catch (e) {
      await dbRun('ROLLBACK');
      console.error('❌ Failed to seed transactions:', e);
    }
  }

  // Seed default consent settings if empty
  const consentCheck = await dbGet('SELECT COUNT(*) as count FROM consent');
  if (consentCheck.count === 0) {
    console.log('🌱 Seeding default category consent settings...');
    for (const cat of CAT_NAMES) {
      await dbRun('INSERT INTO consent (cat, enabled) VALUES (?, 1)', [cat]);
    }
  }

  // Seed default preferences if empty
  const prefCheck = await dbGet('SELECT COUNT(*) as count FROM preferences WHERE key = ?', ['notifMode']);
  if (!prefCheck) {
    console.log('🌱 Seeding default notification mode preference...');
    await dbRun('INSERT INTO preferences (key, value) VALUES (?, ?)', ['notifMode', 'critical']);
  }

  console.log('🏁 Database setup completed successfully.');
}
