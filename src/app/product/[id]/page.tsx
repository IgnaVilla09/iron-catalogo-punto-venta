import { Suspense } from 'react';
import Link from 'next/link';
import { ProductDetail } from '@/components/product-detail';
import { getProduct } from '@/lib/api';
import { buildPosPath } from '@/lib/utils';
import { buildCatalogMetadata } from '@/lib/catalog-metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string; search?: string }>;
}) {
  const { pos, search } = await searchParams;
  return buildCatalogMetadata(pos, search);
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pos?: string; search?: string }>;
}) {
  const [{ id }, { pos, search }] = await Promise.all([params, searchParams]);

  if (!pos) {
    return <p>Falta el punto de venta para cargar el producto.</p>;
  }

  const product = await getProduct(id, pos);

  return (
    <section className="space-y-5">
      <Link href={buildPosPath('/', pos, search)} className="inline-flex py-1 text-sm font-bold text-muted hover:text-foreground">
        ← Volver al catálogo
      </Link>
      <Suspense fallback={<div className="border border-border bg-card p-4">Cargando producto...</div>}>
        <ProductDetail product={product} />
      </Suspense>
    </section>
  );
}
