import { MapPin } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { getProducts } from '@/lib/api';
import { buildCatalogMetadata, resolvePointOfSaleLabel } from '@/lib/catalog-metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string }>;
}) {
  const { pos } = await searchParams;
  return buildCatalogMetadata(pos);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string }>;
}) {
  const { pos } = await searchParams;

  if (!pos) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center shadow-card">
        <p className="text-lg font-semibold">Falta el punto de venta</p>
        <p className="mt-2 text-sm text-stone-600">Abrir el catalogo con `?pos=...` para cargar los productos.</p>
      </div>
    );
  }

  const [products, pointOfSaleLabel] = await Promise.all([
    getProducts(pos),
    resolvePointOfSaleLabel(pos),
  ]);

  return (
    <section className="space-y-4">
      <div>
        <p className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-stone-500">
          <MapPin className="h-4 w-4" />
          Catalogo {pointOfSaleLabel ?? pos.toUpperCase()}
        </p>
        <h1 className="text-2xl font-bold">Productos disponibles</h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center shadow-card">
          No hay productos con stock para este punto de venta.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} pos={pos} />
          ))}
        </div>
      )}
    </section>
  );
}
