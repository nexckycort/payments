# Customization

Customize the appearance of the `BloqueCheckout` component to match your brand.

## Appearance Configuration

Use the `appearance` prop to customize colors, fonts, spacing, and more.

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

## Theme

Choose between light and dark themes:

```tsx
// Light theme (default)
<BloqueCheckout
  appearance={{ theme: 'light' }}
  onSubmit={handleSubmit}
/>

// Dark theme
<BloqueCheckout
  appearance={{ theme: 'dark' }}
  onSubmit={handleSubmit}
/>
```

## CSS Variables

Customize specific aspects using CSS variables:

### Colors

```tsx
<BloqueCheckout
  appearance={{
    variables: {
      colorPrimary: '#6366f1',        // Primary brand color
      colorBackground: '#ffffff',      // Background color
      colorText: '#1f2937',            // Text color
      colorTextSecondary: '#6b7280',   // Secondary text color
      colorBorder: '#e5e7eb',          // Border color
      colorError: '#ef4444',           // Error color
      colorSuccess: '#10b981',         // Success color
    },
  }}
  onSubmit={handleSubmit}
/>
```

### Typography

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

### Spacing and Sizing

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

## Complete Customization Example

```tsx
<BloqueCheckout
  appearance={{
    theme: 'light',
    variables: {
      // Colors
      colorPrimary: '#6366f1',
      colorBackground: '#ffffff',
      colorText: '#1f2937',
      colorTextSecondary: '#6b7280',
      colorBorder: '#e5e7eb',
      colorError: '#ef4444',
      colorSuccess: '#10b981',

      // Typography
      fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '16px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '600',

      // Spacing
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

## Custom CSS

For advanced customization, you can target the component with custom CSS:

```tsx
<BloqueCheckout
  className="custom-checkout"
  onSubmit={handleSubmit}
/>
```

```css
.custom-checkout {
  max-width: 500px;
  margin: 0 auto;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Override internal styles if needed */
.custom-checkout bloque-checkout {
  --color-primary: #6366f1;
  --border-radius: 12px;
}
```

## Responsive Styles

The component is responsive by default, but you can add custom breakpoints:

```css
.custom-checkout {
  padding: 24px;
}

@media (max-width: 640px) {
  .custom-checkout {
    padding: 16px;
  }
}
```

## Dark Mode Example

Create a dark-themed checkout:

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

## Brand Color Examples

Match your brand:

### Blue (Default)

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#6366f1' },
  }}
  onSubmit={handleSubmit}
/>
```

### Purple

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#a855f7' },
  }}
  onSubmit={handleSubmit}
/>
```

### Green

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#10b981' },
  }}
  onSubmit={handleSubmit}
/>
```

### Red

```tsx
<BloqueCheckout
  appearance={{
    variables: { colorPrimary: '#ef4444' },
  }}
  onSubmit={handleSubmit}
/>
```

## Complete AppearanceConfig Type

```typescript
interface AppearanceConfig {
  theme?: 'light' | 'dark';
  variables?: {
    // Colors
    colorPrimary?: string;
    colorBackground?: string;
    colorText?: string;
    colorTextSecondary?: string;
    colorBorder?: string;
    colorError?: string;
    colorSuccess?: string;
    colorWarning?: string;
    colorInfo?: string;

    // Typography
    fontFamily?: string;
    fontSize?: string;
    fontWeightNormal?: string;
    fontWeightMedium?: string;
    fontWeightBold?: string;

    // Spacing
    borderRadius?: string;
    borderWidth?: string;
    spacingUnit?: string;
    inputHeight?: string;
    buttonHeight?: string;

    // Shadows
    boxShadow?: string;
    boxShadowFocus?: string;
  };
}
```

## Best Practices

1. **Use CSS variables** for easy theme switching
2. **Test both light and dark modes** if you support both
3. **Ensure sufficient contrast** for accessibility
4. **Test on mobile devices** for responsive design
5. **Keep it consistent** with your application's design system
6. **Don't override security features** like input masking
