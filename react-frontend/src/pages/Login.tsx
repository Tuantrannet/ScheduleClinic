import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Yêu cầu: Nếu là admin / admin -> Chuyển sang trang CRUD Account
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/account-manager'); // <--- ĐIỂM THAY ĐỔI
    } 
    // Giữ lại logic cũ (admin / 123) để vào trang quản lý Admin Dashboard (nếu cần)
    else if (username === 'admin' && password === '123') {
       localStorage.setItem('isAdmin', 'true');
       navigate('/admin');
    }
    else {
      alert('Tài khoản hoặc mật khẩu không đúng! (Thử: admin / admin)');
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-[80vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-blue-50 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Cổng Quản Trị</h2>
          <p className="text-slate-400 text-sm mt-1">Đăng nhập để quản lý hệ thống</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Tên đăng nhập</label>
            <input 
              type="text" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập username"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 mb-1 block">Mật khẩu</label>
            <input 
              type="password" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button className="w-full py-3.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;