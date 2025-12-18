# Examples

Real-world examples of integrating Bloque Payments in your applications.

## Node.js Examples

### Express.js API

Complete checkout and payment flow with Express:

```typescript
import express from 'express';
import { Bloque } from '@bloque/payments-sdk';

const app = express();
app.use(express.json());

const bloque = new Bloque({
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY!,
});

// Create checkout endpoint
app.post('/api/checkouts', async (req, res) => {
  try {
    const { items, metadata } = req.body;

    const checkout = await bloque.checkout.create({
      name: `Order ${Date.now()}`,
      items,
      success_url: `${req.protocol}://${req.get('host')}/success`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
      metadata,
    });

    res.json(checkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process payment endpoint
app.post('/api/payments', async (req, res) => {
  try {
    const { checkoutId, payment } = req.body;

    const result = await bloque.payments.create({
      checkoutId,
      payment,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get checkout status
app.get('/api/checkouts/:id', async (req, res) => {
  try {
    const checkout = await bloque.checkout.retrieve(req.params.id);
    res.json(checkout);
  } catch (error) {
    res.status(404).json({ error: 'Checkout not found' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Next.js API Routes

Using Bloque with Next.js App Router:

```typescript
// app/api/checkouts/route.ts
import { Bloque } from '@bloque/payments-sdk';
import { NextRequest } from 'next/server';

const bloque = new Bloque({
  server: 'production',
  apiKey: process.env.BLOQUE_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const checkout = await bloque.checkout.create({
      name: body.name,
      items: body.items,
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancel`,
      metadata: body.metadata,
    });

    return Response.json(checkout);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/payments/route.ts
import { Bloque } from '@bloque/payments-sdk';
import { NextRequest } from 'next/server';

const bloque = new Bloque({
  server: 'production',
  apiKey: process.env.BLOQUE_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { checkoutId, payment } = await request.json();

    const result = await bloque.payments.create({
      checkoutId,
      payment,
    });

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## React Examples

### Next.js Page

Complete checkout page with Next.js:

```tsx
// app/checkout/page.tsx
'use client';

import { BloqueCheckout } from '@bloque/payments-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId: 'checkout_123',
          payment: payload,
        }),
      });

      const result = await response.json();

      if (result.status === 'approved') {
        router.push('/success');
      } else if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <BloqueCheckout
        amount={99900}
        availableMethods={['card', 'pse', 'cash']}
        onSubmit={handleSubmit}
        appearance={{
          variables: {
            colorPrimary: '#6366f1',
            borderRadius: '8px',
          },
        }}
      />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-700">Processing payment...</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### E-commerce Checkout Flow

Complete e-commerce flow with cart:

```tsx
// components/CartCheckout.tsx
'use client';

import { BloqueCheckout } from '@bloque/payments-react';
import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartCheckoutProps {
  items: CartItem[];
}

export function CartCheckout({ items }: CartCheckoutProps) {
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const createCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            amount: item.price,
            quantity: item.quantity,
          })),
          metadata: {
            cart_id: Math.random().toString(36),
          },
        }),
      });

      const checkout = await response.json();
      setCheckoutId(checkout.id);
    } catch (error) {
      console.error('Failed to create checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (payload) => {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutId,
        payment: payload,
      }),
    });

    const result = await response.json();

    if (result.status === 'approved') {
      window.location.href = '/success';
    } else if (result.redirect_url) {
      window.location.href = result.redirect_url;
    }
  };

  if (!checkoutId) {
    return (
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity / 100).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={createCheckout}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Creating checkout...' : 'Proceed to Payment'}
        </button>
      </div>
    );
  }

  return (
    <BloqueCheckout
      amount={total}
      onSubmit={handlePayment}
    />
  );
}
```

## Subscription Example

Recurring subscription checkout:

```typescript
// Create subscription checkout
const checkout = await bloque.checkout.create({
  name: 'Premium Subscription',
  description: 'Monthly premium subscription',
  items: [
    {
      name: 'Premium Plan - Monthly',
      amount: 1990, // $19.90/month
      quantity: 1,
    },
  ],
  success_url: 'https://myapp.com/subscription/success',
  cancel_url: 'https://myapp.com/subscription/cancel',
  metadata: {
    subscription_plan: 'premium',
    billing_cycle: 'monthly',
    user_id: 'user_123',
  },
});
```

## Testing Example

Testing with Jest:

```typescript
import { Bloque } from '@bloque/payments-sdk';

describe('Checkout API', () => {
  let bloque: Bloque;

  beforeAll(() => {
    bloque = new Bloque({
      server: 'sandbox',
      apiKey: process.env.BLOQUE_TEST_API_KEY!,
    });
  });

  it('should create a checkout', async () => {
    const checkout = await bloque.checkout.create({
      name: 'Test Order',
      items: [
        {
          name: 'Test Product',
          amount: 10000,
          quantity: 1,
        },
      ],
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    expect(checkout.id).toBeDefined();
    expect(checkout.status).toBe('pending');
    expect(checkout.amount_total).toBe(10000);
  });

  it('should retrieve a checkout', async () => {
    const created = await bloque.checkout.create({
      name: 'Test Order',
      items: [
        {
          name: 'Test Product',
          amount: 10000,
          quantity: 1,
        },
      ],
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });

    const retrieved = await bloque.checkout.retrieve(created.id);

    expect(retrieved.id).toBe(created.id);
    expect(retrieved.status).toBe('pending');
  });
});
```

## Environment Variables

Example `.env` file:

```bash
# Sandbox (for development)
BLOQUE_API_KEY=sk_sandbox_your_key_here

# Production
BLOQUE_API_KEY=sk_live_your_key_here

# App URL
NEXT_PUBLIC_URL=https://yourapp.com
```

## Best Practices

1. **Always use environment variables** for API keys
2. **Validate input** on both client and server
3. **Handle all error cases** gracefully
4. **Test in sandbox** before deploying to production
5. **Store checkout IDs** for order tracking
6. **Use metadata** to link payments to your records
7. **Implement webhooks** for reliable payment notifications
