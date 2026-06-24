# Iron Catalog

Frontend publico mobile-first para el catalogo de `iron`.

## Requisitos

- Node.js 20+
- `iron/backend` corriendo y accesible

## Variables de entorno

Crear `iron-catalog/.env.local` con:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CATALOG_WHATSAPP=2622221483
```

`NEXT_PUBLIC_API_URL` debe apuntar a la base del backend. El frontend ya agrega `/api/v1/...` en el código.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir, por ejemplo:

```text
http://localhost:3001?pos=gym
```

`pos` puede ser el UUID, el `name` o el `label` del punto de venta.

## Verificacion

```bash
npm run typecheck
```

## Flujo

- Home: lista productos con precio y stock del punto de venta
- Producto: seleccion de color/talle, consulta por otros talles por WhatsApp
- Carrito: cantidades editables localmente
- Checkout: crea pedido usando `MERCADO_PAGO`
- Confirmacion: modal final con acceso directo a WhatsApp y vuelta al inicio
