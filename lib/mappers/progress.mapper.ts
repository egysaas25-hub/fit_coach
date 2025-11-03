import { ProgressEntryResponseDto, ProgressChartDataDto } from '@/types/api/progress.dto';
import { ProgressEntry, ProgressChart, MetricCategory } from '@/types/models/progress.model';

export const progressMapper = {
  toEntryModel: (dto: ProgressEntryResponseDto): ProgressEntry => ({
    id: dto.id,
    customerId: dto.customer_id,
    value: dto.metric_value,
    category: dto.category as MetricCategory,
    recordedAt: new Date(dto.recorded_at),
  }),
  toChartModel: (dto: ProgressChartDataDto): ProgressChart => ({
    customerId: dto.customer_id,
    category: dto.category as MetricCategory,
    data: dto.data.map(d => ({ date: new Date(d.date), value: d.value })),
  }),
};