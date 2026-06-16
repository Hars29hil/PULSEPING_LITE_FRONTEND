// frontend/src/components/layout/Sidebar.tsx
'use client';

import { Activity, LayoutDashboard, Settings, User, LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const links = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Monitors', href: '/monitors', icon: Activity },
    { name: 'Analytics', href: '/analytics', icon: Activity },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      <div className="mobile-nav-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Activity size={20} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>PulsePing</span>
        </div>
        <button className="hamburger-btn" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(false)} />

      <aside className={`sidebar-wrapper glass-panel ${isOpen ? 'open' : ''}`} style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'fixed',
        margin: '0',
        borderRadius: '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>PulsePing</span>
          </div>
          <button className="hamburger-btn" style={{ display: 'block' }} onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            
            return (
              <Link key={link.name} href={link.href} style={{ position: 'relative' }}>
                <motion.div 
                  whileHover={{ x: 4 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'color 0.2s ease',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: 'var(--accent-primary)',
                        borderRadius: '0 4px 4px 0'
                      }}
                    />
                  )}
                  <Icon size={20} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                  {link.name}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px 16px',
            borderRadius: '12px',
            color: 'var(--text-secondary)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            fontWeight: 500,
            textAlign: 'left'
          }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
