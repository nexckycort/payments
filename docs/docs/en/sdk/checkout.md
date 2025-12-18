# Checkout Resource

The Checkout resource allows you to create payment sessions where customers can complete their purchases.

## Create a Checkout

Creates a new checkout session with items to be purchased.

```typescript
const checkout = await bloque.checkout.create({
  name: 'Order #1234',
  description: 'Premium subscription',
  items: [
    {
      name: 'Premium Plan',
      amount: 99900, // Amount in cents
      quantity: 1,
      image_url: 'https://example.com/image.png',
    },
  ],
  success_url: 'https://yourapp.com/success',
  cancel_url: 'https://yourapp.com/cancel',
  expires_at: '2024-12-31T23:59:59Z', // Optional expiration
  metadata: {
    user_id: '123',
    order_id: 'order_abc',
  },
});

console.log(checkout.id); // Checkout ID
console.log(checkout.url); // Public payment URL
console.log(checkout.status); // 'pending'
```

## Parameters

### CheckoutParams

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the checkout session |
| `description` | `string` | No | Optional description |
| `items` | `CheckoutItem[]` | Yes | List of items to be charged |
| `success_url` | `string` | Yes | URL to redirect after successful payment |
| `cancel_url` | `string` | Yes | URL to redirect if payment is canceled |
| `image_url` | `string` | No | URL of an image representing the checkout |
| `expires_at` | `string` | No | Expiration date in ISO 8601 format |
| `metadata` | `Metadata` | No | Arbitrary key-value pairs for internal use |

### CheckoutItem

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | `string` | Yes | Name of the product or service |
| `amount` | `number` | Yes | Unit price in cents (e.g., 99900 = $999.00) |
| `quantity` | `number` | Yes | Number of units |
| `description` | `string` | No | Optional description |
| `image_url` | `string` | No | URL of item image |

## Retrieve a Checkout

Retrieves an existing checkout by its ID.

```typescript
const checkout = await bloque.checkout.retrieve('checkout_abc123');

console.log(checkout.status); // 'pending', 'completed', 'expired', 'canceled'
console.log(checkout.amount_total); // Total amount in cents
```

## Cancel a Checkout

Cancels a pending checkout.

```typescript
const checkout = await bloque.checkout.cancel('checkout_abc123');

console.log(checkout.status); // 'canceled'
```

## Checkout Object

The checkout object returned by the API:

```typescript
interface Checkout {
  id: string; // Unique identifier
  object: 'checkout';
  url: string; // Public payment URL
  status: 'pending' | 'completed' | 'expired' | 'canceled';
  amount_total: number; // Total amount in cents
  amount_subtotal: number; // Subtotal in cents
  currency: 'USD';
  items: CheckoutItem[];
  metadata?: Metadata;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  expires_at: string; // ISO 8601 timestamp
}
```

## Checkout Status

A checkout can have the following statuses:

- `pending`: Created and waiting for payment
- `completed`: Successfully paid
- `expired`: Expired without payment
- `canceled`: Manually canceled

## Example: Complete Checkout Flow

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
});

// 1. Create checkout
const checkout = await bloque.checkout.create({
  name: 'E-commerce Order',
  items: [
    {
      name: 'Wireless Headphones',
      amount: 15990,
      quantity: 1,
    },
    {
      name: 'Phone Case',
      amount: 2990,
      quantity: 2,
    },
  ],
  success_url: 'https://mystore.com/success',
  cancel_url: 'https://mystore.com/cart',
  metadata: {
    user_id: 'user_123',
    cart_id: 'cart_456',
  },
});

// 2. Send checkout URL to customer
console.log('Send this URL to customer:', checkout.url);

// 3. Later, check checkout status
const updatedCheckout = await bloque.checkout.retrieve(checkout.id);

if (updatedCheckout.status === 'completed') {
  console.log('Payment completed! Process order...');
} else if (updatedCheckout.status === 'expired') {
  console.log('Checkout expired. Send reminder to customer.');
}
```

## Best Practices

1. **Always use HTTPS** for success_url and cancel_url
2. **Store checkout IDs** in your database for reference
3. **Set expiration dates** for time-sensitive checkouts
4. **Use metadata** to associate checkouts with your internal records
5. **Handle all statuses** in your application logic
6. **Validate amounts** before creating checkouts (use cents, not decimal)
