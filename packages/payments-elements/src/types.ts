export type PaymentMethodType = 'card' | 'pse' | 'cash';

export interface PaymentMethod {
  type: PaymentMethodType;
  label: string;
  description: string;
  icon?: string;
}

export const PAYMENT_METHODS: Record<PaymentMethodType, PaymentMethod> = {
  card: {
    type: 'card',
    label: 'Tarjeta de Crédito/Débito',
    description: 'Paga con tu tarjeta de crédito o débito',
  },
  pse: {
    type: 'pse',
    label: 'PSE',
    description: 'Pago seguro en línea con tu banco',
  },
  cash: {
    type: 'cash',
    label: 'Efectivo',
    description: 'Genera un recibo para pagar en efectivo',
  },
};

export interface CheckoutConfig {
  payment_methods?: PaymentMethodType[];
  amount?: number;
  currency?: string;
}

export interface AppearanceConfig {
  primaryColor?: string;
  borderRadius?: string;
  fontFamily?: string;
}
