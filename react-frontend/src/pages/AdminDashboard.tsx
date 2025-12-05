import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingSystem } from '../hooks/useBookingSystem';
import type {BookingData } from '../hooks/useBookingSystem';
import AdminFilter from '../components/admin/AdminFilter';
import BookingCard from '../components/admin/BookingCard';
import AdminTimeSettings from '../components/admin/AdminTimeSettings';
import { createPortal } from 'react-dom';

const ITEMS_PER_PAGE = 5;

// --- COMPONENT MODAL CHI TIẾT (Dữ liệu mẫu) ---
interface DetailModalProps {
  booking: BookingData | null;
  onClose: () => void;
}

const PatientDetailModal: React.FC<DetailModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;

  // Dữ liệu giả lập (Sample Data)
  const mockDetails = {
    phone: '0905 123 456',
    dob: '15/08/1995',
    gender: Math.random() > 0.5 ? 'Nam' : 'Nữ',
    cccd: '048095000XXX',
    address: 'Hải Châu, Đà Nẵng',
    history: 'Tiền sử dị ứng thuốc kháng sinh nhẹ.'
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[60] bg-slate-900/20 backdrop-blur-sm transition-all" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm px-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Modal */}
          <div className="bg-blue-600 p-6 text-white relative">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-bold">Hồ sơ bệnh nhân</h3>
            <p className="text-blue-100 text-sm opacity-90">Chi tiết lịch hẹn #{booking.id.toString().slice(-4)}</p>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-3xl">
                {mockDetails.gender === 'Nam' ? '👨🏻‍🦱' : '👩🏻‍🦰'}
              </div>
              <h2 className="text-xl font-bold text-slate-800">{booking.fullName}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2
                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                  booking.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}
              `}>
                {booking.status === 'pending' ? 'Chờ xác nhận' : booking.status === 'approved' ? 'Đã xác nhận' : 'Đã huỷ'}
              </span>
            </div>

            <div className="space-y-4">
              <InfoRow label="Ngày sinh" value={mockDetails.dob} icon="🎂" />
              <InfoRow label="Giới tính" value={mockDetails.gender} icon="users" />
              <InfoRow label="Số điện thoại" value={mockDetails.phone} icon="phone" />
              <InfoRow label="CCCD/CMND" value={mockDetails.cccd} icon="card" />
              
              <div className="bg-slate-50 p-4 rounded-xl space-y-2 mt-2">
                <p className="text-xs font-bold text-slate-400 uppercase">Thông tin khám</p>
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Ngày khám:</span>
                  <span className="font-bold">{booking.date}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-700">
                  <span>Giờ hẹn:</span>
                  <span className="font-bold text-blue-600">{booking.time}</span>
                </div>
              </div>
            </div>
            
            <button onClick={onClose} className="w-full py-3 bg-slate-100 font-bold text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
              Đóng hồ sơ
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

// Helper Row Component
const InfoRow = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-500 font-medium">{label}</span>
    <span className="text-sm font-bold text-slate-800">{value}</span>
  </div>
);

// --- MAIN ADMIN DASHBOARD ---

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, updateStatus } = useBookingSystem();
  
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings'>('appointments');
  
  // State cho Modal
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);

  // Filter States
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterDate, filterTime, filterStatus]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/login');
  };

  const filteredBookings = bookings.filter(b => {
    if (filterDate && b.date !== filterDate) return false;
    if (filterTime && b.time !== filterTime) return false;
    if (filterStatus !== 'all' && b.status !== filterStatus) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24">
      {/* Header Admin */}
      <div className="bg-white p-4 pt-12 pb-4 shadow-sm sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Portal</h1>
          <p className="text-xs text-slate-500">Hệ thống quản lý phòng khám</p>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors group"
        >
           <span className="text-xs font-bold group-hover:text-red-600">Đăng xuất</span>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 group-hover:text-red-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
           </svg>
        </button>
      </div>

      <div className="p-4">
        {/* --- TAB 1: QUẢN LÝ LỊCH HẸN --- */}
        {activeTab === 'appointments' && (
          <div className="fade-in-animation">
             <AdminFilter 
               date={filterDate} setDate={setFilterDate}
               time={filterTime} setTime={setFilterTime}
               status={filterStatus} setStatus={setFilterStatus}
               onReset={() => { setFilterDate(''); setFilterTime(''); setFilterStatus('all'); }}
               isFiltering={filterDate !== '' || filterTime !== '' || filterStatus !== 'all'}
               currentPage={currentPage}
               totalPages={totalPages}
               totalRecords={filteredBookings.length}
               onPageChange={setCurrentPage}
             />

             <div className="space-y-4">
               {paginatedBookings.length === 0 ? (
                 <div className="text-center py-10">
                   <p className="text-slate-400 font-medium">Không tìm thấy dữ liệu</p>
                 </div>
               ) : (
                 paginatedBookings.map((booking) => (
                   <BookingCard 
                     key={booking.id} 
                     booking={booking} 
                     onUpdateStatus={updateStatus}
                     onClick={(selected) => setSelectedBooking(selected)} // <--- Sự kiện mở Modal
                   />
                 ))
               )}
             </div>
          </div>
        )}

        {/* --- TAB 2: QUẢN LÝ KHUNG GIỜ --- */}
        {activeTab === 'settings' && (
          <AdminTimeSettings />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center z-40 shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'appointments' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === 'appointments' ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-[10px] font-bold">Lịch hẹn</span>
        </button>

        <div className="w-px h-8 bg-slate-200"></div>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={activeTab === 'settings' ? 2 : 1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" />
          </svg>
          <span className="text-[10px] font-bold">Cấu hình giờ</span>
        </button>
      </div>

      {/* --- RENDER MODAL TẠI ĐÂY --- */}
      <PatientDetailModal 
        booking={selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
      />
    </div>
  );
};

export default AdminDashboard;