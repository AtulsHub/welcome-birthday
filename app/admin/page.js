'use client';

import { useCallback, useEffect, useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const loadVisitors = useCallback(async () => {
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
      setAuthenticated(true);
    } catch (loadError) {
      setVisitors([]);
      setError(loadError.message);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [password]);

  useEffect(() => {
    if (!authenticated) return undefined;
    const timer = setInterval(loadVisitors, 5000);
    return () => clearInterval(timer);
  }, [authenticated, loadVisitors]);

  const handleSubmit = (event) => {
    event.preventDefault();
    loadVisitors();
  };

  return (
    <main className="admin-page">
      <section className="admin-section">
        <div className="admin-panel">
          <h1>Admin</h1>
          <p>Visitors who entered their name</p>

          <form className="admin-login" onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              aria-label="Admin password"
              required
            />
            <button className="btn" type="submit" disabled={loading}>
              {loading ? 'Loading...' : authenticated ? 'Refresh visitors' : 'View visitors'}
            </button>
          </form>

          {error && <p className="admin-error" role="alert">{error}</p>}

          {visitors.length > 0 && (
            <div className="visitor-table-wrap">
              <table className="visitor-table">
                <thead>
                  <tr><th>Name</th><th>First visit</th><th>Latest visit</th><th>Opened gift</th><th>Boxes opened</th><th>Sent cake cheer</th></tr>
                </thead>
                <tbody>
                  {visitors.map((visitor) => (
                    <tr key={visitor.id}>
                      <td>{visitor.name}</td>
                      <td>{new Date(visitor.createdAt).toLocaleString()}</td>
                      <td>{new Date(visitor.visitedAt).toLocaleString()}</td>
                      <td>
                        <span className={`visitor-status ${visitor.giftOpenedAt ? 'is-done' : ''}`}>
                          {visitor.giftOpenedAt ? `Yes · ${new Date(visitor.giftOpenedAt).toLocaleString()}` : 'No'}
                        </span>
                      </td>
                      <td>{visitor.giftOpenedCount}</td>
                      <td>
                        <span className={`visitor-status ${visitor.cheerSentAt ? 'is-done' : ''}`}>
                          {visitor.cheerSentAt ? `Yes · ${new Date(visitor.cheerSentAt).toLocaleString()}` : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {visitors.length > 0 && (
            <p className="admin-count">Showing {visitors.length} visitor{visitors.length === 1 ? '' : 's'}.</p>
          )}
          {!loading && visitors.length === 0 && !error && (
            <p className="admin-empty">No visitor entries yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
