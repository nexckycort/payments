# API Reference

Complete reference documentation for the Bloque Payments SDK.

## Client

### `new Bloque(config)`

Creates a new Bloque client instance.

**Parameters:**

- `config` (BloqueConfig): Configuration object

**BloqueConfig:**

```typescript
interface BloqueConfig {
  server: 'sandbox' | 'production';
  apiKey: string;
  timeout?: number; // Default: 30000ms
  maxRetries?: number; // Default: 3
}
```

**Example:**

```typescript
const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
  timeout: 30000,
  maxRetries: 3,
});
```

## Checkout Resource

### `bloque.checkout.create(params)`

Creates a new checkout session.

**Parameters:**

- `params` (CheckoutParams): Checkout parameters

**Returns:** `Promise<Checkout>`

**CheckoutParams:**

```typescript
interface CheckoutParams {
  name: string;
  description?: string;
  image_url?: string;
  items: CheckoutItem[];
  currency?: Currency; // Default: 'USD'
  success_url: string;
  cancel_url: string;
  metadata?: Metadata;
  expires_at?: string; // ISO 8601 format
  payment_methods?: ('card' | 'pse' | 'cash')[];
}
```

**CheckoutItem:**

```typescript
interface CheckoutItem {
  name: string;
  description?: string;
  amount: number; // Amount in cents
  quantity: number;
  image_url?: string;
}
```

**Checkout:**

```typescript
interface Checkout {
  id: string;
  object: 'checkout';
  url: string;
  status: CheckoutStatus;
  amount_total: number;
  amount_subtotal: number;
  currency: Currency;
  customer?: Customer;
  items: CheckoutItem[];
  metadata?: Metadata;
  created_at: string;
  updated_at: string;
  expires_at: string;
}
```

**CheckoutStatus:**

```typescript
type CheckoutStatus = 'pending' | 'completed' | 'expired' | 'canceled';
```

### `bloque.checkout.retrieve(checkoutId)`

Retrieves an existing checkout.

**Parameters:**

- `checkoutId` (string): The checkout ID

**Returns:** `Promise<Checkout>`

**Example:**

```typescript
const checkout = await bloque.checkout.retrieve('checkout_abc123');
```

### `bloque.checkout.cancel(checkoutId)`

Cancels a pending checkout.

**Parameters:**

- `checkoutId` (string): The checkout ID

**Returns:** `Promise<Checkout>`

**Example:**

```typescript
const checkout = await bloque.checkout.cancel('checkout_abc123');
```

## Payment Resource

### `bloque.payments.create(params)`

Creates a payment for a checkout.

**Parameters:**

- `params` (CreatePaymentParams): Payment parameters

**Returns:** `Promise<PaymentResponse>`

**CreatePaymentParams:**

```typescript
interface CreatePaymentParams {
  checkoutId: string;
  payment: PaymentSubmitPayload;
}
```

**PaymentSubmitPayload:**

```typescript
type PaymentSubmitPayload =
  | { type: 'card'; data: CardPaymentFormData }
  | { type: 'pse'; data: PSEPaymentFormData }
  | { type: 'cash'; data: CashPaymentFormData };
```

**CardPaymentFormData:**

```typescript
interface CardPaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  email?: string;
}
```

**PSEPaymentFormData:**

```typescript
interface PSEPaymentFormData {
  email: string;
  personType: 'natural' | 'juridica';
  documentType: string; // 'CC', 'CE', 'NIT', etc.
  documentNumber: string;
  bankCode: string;
}
```

**CashPaymentFormData:**

```typescript
interface CashPaymentFormData {
  email: string;
  documentType: string;
  documentNumber: string;
  fullName: string;
}
```

**PaymentResponse:**

```typescript
interface PaymentResponse {
  status: 'pending' | 'approved' | 'declined' | 'error';
  redirect_url?: string;
  reference?: string;
  message?: string;
  error?: string;
}
```

## Type Definitions

### Currency

```typescript
type Currency = 'USD';
```

Currently, only USD is supported.

### Metadata

```typescript
type Metadata = Record<string, string | number | boolean>;
```

Arbitrary key-value pairs for storing additional information.

### Customer

```typescript
interface Customer {
  id: string;
  email?: string;
  name?: string;
}
```

## Errors

All errors extend the `BloqueError` class:

```typescript
class BloqueError extends Error {
  name: string;
  message: string;
  statusCode?: number;
  code?: string;
}
```

See [Error Handling](/sdk/error-handling) for more details.

## Constants

### Payment Methods

```typescript
const PAYMENT_METHODS = ['card', 'pse', 'cash'] as const;
```

### Document Types (Colombia)

```typescript
const DOCUMENT_TYPES = [
  'CC',  // Cédula de Ciudadanía
  'CE',  // Cédula de Extranjería
  'NIT', // Número de Identificación Tributaria
  'TI',  // Tarjeta de Identidad
  'PP',  // Pasaporte
] as const;
```

### Person Types (PSE)

```typescript
const PERSON_TYPES = [
  'natural',   // Natural person
  'juridica',  // Legal entity
] as const;
```
