import { faker } from '@faker-js/faker';
import { ClientResponseDto } from '@/types/api/client.dto';
import { WorkoutResponseDto } from '@/types/api/workout.dto';
import { AppointmentResponseDto } from '@/types/api/appointment.dto';
import { CheckInResponseDto } from '@/types/api/check-in.dto';
import { CustomerMetricResponseDto } from '@/types/api/customer-metric.dto';
import { MessageResponseDto, MessageThreadResponseDto } from '@/types/api/message.dto';
import { NotificationResponseDto } from '@/types/api/notification.dto';
import { NutritionPlanResponseDto } from '@/types/api/nutrition.dto';
import { NutritionLogResponseDto } from '@/types/api/nutrition-log.dto';
import { ProgressEntryResponseDto } from '@/types/api/progress.dto';
import { ReferralResponseDto } from '@/types/api/referral.dto';
import { TrainerResponseDto } from '@/types/api/trainer.dto';
import { WorkoutLogResponseDto } from '@/types/api/workout-log.dto';
import { AuthResponseDto } from '@/types/api/auth.dto';

const generateId = () => faker.number.int({ min: 1, max: 1000 });
const generateDate = () => faker.date.recent().toISOString();
const generateTenantId = () => faker.number.int({ min: 1, max: 10 });

export const mockUsers: { email: string; password: string; type: string; user: any }[] = [
  { email: 'admin@demo.com', password: 'password', type: 'admin', user: { id: generateId(), email: 'admin@demo.com', role: 'admin', tenant_id: generateTenantId() } },
  { email: 'trainer@demo.com', password: 'password', type: 'trainer', user: { id: generateId(), email: 'trainer@demo.com', role: 'trainer', tenant_id: generateTenantId() } },
  { email: 'client@demo.com', password: 'password', type: 'client', user: { id: generateId(), email: 'client@demo.com', role: 'client', tenant_id: generateTenantId() } },
];

export const mockClients: ClientResponseDto[] = Array(50).fill(0).map(() => ({
  id: faker.string.uuid(),
  tenant_id: generateTenantId(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  phone_e164: faker.phone.number(),
  status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
  goal: faker.helpers.arrayElement(['Weight loss', 'Muscle gain', 'General fitness']),
  created_at: generateDate(),
  updated_at: generateDate(),
}));

export const mockWorkouts: WorkoutResponseDto[] = Array(100).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  version: 1,
  is_active: true,
  split: faker.helpers.arrayElement(['Full body', 'Upper body', 'Lower body']),
  notes: faker.lorem.sentence(),
  created_by: generateId(),
  created_at: generateDate(),
  training_plan_exercises: [],
}));

export const mockAppointments: AppointmentResponseDto[] = Array(30).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  trainer_id: generateId(),
  start_time: generateDate(),
  end_time: generateDate(),
  status: faker.helpers.arrayElement(['scheduled', 'completed', 'canceled']),
  created_at: generateDate(),
  updated_at: generateDate(),
}));

export const mockCheckIns: CheckInResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  check_in_date: generateDate(),
  notes: faker.lorem.sentence(),
  created_at: generateDate(),
}));

export const mockCustomerMetrics: CustomerMetricResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  metric_definition_id: generateId(),
  value: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
  recorded_at: generateDate(),
  created_at: generateDate(),
}));

export const mockMessageThreads: MessageThreadResponseDto[] = Array(20).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  channel: faker.helpers.arrayElement(['WhatsApp', 'Telegram', 'Email']),
  created_at: generateDate(),
  updated_at: generateDate(),
}));

export const mockMessages: MessageResponseDto[] = Array(200).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  thread_id: mockMessageThreads[faker.number.int({ min: 0, max: mockMessageThreads.length - 1 })].id,
  sender_id: generateId(),
  recipient_id: generateId(),
  content: faker.lorem.paragraph(),
  channel: faker.helpers.arrayElement(['WhatsApp', 'Telegram', 'Email']),
  sent_at: generateDate(),
  status: 'sent',
  created_at: generateDate(),
}));

// export const mockMetricDefinitions: MetricDefinitionResponseDto[] = Array(10).fill(0).map(() => ({
//   id: generateId(),
//   tenant_id: generateTenantId(),
//   name: faker.lorem.word(),
//   unit: faker.helpers.arrayElement(['kg', 'cm', '%']),
//   created_at: generateDate(),
// }));

export const mockNotifications: NotificationResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  recipient_id: generateId(),
  content: faker.lorem.sentence(),
  channel: faker.helpers.arrayElement(['WhatsApp', 'Email', 'Push']),
  status: faker.helpers.arrayElement(['sent', 'read', 'pending']),
  created_at: generateDate(),
}));

export const mockNutritionPlans: NutritionPlanResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  total_calories: faker.number.int({ min: 1000, max: 3000 }),
  created_at: generateDate(),
  updated_at: generateDate(),
}));

export const mockNutritionLogs: NutritionLogResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  calories: faker.number.int({ min: 500, max: 2000 }),
  log_date: generateDate(),
  created_at: generateDate(),
}));

export const mockProgressEntries: ProgressEntryResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  metric: faker.lorem.word(),
  value: faker.number.float({ min: 0, max: 100, precision: 0.1 }),
  recorded_at: generateDate(),
  created_at: generateDate(),
}));

export const mockReferrals: ReferralResponseDto[] = Array(20).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  referrer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  referee_email: faker.internet.email(),
  status: faker.helpers.arrayElement(['pending', 'accepted']),
  created_at: generateDate(),
}));

// export const mockTenants: TenantResponseDto[] = Array(10).fill(0).map(() => ({
//   id: generateTenantId(),
//   name: faker.company.name(),
//   created_at: generateDate(),
//   updated_at: generateDate(),
// }));

export const mockTrainers: TrainerResponseDto[] = Array(5).fill(0).map(() => ({
  id: faker.string.uuid(),
  tenant_id: generateTenantId(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  phone_e164: faker.phone.number(),
  status: 'active',
  created_at: generateDate(),
  updated_at: generateDate(),
}));

export const mockWorkoutLogs: WorkoutLogResponseDto[] = Array(50).fill(0).map(() => ({
  id: generateId(),
  tenant_id: generateTenantId(),
  customer_id: mockClients[faker.number.int({ min: 0, max: mockClients.length - 1 })].id,
  workout_id: mockWorkouts[faker.number.int({ min: 0, max: mockWorkouts.length - 1 })].id,
  completed_at: generateDate(),
  notes: faker.lorem.sentence(),
  created_at: generateDate(),
}));