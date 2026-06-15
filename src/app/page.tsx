// frontend/src/app/page.tsx
'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Activity, Globe, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MouseEvent } from 'react';

export default function Home() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-300, 300], [10, -10]);
  const rotateY = useTransform(x, [-300, 300], [-10, 10]);

  function handleMouse(event: MouseEvent) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <main 
      className="hero-container"
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div className="hero-grid"></div>

      <div style={{ zIndex: 10, textAlign: 'center', padding: '2rem', maxWidth: '800px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
            <Zap size={16} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>INTRODUCING PULSEPING LITE</span>
          </div>
          
          <h1 style={{ fontSize: '4.5rem', lineHeight: '1.1', marginBottom: '24px' }}>
            Monitor your URLs with <br/>
            <span className="text-accent-gradient">Absolute Precision</span>
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            A meticulously crafted monitoring platform designed to keep your services online, with a stunning interface that just works.
          </p>

          <Link href="/login" passHref>
            <motion.button 
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', fontSize: '1.125rem', padding: '16px 32px' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        style={{
          marginTop: '64px',
          perspective: 1000,
          zIndex: 10,
        }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <motion.div
          className="glass-panel"
          style={{
            rotateX,
            rotateY,
            width: '800px',
            height: '400px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            background: 'linear-gradient(145deg, rgba(30, 30, 50, 0.6) 0%, rgba(10, 10, 20, 0.4) 100%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.1)',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Mock UI Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', transform: 'translateZ(30px)' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Dashboard Overview</div>
          </div>

          {/* Mock UI Content */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', transform: 'translateZ(50px)' }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '8px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                    <Activity size={20} color="var(--accent-primary)" />
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Uptime</div>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>99.{9 - i}%</div>
              </div>
            ))}
          </div>
          
          {/* Mock Chart Area */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', borderRadius: '12px', marginTop: 'auto', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', transform: 'translateZ(20px)' }}>
            <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,100 L0,50 Q25,30 50,60 T100,40 L100,100 Z" fill="rgba(99, 102, 241, 0.1)" />
              <path d="M0,50 Q25,30 50,60 T100,40" fill="none" stroke="var(--accent-primary)" strokeWidth="2" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
