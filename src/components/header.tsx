'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cart-store';
import { useHydrated } from '@/stores/use-hydrated';
import { buildPosPath } from '@/lib/utils';

export function Header() {
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const search = searchParams.get('search');
  const count = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const hydrated = useHydrated();
  const visibleCount = hydrated ? count : 0;

  return (
    <header className="relative z-10 shrink-0 border-b border-border bg-white">
      <div className="mx-auto flex h-[73px] w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link href={buildPosPath('/', pos, search)} aria-label="Iron Threads, ir al catálogo" className="inline-flex items-center">
          <Image src="/logo.png" alt="Iron Threads" width={177} height={40} priority className="h-auto w-[145px] sm:w-[177px]" />
        </Link>
        <div className="flex items-center gap-5">
          <span className="hidden text-sm font-bold text-muted sm:block">Indumentaria para moverte</span>
          <Link href={buildPosPath('/cart', pos, search)} aria-label={`Ver carrito, ${visibleCount} productos`} className="relative flex h-11 w-11 items-center justify-center rounded-lg border border-border transition-colors hover:border-foreground">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {visibleCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-extrabold text-foreground">{visibleCount}</span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
