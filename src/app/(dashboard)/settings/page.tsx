'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState('Dark Mode');
  const [interval, setIntervalVal] = useState('1 minute');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load from local storage
    const savedTheme = localStorage.getItem('theme') || 'Dark Mode';
    const savedInterval = localStorage.getItem('interval') || '1 minute';
    setTheme(savedTheme);
    setIntervalVal(savedInterval);

    // Apply theme on load
    if (savedTheme === 'Light Mode') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('interval', interval);
    
    if (theme === 'Light Mode') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Settings</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Configure your dashboard preferences.</p>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}
      >
        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Theme</h3>
          <select 
            className="input-glass"
            style={{ width: '100%', padding: '12px' }}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option>Dark Mode</option>
            <option>Light Mode</option>
          </select>
        </div>

        <div>
          <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>Default Monitoring Interval</h3>
          <select 
            className="input-glass"
            style={{ width: '100%', padding: '12px' }}
            value={interval}
            onChange={(e) => setIntervalVal(e.target.value)}
          >
            <option>1 minute</option>
            <option>5 minutes</option>
            <option>15 minutes</option>
            <option>60 minutes</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
          <button className="btn-primary" onClick={handleSave}>Save Changes</button>
          {saved && <span style={{ color: 'var(--status-online)' }}>Preferences saved!</span>}
        </div>
      </motion.div>
    </div>
  );
}
