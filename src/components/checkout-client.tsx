'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createOrder } from '@/lib/api';
import { formatPrice, getCartTotal } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

export function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const items = useCartStore((state) => state.items);
  const clear = useCartStore((state) => state.clear);
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
      router.push(`/confirmation/${order.id}?pos=${encodeURIComponent(pos)}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo generar el pedido');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <p className="rounded-[2rem] border border-border bg-card p-6 shadow-card">Agrega productos antes de finalizar la compra.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-[2rem] border border-border bg-card p-4 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-semibold">Metodo de pago</p>
            <p className="text-sm text-stone-600">Mercado Pago/Transferencia</p>
          </div>
          <p className="font-bold text-accent">{formatPrice(getCartTotal(items))}</p>
        </div>

        <div className="grid gap-3">
          <input required name="firstName" placeholder="Nombre" className="rounded-2xl border border-border px-4 py-3" />
          <input required name="lastName" placeholder="Apellido" className="rounded-2xl border border-border px-4 py-3" />
          <input required name="phone" placeholder="Telefono" className="rounded-2xl border border-border px-4 py-3" />
          <textarea name="notes" placeholder="Notas (opcional)" rows={4} className="rounded-2xl border border-border px-4 py-3" />
        </div>
      </div>

      <div className="rounded-[2rem] border border-emerald-300 bg-emerald-600 p-4 text-white shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Datos de transferencia</p>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="font-semibold text-emerald-100">Alias:</span>{' '}
            <span className="font-bold">iront.cf</span>
          </p>
          <p>
            <span className="font-semibold text-emerald-100">Titular:</span>{' '}
            <span className="font-medium">Augusto Lucas Villafañe Palma</span>
          </p>
          <p>
            <span className="font-semibold text-emerald-100">Cuenta:</span>{' '}
            <span className="font-medium">Mercado Pago</span>
          </p>
        </div>
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <button disabled={loading} className="w-full rounded-2xl bg-accent px-4 py-3 font-semibold text-white disabled:opacity-70">
        {loading ? 'Generando pedido...' : 'Confirmar pedido'}
      </button>
    </form>
  );
}
