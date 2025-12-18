# Ejemplos

Ejemplos del mundo real de integración de Bloque Payments en tus aplicaciones.

## Ejemplos de Node.js

### API Express.js

Flujo completo de checkout y pago con Express:

```typescript
import express from 'express';
import { Bloque } from '@bloque/payments-sdk';

const app = express();
app.use(express.json());

const bloque = new Bloque({
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
  apiKey: process.env.BLOQUE_API_KEY!,
});

// Endpoint para crear checkout
app.post('/api/checkouts', async (req, res) => {
  try {
    const { items, metadata } = req.body;

    const checkout = await bloque.checkout.create({
      name: `Orden ${Date.now()}`,
      items,
      success_url: `${req.protocol}://${req.get('host')}/exito`,
      cancel_url: `${req.protocol}://${req.get('host')}/cancelar`,
      metadata,
    });

    res.json(checkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para procesar pago
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

// Obtener estado del checkout
app.get('/api/checkouts/:id', async (req, res) => {
  try {
    const checkout = await bloque.checkout.retrieve(req.params.id);
    res.json(checkout);
  } catch (error) {
    res.status(404).json({ error: 'Checkout no encontrado' });
  }
});

app.listen(3000, () => {
  console.log('Servidor ejecutándose en puerto 3000');
});
```

### Rutas API de Next.js

Usando Bloque con Next.js App Router:

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
      success_url: `${process.env.NEXT_PUBLIC_URL}/exito`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cancelar`,
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

## Ejemplos de React

### Página de Next.js

Página de checkout completa con Next.js:

```tsx
// app/checkout/page.tsx
'use client';

import { BloqueCheckout } from '@bloque/payments-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaginaCheckout() {
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
        router.push('/exito');
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
            <p className="mt-4 text-gray-700">Procesando pago...</p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Variables de Entorno

Ejemplo de archivo `.env`:

```bash
# Sandbox (para desarrollo)
BLOQUE_API_KEY=sk_sandbox_tu_clave_aqui

# Producción
BLOQUE_API_KEY=sk_live_tu_clave_aqui

# URL de la App
NEXT_PUBLIC_URL=https://tuapp.com
```

## Mejores Prácticas

1. **Siempre usa variables de entorno** para claves de API
2. **Valida entrada** tanto en cliente como en servidor
3. **Maneja todos los casos de error** gracefully
4. **Prueba en sandbox** antes de desplegar a producción
5. **Almacena IDs de checkout** para seguimiento de órdenes
6. **Usa metadata** para vincular pagos con tus registros
7. **Implementa webhooks** para notificaciones de pago confiables
