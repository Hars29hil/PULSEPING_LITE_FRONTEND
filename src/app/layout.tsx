// frontend/src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'PulsePing Lite | Premium URL Monitoring',
  description: 'Monitor your websites in real-time with an elegant, modern dashboard.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
