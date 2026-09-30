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
    <section className="space-y-6">
      <div className="border-b border-border pb-5">
        <p className="section-label">Tu selección</p>
        <h1 className="mt-2 text-5xl font-bold sm:text-6xl">Tu carrito</h1>
      </div>
      <Suspense fallback={<div className="border border-border bg-card p-4">Cargando carrito...</div>}>
        <CartClient />
      </Suspense>
    </section>
  );
}
