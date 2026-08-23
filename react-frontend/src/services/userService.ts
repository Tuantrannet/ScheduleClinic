import { api } from './api';

export interface Role {
    roleId: number;
    roleName: string;
}
  
export interface User {
    userId: number;
    userName: string;
    isActive: boolean;
    role: Role;
}
  
export interface CreateUserRequest {
    userName: string;
    password: string;
}

export const userService = {
  // ... (Giữ nguyên getAll) ...
  getAll: (token: string) => {
     return api.get<User[]>('/User/GetAll', { headers: { Authorization: `Bearer ${token}` } });
  },

  // ... (Giữ nguyên add) ...
  add: (data: any, token: string) => {
     return api.post('/User/Add', data, { headers: { Authorization: `Bearer ${token}` } });
  },

  // ... (Giữ nguyên delete) ...
  delete: (id: number, token: string) => {
    return api.delete(`/User/Delete?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // ... (Giữ nguyên updateActive) ...
  updateActive: (id: number, token: string) => {
    return api.patch(`/User/UpdateActive?id=${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // --- MỚI: Cập nhật mật khẩu ---
  updatePassword: (id: number, password: string, token: string) => {
    // Body là chuỗi password (string)
    // api.put sẽ tự động JSON.stringify chuỗi này và thêm Content-Type: application/json
    return api.patch(`/User/UpdatePassword?id=${id}`, password, {
        headers: { Authorization: `Bearer ${token}` },
    });
  }
};