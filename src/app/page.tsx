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
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center shadow-card">
        <p className="text-lg font-semibold">Falta el punto de venta</p>
        <p className="mt-2 text-sm text-stone-600">Abrir el catalogo con `?pos=...` para cargar los productos.</p>
      </div>
    );
  }

  const [{ products, meta }, pointOfSaleLabel] = await Promise.all([
    getProductsPage(pos, 1, undefined, search),
    resolvePointOfSaleLabel(pos),
  ]);

  return (
    <section className="flex flex-col overflow-hidden">
      <div className="shrink-0 pb-4">
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-stone-500">
          <MapPin className="h-4 w-4" />
          Catalogo {pointOfSaleLabel ?? pos.toUpperCase()}
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Productos disponibles</h1>
          <SearchBarWrapper pos={pos} initialValue={search} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center shadow-card">
          {search ? `No se encontraron resultados para "${search}".` : 'No hay productos con stock para este punto de venta.'}
        </div>
      ) : (
        <ProductFeed initialProducts={products} initialMeta={meta} pos={pos} search={search} />
      )}
    </section>
  );
}
