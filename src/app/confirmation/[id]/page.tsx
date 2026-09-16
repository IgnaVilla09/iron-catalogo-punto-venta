import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getOrder } from '@/lib/api';
import { CATALOG_WHATSAPP } from '@/lib/config';
import { buildPosPath, formatPrice, getWhatsappUrl } from '@/lib/utils';
import { buildCatalogMetadata } from '@/lib/catalog-metadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ pos?: string }>;
}) {
  const { pos } = await searchParams;
  return buildCatalogMetadata(pos);
}

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pos?: string }>;
}) {
  const [{ id }, { pos }] = await Promise.all([params, searchParams]);
  const order = await getOrder(id);
  const whatsapp = CATALOG_WHATSAPP;

  return (
    <section className="fixed inset-0 z-20 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-sm rounded-[2rem] border border-border bg-card p-6 shadow-card">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Pedido confirmado</p>
        <h1 className="mt-2 text-2xl font-bold">Gracias por tu compra</h1>
        <p className="mt-3 text-sm text-stone-600">
          Envia el comprobante a WhatsApp{' '}
          <a
            href={getWhatsappUrl(whatsapp, pos ?? '', order.items)}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent"
          >
            {whatsapp}
          </a>
          .
        </p>
        <div className="mt-4 rounded-2xl bg-accentSoft px-4 py-3">
          <p className="text-sm">Total</p>
          <p className="text-xl font-bold text-accent">{formatPrice(order.total)}</p>
        </div>

        <a
          href={getWhatsappUrl(whatsapp, pos ?? '', order.items)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Enviar comprobante
        </a>

        <Link href={buildPosPath('/', pos)} className="mt-3 flex w-full items-center justify-center rounded-2xl border border-border bg-white px-4 py-3 font-semibold text-accent">
          LISTO
        </Link>
      </div>
    </section>
  );
}
