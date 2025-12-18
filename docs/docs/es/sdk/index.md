# SDK de Node.js

El SDK de Bloque Payments para Node.js proporciona una forma segura y tipada de integrar procesamiento de pagos en tus aplicaciones backend.

## Instalación

```bash
npm install @bloque/payments-sdk
```

## Requisitos

- Node.js 22 o superior
- TypeScript 5.0+ (recomendado)

## Ejemplo Rápido

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
});

// Crear un checkout
const checkout = await bloque.checkout.create({
  name: 'Orden #1234',
  description: 'Suscripción premium',
  items: [
    {
      name: 'Plan Premium',
      amount: 99900,
      quantity: 1,
    },
  ],
  success_url: 'https://tuapp.com/exito',
  cancel_url: 'https://tuapp.com/cancelar',
});

console.log('URL de Checkout:', checkout.url);
```

## Características Principales

- **Tipado Seguro**: Soporte completo de TypeScript con definiciones de tipos comprehensivas
- **API Moderna**: API basada en Promesas con soporte de async/await
- **Múltiples Métodos de Pago**: Soporte para tarjetas, PSE y pagos en efectivo
- **Reintentos Automáticos**: Lógica de reintento incorporada para solicitudes fallidas
- **Manejo de Errores**: Mensajes de error detallados y tipos de error

## Estructura del SDK

El SDK está organizado en recursos:

- `bloque.checkout`: Crear y administrar sesiones de checkout
- `bloque.payments`: Procesar pagos para checkouts

## Configuración

### Configuración Básica

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox', // o 'production'
  apiKey: 'tu_clave_api',
});
```

### Configuración Avanzada

```typescript
const bloque = new Bloque({
  server: 'production',
  apiKey: process.env.BLOQUE_API_KEY,
  timeout: 30000, // Tiempo de espera de solicitud en milisegundos (predeterminado: 30000)
  maxRetries: 3, // Número máximo de reintentos para solicitudes fallidas (predeterminado: 3)
});
```

## Próximos Pasos

- [Recurso Checkout](/sdk/checkout) - Crear y administrar checkouts
- [Recurso Payment](/sdk/payments) - Procesar pagos
- [Manejo de Errores](/sdk/error-handling) - Manejar errores gracefully
- [Referencia de API](/sdk/api-reference) - Documentación completa de API
