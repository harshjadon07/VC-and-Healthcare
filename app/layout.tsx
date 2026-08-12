import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'SevaHealth (ग्रामीण आरोग्य) - Rural Health AI Platform',
  description: 'Instant AI clinical triage, community health worker queues, and direct tele-consultations for rural healthcare.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-sand-50 text-slate-900 min-h-screen flex flex-col justify-between">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
