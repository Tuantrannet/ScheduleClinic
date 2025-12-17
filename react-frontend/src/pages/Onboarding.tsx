import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/authService';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [zaloId, setZaloId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!zaloId.trim()) {
      setError('Vui lòng nhập Zalo ID');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Gọi service (lúc này đã là POST với query string)
      const data = await authApi.checkZaloId(zaloId);

      // Lưu token vào localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      // Điều hướng dựa trên biến exists
      if (data.exists === false) {
        navigate('/register-info');
      } else {
        navigate('/home');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Có lỗi xảy ra khi kết nối tới máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="mb-8 text-center z-10">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ScheduleClinic</h1>
        <p className="text-slate-500 text-sm mt-1">Kết nối qua Zalo</p>
      </div>

      <div className="w-full max-w-sm z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Nhập Zalo ID</label>
            <input 
              autoFocus
              type="text" 
              placeholder="Nhập Zalo ID..."
              value={zaloId}
              onChange={(e) => {
                setZaloId(e.target.value);
                setError('');
              }}
              disabled={isLoading}
              className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all text-lg
                ${error ? 'border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}
                ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            />
            {error && <p className="text-red-500 text-xs ml-1 font-medium">{error}</p>}
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full p-4 rounded-2xl shadow-lg shadow-blue-200 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all
              ${isLoading 
                ? 'bg-blue-400 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }
            `}
          >
            {isLoading ? 'Đang xử lý...' : 'Tiếp tục'}
          </button>
        </form>
      </div>
      <p className="absolute bottom-6 text-xs text-slate-400">Phiên bản 1.2.1 (Post Query)</p>
    </div>
  );
};

export default Onboarding;