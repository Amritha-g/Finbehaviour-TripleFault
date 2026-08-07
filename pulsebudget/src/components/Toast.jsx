import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast } = useApp();
  const isAlert = toast?.type !== 'success';

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key="toast"
          initial={{ x: 120, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 120, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 300 }}
          style={{
            position: 'fixed', bottom: 32, right: 32, zIndex: 999,
            background: isAlert
              ? 'linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.92))'
              : 'linear-gradient(135deg, rgba(16,185,129,0.95), rgba(5,150,105,0.92))',
            border: `1px solid ${isAlert ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}`,
            borderRadius: 18,
            padding: '18px 24px',
            maxWidth: 360,
            boxShadow: isAlert
              ? '0 8px 40px rgba(239,68,68,0.35), 0 0 0 1px rgba(239,68,68,0.1)'
              : '0 8px 40px rgba(16,185,129,0.35)',
            backdropFilter: 'blur(20px)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 5 }}>{toast.title}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{toast.body}</div>

          {/* Animated corner glow */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: isAlert
                ? 'radial-gradient(circle, rgba(239,68,68,0.4), transparent 70%)'
                : 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
