// lib/api/mock/interceptors.ts
import { setupWorker } from 'msw';
import { handlers } from '@/lib/api/mock/handlers';

export const worker = setupWorker(...handlers);

export const startMock = async () => {
  if (typeof window !== 'undefined') {
    await worker.start();
  }
};