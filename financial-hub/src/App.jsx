import React, { useState } from 'react';
import StockChart from './components/StockChart';

function App() {
  const [ticker, setTicker] = useState("AAPL");

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = e.target.elements.ticker.value.trim().toUpperCase();
    if (input) {
      setTicker(input);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>📈 SamiView</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          name="ticker"
          placeholder="Enter stock symbol (e.g., TSLA)"
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            width: "200px",
            marginRight: "0.5rem"
          }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Load Chart
        </button>
      </form>
      <StockChart symbol={ticker} />
    </div>
  );
}

export default App;
