import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ClinicInfoManager: React.FC = () => {
  const navigate = useNavigate();

  // State dữ liệu phòng khám
  const [clinicInfo, setClinicInfo] = useState({
    name: 'ScheduleClinic Đà Nẵng',
    hotline: '1900 6868',
    address: '123 Nguyễn Văn Linh, Q. Hải Châu, Đà Nẵng',
    workingTime: 'Thứ 2 - Thứ 7: 07:30 - 17:00'
  });

  // Kiểm tra quyền Admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) navigate('/login');
  }, [navigate]);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Gọi API lưu thông tin ở đây
    alert('Đã lưu thông tin phòng khám thành công!');
    console.log('Saved Info:', clinicInfo);
  };

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24">
      {/* --- HEADER --- */}
      <div className="bg-white p-4 pt-6 shadow-sm sticky top-0 z-40 flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Thông tin Phòng khám</h1>
          <p className="text-xs text-slate-500">Cấu hình hiển thị chung</p>
        </div>
        <button 
          onClick={() => { localStorage.removeItem('isAdmin'); navigate('/login'); }} 
          className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl hover:bg-red-100 transition-colors"
        >
          Đăng xuất
        </button>
      </div>

      {/* --- FORM CONTENT --- */}
      <div className="px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleInfoSubmit} className="space-y-5">
            
            {/* Tên phòng khám */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Tên hiển thị</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  value={clinicInfo.name}
                  onChange={(e) => setClinicInfo({...clinicInfo, name: e.target.value})}
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Hotline */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Hotline liên hệ</label>
              <div className="relative">
                 <span className="absolute left-3 top-3.5 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
                  </svg>
                </span>
                <input 
                  type="text" 
                  value={clinicInfo.hotline}
                  onChange={(e) => setClinicInfo({...clinicInfo, hotline: e.target.value})}
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Địa chỉ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ</label>
              <textarea 
                rows={2}
                value={clinicInfo.address}
                onChange={(e) => setClinicInfo({...clinicInfo, address: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              />
            </div>

            {/* Giờ làm việc */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">Lịch làm việc</label>
              <input 
                type="text" 
                value={clinicInfo.workingTime}
                onChange={(e) => setClinicInfo({...clinicInfo, workingTime: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-slate-400 italic">Ví dụ: Thứ 2 - Thứ 6: 8:00 - 17:00</p>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
              >
                Lưu thông tin
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* ================= FOOTER NAVIGATION ================= */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
        
        {/* Tab Account (Inactive) -> Link tới trang kia */}
        <button 
          onClick={() => navigate('/account-manager')}
          className="flex flex-col items-center gap-1 transition-colors text-slate-400 hover:text-slate-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span className="text-[10px] font-bold">Tài khoản</span>
        </button>

        <div className="w-px h-8 bg-slate-200 mx-4"></div>

        {/* Tab Info (Active) */}
        <button 
          className="flex flex-col items-center gap-1 transition-colors text-blue-600"
        >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
          </svg>
          <span className="text-[10px] font-bold">Thông tin</span>
        </button>

      </div>
    </div>
  );
};

export default ClinicInfoManager;