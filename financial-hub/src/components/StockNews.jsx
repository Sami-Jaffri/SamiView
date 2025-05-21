import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function StockNews({ symbol }) {
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:5000/api/news/${symbol}`)
      .then(({ data }) => setArticles(data))
      .catch(() => setError('Failed to load news'))
      .finally(() => setLoading(false));
  }, [symbol]);

  const fmt = ts => new Date(ts * 1000).toLocaleString();

  if (loading) return <p style={{ color: '#888' }}>Loading...</p>;
  if (error)   return <p style={{ color: '#e11d48' }}>{error}</p>;
  if (articles.length === 0) return <p style={{ color: '#888' }}>No recent news.</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {articles.map((a, i) => (
        <div key={i} style={{
          padding: '0.75rem',
          background: '#1c1c1e',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}>
          <a
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.95rem',
              fontWeight: '600',
              color: '#3b82f6',
              textDecoration: 'none'
            }}
          >
            {a.headline}
          </a>
          <p style={{
            margin: '0.25rem 0',
            fontSize: '0.75rem',
            color: '#aaa'
          }}>
            {fmt(a.datetime)} — {a.source}
          </p>
          {a.summary && (
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#e1e1e1'
            }}>
              {a.summary}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
