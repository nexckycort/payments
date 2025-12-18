# Node.js SDK

The Bloque Payments SDK for Node.js provides a type-safe way to integrate payment processing in your backend applications.

## Installation

```bash
npm install @bloque/payments-sdk
```

## Requirements

- Node.js 22 or later
- TypeScript 5.0+ (recommended)

## Quick Example

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
});

// Create a checkout
const checkout = await bloque.checkout.create({
  name: 'Order #1234',
  description: 'Premium subscription',
  items: [
    {
      name: 'Premium Plan',
      amount: 99900,
      quantity: 1,
    },
  ],
  success_url: 'https://yourapp.com/success',
  cancel_url: 'https://yourapp.com/cancel',
});

console.log('Checkout URL:', checkout.url);
```

## Key Features

- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Modern API**: Promise-based API with async/await support
- **Multiple Payment Methods**: Support for cards, PSE, and cash payments
- **Automatic Retries**: Built-in retry logic for failed requests
- **Error Handling**: Detailed error messages and error types

## SDK Structure

The SDK is organized into resources:

- `bloque.checkout`: Create and manage checkout sessions
- `bloque.payments`: Process payments for checkouts

## Configuration

### Basic Configuration

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox', // or 'production'
  apiKey: 'your_api_key',
});
```

### Advanced Configuration

```typescript
const bloque = new Bloque({
  server: 'production',
  apiKey: process.env.BLOQUE_API_KEY,
  timeout: 30000, // Request timeout in milliseconds (default: 30000)
  maxRetries: 3, // Maximum number of retries for failed requests (default: 3)
});
```

## Next Steps

- [Checkout Resource](/sdk/checkout) - Create and manage checkouts
- [Payment Resource](/sdk/payments) - Process payments
- [Error Handling](/sdk/error-handling) - Handle errors gracefully
- [API Reference](/sdk/api-reference) - Complete API documentation
