// lib/api/client.ts
import axios from 'axios';
import { env } from '@/lib/config/env';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    throw error.response?.data || { message: 'Unknown error' };
  }
);