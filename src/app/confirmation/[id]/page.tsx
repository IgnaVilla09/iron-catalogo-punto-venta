import Link from 'next/link';
import { Check, MessageCircle } from 'lucide-react';
import { getOrder } from '@/lib/api';
import { CATALOG_WHATSAPP } from '@/lib/config';
import { buildPosPath, formatPrice, getWhatsappUrl } from '@/lib/utils';
import { buildCatalogMetadata } from '@/lib/catalog-metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ pos?: string }> }) {
  const { pos } = await searchParams;
  return buildCatalogMetadata(pos);
}

export default async function ConfirmationPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pos?: string; search?: string }>;
}) {
  const [{ id }, { pos, search }] = await Promise.all([params, searchParams]);
  const order = await getOrder(id);

  return (
    <section className="mx-auto w-full max-w-2xl py-4 sm:py-10">
      <div className="border border-border bg-white p-6 sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accentSoft text-[#007b90]"><Check className="h-7 w-7" aria-hidden="true" /></div>
        <h1 className="mt-6 text-5xl font-bold sm:text-6xl">Pedido confirmado</h1>
        <p className="mt-4 max-w-prose text-sm leading-6 text-muted">Gracias por tu compra. Transferí el total y enviá el comprobante por WhatsApp para completar el proceso.</p>
        <div className="mt-8 border-y border-border py-5">
          <p className="text-sm font-semibold text-muted">Total del pedido</p>
          <p className="mt-1 text-3xl font-extrabold">{formatPrice(order.total)}</p>
          <p className="mt-2 break-all text-xs text-muted">Pedido {order.id}</p>
        </div>
        <a href={getWhatsappUrl(CATALOG_WHATSAPP, pos ?? '', order.items)} target="_blank" rel="noopener noreferrer" className="button-accent mt-8 w-full"><MessageCircle className="h-5 w-5" aria-hidden="true" />Enviar comprobante</a>
        <Link href={buildPosPath('/', pos, search)} className="button-outline mt-3 w-full">Volver al catálogo</Link>
      </div>
    </section>
  );
}
