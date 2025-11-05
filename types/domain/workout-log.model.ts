export enum WorkoutLogStatus {
  COMPLETED = 'completed',
  PARTIAL = 'partial',
  SKIPPED = 'skipped',
}

export interface WorkoutLog {
  id: number;
  tenantId: number;
  customerId: string;
  trainingPlanId: number;
  status: WorkoutLogStatus;
  notes: string | null;
  loggedAt: Date;
  createdAt: Date;
}