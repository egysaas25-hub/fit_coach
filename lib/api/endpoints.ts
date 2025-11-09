// lib/api/endpoints.ts
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    currentUser: '/auth/user',
  },
  admin: {
    analytics: {
      dashboard: '/admin/analytics/dashboard',
      clients: '/admin/analytics/clients',
      trainers: '/admin/analytics/trainers',
    },
    users: '/admin/users',
    settings: '/admin/settings',
  },
  appointment: '/appointments',
  checkIn: '/check-ins',
  client: '/clients',
  customerMetric: '/customer-metrics',
  message: '/messages',
  metricDefinition: '/metric-definitions',
  notification: '/notifications',
  nutrition: '/nutrition-plans',
  nutritionLog: '/nutrition-logs',
  progress: '/progress',
  referral: '/referrals',
  trainer: '/trainers',
  workout: '/workouts',
  workoutLog: '/workout-logs',
};