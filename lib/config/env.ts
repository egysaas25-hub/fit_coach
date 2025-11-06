// lib/config/env.ts
export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  MOCK_ENABLED: process.env.NEXT_PUBLIC_MOCK_ENABLED === 'true',
};