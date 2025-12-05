import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterInfo: React.FC = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({
    fullName: '',
    phone: '0901234567', // Giả lập số đã lấy được từ bước trước
    dob: '',
    gender: 'male',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ở đây sau này sẽ gọi API lưu user info
    localStorage.setItem('currentUser', JSON.stringify(info));
    alert('Cập nhật thông tin thành công!');
    navigate('/home'); // Chuyển hướng vào trang chủ chính thức
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cập nhật thông tin</h1>
        <p className="text-slate-500 text-sm">Vui lòng điền thông tin để tạo hồ sơ y tế.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={info.phone} 
            disabled 
            className="w-full p-3 bg-slate-200 text-slate-500 border border-slate-200 rounded-xl font-medium"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
          <input 
            required
            type="text" 
            placeholder="Ví dụ: Nguyễn Văn A"
            value={info.fullName}
            onChange={(e) => setInfo({...info, fullName: e.target.value})}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Ngày sinh <span className="text-red-500">*</span></label>
            <input 
              required
              type="date" 
              value={info.dob}
              onChange={(e) => setInfo({...info, dob: e.target.value})}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Giới tính</label>
            <select 
              value={info.gender}
              onChange={(e) => setInfo({...info, gender: e.target.value})}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Số căn cước công dân</label>
          <input 
            type="text" 
            placeholder="Nhập đúng 12 số"
            value={info.address}
            onChange={(e) => setInfo({...info, address: e.target.value})}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mt-auto pb-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all"
          >
            Hoàn tất & Vào trang chủ
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterInfo;