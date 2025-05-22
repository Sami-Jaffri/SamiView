import React, { useState, useEffect } from 'react';
import StockChart from './components/StockChart';
import NewsDrawer from './components/NewsDrawer';

export default function App() {
  const [ticker, setTicker] = useState('AAPL');
  const [input, setInput]   = useState('AAPL');
  const [isOpen, setIsOpen] = useState(false);
  const [chartType, setChartType] = useState('candlestick');
  const [prediction, setPrediction] = useState(null);

  const loadChart = () => {
    const sym = input.trim().toUpperCase();
    if (sym) setTicker(sym);
  };

  useEffect(() => {
    setPrediction(null);
    fetch(`http://localhost:5000/api/predict/${ticker}`)
      .then(res => res.json())
      .then(data => setPrediction(data))
      .catch(() => setPrediction(null));
  }, [ticker]);

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

        <select
          value={chartType}
          onChange={e => setChartType(e.target.value)}
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
          <option value="candlestick">Candlestick</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="area">Area</option>
          <option value="baseline">Baseline</option>
        </select>
      </div>

      <div style={{
        fontSize: '1.3rem',
        fontWeight: 600,
        color: '#26a69a',
        marginBottom: '0.5rem',
        textAlign: 'center',
        letterSpacing: '0.04em'
      }}>
        {ticker} Stock Chart
      </div>

      <main style={{
        width: '100%',
        maxWidth: '1200px',
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem 0 2rem 0',
      }}>
        <div className="chart-outer">
          <StockChart symbol={ticker} chartType={chartType} />
        </div>
      </main>

      <div style={{
        marginTop: '1rem',
        background: '#181818',
        color: '#fff',
        borderRadius: '6px',
        padding: '1rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        {prediction
          ? prediction.error
            ? <span style={{ color: '#ef5350' }}>Prediction error: {prediction.error}</span>
            : <>
                <b>ML Trend Prediction:</b> <span style={{ color: prediction.trend === 'Up' ? '#26a69a' : '#ef5350' }}>{prediction.trend}</span>
                <br />
                <span>Confidence: <b>{prediction.confidence}</b></span>
                <br />
                <span>Feature: <b>{prediction.feature}</b></span>
              </>
          : 'Loading prediction...'
        }
      </div>

      <NewsDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        symbol={ticker}
      />
    </div>
  );
}