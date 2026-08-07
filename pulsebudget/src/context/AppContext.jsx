import { createContext, useContext, useState, useEffect } from 'react';
import { generateTransactions, CAT_NAMES } from '../data/engine';

const AppCtx = createContext(null);

export function AppProvider({ children }) {
  const [txs, setTxs] = useState(() => {
    try { const s = localStorage.getItem('pb_txs'); return s ? JSON.parse(s) : generateTransactions(); }
    catch { return generateTransactions(); }
  });
  const [consent, setConsent] = useState(() => {
    try { const s = localStorage.getItem('pb_consent'); return s ? JSON.parse(s) : Object.fromEntries(CAT_NAMES.map(c => [c, true])); }
    catch { return Object.fromEntries(CAT_NAMES.map(c => [c, true])); }
  });
  const [notifMode, setNotifMode] = useState(() => localStorage.getItem('pb_notif') || 'critical');
  const [screen, setScreen] = useState('onboard');
  const [toast, setToast] = useState(null);

  useEffect(() => { localStorage.setItem('pb_txs', JSON.stringify(txs)); }, [txs]);
  useEffect(() => { localStorage.setItem('pb_consent', JSON.stringify(consent)); }, [consent]);
  useEffect(() => { localStorage.setItem('pb_notif', notifMode); }, [notifMode]);

  const showToast = (title, body, type = 'alert') => {
    setToast({ title, body, type });
    setTimeout(() => setToast(null), 5500);
  };

  const addTransaction = (tx) => setTxs(prev => [...prev, tx]);

  const wipe = () => {
    localStorage.removeItem('pb_txs');
    localStorage.removeItem('pb_consent');
    localStorage.removeItem('pb_notif');
    setTxs([]);
    setConsent(Object.fromEntries(CAT_NAMES.map(c => [c, true])));
    setNotifMode('critical');
    showToast('🔒 Data Wiped', 'All data permanently removed from device.', 'success');
  };

  return (
    <AppCtx.Provider value={{ txs, consent, setConsent, notifMode, setNotifMode, screen, setScreen, toast, showToast, addTransaction, wipe }}>
      {children}
    </AppCtx.Provider>
  );
}

export const useApp = () => useContext(AppCtx);
