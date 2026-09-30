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
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="border-b border-border pb-5">
        <p className="section-label">Último paso</p>
        <h1 className="mt-2 text-5xl font-bold sm:text-6xl">Completá tus datos</h1>
      </div>
      <Suspense fallback={<div className="border border-border bg-card p-4">Cargando compra...</div>}>
        <CheckoutClient />
      </Suspense>
    </section>
  );
}
