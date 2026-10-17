import { ApiResponse, CatalogListProduct, CatalogOrder, PaginationMeta } from '@/lib/types';

export const PRODUCTS_PAGE_SIZE = 20;

async function request<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`/api/catalog${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await response.json()) as ApiResponse<T> & { message?: string };

  if (!response.ok || !payload.success) {
    throw new Error(payload.error?.message || payload.message || 'No se pudo completar la solicitud');
  }

  return payload;
}

export async function getProductsPage(pointOfSaleId: string, page = 1, limit = PRODUCTS_PAGE_SIZE, search?: string): Promise<{
  products: CatalogListProduct[];
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

  const payload = await request<CatalogListProduct[]>(`/products?${params.toString()}`);

  return {
    products: payload.data.map((product) => ({
      ...product,
      isOnSale: product.isOnSale ?? false,
    })),
    meta: payload.meta ?? {
      page,
      limit,
      total: payload.data.length,
      totalPages: payload.data.length === 0 ? 0 : 1,
    },
  };
}

export async function validateDiscountCode(couponCode: string, subtotal: number) {
  const payload = await request<{ code: string; discountAmount: number }>('/discount-codes/validate', {
    method: 'POST',
    body: JSON.stringify({ couponCode, subtotal }),
  });
  return payload.data;
}

export async function createOrder(input: {
  pointOfSaleId: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  notes?: string;
  couponCode?: string;
  items: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
}) {
  const payload = await request<CatalogOrder>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      ...input,
      paymentMethod: 'MERCADO_PAGO',
    }),
  });

  return payload.data;
}
