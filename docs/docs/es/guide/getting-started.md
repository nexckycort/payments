# Inicio Rápido

Bienvenido a Bloque Payments! Esta guía te ayudará a integrar procesamiento de pagos en tus aplicaciones Node.js y React.

## Descripción General

Bloque Payments proporciona dos paquetes principales:

- **@bloque/payments-sdk**: SDK de Node.js para crear checkouts y procesar pagos en tu backend
- **@bloque/payments-react**: Componentes React para integrar formularios de pago en tu frontend

## Requisitos Previos

- Node.js 22 o superior
- Una cuenta de Bloque con credenciales de API
- Conocimiento básico de TypeScript/JavaScript

## Inicio Rápido

### 1. Obtén tus Claves de API

Primero, regístrate en Bloque y obtén tus claves de API:

1. Ve al [Panel de Bloque](https://bloque.app/dashboard)
2. Navega a la sección de Claves de API
3. Copia tu **Clave de API de Sandbox** para pruebas
4. Más adelante, obtendrás una **Clave de API de Producción** para pagos reales

### 2. Instala los Paquetes

Elige el/los paquete(s) que necesites:

```bash
# Para backend de Node.js
npm install @bloque/payments-sdk

# Para frontend de React
npm install @bloque/payments-react
```

### 3. Crea tu Primer Checkout

Aquí hay un ejemplo mínimo usando el SDK de Node.js:

```typescript
import { Bloque } from '@bloque/payments-sdk';

const bloque = new Bloque({
  server: 'sandbox',
  apiKey: 'tu_clave_de_api_sandbox',
});

const checkout = await bloque.checkout.create({
  name: 'Orden #1234',
  description: 'Suscripción premium',
  items: [
    {
      name: 'Plan Premium',
      amount: 99900, // $999.00 en centavos
      quantity: 1,
    },
  ],
  success_url: 'https://tuapp.com/exito',
  cancel_url: 'https://tuapp.com/cancelar',
});

console.log('URL de Checkout:', checkout.url);
// Envía esta URL a tu cliente
```

### 4. Muestra el Formulario de Pago (React)

Si deseas integrar el formulario de pago directamente en tu aplicación React:

```tsx
import { BloqueCheckout } from '@bloque/payments-react';

function PaginaCheckout() {
  const handleSubmit = async (payload) => {
    // Envía los datos de pago a tu backend
    const response = await fetch('/api/procesar-pago', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // Pago exitoso
      window.location.href = '/exito';
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

## Flujo de Pago

El flujo típico de pago con Bloque Payments:

1. **Backend**: Crea una sesión de checkout con el SDK
2. **Frontend**: Muestra la URL de checkout o integra el formulario de pago
3. **Cliente**: Selecciona el método de pago y completa el pago
4. **Backend**: Recibe notificación webhook (opcional)
5. **Frontend**: Redirige a la página de éxito

## Métodos de Pago Soportados

Bloque Payments soporta múltiples métodos de pago para Colombia:

- **Tarjetas de Crédito/Débito**: Visa, Mastercard, American Express
- **PSE**: Transferencias bancarias a través del sistema PSE de Colombia
- **Efectivo**: Efecty, Baloto y otros puntos de pago en efectivo

## Entornos

Bloque Payments proporciona dos entornos:

- **Sandbox**: Para pruebas y desarrollo (usa tarjetas de prueba)
- **Producción**: Para pagos reales con dinero real

Siempre prueba tu integración en sandbox antes de pasar a producción.

## Próximos Pasos

- Aprende más sobre el [SDK de Node.js](/sdk/)
- Explora los [componentes React](/react/)
- Revisa los [ejemplos de código](/examples/)
- Consulta la [Referencia de API](/sdk/api-reference)
