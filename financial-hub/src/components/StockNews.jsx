import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockNews = ({ symbol }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY = 'S3RSUZ84ITCTGFHY';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'NEWS_SENTIMENT',
            tickers: symbol,
            apikey: API_KEY,
            sort: 'LATEST',
            limit: 5
          }
        });

        setArticles(response.data.feed || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
        setLoading(false);
      }
    };

    fetchNews();
  }, [symbol]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📰 News for {symbol}</h2>
      {loading ? (
        <p>Loading news...</p>
      ) : articles.length === 0 ? (
        <p>No news found.</p>
      ) : (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
        {articles.map((article, idx) => (
            <li key={idx} style={{
            marginBottom: "1rem",
            padding: "1rem",
            background: "#1e1e1e",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
            }}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", color: "#3b82f6", fontSize: "1rem" }}>
                {article.title}
            </a>
            <p style={{ margin: "0.2rem 0", color: "#999", fontSize: "0.8rem" }}>
                {new Date(article.time_published.slice(0, 4) + "-" + article.time_published.slice(4, 6) + "-" + article.time_published.slice(6, 8) + "T" + article.time_published.slice(9, 11) + ":" + article.time_published.slice(11, 13)).toLocaleString()}
            </p>
            <p style={{ margin: "0.4rem 0", fontSize: "0.9rem" }}>{article.summary}</p>
            </li>
        ))}
        </ul>
      )}
    </div>
  );
};

export default StockNews;
