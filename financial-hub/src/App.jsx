import React, { useState } from 'react';
import StockChart from './components/StockChart';
import NewsDrawer from './components/NewsDrawer';

export default function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [input, setInput]   = useState('AAPL');
  const [isOpen, setIsOpen] = useState(false);

  const loadChart = () => {
    const sym = input.trim().toUpperCase();
    if (sym) setTicker(sym);
  };

  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      background: '#0f0f0f',
      color: '#e1e1e1',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        margin: 0,
        fontSize: '2.5rem',
        textAlign: 'center'
      }}>
        SamiView
      </h1>

      <div style={{
        display: 'flex',
        gap: '1rem',
        margin: '1.5rem 0'
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="TSLA, MSFT …"
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            background: '#0f0f0f',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '4px',
            width: '140px',
            textAlign: 'center'
          }}
        />

        <button
          onClick={loadChart}
          style={{
            padding: '0.5rem 1rem',
            background: '#0f0f0f',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Load
        </button>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#0f0f0f',
            color: '#fff',
            border: '1px solid #fff',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          News
        </button>
      </div>

      <main style={{
        width: '100%',
        maxWidth: '1000px',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <StockChart symbol={ticker} />
      </main>

      <NewsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        symbol={ticker}
      />
    </div>
  );
}