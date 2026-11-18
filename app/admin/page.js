'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadVisitors = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/visitors', {
        headers: { 'x-admin-password': password },
        cache: 'no-store',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load visitors');
      setVisitors(data.visitors);
    } catch (loadError) {
      setVisitors([]);
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-page">
      <section className="admin-section">
        <div className="admin-panel">
          <h1>Admin</h1>
          <p>Visitors who entered their name</p>

          <form className="admin-login" onSubmit={loadVisitors}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              aria-label="Admin password"
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Loading...' : 'View visitors'}
            </button>
          </form>

          {error && <p className="admin-error" role="alert">{error}</p>}

          {visitors.length > 0 && (
            <div className="visitor-table-wrap">
              <table className="visitor-table">
                <thead>
                  <tr><th>Name</th><th>First visit</th><th>Latest visit</th></tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td>{visitor.name}</td>
                      <td>{new Date(visitor.createdAt).toLocaleString()}</td>
                      <td>{new Date(visitor.visitedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!loading && visitors.length === 0 && !error && (
            <p className="admin-empty">No visitor entries yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
