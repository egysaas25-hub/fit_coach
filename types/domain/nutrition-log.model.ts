export enum NutritionLogStatus {
  ADHERED = 'adhered',
  PARTIAL = 'partial',
  SKIPPED = 'skipped',
}

export interface NutritionLog {
  id: number;
  tenantId: number;
  customerId: string;
  nutritionPlanId: number;
  status: NutritionLogStatus;
  notes: string | null;
  loggedAt: Date;
  createdAt: Date;
}