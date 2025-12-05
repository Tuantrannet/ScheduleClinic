import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountSystem} from '../hooks/useAccountSystem';
import type {Account } from '../hooks/useAccountSystem';

const AccountManager: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccountSystem();

  // State cho Form
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Hàm xử lý Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu nhập lại không khớp!');
      return;
    }

    if (formData.password.length < 3) {
      setError('Mật khẩu phải có ít nhất 3 ký tự');
      return;
    }

    if (editingId) {
      // Chế độ Edit
      updateAccount(editingId, { username: formData.username, password: formData.password });
      setEditingId(null);
      alert('Cập nhật thành công!');
    } else {
      // Chế độ Thêm mới
      addAccount({ username: formData.username, password: formData.password });
    }

    // Reset Form
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

  // Hàm click nút Sửa
  const handleEditClick = (acc: Account) => {
    setEditingId(acc.id);
    setFormData({ 
      username: acc.username, 
      password: acc.password, 
      confirmPassword: acc.password 
    });
    setError('');
  };

  // Hàm hủy sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ username: '', password: '', confirmPassword: '' });
    setError('');
  };

  // Kiểm tra quyền Admin (nếu không phải admin thì đá ra)
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50">
            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Tài khoản</h1>
        </div>
        <button onClick={() => { localStorage.removeItem('isAdmin'); navigate('/login'); }} className="text-sm text-red-500 font-medium hover:underline">Đăng xuất</button>
      </div>

      {/* Form Area */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-lg font-bold text-slate-700 mb-4">
          {editingId ? `Đang sửa tài khoản #${editingId}` : 'Thêm tài khoản mới'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tên đăng nhập</label>
            <input 
              required
              type="text" 
              value={formData.username || ''}
              onChange={e => setFormData({...formData, username: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập tên đăng nhập..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mật khẩu</label>
              <input 
                required
                type="text" // Để text cho dễ nhìn demo, thực tế nên là password
                value={formData.password || ''}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập mật khẩu..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nhập lại mật khẩu</label>
              <input 
                required
                type="text"
                value={formData.confirmPassword || ''}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className={`w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'}`}
                placeholder="Xác nhận lại..."
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium">⚠️ {error}</p>}

          <div className="flex gap-3 mt-2">
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
            >
              {editingId ? 'Cập nhật' : 'Tạo tài khoản'}
            </button>
            {editingId && (
              <button 
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
              >
                Hủy
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Area */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-600 uppercase text-xs ml-1">Danh sách hiện có ({accounts.length})</h3>
        
        {accounts.length === 0 && (
          <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
            Chưa có tài khoản nào được tạo
          </div>
        )}

        {accounts.map((acc) => (
          <div key={acc.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
            <div>
              <p className="font-bold text-slate-800">{acc.username}</p>
              <p className="text-xs text-slate-400 font-mono">Pass: {acc.password}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditClick(acc)}
                className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </button>
              <button 
                onClick={() => deleteAccount(acc.id)}
                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountManager;