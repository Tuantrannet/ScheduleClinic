import React, { useState, useEffect } from 'react';
// Đã xóa useNavigate vì không còn dùng chức năng logout hay chuyển trang

interface UserProfile {
  fullName: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Dữ liệu giả lập mặc định
  const defaultData: UserProfile = {
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    dob: '1995-05-15',
    gender: 'male',
    address: '079095000123'
  };

  const [info, setInfo] = useState<UserProfile>(defaultData);

  // Load dữ liệu từ LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('currentUser', JSON.stringify(info));
    setIsEditing(false);
    alert('Cập nhật hồ sơ thành công!');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative">
      
      {/* Header Background - Đã xóa nút Đăng xuất */}
      <div className="bg-blue-600 h-32 rounded-b-[2.5rem] relative overflow-hidden shadow-blue-200 shadow-lg flex items-center justify-center">
        {/* Decoration circles */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-white z-10 pt-2">Hồ sơ cá nhân</h1>
      </div>

      {/* Form Info - Đã xóa Avatar section, điều chỉnh margin-top */}
      <form onSubmit={handleSave} className="px-6 mt-8 flex flex-col gap-5 animate-in slide-in-from-bottom-4 duration-500">
        
        {/* Phone (Read Only) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số điện thoại</label>
          <div className="flex items-center gap-3 w-full p-4 bg-slate-200/60 border border-slate-200 rounded-2xl text-slate-500">
             <svg className="w-5 h-5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
             <span className="font-mono font-medium tracking-wide">{info.phone}</span>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Họ và tên</label>
          <input 
            type="text" 
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
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        {/* CCCD */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Số CCCD</label>
          <input 
            type="text" 
            disabled={!isEditing}
            value={info.address} 
            onChange={(e) => setInfo({...info, address: e.target.value})}
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
                        onClick={() => {
                            setIsEditing(false);
                            // Reset lại data cũ nếu hủy
                            const stored = localStorage.getItem('currentUser');
                            if(stored) setInfo(JSON.parse(stored));
                        }}
                        className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit"
                        className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                    >
                        Lưu thay đổi
                    </button>
                </div>
            )}
        </div>
      </form>
    </div>
  );
};

export default Profile;