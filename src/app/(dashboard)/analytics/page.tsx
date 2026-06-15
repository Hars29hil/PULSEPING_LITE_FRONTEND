'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState({
    total_monitors: 0,
    online_monitors: 0,
    offline_monitors: 0,
    overall_uptime: 100,
    avg_response_time: 0
  });
  const [monitors, setMonitors] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const fetchAnalytics = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
      const [statRes, monRes] = await Promise.all([
        fetch(`${API_URL}/api/analytics`, { headers: getAuthHeaders() }),
        fetch(`${API_URL}/api/monitors`, { headers: getAuthHeaders() })
      ]);

      if (statRes.status === 401 || monRes.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (statRes.ok) setOverview(await statRes.json());
      if (monRes.ok) setMonitors(await monRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const intervalId = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>Loading analytics...</div>;

  const onlinePercent = overview.total_monitors > 0 
    ? (overview.online_monitors / overview.total_monitors) * 100 
    : 0;

  return (
    <div style={{ maxWidth: '1200px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Deep dive into your monitor performance and uptime history.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel"
          style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Uptime History by Monitor</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {monitors.length === 0 ? (
              <div style={{ color: 'var(--text-secondary)' }}>No monitors available.</div>
            ) : (
              monitors.map((m: any) => (
                <div key={m.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 500 }}>{m.name}</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.uptime_percentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${m.uptime_percentage}%`, 
                      height: '100%', 
                      background: m.uptime_percentage > 98 ? 'var(--status-online)' : (m.uptime_percentage > 90 ? '#f59e0b' : 'var(--status-offline)'),
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel"
            style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Response Times</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '4rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{overview.avg_response_time}<span style={{ fontSize: '2rem', color: 'var(--text-secondary)' }}>ms</span></div>
              <div style={{ color: 'var(--text-secondary)' }}>Average Latency (24h)</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel"
            style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
          >
            <h2 style={{ fontSize: '1.25rem', marginBottom: '24px' }}>Status Distribution</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flex: 1, gap: '24px' }}>
              <div style={{ width: '100%', height: '24px', borderRadius: '12px', background: 'var(--status-offline)', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${onlinePercent}%`, background: 'var(--status-online)', height: '100%', transition: 'width 0.5s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--status-online)' }}>{overview.online_monitors}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Online</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--status-offline)' }}>{overview.offline_monitors}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Offline</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
