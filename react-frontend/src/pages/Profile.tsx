import React, { useState, useEffect, useCallback } from 'react';
import { patientApi } from '../services/patientService';
import type { UpdatePatientPayload } from '../services/patientService';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State quản lý dữ liệu form
  const [info, setInfo] = useState({
    fullName: '',
    phone: '',
    dob: '',
    gender: 'Nam',
    cccd: ''
  });

  // Hàm load dữ liệu (được tách ra để tái sử dụng sau khi update xong)
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      setIsLoading(true);

      // --- Giải mã token lấy zalo_id ---
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decodedToken = JSON.parse(jsonPayload);
      const currentZaloId = decodedToken["zalo_id"];

      if (currentZaloId) {
        // Gọi API Get Detail
        const data = await patientApi.getDetail(currentZaloId, token);
        
        if (data) {
          // --- FIX LỖI CCCD KHÔNG HIỂN THỊ ---
          // Ép kiểu 'any' để check cả key viết hoa (PascalCase) từ C# trả về
          const rawData = data as any;

          const formattedDob = rawData.birthday ? rawData.birthday.split('T')[0] 
                             : (rawData.Birthday ? rawData.Birthday.split('T')[0] : '');

          setInfo({
            // Ưu tiên check cả 2 trường hợp key (camelCase và PascalCase)
            fullName: rawData.patientName || rawData.PatientName || '',
            phone: rawData.phoneNumber || rawData.PhoneNumber || '',
            dob: formattedDob,
            gender: rawData.gender || rawData.Gender || 'Nam',
            // Fix lỗi CCCD: Backend C# thường trả về "CCCD" hoặc "Cccd"
            cccd: rawData.cccd || rawData.CCCD || rawData.Cccd || ''
          });
        }
      }
    } catch (error) {
      console.error("Lỗi tải thông tin:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 1. Load dữ liệu khi vào trang
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // 2. Xử lý lưu thông tin (Gọi API Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (info.phone.length !== 10) {
      alert('Số điện thoại phải có chính xác 10 ký tự.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("Phiên đăng nhập hết hạn.");
      return;
    }

    // Chuẩn bị Payload
    const payload: UpdatePatientPayload = {
      PatientName: info.fullName,
      Gender: info.gender,
      Birthday: info.dob,
      PhoneNumber: info.phone,
      // Gửi đúng key CCCD lên server
      CCCD: info.cccd && info.cccd.trim() !== '' ? info.cccd : null
    };

    try {
      setIsLoading(true);
      await patientApi.updateInformation(payload, token);
      
      alert('Cập nhật hồ sơ thành công!');
      setIsEditing(false);

      // --- KHÔNG LƯU LOCALSTORAGE ---
      // Thay vào đó, gọi lại API getDetail để đảm bảo dữ liệu hiển thị là mới nhất từ DB
      await fetchUserData();

    } catch (error: any) {
      console.error('Update Error:', error);
      alert('Lỗi cập nhật: ' + (error.message || 'Vui lòng kiểm tra lại kết nối.'));
    } finally {
      setIsLoading(false);
    }
  };

  // Nút hủy bỏ chỉnh sửa
  const handleCancel = () => {
    setIsEditing(false);
    fetchUserData(); // Reset lại dữ liệu cũ từ server
  };

  if (isLoading && !info.fullName) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      
      {/* Header Background */}
      <div className="bg-blue-600 h-32 rounded-b-[2.5rem] relative overflow-hidden shadow-blue-200 shadow-lg flex items-center justify-center">
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <h1 className="text-2xl font-bold text-white z-10 pt-2">Hồ sơ cá nhân</h1>
      </div>

      {/* Form Info */}
      <form onSubmit={handleSave} className="px-6 mt-8 flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số điện thoại</label>
          <div className={`relative transition-all ${isEditing ? 'opacity-100' : 'opacity-80'}`}>
             <input 
                type="tel" 
                disabled={!isEditing}
                value={info.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  if (val.length <= 10) setInfo({...info, phone: val});
                }}
                className={`w-full p-4 border rounded-2xl outline-none transition-all font-mono tracking-wide
                    ${isEditing 
                        ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-100 text-slate-800' 
                        : 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed'
                    }
                `}
              />
              {!isEditing && (
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                 </div>
              )}
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Họ và tên</label>
          <input 
            type="text" 
            required
            disabled={!isEditing}
            value={info.fullName}
            onChange={(e) => setInfo({...info, fullName: e.target.value})}
            className={`w-full p-4 border rounded-2xl outline-none transition-all
                ${isEditing 
                    ? 'bg-white border-blue-300 focus:ring-2 focus:ring-blue-100 text-slate-800' 
                    : 'bg-white border-slate-100 text-slate-600'
                }
            `}
          />
        </div>

        {/* DOB & Gender Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày sinh</label>
            <input 
              type="date" 
              required
              disabled={!isEditing}
              value={info.dob}
              onChange={(e) => setInfo({...info, dob: e.target.value})}
              className={`w-full p-4 border rounded-2xl outline-none transition-all
                ${isEditing ? 'bg-white border-blue-300' : 'bg-white border-slate-100 text-slate-600'}
              `}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Giới tính</label>
            <select 
              disabled={!isEditing}
              value={info.gender}
              onChange={(e) => setInfo({...info, gender: e.target.value})}
              className={`w-full p-4 border rounded-2xl outline-none transition-all appearance-none
                ${isEditing ? 'bg-white border-blue-300' : 'bg-white border-slate-100 text-slate-600'}
              `}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
        </div>

        {/* CCCD */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số CCCD</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={info.cccd} 
            onChange={(e) => setInfo({...info, cccd: e.target.value})}
            placeholder={isEditing ? "Nhập số CCCD" : "Chưa cập nhật"}
            className={`w-full p-4 border rounded-2xl outline-none transition-all font-mono
                ${isEditing ? 'bg-white border-blue-300' : 'bg-white border-slate-100 text-slate-600'}
            `}
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 pb-6">
            {!isEditing ? (
                <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-white border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 text-slate-600 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Chỉnh sửa thông tin
                </button>
            ) : (
                <div className="flex gap-3">
                    <button 
                        type="button"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className={`flex-1 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all
                            ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                        `}
                    >
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            )}
        </div>
      </form>
    </div>
  );
};

export default Profile;