import { api } from './api';

// Interface cho request body login
export interface LoginRequest {
  userName: string;
  password?: string;
}

// Interface cho response trả về từ server
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  exists: boolean;
}

export interface CheckExistResponse {
  accessToken: string;
  refreshToken: string;
  exists: boolean;
}

export const authApi = {
  /**
   * Gọi API POST /Auth/checkexist?zaloId=...
   */
  checkZaloId: (zaloId: string) => {
    return api.post<CheckExistResponse>(`/Auth/checkexist?zaloId=${zaloId}`, null);
  },

  /**
   * Gọi API POST /Auth/login
   * Input: userName, password
   */
  login: (data: LoginRequest) => {
    return api.post<LoginResponse>('/Auth/login', data);
  }
};