import { setupWorker } from 'msw';
import { handlers } from '@/lib/api/mock/handlers';

export const worker = setupWorker(...handlers);

export const startMock = async () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_MOCK_ENABLED === 'true') {
    await worker.start({ onUnhandledRequest: 'bypass' });
  }
};