'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<{name: string, email: string, avatar: string | null} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost/pulseping-api/public';
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.status === 401) {
          window.location.href = '/login';
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>Loading profile...</div>;
  if (!user) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>User not found</div>;

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information.</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700 }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{user.name}</h2>
            <div style={{ color: 'var(--text-secondary)' }}>{user.email}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn-primary" style={{ alignSelf: 'flex-start' }}>Edit Profile</button>
        </div>
      </motion.div>
    </div>
  );
}
