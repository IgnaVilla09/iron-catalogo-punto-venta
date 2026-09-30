'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Copy } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { createOrder } from '@/lib/api';
import { buildPosPath, formatPrice, getCartTotal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { useHydrated } from '@/stores/use-hydrated';

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const search = searchParams.get('search');
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
  const hydrated = useHydrated();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!pos) {
      setError('Falta el punto de venta. Volve al catalogo desde un link con pos.');
      return;
    }

    if (items.length === 0) {
      setError('El carrito esta vacio.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const order = await createOrder({
        pointOfSaleId: pos,
        customerFirstName: String(formData.get('firstName') || ''),
        customerLastName: String(formData.get('lastName') || ''),
        customerPhone: String(formData.get('phone') || ''),
        notes: String(formData.get('notes') || ''),
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      clear();
      router.push(buildPosPath(`/confirmation/${order.id}`, pos, search));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo generar el pedido');
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="border border-border bg-white p-6 text-sm text-muted">Cargando compra...</div>;
  }

  if (items.length === 0) {
    return <div className="border border-border bg-white p-8"><p className="text-sm text-muted">Agregá productos antes de finalizar la compra.</p><Link href={buildPosPath('/', pos, search)} className="button-accent mt-5">Ver productos</Link></div>;
  }

  return (
    <>
      <Toaster position="bottom-center" richColors closeButton />
      <form onSubmit={handleSubmit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
      <div className="space-y-6">
        <div className="border border-border bg-white p-5 sm:p-7">
          <h2 className="text-3xl font-bold">Tus datos</h2>
          <p className="mt-2 text-sm text-muted">Los usaremos para identificar tu pedido.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold">Nombre<input required name="firstName" autoComplete="given-name" className="field" /></label>
            <label className="space-y-2 text-sm font-bold">Apellido<input required name="lastName" autoComplete="family-name" className="field" /></label>
            <label className="space-y-2 text-sm font-bold sm:col-span-2">Teléfono<input required name="phone" type="tel" autoComplete="tel" className="field" /></label>
            <label className="space-y-2 text-sm font-bold sm:col-span-2">Notas <span className="font-normal text-muted">(opcional)</span><textarea name="notes" rows={3} className="field resize-y" placeholder="Algo que debamos saber sobre tu pedido" /></label>
          </div>
        </div>

        <div className="border border-border bg-white p-5 sm:p-7">
          <h2 className="text-3xl font-bold">Transferencia</h2>
          <p className="mt-2 text-sm text-muted">Pagá por Mercado Pago y enviá el comprobante por WhatsApp después de confirmar el pedido.</p>
          <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
            <div className="flex items-center justify-between gap-2 py-3"><dt className="text-muted">Alias</dt><dd className="flex items-center gap-2 font-extrabold">iront.cf<button type="button" onClick={async () => { try { await navigator.clipboard.writeText('iront.cf'); toast.success('Alias copiado'); } catch { toast.error('No se pudo copiar el alias'); } }} aria-label="Copiar alias iront.cf" className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-background"><Copy className="h-4 w-4" /></button></dd></div>
            <div className="flex justify-between gap-3 py-3"><dt className="shrink-0 text-muted">Titular</dt><dd className="text-right font-bold">Augusto Lucas Villafañe Palma</dd></div>
            <div className="flex justify-between gap-3 py-3"><dt className="text-muted">Cuenta</dt><dd className="font-bold">Mercado Pago</dd></div>
          </dl>
        </div>
      </div>

      <aside className="border border-border bg-white p-5 lg:sticky lg:top-4">
        <h2 className="text-3xl font-bold">Tu pedido</h2>
        <div className="mt-5 space-y-3 border-y border-border py-5 text-sm">
          {items.map((item) => <div key={item.variantId} className="flex justify-between gap-4"><span className="text-muted">{item.quantity} × {item.productName} · {item.sizeLabel}</span><span className="shrink-0 font-bold">{formatPrice(item.price * item.quantity)}</span></div>)}
        </div>
        <div className="mt-5 flex items-center justify-between text-lg font-extrabold"><span>Total</span><span>{formatPrice(getCartTotal(items))}</span></div>
        {error ? <p role="alert" className="mt-5 border-l-4 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p> : null}
        <button type="submit" disabled={loading} className="button-accent mt-6 w-full">{loading ? 'Generando pedido...' : 'Confirmar pedido'}</button>
        <p className="mt-4 text-xs leading-5 text-muted">Al confirmar, guardaremos tu pedido. Después podrás enviar el comprobante por WhatsApp.</p>
      </aside>
      </form>
    </>
  );
}
