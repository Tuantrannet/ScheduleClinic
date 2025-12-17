// src/services/slotService.ts
import { api } from './api';

export interface SlotDto {
  timeStart: string; // ISO String
  timeEnd: string;   // ISO String
  status: 'available' | 'reserved' | 'confirmed';
}

export const slotApi = {
  // THAY ĐỔI: Nhận thêm tham số token
  getSlotsByDate: (date: string, token: string) => {
    return api.get<SlotDto[]>(`/Slot/slots?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}` // ✅ Gửi kèm token
      }
    });
  }
};