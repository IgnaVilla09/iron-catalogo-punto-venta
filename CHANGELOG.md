# Historial de versiones — Iron Catálogo

## 1.1.0 — 2026-10-12 — Ofertas y descuentos

- Pegatina visual de oferta mediante `ofertasvg.svg` para productos marcados como `isOnSale` en Iron Stock.
- Código de descuento en checkout, con validación contra el backend, subtotal, descuento aplicado y total actualizado.
- Comunicación con la API pública de descuentos; la validación final se repite al crear el pedido.
- Puerto de desarrollo fijo en `3002`, para convivir con el panel de Iron Stock.

Cambios posteriores a `22b6bc3`.

## 1.0.0 — 2026-10-12 — Catálogo público inicial

- Catálogo mobile-first, detalle de producto, variantes, stock por punto de venta y carrito persistente.
- Checkout por transferencia y confirmación por WhatsApp.
- Búsqueda por nombre, scroll infinito, actualización de productos y visor de imágenes.

Historial base: `8654316` → `22b6bc3`.
