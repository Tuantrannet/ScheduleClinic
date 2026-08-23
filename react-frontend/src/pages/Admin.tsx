import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import type { User } from '../services/userService';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form State
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- 1. LOAD DATA ---
  const fetchUsers = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    try {
      setLoading(true); // Hiển thị trạng thái loading khi refresh
      const data = await userService.getAll(token);
      setUsers(data);
    } catch (err: any) {
      console.error("Load error:", err);
      if (err.message && err.message.includes('401')) {
          localStorage.removeItem('accessToken');
          navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  // --- 2. ADD USER ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return alert("Vui lòng nhập đủ thông tin");
    if (formData.password !== formData.confirmPassword) return alert("Mật khẩu không khớp");

    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    try {
      setIsSubmitting(true);
      await userService.add({ userName: formData.username, password: formData.password }, token);
      alert("Thêm thành công!");
      setFormData({ username: '', password: '', confirmPassword: '' });
      fetchUsers(); 
    } catch (err: any) {
      alert("Lỗi thêm: " + (err.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- 3. DELETE USER ---
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    try {
        await userService.delete(userId, token);
        alert("Đã xóa người dùng thành công.");
        fetchUsers();
    } catch (err: any) {
        alert("Không thể xóa: " + (err.message || "Lỗi kết nối"));
    }
  };

  // --- 4. TOGGLE ACTIVE STATUS (MỚI) ---
  const handleToggleActive = async (user: User) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return navigate('/login');

    // Xác nhận hành động (Optional - có thể bỏ nếu muốn nhanh)
    const actionName = user.isActive ? "KHÓA" : "KÍCH HOẠT";
    if (!window.confirm(`Bạn có chắc muốn ${actionName} tài khoản ${user.userName}?`)) return;

    try {
        // Gọi API UpdateActive
        await userService.updateActive(user.userId, token);
        
        // Gọi lại fetchUsers để server trả về dữ liệu mới nhất
        await fetchUsers(); 
        
    } catch (err: any) {
        console.error("Update active error:", err);
        alert("Lỗi cập nhật trạng thái: " + (err.message || "Unknown error"));
    }
  };

  const getRoleBadge = (roleName: string) => {
    if (roleName === 'Admin') return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      {/* Header */}
      <div className="bg-white p-4 pt-6 shadow-sm sticky top-0 z-40 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản trị hệ thống</h1>
          <p className="text-xs text-slate-500">Danh sách người dùng</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100">
          Đăng xuất
        </button>
      </div>

      <div className="px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Form Thêm mới */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
           <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
              <h2 className="text-sm font-bold text-slate-700 uppercase">Thêm tài khoản mới</h2>
           </div>
           <form onSubmit={handleAddUser} className="space-y-3">
               <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" className="w-full p-3 bg-slate-50 rounded-xl border text-sm outline-none focus:border-blue-500 transition-colors" required />
               <div className="flex gap-2">
                  <input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" className="w-full p-3 bg-slate-50 rounded-xl border text-sm outline-none focus:border-blue-500" required />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm Pass" className="w-full p-3 bg-slate-50 rounded-xl border text-sm outline-none focus:border-blue-500" required />
               </div>
               <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                 {isSubmitting ? 'Đang xử lý...' : 'Tạo tài khoản'}
               </button>
           </form>
        </div>

        {/* Danh sách User */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-500 uppercase text-xs ml-1 mb-2">Danh sách User ({users.length})</h3>
          
          {loading && <p className="text-center text-xs text-blue-500 py-4">Đang đồng bộ dữ liệu...</p>}
          
          {!loading && users.map((user) => (
            <div key={user.userId} className={`bg-white p-4 rounded-2xl border flex justify-between items-center shadow-sm transition-all ${user.isActive ? 'border-slate-100' : 'border-slate-200 bg-slate-50 opacity-90'}`}>
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-colors 
                    ${user.role?.roleName === 'Admin' ? 'bg-purple-600 text-white' : 
                      user.isActive ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                  {(user.userName || 'U').charAt(0).toUpperCase()}
                </div>
                
                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${user.isActive ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                        {user.userName}
                    </p>
                    {user.role && <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${getRoleBadge(user.role.roleName)}`}>{user.role.roleName}</span>}
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="flex items-center gap-1 mt-1">
                     <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-red-400'}`}></span>
                     <span className={`text-xs ${user.isActive ? 'text-emerald-600' : 'text-red-400 font-medium'}`}>
                        {user.isActive ? 'Đang hoạt động' : 'Đã bị khóa'}
                     </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                
                {/* --- NÚT TOGGLE ACTIVE (MỚI) --- */}
                <button 
                  onClick={() => handleToggleActive(user)}
                  className={`p-2 rounded-xl transition-colors shadow-sm ${
                      user.isActive 
                      ? 'bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600' // Style cho nút khóa
                      : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600' // Style cho nút mở khóa
                  }`}
                  title={user.isActive ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                >
                   {user.isActive ? (
                       // Icon Lock (Để khóa)
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                       </svg>
                   ) : (
                       // Icon Unlock/Power (Để mở)
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                       </svg>
                   )}
                </button>

                {/* Nút Delete */}
                <button 
                  onClick={() => handleDeleteUser(user.userId)}
                  className="p-2 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors shadow-sm"
                  title="Xóa vĩnh viễn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Footer Navigation (Giữ nguyên) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40 shadow-lg">
         <button className="flex flex-col items-center gap-1 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-[10px] font-bold">Tài khoản</span>
         </button>
         <div className="w-px h-8 bg-slate-200"></div>
         <button onClick={() => navigate('/clinic-info')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="text-[10px] font-bold">Thông tin</span>
         </button>
      </div>
    </div>
  );
};

export default Admin;