# Personalización

Personaliza la apariencia del componente `BloqueCheckout` para que coincida con tu marca.

## Configuración de Apariencia

Usa la prop `appearance` para personalizar colores, fuentes, espaciado y más.

```tsx
<BloqueCheckout
  appearance={{
    theme: 'light',
    variables: {
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      borderRadius: '8px',
      fontFamily: 'Inter, sans-serif',
    },
  }}
  onSubmit={handleSubmit}
/>
```

## Tema

Elige entre temas claro y oscuro:

```tsx
// Tema claro (predeterminado)
<BloqueCheckout
  appearance={{ theme: 'light' }}
  onSubmit={handleSubmit}
/>

// Tema oscuro
<BloqueCheckout
  appearance={{ theme: 'dark' }}
  onSubmit={handleSubmit}
/>
```

## Variables CSS

Personaliza aspectos específicos usando variables CSS:

### Colores

```tsx
<BloqueCheckout
  appearance={{
    variables: {
      colorPrimary: '#6366f1',        // Color principal de la marca
      colorBackground: '#ffffff',      // Color de fondo
      colorText: '#1f2937',            // Color del texto
      colorTextSecondary: '#6b7280',   // Color del texto secundario
      colorBorder: '#e5e7eb',          // Color del borde
      colorError: '#ef4444',           // Color de error
      colorSuccess: '#10b981',         // Color de éxito
    },
  }}
  onSubmit={handleSubmit}
/>
```

### Tipografía

```tsx
<BloqueCheckout
  appearance={{
    variables: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '16px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '600',
    },
  }}
  onSubmit={handleSubmit}
/>
```

### Espaciado y Tamaño

```tsx
<BloqueCheckout
  appearance={{
    variables: {
      borderRadius: '8px',
      borderWidth: '1px',
      spacingUnit: '8px',
      inputHeight: '44px',
      buttonHeight: '48px',
    },
  }}
  onSubmit={handleSubmit}
/>
```

## Ejemplo de Personalización Completa

```tsx
<BloqueCheckout
  appearance={{
    theme: 'light',
    variables: {
      // Colores
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorBorder: '#e5e7eb',
      colorError: '#ef4444',
      colorSuccess: '#10b981',

      // Tipografía
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '16px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '600',

      // Espaciado
      borderRadius: '12px',
      borderWidth: '1px',
      spacingUnit: '8px',
      inputHeight: '48px',
      buttonHeight: '52px',
    },
  }}
  onSubmit={handleSubmit}
/>
```

## CSS Personalizado

Para personalización avanzada, puedes apuntar al componente con CSS personalizado:

```tsx
<BloqueCheckout
  className="checkout-personalizado"
  onSubmit={handleSubmit}
/>
```

```css
.checkout-personalizado {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

## Ejemplo de Modo Oscuro

Crea un checkout con tema oscuro:

```tsx
<BloqueCheckout
  appearance={{
    theme: 'dark',
    variables: {
      colorPrimary: '#818cf8',
      colorBackground: '#1f2937',
      colorText: '#f9fafb',
      colorTextSecondary: '#d1d5db',
      colorBorder: '#374151',
      borderRadius: '8px',
    },
  }}
  onSubmit={handleSubmit}
/>
```

## Ejemplos de Colores de Marca

Coincide con tu marca:

### Azul (Predeterminado)

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#6366f1' },
  }}
  onSubmit={handleSubmit}
/>
```

### Púrpura

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#a855f7' },
  }}
  onSubmit={handleSubmit}
/>
```

### Verde

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#10b981' },
  }}
  onSubmit={handleSubmit}
/>
```

## Mejores Prácticas

1. **Usa variables CSS** para cambio fácil de tema
2. **Prueba modos claro y oscuro** si soportas ambos
3. **Asegura contraste suficiente** para accesibilidad
4. **Prueba en dispositivos móviles** para diseño responsivo
5. **Mantenlo consistente** con el sistema de diseño de tu aplicación
