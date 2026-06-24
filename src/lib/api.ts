import { ApiResponse, CatalogOrder, CatalogProduct } from '@/lib/types';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  return apiUrl;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const payload = (await response.json()) as ApiResponse<T> & { message?: string };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || payload.message || 'No se pudo completar la solicitud');
  }

  return payload.data;
}

export async function getProducts(pointOfSaleId: string) {
  return request<CatalogProduct[]>(`/api/v1/catalog/public/products?pointOfSaleId=${encodeURIComponent(pointOfSaleId)}`);
}

export async function getProduct(id: string, pointOfSaleId: string) {
  return request<CatalogProduct>(`/api/v1/catalog/public/products/${id}?pointOfSaleId=${encodeURIComponent(pointOfSaleId)}`);
}

export async function getOrder(id: string) {
  return request<CatalogOrder>(`/api/v1/catalog/public/orders/${id}`);
}

export async function createOrder(input: {
  pointOfSaleId: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  notes?: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
}) {
  return request<CatalogOrder>('/api/v1/catalog/public/orders', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      paymentMethod: 'MERCADO_PAGO',
    }),
  });
}
