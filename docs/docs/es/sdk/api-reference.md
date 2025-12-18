# Referencia de API

Documentación de referencia completa para el SDK de Bloque Payments.

## Cliente

### `new Bloque(config)`

Crea una nueva instancia del cliente Bloque.

**Parámetros:**

- `config` (BloqueConfig): Objeto de configuración

**BloqueConfig:**

```typescript
interface BloqueConfig {
  server: 'sandbox' | 'production';
  apiKey: string;
  timeout?: number; // Predeterminado: 30000ms
  maxRetries?: number; // Predeterminado: 3
}
```

**Ejemplo:**

```typescript
const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
  timeout: 30000,
  maxRetries: 3,
});
```

## Recurso Checkout

### `bloque.checkout.create(params)`

Crea una nueva sesión de checkout.

**Parámetros:**

- `params` (CheckoutParams): Parámetros del checkout

**Retorna:** `Promise<Checkout>`

### `bloque.checkout.retrieve(checkoutId)`

Recupera un checkout existente.

**Parámetros:**

- `checkoutId` (string): El ID del checkout

**Retorna:** `Promise<Checkout>`

### `bloque.checkout.cancel(checkoutId)`

Cancela un checkout pendiente.

**Parámetros:**

- `checkoutId` (string): El ID del checkout

**Retorna:** `Promise<Checkout>`

## Recurso Payment

### `bloque.payments.create(params)`

Crea un pago para un checkout.

**Parámetros:**

- `params` (CreatePaymentParams): Parámetros del pago

**Retorna:** `Promise<PaymentResponse>`

## Definiciones de Tipos

### Currency

```typescript
type Currency = 'USD';
```

Actualmente, solo USD está soportado.

### Metadata

```typescript
type Metadata = Record<string, string | number | boolean>;
```

Pares clave-valor arbitrarios para almacenar información adicional.

### CheckoutStatus

```typescript
type CheckoutStatus = 'pending' | 'completed' | 'expired' | 'canceled';
```

## Errores

Todos los errores extienden la clase `BloqueError`:

```typescript
class BloqueError extends Error {
  name: string;
  message: string;
  statusCode?: number;
  code?: string;
}
```

Ver [Manejo de Errores](/sdk/error-handling) para más detalles.

## Constantes

### Métodos de Pago

```typescript
const PAYMENT_METHODS = ['card', 'pse', 'cash'] as const;
```

### Tipos de Documento (Colombia)

```typescript
const DOCUMENT_TYPES = [
  'CC',  // Cédula de Ciudadanía
  'CE',  // Cédula de Extranjería
  'NIT', // Número de Identificación Tributaria
  'TI',  // Tarjeta de Identidad
  'PP',  // Pasaporte
] as const;
```

### Tipos de Persona (PSE)

```typescript
const PERSON_TYPES = [
  'natural',   // Persona natural
  'juridica',  // Persona jurídica
] as const;
```
