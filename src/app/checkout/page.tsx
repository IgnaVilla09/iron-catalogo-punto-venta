import { Suspense } from 'react';
import { CheckoutClient } from '@/components/checkout-client';
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

export default function CheckoutPage() {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Checkout</p>
        <h1 className="text-2xl font-bold">Completa tus datos</h1>
      </div>
      <Suspense fallback={<div className="rounded-[2rem] border border-border bg-card p-4 shadow-card">Cargando checkout...</div>}>
        <CheckoutClient />
      </Suspense>
    </section>
  );
}
