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

## Flujo de Stock y Descuentos

El sistema utiliza un **diseño de dos fases** para el manejo de stock. **El stock NO se descuenta al crear la orden.**

### Fase 1: Creacion de orden (cliente)

Cuando el cliente realiza una compra desde iron-catalog (`POST /api/v1/catalog/public/orders`):

1. El backend **valida que el stock exista** (solo lectura, sin descuento)
2. Verifica que la variante pertenezca al producto y que el producto tenga precio configurado
3. Si no hay stock suficiente, rechaza la orden con error `Stock insuficiente para [producto] - [color] / [talle]. Disponible: [cantidad]`
4. Si hay stock, crea la orden con status `PENDING_PAYMENT`
5. Retorna 201 al cliente

**No se toca el stock.** Solo se verifica disponibilidad.

### Fase 2: Confirmacion de orden (admin)

El descuento real de stock ocurre **unicamente** cuando un admin confirma la orden desde el panel de admin (`POST /api/v1/catalog/orders/:id/confirm`):

1. Re-verifica stock (segunda validacion dentro de una transaccion)
2. **Descuenta stock** de `inventory_items` usando una transaccion `SERIALIZABLE` (el nivel de aislamiento mas alto)
3. Crea un registro en `sales` con los items vendidos
4. Marca la orden como `CONFIRMED` y la vincula a la venta

### Ciclo de vida de una orden

```
PENDING_PAYMENT  →  PAYMENT_REPORTED  →  CONFIRMED (aqui se descuenta stock)
                         ↓
                    CANCELLED / REJECTED / OUT_OF_STOCK
```

### Detalle del descuento de stock

Cuando se confirma una orden, por cada item:

1. Busca todos los `InventoryItem` de esa variante en el punto de venta con `stock > 0`
2. Descuenta primero del inventario que tiene mas stock
3. Si no alcanza el stock total → status `OUT_OF_STOCK` y aborta la transaccion
4. Si alcanza, descuenta la cantidad solicitada de cada `InventoryItem`

### Por que este diseno?

- Permite que multiples ordenes se creen simultaneamente para la misma variante (validacion de stock al crear)
- Solo al confirmar se descuenta stock real, evitando descuentos innecesarios por ordenes canceladas
- Si el stock se agota entre la creacion y la confirmacion (ej: otra orden se confirmo primero), la confirmacion falla con `OUT_OF_STOCK`
- Cancelaciones y rechazos nunca tocan stock porque nunca fue descontado
