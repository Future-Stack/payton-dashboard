import { apiClient } from './axios';

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage: string | null;
  provider: string;
  providerId: string | null;
  otpExpiredAt: string | null;
  isVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  lastActive: string;
  fcmToken: string;
  createdAt: string;
  updatedAt: string;
  subscription: any;
}

export interface UserProfileResponse {
  statusCode: number;
  message: string;
  meta: any;
  data: UserProfile;
  timestamp: string;
}

export const userService = {
  getMe: async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/user/me');
    return response.data;
  },
  deleteUser: async (userId: string): Promise<any> => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },
  updateUserStatus: async (userId: string, status: "ACTIVE" | "SUSPEND"): Promise<any> => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`, { status });
    return response.data;
  },
  changePlan: async (userId: string, plan: "PRO" | "FREE"): Promise<any> => {
    const response = await apiClient.patch(`/admin/users/${userId}/change-plan`, { plan });
    return response.data;
  },
  updateProfile: async (formData: FormData): Promise<any> => {
    const response = await apiClient.patch(`/user/profile-update`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
