# Componente BloqueCheckout

El componente `BloqueCheckout` proporciona un formulario de pago completo con soporte para múltiples métodos de pago.

## Uso Básico

```tsx
import { BloqueCheckout } from '@bloque/payments-react';

function App() {
  return (
    <BloqueCheckout
      amount={99900}
      onSubmit={async (payload) => {
        console.log('Pago enviado:', payload);
      }}
    />
  );
}
```

## Props

### Props Requeridas

#### `onSubmit`

Función callback llamada cuando el usuario envía el formulario de pago.

**Tipo:** `(payload: PaymentSubmitPayload) => Promise<void>`

**Ejemplo:**

```tsx
const handleSubmit = async (payload) => {
  try {
    const response = await fetch('/api/pagos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkoutId: 'checkout_123',
        payment: payload,
      }),
    });

    if (response.ok) {
      console.log('Pago exitoso');
    }
  } catch (error) {
    console.error('Pago fallido:', error);
  }
};

<BloqueCheckout onSubmit={handleSubmit} />
```

### Props Opcionales

#### `amount`

El monto del pago a mostrar (en centavos).

**Tipo:** `number`

**Ejemplo:**

```tsx
<BloqueCheckout
  amount={50000} // $500.00
  onSubmit={handleSubmit}
/>
```

#### `availableMethods`

Métodos de pago a habilitar en el formulario.

**Tipo:** `Array<'card' | 'pse' | 'cash'>`

**Predeterminado:** `['card', 'pse', 'cash']`

**Ejemplo:**

```tsx
<BloqueCheckout
  availableMethods={['card', 'pse']} // Solo tarjetas y PSE
  onSubmit={handleSubmit}
/>
```

#### `requireEmail`

Si se requiere entrada de email.

**Tipo:** `boolean`

**Predeterminado:** `true`

#### `showMethodSelector`

Si se muestra el selector de método de pago.

**Tipo:** `boolean`

**Predeterminado:** `true`

#### `appearance`

Personaliza la apariencia del componente.

**Tipo:** `AppearanceConfig`

**Ejemplo:**

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

Ver [Personalización](/react/customization) para más detalles.

## PaymentSubmitPayload

El payload pasado a `onSubmit` depende del método de pago seleccionado:

### Pago con Tarjeta

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

### Pago PSE

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

### Pago en Efectivo

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

## Ejemplo Completo

```tsx
import { BloqueCheckout } from '@bloque/payments-react';
import { useState } from 'react';

function PaginaCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutId: 'checkout_123',
          payment: payload,
        }),
      });

      const result = await response.json();

      if (result.status === 'approved') {
        window.location.href = '/exito';
      } else if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        setError(result.message || 'Pago fallido');
      }
    } catch (err) {
      setError('Ocurrió un error. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Completa tu Pago</h1>

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

      {loading && <div className="loading">Procesando pago...</div>}
    </div>
  );
}
```

## Mejores Prácticas

1. **Siempre valida en el backend** - Nunca confíes en datos del cliente
2. **Maneja estados de carga** - Muestra retroalimentación al usuario durante el pago
3. **Muestra errores claros** - Ayuda a los usuarios a corregir problemas de validación
4. **Prueba todos los métodos de pago** - Cada método tiene flujos diferentes
5. **Usa HTTPS en producción** - Requerido para cumplimiento PCI
6. **Maneja redirecciones PSE** - PSE requiere redirigir al sitio web del banco
