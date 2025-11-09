// lib/api/client.ts
import axios from 'axios';
import { env } from '@/lib/config/env';
import { useAuthStore } from '@/lib/store/auth.store';

/**
 * API Client - HTTP Layer
 * Rule 5: Services use this client for all HTTP requests
 * Handles:
 * - Base URL configuration
 * - Request/response interceptors
 * - Authentication token injection
 * - Error handling
 */
export const apiClient = axios.create({
  baseURL: env.API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Inject auth token
apiClient.interceptors.request.use(config => {
  const { token, tenantId } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenantId) {
    (config.headers as any)['X-Tenant-Id'] = tenantId;
  }
  return config;
});

// Response interceptor: Handle errors globally
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth on 401 Unauthorized
      useAuthStore.getState().clearAuth();
    }
    throw error.response?.data || { message: 'Unknown error' };
  }
);