import { useState, useEffect, useCallback } from 'react';

export interface BookingData {
  id: number;
  fullName: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export const useBookingSystem = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Load dữ liệu khi khởi chạy
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('bookings') || '[]');
    setBookings(data);
  }, []);

  // Hàm lưu xuống LocalStorage
  const saveToStorage = (data: BookingData[]) => {
    setBookings(data);
    localStorage.setItem('bookings', JSON.stringify(data));
  };

  // Thêm lịch hẹn mới
  const addBooking = useCallback((booking: { fullName: string; date: string; time: string }) => {
    const newBooking: BookingData = {
      id: Date.now(),
      fullName: booking.fullName,
      date: booking.date,
      time: booking.time,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // Lấy dữ liệu mới nhất từ state hiện tại để tránh bất đồng bộ
    setBookings(prev => {
      const updated = [newBooking, ...prev];
      localStorage.setItem('bookings', JSON.stringify(updated));
      return updated;
    });
    return newBooking;
  }, []);

  // Cập nhật trạng thái (Duyệt/Hủy)
  const updateStatus = useCallback((id: number, newStatus: 'approved' | 'rejected') => {
    setBookings(prev => {
      const updated = prev.map(b => 
        b.id === id ? { ...b, status: newStatus } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Xóa toàn bộ dữ liệu (cho Admin Reset nếu cần - optional)
  const clearAllBookings = useCallback(() => {
    setBookings([]);
    localStorage.removeItem('bookings');
  }, []);

  return { bookings, addBooking, updateStatus, clearAllBookings };
};