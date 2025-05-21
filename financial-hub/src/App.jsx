import React, { useState } from 'react';
import StockChart from './components/StockChart';
import NewsDrawer from './components/NewsDrawer';

export default function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    const input = e.target.elements.ticker.value.trim().toUpperCase();
    if (input) setTicker(input);
  };

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      background: '#0e1117',
      color: '#e1e1e1',
      minHeight: '100vh',
      position: 'relative',
      overflow: isOpen ? 'hidden' : 'auto'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈 SamiView</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <input
          name="ticker"
          placeholder="TSLA, MSFT…"
          style={{
            flex: 1,
            padding: '0.6rem',
            fontSize: '1rem',
            background: '#1e1e1e',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '5px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.6rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Load Chart
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            padding: '0.6rem 1rem',
            background: '#e11d48',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          News ↪
        </button>
      </form>

      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 3 }}>
          <StockChart symbol={ticker} />
        </div>
      </div>

      <NewsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        symbol={ticker}
      />
    </div>
  );
}
