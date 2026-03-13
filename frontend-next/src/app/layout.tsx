import type { Metadata } from "next";
import Navbar from '@/components/Navbar';
import { ToastProvider } from '@/components/Toast';
import './globals.css';

export const metadata: Metadata = {
  title: "FinAlliance — Collaborative AI Fraud Detection",
  description: "FinAlliance enables financial institutions to collaboratively detect fraud using federated learning while preserving customer privacy and regulatory compliance.",
  keywords: ["federated learning", "fraud detection", "AI", "banking", "privacy", "machine learning"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden" style={{ backgroundColor: '#020617', color: '#e2e8f0' }}>
        <ToastProvider>
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
