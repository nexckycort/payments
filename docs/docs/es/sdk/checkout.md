# Recurso Checkout

El recurso Checkout te permite crear sesiones de pago donde los clientes pueden completar sus compras.

## Crear un Checkout

Crea una nueva sesión de checkout con los artículos a comprar.

```typescript
const checkout = await bloque.checkout.create({
  name: 'Orden #1234',
  description: 'Suscripción premium',
  items: [
    {
      name: 'Plan Premium',
      amount: 99900, // Monto en centavos
      quantity: 1,
      image_url: 'https://ejemplo.com/imagen.png',
    },
  ],
  success_url: 'https://tuapp.com/exito',
  cancel_url: 'https://tuapp.com/cancelar',
  expires_at: '2024-12-31T23:59:59Z', // Expiración opcional
  metadata: {
    user_id: '123',
    order_id: 'orden_abc',
  },
});

console.log(checkout.id); // ID del Checkout
console.log(checkout.url); // URL pública de pago
console.log(checkout.status); // 'pending'
```

## Parámetros

### CheckoutParams

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `name` | `string` | Sí | Nombre de la sesión de checkout |
| `description` | `string` | No | Descripción opcional |
| `items` | `CheckoutItem[]` | Sí | Lista de artículos a cobrar |
| `success_url` | `string` | Sí | URL para redirigir después de pago exitoso |
| `cancel_url` | `string` | Sí | URL para redirigir si se cancela el pago |
| `image_url` | `string` | No | URL de una imagen que representa el checkout |
| `expires_at` | `string` | No | Fecha de expiración en formato ISO 8601 |
| `metadata` | `Metadata` | No | Pares clave-valor arbitrarios para uso interno |

### CheckoutItem

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `name` | `string` | Sí | Nombre del producto o servicio |
| `amount` | `number` | Sí | Precio unitario en centavos (ej. 99900 = $999.00) |
| `quantity` | `number` | Sí | Número de unidades |
| `description` | `string` | No | Descripción opcional |
| `image_url` | `string` | No | URL de la imagen del artículo |

## Recuperar un Checkout

Recupera un checkout existente por su ID.

```typescript
const checkout = await bloque.checkout.retrieve('checkout_abc123');

console.log(checkout.status); // 'pending', 'completed', 'expired', 'canceled'
console.log(checkout.amount_total); // Monto total en centavos
```

## Cancelar un Checkout

Cancela un checkout pendiente.

```typescript
const checkout = await bloque.checkout.cancel('checkout_abc123');

console.log(checkout.status); // 'canceled'
```

## Objeto Checkout

El objeto checkout devuelto por la API:

```typescript
interface Checkout {
  id: string; // Identificador único
  object: 'checkout';
  url: string; // URL pública de pago
  status: 'pending' | 'completed' | 'expired' | 'canceled';
  amount_total: number; // Monto total en centavos
  amount_subtotal: number; // Subtotal en centavos
  currency: 'USD';
  items: CheckoutItem[];
  metadata?: Metadata;
  created_at: string; // Timestamp ISO 8601
  updated_at: string; // Timestamp ISO 8601
  expires_at: string; // Timestamp ISO 8601
}
```

## Estados del Checkout

Un checkout puede tener los siguientes estados:

- `pending`: Creado y esperando pago
- `completed`: Pagado exitosamente
- `expired`: Expirado sin pago
- `canceled`: Cancelado manualmente

## Mejores Prácticas

1. **Siempre usa HTTPS** para success_url y cancel_url
2. **Almacena los IDs de checkout** en tu base de datos para referencia
3. **Establece fechas de expiración** para checkouts sensibles al tiempo
4. **Usa metadata** para asociar checkouts con tus registros internos
5. **Maneja todos los estados** en la lógica de tu aplicación
6. **Valida los montos** antes de crear checkouts (usa centavos, no decimales)
