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
    return <p>Falta `pos` para cargar el producto.</p>;
  }

  const product = await getProduct(id, pos);

  return (
    <section className="space-y-4">
      <Link href={buildPosPath('/', pos, search)} className="text-sm font-semibold text-stone-500">
        Volver al catalogo
      </Link>
      <Suspense fallback={<div className="rounded-[2rem] border border-border bg-card p-4 shadow-card">Cargando producto...</div>}>
        <ProductDetail product={product} />
      </Suspense>
    </section>
  );
}
