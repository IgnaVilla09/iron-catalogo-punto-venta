'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { Toaster, toast } from 'sonner';
import { CatalogProduct } from '@/lib/types';
import { CATALOG_WHATSAPP } from '@/lib/config';
import { buildPosPath, formatPrice, getWhatsappMessageUrl } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';
import { ProductImageViewer } from '@/components/product-image-viewer';
import { QuantityStepper } from '@/components/quantity-stepper';

export function ProductDetail({ product }: { product: CatalogProduct }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pos = searchParams.get('pos');
  const search = searchParams.get('search');
  const addItem = useCartStore((state) => state.addItem);

  const colors = useMemo(
    () => Array.from(new Map(product.variants.map((variant) => [variant.color.id, variant.color])).values()),
    [product.variants]
  );
  const [selectedColorId, setSelectedColorId] = useState(colors[0]?.id ?? '');
  const [selectedSizeId, setSelectedSizeId] = useState(product.variants[0]?.size.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const sizes = product.variants.filter((item) => item.color.id === selectedColorId);
  const variant = sizes.find((item) => item.size.id === selectedSizeId);

  function handleColorChange(colorId: string) {
    setSelectedColorId(colorId);
    setSelectedSizeId(product.variants.find((item) => item.color.id === colorId)?.size.id ?? '');
    setQuantity(1);
  }

  function commitAdd() {
    if (!variant || variant.stock < 1 || !pos) return false;
    addItem({
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      variantId: variant.id,
      colorLabel: variant.color.label,
      sizeLabel: variant.size.label,
      quantity: Math.min(quantity, variant.stock),
      stock: variant.stock,
    });
    toast.success('Producto agregado al carrito');
    return true;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
      <Toaster position="bottom-center" richColors closeButton />
      <ProductImageViewer imageUrl={product.imageUrl} name={product.name} />

      <div className="lg:py-4">
        <p className="text-sm font-bold text-muted">{product.category?.label ?? 'Iron Threads'}</p>
        <h1 className="mt-2 text-5xl font-bold sm:text-6xl">{product.name}</h1>
        <p className="mt-4 text-2xl font-extrabold">{formatPrice(product.price)}</p>

        {variant ? (
          <div className="mt-8 space-y-7 border-t border-border pt-7">
            <div>
              <p id="color-label" className="mb-3 text-sm font-bold">Color: <span className="font-medium text-muted">{variant.color.label}</span></p>
              <RadioGroup.Root value={selectedColorId} onValueChange={handleColorChange} aria-labelledby="color-label" className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <RadioGroup.Item key={color.id} value={color.id} aria-label={color.label} className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-white px-3 text-sm font-semibold transition-colors hover:border-foreground data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-white">
                    {color.hex ? <span aria-hidden="true" className="h-5 w-5 rounded-full border border-black/20" style={{ backgroundColor: color.hex }} /> : null}
                    {color.label}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
            </div>

            <div>
              <p id="size-label" className="mb-3 text-sm font-bold">Talle: <span className="font-medium text-muted">{variant.size.label}</span></p>
              <RadioGroup.Root value={selectedSizeId} onValueChange={(sizeId) => { setSelectedSizeId(sizeId); setQuantity(1); }} aria-labelledby="size-label" className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <RadioGroup.Item key={item.id} value={item.size.id} disabled={item.stock < 1} className="flex h-12 min-w-12 items-center justify-center rounded-lg border border-border bg-white px-3 text-sm font-bold transition-colors hover:border-foreground data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-white disabled:cursor-not-allowed disabled:opacity-40">
                    {item.size.label}
                  </RadioGroup.Item>
                ))}
              </RadioGroup.Root>
              <a href={getWhatsappMessageUrl(CATALOG_WHATSAPP, `Hola! Quiero consultar por otros talles de ${product.name} en ${variant.color.label}.`)} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#007b90] underline underline-offset-4">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Consultar por otros talles
              </a>
            </div>

            <div className="flex items-center justify-between border-y border-border py-4 text-sm">
              <span className="font-bold">Disponibilidad</span>
              <span className="text-muted">{variant.stock > 0 ? `${variant.stock} disponibles` : 'Sin stock'}</span>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold">Cantidad</p>
              <QuantityStepper label={`cantidad de ${product.name}`} value={Math.min(quantity, Math.max(variant.stock, 1))} max={variant.stock} onChange={setQuantity} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={commitAdd} disabled={!pos || variant.stock < 1} className="button-outline w-full"><ShoppingBag className="h-4 w-4" />Agregar al carrito</button>
              <button type="button" onClick={() => { if (commitAdd()) router.push(buildPosPath('/checkout', pos, search)); }} disabled={!pos || variant.stock < 1} className="button-accent w-full">Comprar ahora</button>
            </div>
          </div>
        ) : <p className="mt-8 border-t border-border pt-6 text-sm text-muted">Este producto no tiene variantes disponibles por ahora.</p>}
      </div>
    </div>
  );
}
