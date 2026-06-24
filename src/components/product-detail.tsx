'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { CatalogProduct } from '@/lib/types';
import { CATALOG_WHATSAPP } from '@/lib/config';
import { buildPosPath, cn, formatPrice, getWhatsappMessageUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { ImagePlaceholder } from '@/components/image-placeholder';

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const addItem = useCartStore((state) => state.addItem);
  const whatsapp = CATALOG_WHATSAPP;

  const colors = useMemo(
    () => Array.from(new Map(product.variants.map((variant) => [variant.color.id, variant.color])).values()),
    [product.variants]
  );
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id ?? '');

  const sizes = useMemo(
    () => product.variants.filter((variant) => variant.color.id === selectedColorId).map((variant) => variant.size),
    [product.variants, selectedColorId]
  );
  const [selectedSizeId, setSelectedSizeId] = useState(() => {
    const first = product.variants.find((variant) => variant.color.id === colors[0]?.id);
    return first?.size.id ?? '';
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const currentColorVariants = product.variants.filter((item) => item.color.id === selectedColorId);
    const selectedStillValid = currentColorVariants.some((item) => item.size.id === selectedSizeId);

    if (!selectedStillValid && currentColorVariants[0]) {
      setSelectedSizeId(currentColorVariants[0].size.id);
      setQuantity(1);
    }
  }, [product.variants, selectedColorId, selectedSizeId]);

  const variant = product.variants.find(
    (item) => item.color.id === selectedColorId && item.size.id === selectedSizeId
  ) ?? product.variants[0];

  if (!variant) {
    return null;
  }

  const commitAdd = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      variantId: variant.id,
      colorLabel: variant.color.label,
      sizeLabel: variant.size.label,
      quantity,
      stock: variant.stock,
    });
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-card">
        <div className="aspect-square bg-stone-100">
          <ImagePlaceholder imageUrl={product.imageUrl} alt={product.name} />
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">{product.category?.label ?? 'Catalogo'}</p>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-xl font-bold text-accent">{formatPrice(product.price)}</p>
      </div>

      <section className="space-y-3 rounded-[2rem] border border-border bg-card p-4 shadow-card">
        <div>
          <p className="mb-2 text-sm font-semibold">Color</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColorId(color.id)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium',
                  selectedColorId === color.id ? 'border-accent bg-accent text-white' : 'border-border bg-white'
                )}
              >
                {color.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold">Talle</p>
          <div className="flex flex-wrap gap-2">
            {product.variants
              .filter((item) => item.color.id === selectedColorId)
              .map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedSizeId(item.size.id)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium',
                    selectedSizeId === item.size.id ? 'border-accent bg-accent text-white' : 'border-border bg-white'
                  )}
                >
                  {item.size.label}
                </button>
              ))}
          </div>
          <a
            href={getWhatsappMessageUrl(
              whatsapp,
              `Hola! Quiero consultar por otros talles de ${product.name} en ${colors.find((color) => color.id === selectedColorId)?.label ?? 'este color'}.`
            )}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-accentSoft px-4 py-2 text-sm font-semibold text-accent"
          >
            <MessageCircle className="h-4 w-4" />
            Consultar por otros talles
          </a>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-accentSoft px-4 py-3 text-sm">
          <span>Stock disponible</span>
          <strong>{variant.stock}</strong>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="quantity">Cantidad</label>
          <input
            id="quantity"
            type="number"
            min={1}
            max={variant.stock}
            value={quantity}
            onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value) || 1, variant.stock)))}
            className="w-full rounded-2xl border border-border bg-white px-4 py-3"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={commitAdd}
            className="rounded-2xl border border-accent bg-white px-4 py-3 font-semibold text-accent"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={() => {
              commitAdd();
              router.push(buildPosPath('/checkout', pos));
            }}
            className="rounded-2xl bg-accent px-4 py-3 font-semibold text-white"
          >
            Comprar ahora
          </button>
        </div>
      </section>
    </div>
  );
}
