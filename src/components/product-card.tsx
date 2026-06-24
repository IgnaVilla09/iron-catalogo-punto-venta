import Link from 'next/link';
import { CatalogProduct } from '@/lib/types';
import { buildPosPath, formatPrice } from '@/lib/utils';
import { ImagePlaceholder } from '@/components/image-placeholder';

export function ProductCard({ product, pos }: { product: CatalogProduct; pos: string }) {
  return (
    <Link href={buildPosPath(`/product/${product.id}`, pos)} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
      <div className="aspect-square bg-stone-100">
        <ImagePlaceholder imageUrl={product.imageUrl} alt={product.name} />
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 min-h-10 text-sm font-semibold">{product.name}</p>
        <p className="text-sm font-bold text-accent">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
