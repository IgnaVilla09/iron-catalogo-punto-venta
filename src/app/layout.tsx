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
      <body className="h-screen overflow-hidden">
        <Suspense fallback={<div className="h-[69px] border-b border-border bg-background" />}>
          <Header />
        </Suspense>
        <main className="mx-auto flex h-[calc(100vh-69px)] max-w-md flex-col overflow-hidden px-4 pt-5">
          {children}
        </main>
      </body>
    </html>
  );
}
