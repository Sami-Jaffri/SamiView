import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function StockChart({ symbol = "AAPL" }) {
  const [chartData, setChartData] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const [pred,     setPred]     = useState(null);
  const [predLoading, setPredLoading] = useState(false);
  const [predError,   setPredError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setChartData(null);

    axios.get(`http://localhost:5000/api/candle/${symbol}`)
      .then(({ data }) => {
        if (data.error) throw new Error(data.error);

        const labels = data.t.map(ts => new Date(ts * 1000).toLocaleDateString());
        const closes = data.c;

        setChartData({
          labels,
          datasets: [{
            label: `${symbol} Closing Price`,
            data: closes,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59,130,246,0.2)',
            tension: 0.2,
            fill: true
          }]
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [symbol]);

  useEffect(() => {
    setPredLoading(true);
    setPredError(null);
    setPred(null);

    axios.get(`http://localhost:5000/api/predict/${symbol}`)
      .then(({ data }) => {
        if (data.error) throw new Error(data.error);
        setPred(data);
      })
      .catch(err => setPredError(err.message))
      .finally(() => setPredLoading(false));
  }, [symbol]);

  return (
    <div style={{
      width: '100%',
      height: '450px',
      background: '#1e1e1e',
      padding: '1rem',
      borderRadius: '8px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ flexGrow: 1 }}>
        {loading ? (
          <p style={{ color: '#888' }}>Loading chart…</p>
        ) : error ? (
          <p style={{ color: '#e11d48' }}>{error}</p>
        ) : chartData ? (
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: { color: '#e1e1e1' }
                }
              },
              scales: {
                x: {
                  ticks: { color: '#e1e1e1' },
                  grid: { color: '#333' }
                },
                y: {
                  ticks: { color: '#e1e1e1' },
                  grid: { color: '#333' }
                }
              }
            }}
          />
        ) : (
          <p style={{ color: '#888' }}>No data available.</p>
        )}
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        {predLoading ? (
          <p style={{ color: '#888' }}>Predicting trend…</p>
        ) : predError ? (
          <p style={{ color: '#e11d48' }}>{predError}</p>
        ) : pred ? (
          <p style={{ color: '#3b82f6', fontSize: '1.1rem', margin: 0 }}>
            Next day trend: <strong>{pred.trend}</strong>
            {' '}({Math.round(pred.confidence * 100)}% confidence)
          </p>
        ) : null}
      </div>
    </div>
  );
}
