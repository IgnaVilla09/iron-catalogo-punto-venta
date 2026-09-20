import type { Metadata } from 'next';

function fallbackPointOfSaleLabel(pos?: string) {
  return pos ? pos.toUpperCase() : 'Catalogo';
}

export async function resolvePointOfSaleLabel(pos?: string) {
  return pos ? fallbackPointOfSaleLabel(pos) : null;
}

export async function buildCatalogMetadata(pos?: string, search?: string): Promise<Metadata> {
  const label = await resolvePointOfSaleLabel(pos);
  const suffix = label ?? 'Catalogo';
  const searchSuffix = search ? ` - "${search}"` : '';

  return {
    title: `Iron Threads - ${suffix}${searchSuffix}`,
    description: label ? `Catalogo ${label}` : 'Catalogo publico de productos',
  };
}
