'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Activity, Globe, CheckCircle, AlertTriangle, Clock, ArrowRight } from 'lucide-react';

export default function DashboardOverview() {
  const [monitors, setMonitors] = useState([]);
  const [overview, setOverview] = useState({
    total_monitors: 0,
    online_monitors: 0,
    offline_monitors: 0,
    overall_uptime: 100,
    avg_response_time: 0
  });
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Initial fetch
    fetchData();

    // Trigger the backend cron worker and refresh data every 30 seconds
    const triggerCronAndRefresh = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
        await fetch(`${API_URL}/api/cron/ping`); // Fire the pings
        await fetchData(); // Fetch the new stats
      } catch (err) {
        console.error("Failed to run cron:", err);
      }
    };

    const intervalId = setInterval(triggerCronAndRefresh, 30000);
    
    // Also run it immediately on mount so the first ping happens instantly
    triggerCronAndRefresh();

    return () => clearInterval(intervalId);
  }, []);

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchData = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
      
      const [monRes, statRes] = await Promise.all([
        fetch(`${API_URL}/api/monitors`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/analytics`, { headers: getAuthHeaders() })
      ]);

      if (monRes.status === 401 || statRes.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }

      if (monRes.ok) setMonitors(await monRes.json());
      if (statRes.ok) setOverview(await statRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
        fetchData(); // Refresh list
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add monitor');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { name: 'Total Monitors', value: overview.total_monitors, icon: Globe, color: 'var(--accent-primary)' },
    { name: 'Online', value: overview.online_monitors, icon: CheckCircle, color: 'var(--status-online)' },
    { name: 'Offline', value: overview.offline_monitors, icon: AlertTriangle, color: 'var(--status-offline)' },
    { name: 'Avg. Latency', value: `${overview.avg_response_time}ms`, icon: Clock, color: 'var(--accent-secondary)' },
    { name: 'Overall Uptime', value: `${overview.overall_uptime}%`, icon: Activity, color: '#fff' },
  ];

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back! Here's what's happening with your services.</p>
        </div>
      </header>

      {/* Analytics Overview Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '24px',
        marginBottom: '48px'
      }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel"
            style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ padding: '10px', borderRadius: '12px', background: `rgba(255,255,255,0.05)` }}>
                <stat.icon size={24} color={stat.color} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500 }}>{stat.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

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

      {/* Monitors List */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Your Endpoints</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {monitors.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No monitors added yet. Add your first URL above!
            </div>
          ) : (
            monitors.map((monitor: any) => (
              <motion.div 
                key={monitor.id} 
                className="glass-panel"
                whileHover={{ scale: 1.01 }}
                style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    width: '12px', height: '12px', borderRadius: '50%', 
                    background: monitor.status === 'online' ? 'var(--status-online)' : (monitor.status === 'offline' ? 'var(--status-offline)' : 'var(--text-secondary)'),
                    boxShadow: monitor.status === 'online' ? '0 0 10px var(--status-online)' : 'none'
                  }} />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>{monitor.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{monitor.url}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{monitor.uptime_percentage}%</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Uptime</div>
                  </div>
                  <div style={{ textAlign: 'right', width: '60px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{monitor.response_time || '-'} ms</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Latency</div>
                  </div>
                  <ArrowRight color="var(--text-secondary)" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
