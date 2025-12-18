# BloqueCheckout Component

The `BloqueCheckout` component provides a complete payment form with support for multiple payment methods.

## Basic Usage

```tsx
import { BloqueCheckout } from '@bloque/payments-react';

function App() {
  return (
    <BloqueCheckout
      amount={99900}
      onSubmit={async (payload) => {
        console.log('Payment submitted:', payload);
      }}
    />
  );
}
```

## Props

### Required Props

#### `onSubmit`

Callback function called when the user submits the payment form.

**Type:** `(payload: PaymentSubmitPayload) => Promise<void>`

**Example:**

```tsx
const handleSubmit = async (payload) => {
  try {
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutId: 'checkout_123',
        payment: payload,
      }),
    });

    if (response.ok) {
      console.log('Payment successful');
    }
  } catch (error) {
    console.error('Payment failed:', error);
  }
};

<BloqueCheckout onSubmit={handleSubmit} />
```

### Optional Props

#### `amount`

The payment amount to display (in cents).

**Type:** `number`

**Default:** `undefined`

**Example:**

```tsx
<BloqueCheckout
  amount={50000} // $500.00
  onSubmit={handleSubmit}
/>
```

#### `availableMethods`

Payment methods to enable in the form.

**Type:** `Array<'card' | 'pse' | 'cash'>`

**Default:** `['card', 'pse', 'cash']`

**Example:**

```tsx
<BloqueCheckout
  availableMethods={['card', 'pse']} // Only cards and PSE
  onSubmit={handleSubmit}
/>
```

#### `requireEmail`

Whether to require email input.

**Type:** `boolean`

**Default:** `true`

**Example:**

```tsx
<BloqueCheckout
  requireEmail={false}
  onSubmit={handleSubmit}
/>
```

#### `showMethodSelector`

Whether to show the payment method selector.

**Type:** `boolean`

**Default:** `true`

**Example:**

```tsx
<BloqueCheckout
  showMethodSelector={false} // Only show card form
  availableMethods={['card']}
  onSubmit={handleSubmit}
/>
```

#### `config`

Advanced configuration options.

**Type:** `CheckoutConfig`

**Example:**

```tsx
<BloqueCheckout
  config={{
    locale: 'es',
    country: 'CO',
  }}
  onSubmit={handleSubmit}
/>
```

#### `appearance`

Customize the component's appearance.

**Type:** `AppearanceConfig`

**Example:**

```tsx
<BloqueCheckout
  appearance={{
    theme: 'dark',
    variables: {
      colorPrimary: '#6366f1',
      borderRadius: '8px',
    },
  }}
  onSubmit={handleSubmit}
/>
```

See [Customization](/react/customization) for more details.

#### `onSuccess`

Callback called when payment is successful (if handling payment on client-side).

**Type:** `(event: CustomEvent<PaymentSubmitPayload>) => void`

**Example:**

```tsx
<BloqueCheckout
  onSuccess={(event) => {
    console.log('Payment success:', event.detail);
  }}
  onSubmit={handleSubmit}
/>
```

#### `onError`

Callback called when payment fails.

**Type:** `(event: CustomEvent<PaymentSubmitPayload & { error: string }>) => void`

**Example:**

```tsx
<BloqueCheckout
  onError={(event) => {
    console.error('Payment error:', event.detail.error);
  }}
  onSubmit={handleSubmit}
/>
```

#### `className`

CSS class name for the component wrapper.

**Type:** `string`

**Example:**

```tsx
<BloqueCheckout
  className="my-checkout"
  onSubmit={handleSubmit}
/>
```

#### `style`

Inline styles for the component wrapper.

**Type:** `React.CSSProperties`

**Example:**

```tsx
<BloqueCheckout
  style={{ maxWidth: '500px', margin: '0 auto' }}
  onSubmit={handleSubmit}
/>
```

## PaymentSubmitPayload

The payload passed to `onSubmit` depends on the selected payment method:

### Card Payment

```typescript
{
  type: 'card',
  data: {
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    email?: string;
  }
}
```

### PSE Payment

```typescript
{
  type: 'pse',
  data: {
    email: string;
    personType: 'natural' | 'juridica';
    documentType: string;
    documentNumber: string;
    bankCode: string;
  }
}
```

### Cash Payment

```typescript
{
  type: 'cash',
  data: {
    email: string;
    documentType: string;
    documentNumber: string;
    fullName: string;
  }
}
```

## Complete Example

```tsx
import { BloqueCheckout } from '@bloque/payments-react';
import { useState } from 'react';

function CheckoutPage() {
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
        window.location.href = '/success';
      } else if (result.redirect_url) {
        // For PSE, redirect to bank
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
    <div className="checkout-container">
      <h1>Complete Your Payment</h1>

      {error && (
        <div className="error-message">{error}</div>
      )}

      <BloqueCheckout
        amount={99900}
        availableMethods={['card', 'pse', 'cash']}
        onSubmit={handleSubmit}
        appearance={{
          variables: {
            colorPrimary: '#6366f1',
          },
        }}
      />

      {loading && <div className="loading">Processing payment...</div>}
    </div>
  );
}
```

## Integration with Backend

The typical flow:

1. User fills out the payment form
2. `onSubmit` is called with payment data
3. Send data to your backend API
4. Backend processes payment using `@bloque/payments-sdk`
5. Return result to frontend
6. Redirect or display error based on result

**Backend API Example:**

```typescript
import { Bloque } from '@bloque/payments-sdk';

export async function POST(request: Request) {
  const { checkoutId, payment } = await request.json();

  const bloque = new Bloque({
    server: 'production',
    apiKey: process.env.BLOQUE_API_KEY!,
  });

  try {
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

## Best Practices

1. **Always validate on backend** - Never trust client-side data
2. **Handle loading states** - Show user feedback during payment
3. **Display clear errors** - Help users fix validation issues
4. **Test all payment methods** - Each method has different flows
5. **Use HTTPS in production** - Required for PCI compliance
6. **Store sensitive data securely** - Never log card numbers
7. **Handle PSE redirects** - PSE requires redirecting to bank website
