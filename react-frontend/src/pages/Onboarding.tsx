import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Xử lý khi chọn Khách hàng mới
  const handleNewCustomer = () => {
    setShowPhoneModal(true);
  };

  // Xử lý khi chọn Khách hàng cũ
  const handleReturningCustomer = () => {
    navigate('/check-phone');
  };

  // Xử lý khi chọn Admin -> Chuyển sang trang Login
  const handleAdmin = () => {
    navigate('/login');
  };

  // Xử lý khi đồng ý liên kết SĐT (Cho khách mới)
  const handleConfirmPhone = () => {
    setShowPhoneModal(false);
    navigate('/register-info');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      {/* Logo / Branding */}
      <div className="mb-8 text-center z-10">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">ScheduleClinic</h1>
        <p className="text-slate-500 text-sm mt-1">Chăm sóc sức khỏe toàn diện</p>
      </div>

      {/* Selection Area */}
      <div className="w-full max-w-sm space-y-3 z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-center text-slate-600 font-medium mb-2">Bạn là...</p>
        
        {/* Lựa chọn 1: Khách hàng mới */}
        <button 
          onClick={handleNewCustomer}
          className="w-full p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-white/20 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </span>
            <span className="font-bold text-lg">Khách hàng mới</span>
          </div>
          <svg className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Lựa chọn 2: Khách hàng cũ */}
        <button 
          onClick={handleReturningCustomer}
          className="w-full p-4 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </span>
            <span className="font-bold text-lg">Khách hàng cũ</span>
          </div>
          <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Lựa chọn 3: Admin */}
        <button 
          onClick={handleAdmin}
          className="w-full p-4 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            <span className="font-bold text-lg">Admin</span>
          </div>
          <svg className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Phone Modal */}
      <Modal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        title="Liên kết số điện thoại"
        footer={
          <>
            <button onClick={() => setShowPhoneModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Để sau</button>
            <button onClick={handleConfirmPhone} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-blue-200 shadow-md">Đồng ý</button>
          </>
        }
      >
        <div className="flex flex-col items-center">
          <p className="mb-4">Hệ thống sẽ liên kết với số điện thoại trên thiết bị để định danh hồ sơ y tế của bạn.</p>
          <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 text-slate-500 text-sm font-mono">
            +84 901 *** ***
          </div>
        </div>
      </Modal>

      <p className="absolute bottom-6 text-xs text-slate-400">Phiên bản 1.0.0</p>
    </div>
  );
};

export default Onboarding;