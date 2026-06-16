'use client';

import { motion } from 'framer-motion';
import { Plus, Globe, MoreVertical, Play, Pause, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function MonitorsPage() {
  const [monitors, setMonitors] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const fetchMonitors = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
      const res = await fetch(`${API_URL}/api/monitors`, { headers: getAuthHeaders() });
      if (res.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (res.ok) setMonitors(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitors();
    const intervalId = setInterval(fetchMonitors, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const handleAddMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
      const res = await fetch(`${API_URL}/api/monitors`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newName, url: newUrl, interval: 5 })
      });
      if (res.ok) {
        setNewUrl('');
        setNewName('');
        fetchMonitors();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add monitor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePause = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'paused' ? 'online' : 'paused';
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
      await fetch(`${API_URL}/api/monitors/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      fetchMonitors();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this monitor?')) return;
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
      await fetch(`${API_URL}/api/monitors/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      fetchMonitors();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>Loading monitors...</div>;

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Monitors</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your URL endpoints and view their current status.</p>
        </div>
      </header>

      {/* Add Monitor Form */}
      <motion.form 
        className="glass-panel" 
        onSubmit={handleAddMonitor}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '24px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '48px' }}
      >
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input 
            type="text" 
            placeholder="Monitor Name (e.g. Production API)" 
            className="input-glass" 
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ flex: 2, minWidth: '300px' }}>
          <input 
            type="url" 
            placeholder="https://example.com" 
            className="input-glass" 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            required
            style={{ width: '100%' }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 24px' }}>
          <Plus size={18} /> Add Monitor
        </button>
      </motion.form>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {monitors.map((monitor: any, i) => (
          <motion.div
            key={monitor.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={24} color={monitor.status === 'online' ? 'var(--status-online)' : (monitor.status === 'offline' ? 'var(--status-offline)' : 'var(--text-secondary)')} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{monitor.name}</h3>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', wordBreak: 'break-all' }}>{monitor.url}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{monitor.uptime_percentage}%</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uptime</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{monitor.response_time || '-'} ms</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Response</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => handleTogglePause(monitor.id, monitor.status)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}>
                  {monitor.status === 'paused' ? <Play size={20} /> : <Pause size={20} />}
                </button>
                <button onClick={() => handleDelete(monitor.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px' }}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {monitors.length === 0 && (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No monitors added yet.
          </div>
        )}
      </div>
    </div>
  );
}
