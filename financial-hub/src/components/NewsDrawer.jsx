import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StockNews from './StockNews';

const variants = {
  hidden: { x: '100%' },
  visible: { x: 0 },
  exit:    { x: '100%' }
};

export default function NewsDrawer({ isOpen, onClose, symbol }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ type: 'tween', duration: 0.25 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100vh',
            background: '#111',
            boxShadow: '-3px 0 8px rgba(0,0,0,0.6)',
            padding: '1rem',
            overflowY: 'auto',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '1.25rem',
              color: '#e1e1e1'
            }}>
              News – {symbol}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.25rem',
                color: '#e1e1e1',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <StockNews symbol={symbol} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
