import { api } from './api';

export interface CheckExistResponse {
  accessToken: string;
  refreshToken: string;
  exists: boolean;
}

export const authApi = {
  /**
   * Gọi API POST /Auth/checkexist?zaloId=...
   * - endpoint: Chứa query string
   * - body: null (vì backend lấy dữ liệu từ [FromQuery])
   */
  checkZaloId: (zaloId: string) => {
    return api.post<CheckExistResponse>(`/Auth/checkexist?zaloId=${zaloId}`, null);
  },
};