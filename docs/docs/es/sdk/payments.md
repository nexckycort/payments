# Recurso Payment

El recurso Payment te permite procesar pagos para sesiones de checkout existentes usando diferentes métodos de pago.

## Crear un Pago

Procesa un pago para un checkout existente.

### Pago con Tarjeta

```typescript
const payment = await bloque.payments.create({
  checkoutId: 'checkout_abc123',
  payment: {
    type: 'card',
    data: {
      cardNumber: '4111111111111111',
      cardholderName: 'John Doe',
      expiryMonth: '12',
      expiryYear: '2025',
      cvv: '123',
      email: 'john@example.com',
    },
  },
});

console.log(payment.status); // Estado del pago
```

### Pago PSE (Transferencia Bancaria)

```typescript
const payment = await bloque.payments.create({
  checkoutId: 'checkout_abc123',
  payment: {
    type: 'pse',
    data: {
      email: 'cliente@ejemplo.com',
      personType: 'natural', // 'natural' o 'juridica'
      documentType: 'CC', // 'CC', 'CE', 'NIT', etc.
      documentNumber: '1234567890',
      bankCode: '1007', // Código del banco PSE
    },
  },
});

console.log(payment.redirect_url); // Redirigir a PSE para autorización
```

### Pago en Efectivo

```typescript
const payment = await bloque.payments.create({
  checkoutId: 'checkout_abc123',
  payment: {
    type: 'cash',
    data: {
      email: 'cliente@ejemplo.com',
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'John Doe',
    },
  },
});

console.log(payment.reference); // Referencia de pago para recolección de efectivo
```

## Métodos de Pago

### Datos de Pago con Tarjeta

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `cardNumber` | `string` | Sí | Número de tarjeta (13-19 dígitos) |
| `cardholderName` | `string` | Sí | Nombre en la tarjeta |
| `expiryMonth` | `string` | Sí | Mes de expiración (MM) |
| `expiryYear` | `string` | Sí | Año de expiración (YYYY) |
| `cvv` | `string` | Sí | Código de seguridad (3-4 dígitos) |
| `email` | `string` | No | Email del cliente |

### Datos de Pago PSE

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | Sí | Email del cliente |
| `personType` | `'natural' \| 'juridica'` | Sí | Tipo de persona |
| `documentType` | `string` | Sí | Tipo de documento (CC, CE, NIT, etc.) |
| `documentNumber` | `string` | Sí | Número de documento |
| `bankCode` | `string` | Sí | Código del banco PSE |

### Datos de Pago en Efectivo

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `email` | `string` | Sí | Email del cliente |
| `documentType` | `string` | Sí | Tipo de documento (CC, CE, etc.) |
| `documentNumber` | `string` | Sí | Número de documento |
| `fullName` | `string` | Sí | Nombre completo del cliente |

## Respuesta de Pago

```typescript
interface PaymentResponse {
  status: 'pending' | 'approved' | 'declined' | 'error';
  redirect_url?: string; // Para PSE y algunos pagos con tarjeta
  reference?: string; // Para pagos en efectivo
  message?: string; // Mensaje de estado
  error?: string; // Mensaje de error si falla
}
```

## Tarjetas de Prueba

Para pruebas en sandbox, usa estos números de tarjeta:

| Tipo de Tarjeta | Número | CVV | Resultado |
|-----------------|--------|-----|-----------|
| Visa | 4111111111111111 | Cualquiera | Aprobado |
| Mastercard | 5555555555554444 | Cualquiera | Aprobado |
| Visa | 4000000000000002 | Cualquiera | Rechazado |
| Amex | 378282246310005 | Cualquiera | Aprobado |

Usa cualquier fecha de expiración futura para las pruebas.

## Mejores Prácticas

1. **Nunca almacenes datos de tarjetas** en tus servidores - deja que Bloque maneje el cumplimiento PCI
2. **Valida la entrada** antes de enviar a la API
3. **Maneja todos los estados de pago** (pending, approved, declined, error)
4. **Usa manejo de errores** para capturar y mostrar mensajes amigables
5. **Prueba exhaustivamente** con tarjetas de prueba en sandbox antes de producción
6. **Para PSE**, siempre maneja el flujo de redirección correctamente
7. **Para pagos en efectivo**, muestra claramente el código de referencia a los usuarios
