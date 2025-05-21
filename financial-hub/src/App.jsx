import React from 'react'
import StockChart from './components/StockChart'

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>📊 SamiView</h1>
      <StockChart symbol="AAPL" />
    </div>
  )
}

export default App
