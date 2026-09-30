import Link from 'next/link';
import { memo } from 'react';
import { CatalogListProduct } from '@/lib/types';
import { buildPosPath, formatPrice } from '@/lib/utils';
import { ImagePlaceholder } from '@/components/image-placeholder';

export const ProductCard = memo(function ProductCard({ product, pos, search, priority = false }: { product: CatalogListProduct; pos: string; search?: string; priority?: boolean }) {
  return (
    <Link href={buildPosPath(`/product/${product.id}`, pos, search)} prefetch={false} className="group min-w-0 bg-white focus-visible:outline-offset-2">
      <div className="aspect-[4/5] overflow-hidden bg-[#e4e9e8]">
        <ImagePlaceholder imageUrl={product.imageUrl} alt={product.name} priority={priority} />
      </div>
      <div className="border-x border-b border-border px-3 py-3 sm:px-4 sm:py-4">
        {product.category ? <p className="mb-1 text-xs font-semibold text-muted">{product.category.label}</p> : null}
        <h2 className="line-clamp-2 min-h-10 text-base font-semibold leading-5 group-hover:text-[#007b90] sm:text-lg">{product.name}</h2>
        <p className="mt-2 text-sm font-extrabold sm:text-base">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
});
