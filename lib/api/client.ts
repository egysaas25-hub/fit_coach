// lib/api/client.ts
import axios from 'axios';
import { env } from '@/lib/config/env';
import { useAuthStore } from '@/lib/store/auth.store';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const { token } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    throw error.response?.data || { message: 'Unknown error' };
  }
);