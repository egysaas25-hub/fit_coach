// lib/hooks/api/useSettings.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsService, AppSettings } from '@/lib/api/services/settings.service';

const settingsService = new SettingsService();

/**
 * Hook for app settings
 * Rule 1: Component calls hook
 * Rule 2: Hook calls service
 */
export const useSettings = () => {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => settingsService.getSettings(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Mutation: Update settings
 */
export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (settings: Partial<AppSettings>) => settingsService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
};