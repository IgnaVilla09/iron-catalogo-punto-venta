import { MapPin } from 'lucide-react';
import { ProductFeed } from '@/components/product-feed';
import { SearchBarWrapper } from '@/components/search-bar-wrapper';
import { getProductsPage } from '@/lib/api';
import { buildCatalogMetadata, resolvePointOfSaleLabel } from '@/lib/catalog-metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string; search?: string }>;
}) {
  const { pos, search } = await searchParams;
  return buildCatalogMetadata(pos, search);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string; search?: string }>;
}) {
  const { pos, search } = await searchParams;

  if (!pos) {
    return (
      <div className="mx-auto w-full max-w-xl border border-border bg-card p-8 text-center">
        <h1 className="text-4xl font-bold">Falta el punto de venta</h1>
        <p className="mt-3 text-sm text-muted">Abrí el catálogo desde el enlace de tu punto de venta para ver los productos.</p>
      </div>
    );
  }

  const [{ products, meta }, pointOfSaleLabel] = await Promise.all([
    getProductsPage(pos, 1, undefined, search),
    resolvePointOfSaleLabel(pos),
  ]);

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border pb-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-muted">
          <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
          {pointOfSaleLabel ?? pos.toUpperCase()}
        </p>
        <div className="mt-3 flex items-end justify-between gap-3">
          <h1 className="text-[2.75rem] font-bold leading-none sm:text-6xl">Productos disponibles</h1>
          <SearchBarWrapper initialValue={search} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 border border-border bg-white px-6 py-12 text-center">
          <h2 className="text-3xl font-semibold">{search ? 'No encontramos coincidencias' : 'Todavía no hay productos'}</h2>
          <p className="mt-3 text-sm text-muted">{search ? `Probá con otro nombre para «${search}».` : 'Volvé más tarde para descubrir las novedades de este punto de venta.'}</p>
        </div>
      ) : (
        <ProductFeed key={`${pos}:${search ?? ''}`} initialProducts={products} initialMeta={meta} pos={pos} search={search} />
      )}
    </section>
  );
}
