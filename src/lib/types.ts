export interface CatalogColor {
  id: string;
  name: string;
  label: string;
  hex: string | null;
}

export interface CatalogSize {
  id: string;
  name: string;
  label: string;
}

export interface CatalogVariant {
  id: string;
  color: CatalogColor;
  size: CatalogSize;
  stock: number;
}

export interface CatalogProduct {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number;
  category: {
    id: string;
    name: string;
    label: string;
  } | null;
  variants: CatalogVariant[];
}

export interface CatalogOrderItem {
  id: string;
  productId: string;
  variantId: string;
  productNameSnapshot: string;
  colorNameSnapshot: string;
  sizeNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
}

export interface CatalogOrder {
  id: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  paymentMethod: 'MERCADO_PAGO';
  status: string;
  total: number;
  notes: string | null;
  items: CatalogOrderItem[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface CartItem {
  productId: string;
  productName: string;
  imageUrl: string | null;
  price: number;
  variantId: string;
  colorLabel: string;
  sizeLabel: string;
  quantity: number;
  stock: number;
}
