# Manejo de Errores

El SDK de Bloque proporciona información detallada de errores para ayudarte a manejar fallos de manera elegante.

## Tipos de Error

Todos los errores lanzados por el SDK extienden la clase base `BloqueError`:

```typescript
class BloqueError extends Error {
  name: string;
  message: string;
  statusCode?: number;
  code?: string;
}
```

## Capturando Errores

Usa bloques try-catch para manejar errores:

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
});

try {
  const checkout = await bloque.checkout.create({
    name: 'Orden #1234',
    items: [
      {
        name: 'Producto',
        amount: 50000,
        quantity: 1,
      },
    ],
    success_url: 'https://mitienda.com/exito',
    cancel_url: 'https://mitienda.com/cancelar',
  });

  console.log('Checkout creado:', checkout.id);
} catch (error) {
  console.error('Error al crear checkout:', error.message);

  if (error.statusCode === 401) {
    console.error('Clave de API inválida');
  } else if (error.statusCode === 400) {
    console.error('Parámetros inválidos:', error.message);
  }
}
```

## Códigos de Estado HTTP Comunes

| Código | Significado | Cómo Manejar |
|--------|-------------|--------------|
| 400 | Solicitud Incorrecta | Verifica tus parámetros |
| 401 | No Autorizado | Verifica tu clave de API |
| 404 | No Encontrado | Verifica el ID del recurso |
| 429 | Demasiadas Solicitudes | Implementa limitación de tasa |
| 500 | Error del Servidor | Reintenta la solicitud |

## Manejo de Errores de Pago

Los errores de pago pueden ocurrir por varias razones:

```typescript
try {
  const payment = await bloque.payments.create({
    checkoutId: checkout.id,
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

  if (payment.status === 'approved') {
    console.log('¡Pago exitoso!');
  } else if (payment.status === 'declined') {
    console.log('Pago rechazado:', payment.message);
  }
} catch (error) {
  console.error('Error al procesar pago:', error.message);
}
```

## Mejores Prácticas

### 1. Siempre Usa Try-Catch

```typescript
// Bien
try {
  const checkout = await bloque.checkout.create(params);
  // Manejar éxito
} catch (error) {
  // Manejar error
}

// Mal
const checkout = await bloque.checkout.create(params); // Puede fallar
```

### 2. Proporciona Mensajes Amigables

```typescript
try {
  const payment = await bloque.payments.create(paymentParams);
} catch (error) {
  // No muestres errores técnicos a los usuarios
  const userMessage = error.statusCode === 401
    ? 'Error de configuración. Por favor contacta soporte.'
    : 'Pago fallido. Por favor intenta de nuevo.';

  mostrarErrorAlUsuario(userMessage);

  // Pero registra detalles técnicos para depuración
  console.error('Error de pago:', error);
}
```

### 3. Maneja Casos de Error Específicos

```typescript
try {
  const checkout = await bloque.checkout.retrieve(checkoutId);
} catch (error) {
  if (error.statusCode === 404) {
    console.error('Checkout no encontrado');
    // Redirigir a página de error
  } else if (error.statusCode === 401) {
    console.error('Clave de API inválida');
    // Alertar al administrador
  } else {
    console.error('Error inesperado:', error);
    // Registrar en servicio de seguimiento de errores
  }
}
```

### 4. Registra Errores para Depuración

```typescript
import { Bloque } from '@bloque/payments-sdk';

try {
  const payment = await bloque.payments.create(paymentParams);
} catch (error) {
  // Registra en tu servicio de seguimiento de errores
  logger.error('Fallo en creación de pago', {
    error: error.message,
    statusCode: error.statusCode,
    checkoutId: paymentParams.checkoutId,
    timestamp: new Date().toISOString(),
  });

  throw error;
}
```
