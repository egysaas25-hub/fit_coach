// lib/api/mock/handlers.ts
import { rest } from 'msw';
import { endpoints } from '@/lib/api/endpoints';
import { mockClients, mockWorkouts } from '@/lib/api/mock/data';

export const handlers = [
  rest.get(endpoints.client, (req, res, ctx) => {
    return res(ctx.json(mockClients));
  }),
  rest.get(endpoints.workout, (req, res, ctx) => {
    return res(ctx.json(mockWorkouts));
  }),
  // Add handlers for other endpoints
];