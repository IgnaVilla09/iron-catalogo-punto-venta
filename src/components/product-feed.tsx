'use client';

import { useEffect, useRef, useState } from 'react';
import { getProductsPage, PRODUCTS_PAGE_SIZE } from '@/lib/api';
import { CatalogProduct, PaginationMeta } from '@/lib/types';
import { ProductCard } from '@/components/product-card';

const REFRESH_INTERVAL_MS = 10000;

function mergeProducts(current: CatalogProduct[], incoming: CatalogProduct[]) {
  const seen = new Set(current.map((product) => product.id));
  return [...current, ...incoming.filter((product) => !seen.has(product.id))];
}

function mergeLatestProducts(current: CatalogProduct[], latest: CatalogProduct[]) {
  const latestIds = new Set(latest.map((product) => product.id));
  return [...latest, ...current.filter((product) => !latestIds.has(product.id))];
}

export function ProductFeed({
  initialProducts,
  initialMeta,
  pos,
}: {
  initialProducts: CatalogProduct[];
  initialMeta: PaginationMeta;
  pos: string;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isEndVisible, setIsEndVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const refreshingRef = useRef(false);
  const metaRef = useRef(initialMeta);

  const hasMore = meta.page < meta.totalPages;

  async function refreshLatestProducts(showError = false) {
    if (loadingRef.current || refreshingRef.current) {
      return;
    }

    refreshingRef.current = true;
    setRefreshing(true);

    try {
      const latest = await getProductsPage(pos, 1, PRODUCTS_PAGE_SIZE);
      setProducts((current) => mergeLatestProducts(current, latest.products));
      setMeta((current) => ({
        ...current,
        total: latest.meta.total,
        totalPages: latest.meta.totalPages,
      }));
    } catch (loadError) {
      if (showError) {
        setError(loadError instanceof Error ? loadError.message : 'No se pudieron buscar productos nuevos');
      }
    } finally {
      refreshingRef.current = false;
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    refreshingRef.current = refreshing;
  }, [refreshing]);

  useEffect(() => {
    metaRef.current = meta;
  }, [meta]);

  useEffect(() => {
    function handleFocus() {
      void refreshLatestProducts();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        void refreshLatestProducts();
      }
    }

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pos]);

  useEffect(() => {
    const node = endRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setIsEndVisible(Boolean(entries[0]?.isIntersecting));
      },
      { rootMargin: '120px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isEndVisible || hasMore) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshLatestProducts();
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [hasMore, isEndVisible, pos]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          if (loadingRef.current) {
            return;
          }

          const currentMeta = metaRef.current;
          if (currentMeta.page >= currentMeta.totalPages) {
            return;
          }

          loadingRef.current = true;
          setLoading(true);
          setError(null);

          const nextPage = currentMeta.page + 1;
          getProductsPage(pos, nextPage, PRODUCTS_PAGE_SIZE)
            .then((next) => {
              setProducts((current) => mergeProducts(current, next.products));
              setMeta(next.meta);
            })
            .catch((loadError) => {
              setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar mas productos');
            })
            .finally(() => {
              loadingRef.current = false;
              setLoading(false);
            });
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, pos]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} pos={pos} />
        ))}
      </div>

      <div className="rounded-[2rem] border border-border bg-card px-4 py-3 text-center text-sm text-stone-600 shadow-card">
        {loading
          ? 'Cargando mas productos...'
          : hasMore
            ? `Mostrando ${products.length} de ${meta.total} productos`
            : `Se muestran los ${products.length} productos disponibles`}
      </div>

      <div ref={endRef} className="space-y-4">
        {!hasMore ? (
          <button
            type="button"
            onClick={() => {
              void refreshLatestProducts(true);
            }}
            disabled={refreshing || loading}
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm font-semibold text-stone-700 shadow-card disabled:opacity-70"
          >
            {refreshing ? 'Buscando productos nuevos...' : 'Buscar productos nuevos'}
          </button>
        ) : null}

        {!hasMore && isEndVisible && !refreshing ? (
          <p className="text-center text-xs text-stone-500">
            Buscando productos nuevos automaticamente cada 10 segundos.
          </p>
        ) : null}
      </div>

      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {hasMore ? <div ref={sentinelRef} className="h-1" aria-hidden="true" /> : null}
    </div>
  );
}
