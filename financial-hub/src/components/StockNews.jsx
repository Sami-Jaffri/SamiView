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
          <div>
            {a.url ? (
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
                {a.title || 'No Title'}
              </a>
            ) : (
              <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{a.title || 'No Title'}</span>
            )}
          </div>
          <p style={{
            margin: '0.25rem 0',
            fontSize: '0.75rem',
            color: '#aaa'
          }}>
            {a.published_at && <span>{a.published_at}</span>}
            {a.source && <span> — {a.source}</span>}
          </p>
          {a.description && (
            <p style={{
              margin: 0,
              fontSize: '0.85rem',
              color: '#e1e1e1'
            }}>
              {a.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
