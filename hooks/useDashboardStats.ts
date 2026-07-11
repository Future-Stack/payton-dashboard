import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/api/dashboardService';

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: dashboardService.getStats,
    refetchInterval: 5 * 60 * 1000, // Optional: refetch every 5 minutes
    staleTime: 1 * 60 * 1000, // Data stays fresh for 1 minute
  });
};
