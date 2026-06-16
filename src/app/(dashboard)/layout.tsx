// frontend/src/app/(dashboard)/layout.tsx
import Sidebar from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
