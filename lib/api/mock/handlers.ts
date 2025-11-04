import { rest } from 'msw';
import { endpoints } from '@/lib/api/endpoints';
import {
  mockUsers, mockClients, mockWorkouts, mockAppointments, mockCheckIns,
  mockCustomerMetrics, mockMessageThreads, mockMessages, mockMetricDefinitions,
  mockNotifications, mockNutritionPlans, mockNutritionLogs, mockProgressEntries,
  mockReferrals, mockTenants, mockTrainers, mockWorkoutLogs
} from '@/lib/api/mock/data';

export const handlers = [
  // Auth
  rest.post(endpoints.auth.login, async (req, res, ctx) => {
    const { email, password, type } = await req.json();
    const user = mockUsers.find(u => u.email === email && u.password === password && u.type === type);
    if (!user) return res(ctx.status(401), ctx.json({ message: 'Invalid credentials' }));
    return res(ctx.delay(300), ctx.json({ user: user.user, access_token: 'mock-token' }));
  }),

  // Clients
  rest.get(endpoints.client, (req, res, ctx) => {
    const tenantId = req.url.searchParams.get('tenant_id');
    const data = tenantId ? mockClients.filter(c => c.tenant_id === Number(tenantId)) : mockClients;
    return res(ctx.delay(300), ctx.json(data));
  }),
  rest.get(`${endpoints.client}/:id`, (req, res, ctx) => {
    const client = mockClients.find(c => c.id === req.params.id);
    return client ? res(ctx.delay(300), ctx.json(client)) : res(ctx.status(404));
  }),
  rest.post(endpoints.client, async (req, res, ctx) => {
    const newClient = { id: faker.string.uuid(), ...await req.json(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockClients.push(newClient);
    return res(ctx.delay(300), ctx.json(newClient));
  }),
  rest.put(`${endpoints.client}/:id`, async (req, res, ctx) => {
    const client = mockClients.find(c => c.id === req.params.id);
    if (!client) return res(ctx.status(404));
    Object.assign(client, await req.json(), { updated_at: new Date().toISOString() });
    return res(ctx.delay(300), ctx.json(client));
  }),

  // Appointments
  rest.get(endpoints.appointment, (req, res, ctx) => {
    const tenantId = req.url.searchParams.get('tenant_id');
    const data = tenantId ? mockAppointments.filter(a => a.tenant_id === Number(tenantId)) : mockAppointments;
    return res(ctx.delay(300), ctx.json(data));
  }),
  rest.get(`${endpoints.appointment}/:id`, (req, res, ctx) => {
    const appointment = mockAppointments.find(a => a.id === Number(req.params.id));
    return appointment ? res(ctx.delay(300), ctx.json(appointment)) : res(ctx.status(404));
  }),
  rest.post(endpoints.appointment, async (req, res, ctx) => {
    const newAppointment = { id: faker.number.int({ min: 1000, max: 9999 }), ...await req.json(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    mockAppointments.push(newAppointment);
    return res(ctx.delay(300), ctx.json(newAppointment));
  }),
  rest.put(`${endpoints.appointment}/:id`, async (req, res, ctx) => {
    const appointment = mockAppointments.find(a => a.id === Number(req.params.id));
    if (!appointment) return res(ctx.status(404));
    Object.assign(appointment, await req.json(), { updated_at: new Date().toISOString() });
    return res(ctx.delay(300), ctx.json(appointment));
  }),

  // Add similar handlers for check-in, customer-metric, message, metric-definition, notification, nutrition, nutrition-log, progress, referral, tenant, trainer, workout, workout-log
  // Example for Messages
  rest.get(`${endpoints.message}/threads`, (req, res, ctx) => {
    const customerId = req.url.searchParams.get('customer_id');
    const data = customerId ? mockMessageThreads.filter(t => t.customer_id === customerId) : mockMessageThreads;
    return res(ctx.delay(300), ctx.json(data));
  }),
  rest.get(endpoints.message, (req, res, ctx) => {
    const threadId = req.url.searchParams.get('thread_id');
    const data = threadId ? mockMessages.filter(m => m.thread_id === Number(threadId)) : mockMessages;
    return res(ctx.delay(300), ctx.json(data));
  }),
  rest.post(endpoints.message, async (req, res, ctx) => {
    const newMessage = { id: faker.number.int({ min: 1000, max: 9999 }), ...await req.json(), created_at: new Date().toISOString(), sent_at: new Date().toISOString(), status: 'sent' };
    mockMessages.push(newMessage);
    return res(ctx.delay(300), ctx.json(newMessage));
  }),

  // Add handlers for remaining endpoints...
];