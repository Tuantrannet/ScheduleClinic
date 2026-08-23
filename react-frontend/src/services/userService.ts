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

  // --- MỚI: Cập nhật trạng thái Active ---
  updateActive: (id: number, token: string) => {
    // Gọi API PUT: /User/UpdateActive?id=5
    // Tham số body để null hoặc {} vì id đã nằm trên URL
    return api.patch(`/User/UpdateActive?id=${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
};