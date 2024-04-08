'use client';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import 'styles/main.css';
import { Providers } from './provider';
import { usePathname } from 'next/navigation';
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const bgClass = isHomePage ? 'bg-white' : 'bg-slate-900';

  return (
    <html lang="en">
      <body className={`loading ${bgClass}`}>
        <Providers>
          <Navbar />
          <main
            id="skip"
            className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)] z-10"
            style={{ position: 'relative' }}
          >
            {children}
          </main>
          <Footer />
          <Suspense>
            <Toaster />
          </Suspense>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
