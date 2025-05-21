import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StockNews from './StockNews';

const drawerVariants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit:    { x: '100%' }
};

export default function NewsDrawer({ isOpen, onClose, symbol }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={drawerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'tween', duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '320px',
            height: '100vh',
            background: '#0e1117',
            padding: '2rem 1.5rem',
            boxShadow: '-2px 0 8px rgba(0,0,0,0.6)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              color: '#e1e1e1',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <h2 style={{ color: '#e1e1e1', marginBottom: '1rem' }}>📰 News: {symbol}</h2>
          <StockNews symbol={symbol} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
