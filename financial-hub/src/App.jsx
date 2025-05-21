

import React, { useState } from 'react';
import StockChart from './components/StockChart';
import StockNews from './components/StockNews';

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
    <div style={{ padding: "2rem", fontFamily: "Inter, sans-serif", backgroundColor: "#0e1117", color: "#e1e1e1", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>📈 SamiView</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>

        <input
          type="text"
          name="ticker"
          placeholder="Enter stock symbol (e.g., TSLA)"
          style={{
            padding: "0.6rem",
            fontSize: "1rem",
            width: "200px",
            background: "#1e1e1e",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: "5px",
            marginRight: "0.5rem"
          }}
        />
        <button type="submit" style={{ padding: "0.6rem 1rem", backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "5px" }}>
          Load Chart
        </button>
      </form>
      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <div style={{ flex: 3 }}>
          <StockChart symbol={ticker} />
        </div>
        <div style={{ flex: 2 }}>
          <StockNews symbol={ticker} />
        </div>
      </div>
    </div>
  );
}

export default App;
