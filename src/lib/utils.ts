import { CartItem, CatalogOrderItem } from '@/lib/types';

export function formatPrice(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function buildPosPath(path: string, pos?: string | null) {
  if (!pos) {
    return path;
  }

  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}pos=${encodeURIComponent(pos)}`;
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getWhatsappUrl(phone: string, pos: string, items: CatalogOrderItem[]) {
  const productNames = items.map((item) => item.productNameSnapshot).join(', ');
  const text = encodeURIComponent(`Hola, estoy en el punto de venta ${pos} para enviarte el comprobante de ${productNames}.`);
  return `https://wa.me/${phone}?text=${text}`;
}

export function getWhatsappMessageUrl(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
