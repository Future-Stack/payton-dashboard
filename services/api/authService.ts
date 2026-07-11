import { apiClient } from './axios';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  userId: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  statusCode: number;
  message: string;
  meta: any;
  data: {
    accessToken: string;
    refreshToken: string;
  };
  timestamp: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  meta: any;
  data: {
    accessToken: string;
    refreshToken: string;
  } | null;
  timestamp: string;
}

export interface ForgetPasswordPayload {
  email: string;
}

export interface ForgetPasswordResponse {
  statusCode: number;
  message: string;
  meta: any;
  data: any;
  timestamp: string;
}

export interface ResetPasswordPayload {
  otp: string;
  email: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  statusCode: number;
  message: string;
  meta: any;
  data: any;
  timestamp: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },
  refreshToken: async (payload: RefreshTokenPayload): Promise<RefreshTokenResponse> => {
    // using raw axios or api without interceptors if possible to avoid loops, 
    // but apiClient could be okay if we manage isRefreshing in axios.ts
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh-token', payload);
    return response.data;
  },
  forgetPassword: async (payload: ForgetPasswordPayload): Promise<ForgetPasswordResponse> => {
    const response = await apiClient.post<ForgetPasswordResponse>('/auth/forget-password', payload);
    return response.data;
  },
  resetPassword: async (payload: ResetPasswordPayload): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>('/auth/reset-password', payload);
    return response.data;
  },
};
