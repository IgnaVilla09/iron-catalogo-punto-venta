'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { buildPosPath } from '@/lib/utils';

export function Header() {
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const search = searchParams.get('search');
  const items = useCartStore((state) => state.items);
  const lastAddedAt = useCartStore((state) => state.lastAddedAt);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const [showAddedNotice, setShowAddedNotice] = useState(false);

  useEffect(() => {
    if (!lastAddedAt) {
      return;
    }

    setShowAddedNotice(true);
    const timeoutId = window.setTimeout(() => setShowAddedNotice(false), 1800);

    return () => window.clearTimeout(timeoutId);
  }, [lastAddedAt]);

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
        <div className="w-10" />
        <Link href={buildPosPath('/', pos, search)} className="flex justify-center">
          <Image src="/logo.png" alt="Iron Catalog" width={120} height={44} priority className="h-11 w-auto" />
        </Link>
        <div className="relative flex flex-col items-end">
          <Link href={buildPosPath('/cart', pos, search)} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card shadow-card">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current stroke-2">
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8H18a1 1 0 0 0 1-.8L21 7H7" />
            </svg>
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <div
            className={showAddedNotice
              ? 'pointer-events-none absolute top-12 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white opacity-100 shadow-card transition-all duration-300'
              : 'pointer-events-none absolute top-10 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-card transition-all duration-300'}
          >
            Producto agregado!
          </div>
        </div>
      </div>
    </header>
  );
}
