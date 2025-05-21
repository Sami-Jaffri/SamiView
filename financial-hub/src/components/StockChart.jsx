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

const StockChart = ({ symbol = "AAPL" }) => {
  const [chartData, setChartData] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get(`http://localhost:5000/api/candle/${symbol}`);

        if (data.error) {
          throw new Error(data.error);
        }

        const timestamps = data.t;  // array of UNIX timestamps
        const closes = data.c;  // array of closing prices

        if (!timestamps || !closes || timestamps.length === 0 || closes.length === 0) {
          throw new Error("No data points received from server");
        }

        // Convert timestamps to human-readable dates
        const labels = timestamps.map(ts => new Date(ts * 1000).toLocaleDateString());

        setChartData({
          labels,
          datasets: [
            {
              label: `${symbol} Closing Price`,
              data: closes,
              borderColor: '#3b82f6',
              backgroundColor: 'rgba(59,130,246,0.2)',
              tension: 0.2,
              fill: true,
            }
          ]
        });

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.error || err.message || "Failed to fetch data");
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div style={{
      maxWidth: '100%',
      background: '#1e1e1e',
      padding: '1rem',
      borderRadius: '8px'
    }}>
      <h2 style={{ color: '#e1e1e1', marginBottom: '1rem' }}>
        {symbol} Stock Chart
      </h2>

      {loading ? (
        <p style={{ color: '#999' }}>Loading chart...</p>
      ) : error ? (
        <p style={{ color: '#e11d48' }}>{error}</p>
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
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
        <p style={{ color: '#999' }}>No data available.</p>
      )}
    </div>
  );
};

export default StockChart;