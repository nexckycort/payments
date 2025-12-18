# Componentes React

La librería React de Bloque Payments proporciona componentes preconstruidos para aceptar pagos en tus aplicaciones React.

## Instalación

```bash
npm install @bloque/payments-react
```

## Requisitos

- React 16.9.0 o superior
- react-dom 16.9.0 o superior

## Ejemplo Rápido

```tsx
import { BloqueCheckout } from '@bloque/payments-react';

function PaginaCheckout() {
  const handleSubmit = async (payload) => {
    // Envía los datos de pago a tu backend
    const response = await fetch('/api/procesar-pago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
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

## Características Principales

- **Componente Drop-in**: Integración fácil con código mínimo
- **Múltiples Métodos de Pago**: Soporte para tarjetas, PSE y efectivo
- **Apariencia Personalizable**: Estiliza para que coincida con tu marca
- **Soporte TypeScript**: Definiciones de tipos completas incluidas
- **Validación de Formularios**: Validación incorporada para todos los métodos de pago
- **Diseño Responsivo**: Funciona en escritorio y móvil

## Componentes

La librería actualmente proporciona un componente principal:

- `BloqueCheckout`: Componente de checkout completo con selección de método de pago

## Cómo Funciona

El componente `BloqueCheckout` es un wrapper de React alrededor de un Web Component:

1. El componente renderiza un formulario de pago
2. El usuario selecciona el método de pago y completa los detalles
3. El formulario se valida del lado del cliente
4. Al enviar, los datos de pago se pasan a tu manejador `onSubmit`
5. Tu backend procesa el pago usando el SDK
6. Redirige al usuario según el resultado

## Próximos Pasos

- [Componente BloqueCheckout](/react/bloque-checkout) - Documentación completa del componente
- [Personalización](/react/customization) - Estiliza el componente para que coincida con tu marca
- [Ejemplos](/examples/) - Ve ejemplos de uso en el mundo real
