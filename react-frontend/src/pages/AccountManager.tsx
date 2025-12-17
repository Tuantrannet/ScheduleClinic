import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountSystem } from '../hooks/useAccountSystem';
import type { Account } from '../hooks/useAccountSystem';

const AccountManager: React.FC = () => {
  const navigate = useNavigate();
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccountSystem();

  // State cho Form
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  // Kiểm tra quyền Admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) navigate('/login');
  }, [navigate]);

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
      updateAccount(editingId, { username: formData.username, password: formData.password });
      setEditingId(null);
      alert('Cập nhật thành công!');
    } else {
      addAccount({ username: formData.username, password: formData.password });
    }
    setFormData({ username: '', password: '', confirmPassword: '' });
  };

  const handleEditClick = (acc: Account) => {
    setEditingId(acc.id);
    setFormData({ username: acc.username, password: acc.password, confirmPassword: acc.password });
    setError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ username: '', password: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24">
      {/* Header */}
      <div className="bg-white p-4 pt-6 shadow-sm sticky top-0 z-40 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý Tài khoản</h1>
          <p className="text-xs text-slate-500">Danh sách Admin</p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('isAdmin'); navigate('/login'); }} 
          className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors"
        >
          Đăng xuất
        </button>
      </div>

      <div className="px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Form Area */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
          <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide border-b border-slate-50 pb-2">
            {editingId ? `Sửa User #${editingId}` : 'Thêm quản trị viên'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
              <input 
                required
                type="text" 
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Nhập tên đăng nhập..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                <input 
                  required
                  type="text"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Mật khẩu..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm</label>
                <input 
                  required
                  type="text"
                  value={formData.confirmPassword}
                  onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none ${error ? 'border-red-300 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500'}`}
                  placeholder="Nhập lại..."
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-2 rounded-lg">⚠️ {error}</p>}

            <div className="flex gap-3 mt-2">
              <button 
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                {editingId ? 'Lưu thay đổi' : 'Tạo tài khoản'}
              </button>
              {editingId && (
                <button 
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Hủy
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Area */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-500 uppercase text-xs ml-1 mb-2">Danh sách Admin ({accounts.length})</h3>
          
          {accounts.length === 0 && (
            <div className="text-center py-8 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
              Chưa có tài khoản nào
            </div>
          )}

          {accounts.map((acc) => (
            <div key={acc.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
                  {acc.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-800">{acc.username}</p>
                  <p className="text-xs text-slate-400 font-mono">Pass: ••••••</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEditClick(acc)} className="p-2 text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => deleteAccount(acc.id)} className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= FOOTER NAVIGATION ================= */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
        
        {/* Tab Account (Active) */}
        <button 
          className="flex flex-col items-center gap-1 transition-colors text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span className="text-[10px] font-bold">Tài khoản</span>
        </button>

        <div className="w-px h-8 bg-slate-200 mx-4"></div>

        {/* Tab Info (Inactive) -> Link tới trang kia */}
        <button 
          onClick={() => navigate('/clinic-info')}
          className="flex flex-col items-center gap-1 transition-colors text-slate-400 hover:text-slate-600"
        >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
          <span className="text-[10px] font-bold">Thông tin</span>
        </button>

      </div>
    </div>
  );
};

export default AccountManager;