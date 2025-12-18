# Getting Started

Welcome to Bloque Payments! This guide will help you integrate payment processing into your Node.js and React applications.

## Overview

Bloque Payments provides two main packages:

- **@bloque/payments-sdk**: Node.js SDK for creating checkouts and processing payments in your backend
- **@bloque/payments-react**: React components for embedding payment forms in your frontend

## Prerequisites

- Node.js 22 or later
- A Bloque account with API credentials
- Basic knowledge of TypeScript/JavaScript

## Quick Start

### 1. Get Your API Keys

First, sign up for a Bloque account and get your API keys:

1. Go to [Bloque Dashboard](https://bloque.app/dashboard)
2. Navigate to API Keys section
3. Copy your **Sandbox API Key** for testing
4. Later, you'll get a **Production API Key** for live payments

### 2. Install the Packages

Choose the package(s) you need:

```bash
# For Node.js backend
npm install @bloque/payments-sdk

# For React frontend
npm install @bloque/payments-react
```

### 3. Create Your First Checkout

Here's a minimal example using the Node.js SDK:

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: 'your_sandbox_api_key',
});

const checkout = await bloque.checkout.create({
  name: 'Order #1234',
  description: 'Premium subscription',
  items: [
    {
      name: 'Premium Plan',
      amount: 99900, // $999.00 in cents
      quantity: 1,
    },
  ],
  success_url: 'https://yourapp.com/success',
  cancel_url: 'https://yourapp.com/cancel',
});

console.log('Checkout URL:', checkout.url);
// Send this URL to your customer
```

### 4. Display Payment Form (React)

If you want to embed the payment form directly in your React app:

```tsx
import { BloqueCheckout } from '@bloque/payments-react';

function CheckoutPage() {
  const handleSubmit = async (payload) => {
    // Send payment data to your backend
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Payment successful
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

## Payment Flow

The typical payment flow with Bloque Payments:

1. **Backend**: Create a checkout session with the SDK
2. **Frontend**: Display the checkout URL or embed the payment form
3. **Customer**: Selects payment method and completes payment
4. **Backend**: Receive webhook notification (optional)
5. **Frontend**: Redirect to success page

## Supported Payment Methods

Bloque Payments supports multiple payment methods for Colombia:

- **Credit/Debit Cards**: Visa, Mastercard, American Express
- **PSE**: Bank transfers through Colombia's PSE system
- **Cash**: Efecty, Baloto, and other cash payment points

## Environments

Bloque Payments provides two environments:

- **Sandbox**: For testing and development (use test cards)
- **Production**: For real payments with real money

Always test your integration in sandbox before going live.

## Next Steps

- Learn more about the [Node.js SDK](/sdk/)
- Explore [React components](/react/)
- Check out [code examples](/examples/)
- Review the [API Reference](/sdk/api-reference)
