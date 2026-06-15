// frontend/src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div className="desktop-sidebar">
         <Sidebar />
      </div>
      
      <main style={{ 
        flex: 1, 
        marginLeft: '328px', 
        padding: '48px 48px 48px 0',
      }}>
        {children}
      </main>
    </div>
  );
}
