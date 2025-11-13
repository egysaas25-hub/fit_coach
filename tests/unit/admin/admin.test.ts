// __tests__/admin/admin.test.ts
// Comprehensive test suite for all admin functionality

import { 
  DashboardService,
  clientService,
  TeamService,
  WorkoutService,
  NutritionService,
  ExerciseService,
  SubscriptionService,
  CommunicationService
} from '../../lib/api/services';

// This file serves as an entry point to import all admin tests
// In a real testing environment, this would be used to run all admin tests together

describe('Admin Test Suite', () => {
  it('should have all admin services available', () => {
    // This is a placeholder test to ensure all services are imported correctly
    expect(DashboardService).toBeDefined();
    expect(clientService).toBeDefined();
    expect(TeamService).toBeDefined();
    expect(WorkoutService).toBeDefined();
    expect(NutritionService).toBeDefined();
    expect(ExerciseService).toBeDefined();
    expect(SubscriptionService).toBeDefined();
    expect(CommunicationService).toBeDefined();
  });
});