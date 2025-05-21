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

// Register Chart.js components
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
  const [loading, setLoading] = useState(true);

  const API_KEY = 'S3RSUZ84ITCTGFHY'; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://www.alphavantage.co/query`, {
          params: {
            function: "TIME_SERIES_DAILY",
            symbol: symbol,
            apikey: API_KEY
          }
        });

        const raw = res.data["Time Series (Daily)"];
        if (!raw) return;

        const labels = Object.keys(raw).slice(0, 30).reverse();
        const prices = labels.map(date => parseFloat(raw[date]["4. close"]));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${symbol} Closing Price`,
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.2,
              fill: true
            }
          ]
        });

        setLoading(false);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  return (
    <div>
      <h2>{symbol} Stock Chart</h2>
      {loading ? <p>Loading chart...</p> :
        <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
      }
    </div>
  );
};

export default StockChart;
