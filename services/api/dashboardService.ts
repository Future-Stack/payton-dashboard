import { apiClient } from './axios';

export interface DashboardStatsResponse {
  statusCode: number;
  message: string;
  meta: unknown;
  data: {
    stats: {
      users: { total: number; changeText: string };
      proUsers: { total: number; changeText: string };
      reports: { total: number; today: number; changeText: string };
      revenue: { total: number; thisMonth: number };
    };
    recentActivity: Array<{
      message: string;
      timestamp: string;
      type: string;
    }>;
    accessLevelDistribution: Array<{
      label: string;
      count: number;
      percentage: number;
    }>;
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    monthlyRegistrations: Array<{ month: string; count: number }>;
  };
  timestamp: string;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStatsResponse> => {
    const response = await apiClient.get<DashboardStatsResponse>('/admin/dashboard/stats');
    return response.data;
  },
};
