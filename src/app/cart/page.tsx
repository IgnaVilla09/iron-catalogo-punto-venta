import { Suspense } from 'react';
import { CartClient } from '@/components/cart-client';
import { buildCatalogMetadata } from '@/lib/catalog-metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string }>;
}) {
  const { pos } = await searchParams;
  return buildCatalogMetadata(pos);
}

export default function CartPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Resumen</p>
        <h1 className="text-2xl font-bold">Tu carrito</h1>
      </div>
      <Suspense fallback={<div className="rounded-[2rem] border border-border bg-card p-4 shadow-card">Cargando carrito...</div>}>
        <CartClient />
      </Suspense>
    </section>
  );
}
