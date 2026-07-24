// iyzico Sandbox Configuration & Helper Functions

export const IYZICO_CONFIG = {
  apiKey: import.meta.env.VITE_IYZICO_API_KEY || 'sandbox-api-key-placeholder',
  secretKey: import.meta.env.VITE_IYZICO_SECRET_KEY || 'sandbox-secret-key-placeholder',
  baseUrl: 'https://sandbox-api.iyzipay.com',
};

// Plan Prices in Turkish Lira (TRY)
export const IYZICO_PLAN_PRICES = {
  'Starter Plan': { price: 499, formatted: '₺499', period: '/ay' },
  'Professional Plan': { price: 1499, formatted: '₺1.499', period: '/ay' },
  'Enterprise Plan': { price: 4999, formatted: '₺4.999', period: '/ay' },
};

// Official iyzico Test Credit Cards for Sandbox Testing
export const IYZICO_TEST_CARDS = [
  {
    name: 'Başarılı Ödeme (MasterCard)',
    number: '5528 7900 0000 0001',
    expiry: '12/28',
    cvc: '123',
    status: 'success',
  },
  {
    name: 'Başarılı Ödeme (Visa)',
    number: '4543 6000 0000 0001',
    expiry: '06/29',
    cvc: '456',
    status: 'success',
  },
  {
    name: 'Yetersiz Bakiye (3D Secure)',
    number: '5528 7900 0000 0002',
    expiry: '10/27',
    cvc: '789',
    status: 'insufficient_balance',
  },
];
