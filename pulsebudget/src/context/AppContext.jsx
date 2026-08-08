import { createContext, useContext, useState, useEffect } from 'react';
import { generateTransactions, CAT_NAMES } from '../data/engine';

const AppCtx = createContext(null);
const API_URL = 'http://localhost:5005/api';

export function AppProvider({ children }) {
  const [txs, setTxs] = useState([]);
  const [consent, setConsent] = useState(() => Object.fromEntries(CAT_NAMES.map(c => [c, true])));
  const [notifMode, setNotifMode] = useState('critical');
  const [screen, setScreen] = useState('onboard');
  const [toast, setToast] = useState(null);

  // Load from backend on startup
  useEffect(() => {
    async function loadBackendData() {
      try {
        console.log('🔄 Fetching app state from PulseBudget backend...');
        const [txsRes, consentRes, notifRes] = await Promise.all([
          fetch(`${API_URL}/transactions`),
          fetch(`${API_URL}/consent`),
          fetch(`${API_URL}/preferences`)
        ]);

        if (txsRes.ok) {
          const txsData = await txsRes.json();
          setTxs(txsData);
        }
        if (consentRes.ok) {
          const consentData = await consentRes.json();
          setConsent(consentData);
        }
        if (notifRes.ok) {
          const notifData = await notifRes.json();
          setNotifMode(notifData.notifMode);
        }
        console.log('✅ State successfully loaded from backend.');
      } catch (err) {
        console.warn('⚠️ Backend not reachable. Falling back to localStorage offline cache:', err);
        // Offline / LocalStorage Fallback
        try {
          const localTxs = localStorage.getItem('pb_txs');
          if (localTxs) setTxs(JSON.parse(localTxs));
          else setTxs(generateTransactions());

          const localConsent = localStorage.getItem('pb_consent');
          if (localConsent) setConsent(JSON.parse(localConsent));

          const localNotif = localStorage.getItem('pb_notif');
          if (localNotif) setNotifMode(localNotif);
        } catch {
          setTxs(generateTransactions());
        }
      }
    }
    loadBackendData();
  }, []);

  // Update backup LocalStorage cache when state changes
  useEffect(() => {
    if (txs && txs.length > 0) {
      localStorage.setItem('pb_txs', JSON.stringify(txs));
    }
  }, [txs]);

  useEffect(() => {
    localStorage.setItem('pb_consent', JSON.stringify(consent));
  }, [consent]);

  useEffect(() => {
    localStorage.setItem('pb_notif', notifMode);
  }, [notifMode]);

  const showToast = (title, body, type = 'alert') => {
    setToast({ title, body, type });
    setTimeout(() => setToast(null), 5500);
  };

  // Add Transaction with Server Sync
  const addTransaction = async (tx) => {
    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      if (res.ok) {
        const savedTx = await res.json();
        setTxs(prev => {
          // If transaction already exists (avoid duplicate state add)
          if (prev.some(t => t.id === savedTx.id)) return prev;
          return [...prev, savedTx];
        });
        return savedTx;
      }
    } catch (err) {
      console.warn('⚠️ Server update failed. Saving transaction locally.', err);
    }
    // Fallback: Add transaction to local state only
    setTxs(prev => [...prev, tx]);
  };

  // Update Consent with Server Sync (Supports Functional Updates)
  const updateConsent = async (valueOrFunc) => {
    setConsent(prev => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      
      // Async backend sync
      fetch(`${API_URL}/consent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(next)
      }).catch(err => console.warn('⚠️ Failed to sync consent to server:', err));

      return next;
    });
  };

  // Update Notification Preferences with Server Sync (Supports Functional Updates)
  const updateNotifMode = async (valueOrFunc) => {
    setNotifMode(prev => {
      const next = typeof valueOrFunc === 'function' ? valueOrFunc(prev) : valueOrFunc;
      
      // Async backend sync
      fetch(`${API_URL}/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifMode: next })
      }).catch(err => console.warn('⚠️ Failed to sync notification mode to server:', err));

      return next;
    });
  };

  // Wipe Data with Server Sync
  const wipe = async () => {
    try {
      const res = await fetch(`${API_URL}/transactions/wipe`, { method: 'POST' });
      if (res.ok) {
        // Re-fetch seeded backend data to sync UI state
        const [txsRes, consentRes, notifRes] = await Promise.all([
          fetch(`${API_URL}/transactions`),
          fetch(`${API_URL}/consent`),
          fetch(`${API_URL}/preferences`)
        ]);

        if (txsRes.ok) setTxs(await txsRes.json());
        if (consentRes.ok) setConsent(await consentRes.json());
        if (notifRes.ok) {
          const pref = await notifRes.json();
          setNotifMode(pref.notifMode);
        }
        showToast('🔒 Backend Data Reset', 'All data wiped and restored to default seed values.', 'success');
        return;
      }
    } catch (err) {
      console.warn('⚠️ Backend wipe failed. Cleared local client data.', err);
    }

    // Local / Offline Fallback Wipe
    localStorage.removeItem('pb_txs');
    localStorage.removeItem('pb_consent');
    localStorage.removeItem('pb_notif');
    setTxs([]);
    setConsent(Object.fromEntries(CAT_NAMES.map(c => [c, true])));
    setNotifMode('critical');
    showToast('🔒 Local Data Wiped', 'All browser offline data has been permanently cleared.', 'success');
  };

  return (
    <AppCtx.Provider value={{
      txs,
      consent,
      setConsent: updateConsent,
      notifMode,
      setNotifMode: updateNotifMode,
      screen,
      setScreen,
      toast,
      showToast,
      addTransaction,
      wipe
    }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
