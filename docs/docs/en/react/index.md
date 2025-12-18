# React Components

The Bloque Payments React library provides pre-built components for accepting payments in your React applications.

## Installation

```bash
npm install @bloque/payments-react
```

## Requirements

- React 16.9.0 or later
- react-dom 16.9.0 or later

## Quick Example

```tsx
import { BloqueCheckout } from '@bloque/payments-react';

function CheckoutPage() {
  const handleSubmit = async (payload) => {
    // Send payment data to your backend
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      window.location.href = '/success';
    }
  };

  return (
    <BloqueCheckout
      amount={99900}
      onSubmit={handleSubmit}
      availableMethods={['card', 'pse', 'cash']}
    />
  );
}
```

## Key Features

- **Drop-in Component**: Easy integration with minimal code
- **Multiple Payment Methods**: Support for cards, PSE, and cash
- **Customizable Appearance**: Style to match your brand
- **TypeScript Support**: Full type definitions included
- **Form Validation**: Built-in validation for all payment methods
- **Responsive Design**: Works on desktop and mobile

## Components

The library currently provides one main component:

- `BloqueCheckout`: Full-featured checkout component with payment method selection

## How It Works

The `BloqueCheckout` component is a React wrapper around a Web Component:

1. The component renders a payment form
2. User selects payment method and fills in details
3. Form is validated client-side
4. On submit, payment data is passed to your `onSubmit` handler
5. Your backend processes the payment using the SDK
6. You redirect the user based on the result

## Next Steps

- [BloqueCheckout Component](/react/bloque-checkout) - Complete component documentation
- [Customization](/react/customization) - Style the component to match your brand
- [Examples](/examples/) - See real-world usage examples
