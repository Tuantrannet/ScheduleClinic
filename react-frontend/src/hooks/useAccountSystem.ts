import { useState, useEffect, useCallback } from 'react';

export interface Account {
  id: number;
  username: string;
  password: string;
}

export const useAccountSystem = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Load dữ liệu khi khởi chạy
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('accounts') || '[]');
    setAccounts(data);
  }, []);

  // Lưu xuống LocalStorage
  const saveToStorage = (data: Account[]) => {
    setAccounts(data);
    localStorage.setItem('accounts', JSON.stringify(data));
  };

  // 1. Thêm tài khoản
  const addAccount = useCallback((acc: { username: string; password: string }) => {
    setAccounts(prev => {
      // Kiểm tra trùng username
      if (prev.some(a => a.username === acc.username)) {
        alert('Tên đăng nhập đã tồn tại!');
        return prev;
      }
      const newAccount = { ...acc, id: Date.now() };
      const updated = [newAccount, ...prev];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  // 2. Sửa tài khoản
  const updateAccount = useCallback((id: number, newData: { username: string; password: string }) => {
    setAccounts(prev => {
      const updated = prev.map(acc => acc.id === id ? { ...acc, ...newData } : acc);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  // 3. Xóa tài khoản
  const deleteAccount = useCallback((id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      setAccounts(prev => {
        const updated = prev.filter(acc => acc.id !== id);
        saveToStorage(updated);
        return updated;
      });
    }
  }, []);

  return { accounts, addAccount, updateAccount, deleteAccount };
};