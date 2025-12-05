import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CheckPhone: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Giả lập logic kiểm tra số điện thoại
    if (phone === '123') {
      // Giả sử tìm thấy user cũ, lưu lại vào localStorage để Home hiển thị
      const mockReturningUser = {
        fullName: 'Nguyễn Văn Cũ', // Tên khách hàng cũ
        phone: '0909999999',
        // Các thông tin khác...
      };
      localStorage.setItem('currentUser', JSON.stringify(mockReturningUser));
      
      alert('Chào mừng bạn quay trở lại!');
      navigate('/home');
    } else {
      setError('Số điện thoại không đúng hoặc chưa đăng ký.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col relative overflow-hidden">
      {/* Nút Back */}
      <button onClick={() => navigate(-1)} className="absolute top-6 left-4 p-2 text-slate-400 hover:text-blue-600 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Decoration */}
      <div className="absolute top-[-5%] right-[-5%] w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-40 pointer-events-none"></div>

      <div className="mt-16 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Đăng nhập</h1>
        <p className="text-slate-500 text-sm mt-1">Nhập số điện thoại để tra cứu hồ sơ.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
          <input 
            autoFocus
            type="tel" 
            placeholder="Nhập số điện thoại..."
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setError(''); // Xóa lỗi khi gõ lại
            }}
            className={`w-full p-4 bg-slate-50 border rounded-xl outline-none transition-all text-lg tracking-wide
              ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}
            `}
          />
          {error && <p className="text-red-500 text-xs ml-1 font-medium animate-in slide-in-from-top-1">{error}</p>}
        </div>

        <button 
          type="submit" 
          disabled={!phone}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
        >
          Tiếp tục
        </button>
      </form>
      
      <div className="pb-8 text-center">
        <p className="text-xs text-slate-400">Gợi ý: Nhập <span className="font-mono font-bold text-slate-600">123</span> để thử nghiệm.</p>
      </div>
    </div>
  );
};

export default CheckPhone;