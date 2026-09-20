# Iron Catalogo

Frontend publico mobile-first para el catalogo de productos de `Iron Threads`. Permite a los clientes navegar productos, buscar por nombre, seleccionar variantes (color/talle), armar carrito y generar pedidos que se confirman por WhatsApp.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (state management con persistencia en localStorage)

## Requisitos

- Node.js 20+
- `iron/backend` corriendo y accesible

## Variables de entorno

Crear `iron-catalog/.env.local` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CATALOG_WHATSAPP=2622221483
```

`NEXT_PUBLIC_API_URL` debe apuntar a la base del backend. El frontend ya agrega `/api/v1/...` en el codigo.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir, por ejemplo:

```text
http://localhost:3000?pos=gym
```

`pos` puede ser el UUID, el `name` o el `label` del punto de venta.

## Verificacion

```bash
npm run typecheck
```

## Funcionalidades

### Busqueda de productos

- Icono de lupa al lado del titulo "Productos disponibles"
- Al hacer clic, se expande con animacion suave un input de busqueda
- Busca productos por nombre en el backend (case-insensitive)
- El termino de busqueda se guarda en la URL (`?pos=...&search=remera`) para compartir links
- La busqueda persiste al navegar a un producto y volver

### Layout fijo

- Header y seccion de titulo/buscador siempre visibles (no scrollean)
- Solo el grid de productos tiene scroll
- Boton "Inicio" con flecha hacia arriba aparece en la esquina inferior derecha al scrollear hacia abajo, y desaparece al volver al topo

### Infinite scroll

- Carga paginada de productos (20 por pagina)
- Auto-refresh cada 10 segundos cuando se llega al final del listado
- Refresh automatico al recuperar foco o visibilidad de la pestana

### Carrito

- Persistido en localStorage (sobrevive recarga de pagina)
- Cantidad editable por item con validacion de stock
- Notificacion visual al agregar producto

## Flujo

1. **Home** (`/?pos=...`): listado paginado de productos con precio y stock del punto de venta
2. **Producto** (`/product/[id]?pos=...`): seleccion de color/talle, stock disponible, consulta por otros talles via WhatsApp
3. **Carrito** (`/cart?pos=...`): cantidades editables, total, continuar compra
4. **Checkout** (`/checkout?pos=...`): formulario de datos + datos de transferencia Mercado Pago
5. **Confirmacion** (`/confirmation/[id]?pos=...`): modal final con total, link directo a WhatsApp para enviar comprobante

## Estructura del proyecto

```
src/
  app/
    page.tsx                  # Home - listado de productos
    product/[id]/page.tsx     # Detalle de producto
    cart/page.tsx             # Carrito
    checkout/page.tsx         # Checkout
    confirmation/[id]/page.tsx # Post-pedido
    layout.tsx                # Layout raiz (header + main)
  components/
    header.tsx                # Header sticky con logo y carrito
    search-bar.tsx            # Buscador con animacion de expansion
    search-bar-wrapper.tsx    # Wrapper client-side del buscador
    product-feed.tsx          # Grid con infinite scroll y scroll-to-top
    product-card.tsx          # Card de producto en el grid
    product-detail.tsx        # Detalle de producto (selector variante)
    cart-client.tsx           # Vista del carrito
    checkout-client.tsx       # Formulario de checkout
    image-placeholder.tsx     # Placeholder para productos sin imagen
  lib/
    api.ts                    # Capa de fetch hacia el backend
    types.ts                  # Interfaces TypeScript
    utils.ts                  # Utilidades (formatPrice, buildPosPath, etc.)
    config.ts                 # Configuracion (WhatsApp)
    catalog-metadata.ts       # Metadata SEO dinamica
  stores/
    cart-store.ts             # Estado del carrito (Zustand + persist)
```
