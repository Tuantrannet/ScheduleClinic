import React, { useState } from 'react';

// Dữ liệu giả lập (Giữ nguyên việc đã xóa bác sĩ)
const MOCK_APPOINTMENTS = [
  { id: 1, date: '2025-05-20', time: '08:00 - 08:10', status: 'approved' },
  { id: 2, date: '2025-05-22', time: '09:30 - 09:40', status: 'pending' },
  { id: 3, date: '2025-05-15', time: '14:00 - 14:10', status: 'rejected' },
  { id: 4, date: '2025-06-01', time: '10:00 - 10:10', status: 'pending' },
];

const AppointmentHistory: React.FC = () => {
  // State quản lý bộ lọc
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [dateFilter, setDateFilter] = useState('');

  // Logic lọc dữ liệu kết hợp (Status && Date)
  const filteredData = MOCK_APPOINTMENTS.filter(item => {
    const matchStatus = statusFilter === 'all' ? true : item.status === statusFilter;
    const matchDate = dateFilter ? item.date === dateFilter : true;
    
    return matchStatus && matchDate;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved': return { label: 'Đã duyệt', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'pending': return { label: 'Chờ duyệt', color: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'rejected': return { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-200' };
      default: return { label: 'Khác', color: 'bg-slate-100 text-slate-700' };
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24 min-h-screen">
      
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-800">Lịch sử hẹn</h1>
        <p className="text-xs text-slate-500">Theo dõi trạng thái các cuộc hẹn của bạn</p>
      </div>

      {/* --- PHẦN BỘ LỌC NGÀY --- */}
      <div className="px-4 pt-4">
        <div className="relative">
            <input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 pl-10 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
            {/* Icon Calendar bên trái */}
            <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            
            {/* Nút Xóa ngày (chỉ hiện khi đã chọn ngày) */}
            {dateFilter && (
                <button 
                    onClick={() => setDateFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
        </div>
      </div>

      {/* --- PHẦN BỘ LỌC TRẠNG THÁI (Tabs) --- */}
      <div className="p-4 flex gap-2 overflow-x-auto no-scrollbar">
        {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ duyệt' },
            { id: 'approved', label: 'Đã xác nhận' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
              ${statusFilter === tab.id 
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200 shadow-md' 
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 px-4 space-y-3">
        {filteredData.length === 0 ? (
          <div className="text-center py-10 opacity-60">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                 <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p className="text-slate-600 font-medium">Không tìm thấy lịch hẹn</p>
            <p className="text-xs text-slate-400">Vui lòng thử thay đổi bộ lọc ngày hoặc trạng thái</p>
          </div>
        ) : (
          filteredData.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                
                {/* Top Row: Date & Status */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-slate-800 font-bold">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center border border-blue-100">
                      <span className="text-[10px] leading-none uppercase font-bold">{new Date(item.date).toLocaleString('vi', { month: 'short' })}</span>
                      <span className="text-lg leading-none">{new Date(item.date).getDate()}</span>
                    </div>
                    <div>
                      <p className="text-sm">Khám bệnh</p>
                      <p className="text-xs text-slate-400 font-normal">{item.time}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {/* Action Buttons (Chỉ hiển thị khi chờ duyệt) */}
                {item.status === 'pending' && (
                   <>
                     <div className="h-px bg-slate-50 w-full"></div>
                     <button className="w-full mt-1 py-2 rounded-xl text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 transition-colors">
                       Hủy yêu cầu
                     </button>
                   </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;