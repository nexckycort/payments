# Error Handling

The Bloque SDK provides detailed error information to help you handle failures gracefully.

## Error Types

All errors thrown by the SDK extend the base `BloqueError` class:

```typescript
class BloqueError extends Error {
  name: string;
  message: string;
  statusCode?: number;
  code?: string;
}
```

## Catching Errors

Use try-catch blocks to handle errors:

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
});

try {
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

  console.log('Checkout created:', checkout.id);
} catch (error) {
  console.error('Failed to create checkout:', error.message);

  if (error.statusCode === 401) {
    console.error('Invalid API key');
  } else if (error.statusCode === 400) {
    console.error('Invalid parameters:', error.message);
  }
}
```

## Common HTTP Status Codes

| Status Code | Meaning | How to Handle |
|-------------|---------|---------------|
| 400 | Bad Request | Check your parameters |
| 401 | Unauthorized | Verify your API key |
| 404 | Not Found | Check the resource ID |
| 429 | Too Many Requests | Implement rate limiting |
| 500 | Server Error | Retry the request |

## Handling Payment Errors

Payment errors can occur for various reasons:

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
    console.log('Payment successful!');
  } else if (payment.status === 'declined') {
    // Handle declined payment
    console.log('Payment declined:', payment.message);
  }
} catch (error) {
  // Handle API errors
  console.error('Payment processing error:', error.message);
}
```

## Validation Errors

The SDK validates parameters before sending requests:

```typescript
try {
  const checkout = await bloque.checkout.create({
    name: 'Order #1234',
    items: [], // Invalid: empty items array
    success_url: 'https://mystore.com/success',
    cancel_url: 'https://mystore.com/cancel',
  });
} catch (error) {
  console.error('Validation error:', error.message);
  // Output: "Items array cannot be empty"
}
```

## Network Errors

Handle network failures and timeouts:

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY,
  timeout: 10000, // 10 second timeout
  maxRetries: 3, // Retry up to 3 times
});

try {
  const checkout = await bloque.checkout.create({
    // ... checkout params
  });
} catch (error) {
  if (error.message.includes('timeout')) {
    console.error('Request timed out. Please try again.');
  } else if (error.message.includes('network')) {
    console.error('Network error. Check your connection.');
  }
}
```

## Best Practices

### 1. Always Use Try-Catch

```typescript
// Good
try {
  const checkout = await bloque.checkout.create(params);
  // Handle success
} catch (error) {
  // Handle error
}

// Bad
const checkout = await bloque.checkout.create(params); // Might crash
```

### 2. Provide User-Friendly Messages

```typescript
try {
  const payment = await bloque.payments.create(paymentParams);
} catch (error) {
  // Don't show technical errors to users
  const userMessage = error.statusCode === 401
    ? 'Configuration error. Please contact support.'
    : 'Payment failed. Please try again.';

  displayErrorToUser(userMessage);

  // But log technical details for debugging
  console.error('Payment error:', error);
}
```

### 3. Handle Specific Error Cases

```typescript
try {
  const checkout = await bloque.checkout.retrieve(checkoutId);
} catch (error) {
  if (error.statusCode === 404) {
    console.error('Checkout not found');
    // Redirect to error page
  } else if (error.statusCode === 401) {
    console.error('Invalid API key');
    // Alert admin
  } else {
    console.error('Unexpected error:', error);
    // Log to error tracking service
  }
}
```

### 4. Implement Retry Logic for Transient Errors

```typescript
async function createCheckoutWithRetry(params, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await bloque.checkout.create(params);
    } catch (error) {
      if (error.statusCode >= 500 && attempt < maxAttempts) {
        // Server error, retry
        console.log(`Attempt ${attempt} failed, retrying...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      } else {
        throw error; // Give up or non-retryable error
      }
    }
  }
}
```

### 5. Log Errors for Debugging

```typescript
import { Bloque } from '@bloque/payments-sdk';

try {
  const payment = await bloque.payments.create(paymentParams);
} catch (error) {
  // Log to your error tracking service
  logger.error('Payment creation failed', {
    error: error.message,
    statusCode: error.statusCode,
    checkoutId: paymentParams.checkoutId,
    timestamp: new Date().toISOString(),
  });

  throw error;
}
```

## Error Response Example

```typescript
{
  name: 'BloqueError',
  message: 'Invalid checkout parameters',
  statusCode: 400,
  code: 'INVALID_PARAMS'
}
```

## Testing Error Scenarios

Test error handling in your application:

```typescript
describe('Checkout creation', () => {
  it('should handle invalid API key', async () => {
    const bloque = new Bloque({
      server: 'sandbox',
      apiKey: 'invalid_key',
    });

    await expect(
      bloque.checkout.create(validParams)
    ).rejects.toThrow('Unauthorized');
  });

  it('should handle network timeout', async () => {
    const bloque = new Bloque({
      server: 'sandbox',
      apiKey: process.env.BLOQUE_API_KEY,
      timeout: 1, // Very short timeout
    });

    await expect(
      bloque.checkout.create(validParams)
    ).rejects.toThrow('timeout');
  });
});
```
