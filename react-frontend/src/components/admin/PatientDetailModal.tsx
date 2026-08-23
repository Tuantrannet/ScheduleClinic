import React from 'react';
import { createPortal } from 'react-dom';
// Lưu ý: Sửa đường dẫn import tùy theo cấu trúc thư mục của bạn
import type { PatientInformationDto } from '../../services/adminService'; 

interface DetailModalProps {
  isOpen: boolean;
  isLoading: boolean;
  patientData: PatientInformationDto | null;
  appointmentId: number | null;
  onClose: () => void;
}

const PatientDetailModal: React.FC<DetailModalProps> = ({ 
  isOpen, 
  isLoading, 
  patientData, 
  appointmentId, 
  onClose 
}) => {
  // Nếu chưa mở thì không render gì cả
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-all" 
        onClick={onClose} 
      />
      
      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[300px]">
          
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white relative">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-bold">Hồ sơ bệnh nhân</h3>
            <p className="text-blue-100 text-sm opacity-90">Appointment ID: #{appointmentId}</p>
          </div>

          {/* Body */}
          <div className="p-6">
            {isLoading ? (
              // Loading State
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                 <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                 <p className="text-sm text-slate-500 font-medium">Đang tải thông tin...</p>
              </div>
            ) : patientData ? (
              // Data State
              <div className="space-y-6">
                <div className="text-center pb-4 border-b border-slate-100">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl shadow-sm border border-blue-100">
                    {patientData.gender === 'Nam' ? '👨‍🦱' : patientData.gender === 'Nữ' ? '👩‍🦰' : '👤'}
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{patientData.patientName}</h2>
                  <p className="text-sm text-slate-500">Zalo ID: {patientData.zaloId}</p>
                </div>

                <div className="space-y-3">
                  <InfoRow label="Giới tính" value={patientData.gender} />
                  <InfoRow label="Ngày sinh" value={patientData.birthday} />
                  <InfoRow label="Số điện thoại" value={patientData.phoneNumber} />
                  <InfoRow label="CCCD/CMND" value={patientData.cccd || 'Chưa cập nhật'} />
                </div>
              </div>
            ) : (
              // Error/Empty State
              <div className="text-center py-8 text-slate-500">
                <p>Không tìm thấy thông tin bệnh nhân.</p>
              </div>
            )}
            
            <button 
              onClick={onClose} 
              className="w-full mt-6 py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// Component con hiển thị dòng thông tin
const InfoRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
    <span className="text-sm text-slate-500 font-medium flex items-center gap-2">
        {label}
    </span>
    <span className="text-sm font-bold text-slate-800">{value}</span>
  </div>
);

export default PatientDetailModal;