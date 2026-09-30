'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { ImagePlaceholder } from '@/components/image-placeholder';
import { QuantityStepper } from '@/components/quantity-stepper';
import { useCartStore } from '@/stores/cart-store';
import { useHydrated } from '@/stores/use-hydrated';
import { buildPosPath, formatPrice, getCartTotal } from '@/lib/utils';

export function CartClient() {
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const search = searchParams.get('search');
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const hydrated = useHydrated();

  if (!hydrated) {
    return <div className="border border-border bg-white p-6 text-sm text-muted">Cargando carrito...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center border border-border bg-white px-6 py-12 text-center">
        <ShoppingBag className="h-10 w-10 text-accent" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mt-5 text-4xl font-bold">Tu carrito está vacío</h2>
        <p className="mt-3 text-sm text-muted">Elegí tus productos y volvé cuando estés listo para comprar.</p>
        <Link href={buildPosPath('/', pos, search)} className="button-accent mt-6">Ver productos</Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="space-y-3">
        {items.map((item) => (
          <article key={item.variantId} className="flex gap-3 border border-border bg-white p-3 sm:gap-5 sm:p-4">
            <div className="h-32 w-24 shrink-0 overflow-hidden bg-[#e4e9e8] sm:h-40 sm:w-32">
              <ImagePlaceholder imageUrl={item.imageUrl} alt={item.productName} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold sm:text-3xl">{item.productName}</h2>
                <p className="mt-1 text-sm text-muted">{item.colorLabel} / {item.sizeLabel}</p>
                <p className="mt-2 text-sm font-extrabold">{formatPrice(item.price)}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <QuantityStepper label={`cantidad de ${item.productName}, talle ${item.sizeLabel}`} value={item.quantity} max={item.stock} onChange={(value) => updateQuantity(item.variantId, value)} />
                <button type="button" onClick={() => removeItem(item.variantId)} aria-label={`Quitar ${item.productName}, talle ${item.sizeLabel}`} className="flex min-h-11 items-center gap-1 text-xs font-bold text-muted hover:text-red-700"><Trash2 className="h-4 w-4" /> Quitar</button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="border border-border bg-white p-5 lg:sticky lg:top-4">
        <h2 className="text-3xl font-bold">Resumen del pedido</h2>
        <div className="mt-5 flex justify-between border-t border-border pt-5 text-sm"><span className="text-muted">Productos ({items.reduce((sum, item) => sum + item.quantity, 0)})</span><span>{formatPrice(getCartTotal(items))}</span></div>
        <div className="mt-5 flex justify-between border-t border-border pt-5 text-lg font-extrabold"><span>Total</span><span>{formatPrice(getCartTotal(items))}</span></div>
        <Link href={buildPosPath('/checkout', pos, search)} className="button-accent mt-6 w-full">Continuar compra</Link>
        <Link href={buildPosPath('/', pos, search)} className="mt-4 block text-center text-sm font-bold text-muted underline underline-offset-4">Seguir viendo productos</Link>
      </aside>
    </div>
  );
}
