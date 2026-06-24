'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ImagePlaceholder } from '@/components/image-placeholder';
import { useCartStore } from '@/stores/cart-store';
import { buildPosPath, formatPrice, getCartTotal } from '@/lib/utils';

export function CartClient() {
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-border bg-card p-6 text-center shadow-card">
        <p className="mb-3 text-lg font-semibold">Tu carrito esta vacio</p>
        <Link href={buildPosPath('/', pos)} className="inline-flex rounded-full bg-accent px-5 py-3 font-semibold text-white">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.variantId} className="flex gap-3 rounded-[2rem] border border-border bg-card p-3 shadow-card">
          <div className="h-24 w-24 overflow-hidden rounded-2xl bg-stone-100">
            <ImagePlaceholder imageUrl={item.imageUrl} alt={item.productName} />
          </div>
          <div className="flex-1 space-y-2">
            <div>
              <p className="font-semibold">{item.productName}</p>
              <p className="text-sm text-stone-600">{item.colorLabel} / {item.sizeLabel}</p>
              <p className="text-sm font-bold text-accent">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(event) => updateQuantity(item.variantId, Number(event.target.value) || 1)}
                className="w-20 rounded-xl border border-border px-3 py-2"
              />
              <button type="button" onClick={() => removeItem(item.variantId)} className="text-sm font-semibold text-stone-500">
                Quitar
              </button>
            </div>
          </div>
        </article>
      ))}

      <div className="rounded-[2rem] border border-border bg-card p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(getCartTotal(items))}</span>
        </div>
        <Link href={buildPosPath('/checkout', pos)} className="flex w-full items-center justify-center rounded-2xl bg-accent px-4 py-3 font-semibold text-white">
          Continuar compra
        </Link>
      </div>
    </div>
  );
}
