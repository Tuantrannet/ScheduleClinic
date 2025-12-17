import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../services/patientService';
import type { AddPatientPayload } from '../services/patientService';

const RegisterInfo: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [info, setInfo] = useState({
    fullName: '',
    phone: '', 
    dob: '',
    gender: 'Nam', // Default value khớp với logic select option bên dưới
    cccd: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validate Số điện thoại (Yêu cầu C#: 10 ký tự)
    if (info.phone.length !== 10) {
      alert('Số điện thoại phải có chính xác 10 ký tự.');
      return;
    }

    // 2. Lấy AccessToken từ localStorage
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Phiên đăng nhập hết hạn hoặc không tìm thấy token. Vui lòng đăng nhập lại.');
      navigate('/login'); 
      return;
    }

    setIsLoading(true);

    // 3. Chuẩn bị payload (PascalCase theo C# DTO)
    const payload: AddPatientPayload = {
      PatientName: info.fullName,
      Gender: info.gender,
      Birthday: info.dob,
      PhoneNumber: info.phone,
      CCCD: info.cccd || null // Nếu rỗng thì gửi null
    };

    try {
      console.log('Sending payload:', payload); 
      
      // Gọi API với token
      await patientApi.addInformation(payload, token);
      
      // --- ĐÃ XÓA: Logic lưu localStorage cũ tại đây ---
      // Vì trang Home hiện tại đã tự gọi API getDetail để lấy tên người dùng
      
      alert('Cập nhật thông tin thành công!');
      navigate('/home');
      
    } catch (error: any) {
      console.error('API Error:', error);
      // Hiển thị lỗi chi tiết từ backend trả về (nếu có)
      alert('Lỗi: ' + (error.message || 'Không thể lưu thông tin.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col">
      <div className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Cập nhật thông tin</h1>
        <p className="text-slate-500 text-sm">Vui lòng điền thông tin để tạo hồ sơ y tế.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5">
        {/* Số điện thoại */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
          <input 
            required
            type="tel" 
            placeholder="Nhập 10 chữ số (VD: 0901234567)"
            value={info.phone}
            onChange={(e) => {
              // Chỉ cho phép nhập số
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 10) {
                setInfo({...info, phone: value});
              }
            }}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          <p className="text-xs text-slate-400 text-right">{info.phone.length}/10</p>
        </div>

        {/* Họ tên */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
          <input 
            required
            type="text" 
            placeholder="Ví dụ: Nguyễn Văn A"
            maxLength={100} // Khớp với StringLength(100)
            value={info.fullName}
            onChange={(e) => setInfo({...info, fullName: e.target.value})}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Ngày sinh và Giới tính */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Ngày sinh <span className="text-red-500">*</span></label>
            <input 
              required
              type="date" 
              value={info.dob}
              onChange={(e) => setInfo({...info, dob: e.target.value})}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Giới tính <span className="text-red-500">*</span></label>
            <select 
              value={info.gender}
              onChange={(e) => setInfo({...info, gender: e.target.value})}
              className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>

        {/* CCCD */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Số CCCD</label>
          <input 
            type="text" 
            placeholder="Nhập số căn cước (nếu có)"
            value={info.cccd}
            onChange={(e) => setInfo({...info, cccd: e.target.value})}
            className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="mt-auto pb-6">
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg shadow-blue-200 transition-all
              ${isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
              }`}
          >
            {isLoading ? 'Đang xử lý...' : 'Hoàn tất & Vào trang chủ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterInfo;