// lib/hooks/api/useReports.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReportService } from '@/lib/api/services/report.service';
import { Report, ReportType } from '@/types/domain/report';

const reportService = new ReportService();

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportService.getReports(),
    staleTime: 60_000,
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (type: ReportType) => reportService.generateReport(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useExportReport() {
  return useMutation({
    mutationFn: (reportId: string) => reportService.exportReport(reportId),
  });
}