# Payment Resource

The Payment resource allows you to process payments for existing checkout sessions using different payment methods.

## Create a Payment

Process a payment for an existing checkout.

### Card Payment

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

console.log(payment.status); // Payment status
```

### PSE Payment (Bank Transfer)

```typescript
const payment = await bloque.payments.create({
  checkoutId: 'checkout_abc123',
  payment: {
    type: 'pse',
    data: {
      email: 'customer@example.com',
      personType: 'natural', // 'natural' or 'juridica'
      documentType: 'CC', // 'CC', 'CE', 'NIT', etc.
      documentNumber: '1234567890',
      bankCode: '1007', // Bank code from PSE
    },
  },
});

console.log(payment.redirect_url); // Redirect to PSE for authorization
```

### Cash Payment

```typescript
const payment = await bloque.payments.create({
  checkoutId: 'checkout_abc123',
  payment: {
    type: 'cash',
    data: {
      email: 'customer@example.com',
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'John Doe',
    },
  },
});

console.log(payment.reference); // Payment reference for cash collection
```

## Payment Methods

### Card Payment Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `cardNumber` | `string` | Yes | Card number (13-19 digits) |
| `cardholderName` | `string` | Yes | Name on card |
| `expiryMonth` | `string` | Yes | Expiration month (MM) |
| `expiryYear` | `string` | Yes | Expiration year (YYYY) |
| `cvv` | `string` | Yes | Card security code (3-4 digits) |
| `email` | `string` | No | Customer email |

### PSE Payment Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Customer email |
| `personType` | `'natural' \| 'juridica'` | Yes | Person type |
| `documentType` | `string` | Yes | Document type (CC, CE, NIT, etc.) |
| `documentNumber` | `string` | Yes | Document number |
| `bankCode` | `string` | Yes | PSE bank code |

### Cash Payment Data

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | `string` | Yes | Customer email |
| `documentType` | `string` | Yes | Document type (CC, CE, etc.) |
| `documentNumber` | `string` | Yes | Document number |
| `fullName` | `string` | Yes | Full name of customer |

## Payment Response

```typescript
interface PaymentResponse {
  status: 'pending' | 'approved' | 'declined' | 'error';
  redirect_url?: string; // For PSE and some card payments
  reference?: string; // For cash payments
  message?: string; // Status message
  error?: string; // Error message if failed
}
```

## Examples

### Complete Card Payment Flow

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
});

// 1. Create checkout
const checkout = await bloque.checkout.create({
  name: 'Order #1234',
  items: [
    {
      name: 'Product',
      amount: 50000,
      quantity: 1,
    },
  ],
  success_url: 'https://mystore.com/success',
  cancel_url: 'https://mystore.com/cancel',
});

// 2. Process card payment
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
    console.log('Payment approved!');
  } else if (payment.status === 'declined') {
    console.log('Payment declined:', payment.message);
  }
} catch (error) {
  console.error('Payment error:', error);
}
```

### PSE Payment with Redirect

```typescript
// Process PSE payment
const payment = await bloque.payments.create({
  checkoutId: checkout.id,
  payment: {
    type: 'pse',
    data: {
      email: 'customer@example.com',
      personType: 'natural',
      documentType: 'CC',
      documentNumber: '1234567890',
      bankCode: '1007', // Bancolombia
    },
  },
});

// Redirect user to PSE
if (payment.redirect_url) {
  // In a web app, redirect the user
  window.location.href = payment.redirect_url;
}
```

### Cash Payment Reference

```typescript
const payment = await bloque.payments.create({
  checkoutId: checkout.id,
  payment: {
    type: 'cash',
    data: {
      email: 'customer@example.com',
      documentType: 'CC',
      documentNumber: '1234567890',
      fullName: 'John Doe',
    },
  },
});

// Display reference to customer
console.log('Pay with this reference:', payment.reference);
console.log('Available at: Efecty, Baloto, etc.');
```

## Test Cards

For sandbox testing, use these test card numbers:

| Card Type | Number | CVV | Result |
|-----------|--------|-----|--------|
| Visa | 4111111111111111 | Any | Approved |
| Mastercard | 5555555555554444 | Any | Approved |
| Visa | 4000000000000002 | Any | Declined |
| Amex | 378282246310005 | Any | Approved |

Use any future expiration date for testing.

## Best Practices

1. **Never store card data** on your servers - let Bloque handle PCI compliance
2. **Validate input** before sending to the API
3. **Handle all payment statuses** (pending, approved, declined, error)
4. **Use error handling** to catch and display user-friendly messages
5. **Test thoroughly** with test cards in sandbox before production
6. **For PSE**, always handle the redirect flow properly
7. **For cash payments**, clearly display the reference code to users
