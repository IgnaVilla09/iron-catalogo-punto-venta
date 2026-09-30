import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'Iron Threads - Catalogo',
  description: 'Catalogo publico de productos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex h-dvh flex-col">
        <Suspense fallback={<div className="h-[73px] border-b border-border bg-white" />}>
          <Header />
        </Suspense>
        <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-y-auto px-4 pb-8 pt-6 sm:px-8 lg:pt-8">
          {children}
        </main>
      </body>
    </html>
  );
}
