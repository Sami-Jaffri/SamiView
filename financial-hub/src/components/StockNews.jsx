import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockNews({ symbol }) {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/news/${symbol}`);
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load news");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [symbol]);

  // helper to format UNIX seconds → local string
  const fmt = ts => new Date(ts * 1000).toLocaleString();

  return (
    <div>
      <h2 style={{ color: '#e1e1e1' }}>📰 News: {symbol}</h2>
      {loading ? (
        <p style={{ color: '#999' }}>Loading news…</p>
      ) : error ? (
        <p style={{ color: '#e11d48' }}>{error}</p>
      ) : articles.length === 0 ? (
        <p style={{ color: '#999' }}>No recent news.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {articles.map((a, i) => (
            <li key={i} style={{
              marginBottom: '1rem',
              padding: '1rem',
              background: '#1e1e1e',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
            }}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 'bold', color: '#3b82f6', fontSize: '1rem' }}
              >
                {a.headline}
              </a>
              <p style={{ margin: '0.2rem 0', color: '#999', fontSize: '0.8rem' }}>
                {fmt(a.datetime)} &mdash; {a.source}
              </p>
              {a.summary && (
                <p style={{ margin: '0.4rem 0', fontSize: '0.9rem', color: '#e1e1e1' }}>
                  {a.summary}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
