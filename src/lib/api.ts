import { ApiResponse, CatalogOrder, CatalogProduct, PaginationMeta } from '@/lib/types';

export const PRODUCTS_PAGE_SIZE = 20;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function getApiUrl() {
  if (!apiUrl) {
    throw new Error('Missing NEXT_PUBLIC_API_URL');
  }

  return apiUrl;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
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

  return payload;
}

export async function getProducts(pointOfSaleId: string) {
  const payload = await request<CatalogProduct[]>(`/api/v1/catalog/public/products?pointOfSaleId=${encodeURIComponent(pointOfSaleId)}`);
  return payload.data;
}

export async function getProductsPage(pointOfSaleId: string, page = 1, limit = PRODUCTS_PAGE_SIZE, search?: string): Promise<{
  products: CatalogProduct[];
  meta: PaginationMeta;
}> {
  const params = new URLSearchParams({
    pointOfSaleId,
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.set('search', search);
  }

  const payload = await request<CatalogProduct[]>(
    `/api/v1/catalog/public/products?${params.toString()}`
  );

  return {
    products: payload.data,
    meta: payload.meta ?? {
      page,
      limit,
      total: payload.data.length,
      totalPages: payload.data.length === 0 ? 0 : 1,
    },
  };
}

export async function getProduct(id: string, pointOfSaleId: string) {
  const payload = await request<CatalogProduct>(`/api/v1/catalog/public/products/${id}?pointOfSaleId=${encodeURIComponent(pointOfSaleId)}`);
  return payload.data;
}

export async function getOrder(id: string) {
  const payload = await request<CatalogOrder>(`/api/v1/catalog/public/orders/${id}`);
  return payload.data;
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
  const payload = await request<CatalogOrder>('/api/v1/catalog/public/orders', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      paymentMethod: 'MERCADO_PAGO',
    }),
  });

  return payload.data;
}
