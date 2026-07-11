import { apiClient } from "./axios";

export interface GetReportsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  userSubscription?: string;
}

export const reportService = {
  getReports: async (params: GetReportsParams = {}) => {
    const response = await apiClient.get("/admin/reports", { params });
    return response.data;
  },
  deleteReport: async (id: string) => {
    const response = await apiClient.delete(`/admin/reports/${id}`);
    return response.data;
  },
};
