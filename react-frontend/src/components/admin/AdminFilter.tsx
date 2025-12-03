import React from 'react';

const FIXED_TIME_FRAMES = [
  "08:00 - 08:10", "09:00 - 09:10", "10:00 - 10:10",
  "13:00 - 13:10", "14:00 - 14:10", "15:00 - 15:10"
];

interface AdminFilterProps {
  date: string;
  setDate: (v: string) => void;
  time: string;
  setTime: (v: string) => void;
  status: string;
  setStatus: (v: any) => void;
  onReset: () => void;
  isFiltering: boolean;
  
  // --- Props mới cho Phân trang ---
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
}

const AdminFilter: React.FC<AdminFilterProps> = ({ 
  date, setDate, time, setTime, status, setStatus, onReset, isFiltering,
  currentPage, totalPages, onPageChange, totalRecords
}) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          Bộ lọc tìm kiếm
        </h3>
        {isFiltering && (
          <button onClick={onReset} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
            Xóa hết
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Date Input */}
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block font-medium">Ngày khám</label>
          <input 
            type="date" 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Time Select */}
        <div>
          <label className="text-xs text-slate-500 mb-1.5 block font-medium">Khung giờ</label>
          <select 
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Tất cả giờ</option>
            {FIXED_TIME_FRAMES.map((t, idx) => (
              <option key={idx} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Status Pills */}
        <div className="col-span-2">
          <label className="text-xs text-slate-500 mb-1.5 block font-medium">Trạng thái</label>
          <div className="grid grid-cols-4 gap-2">
            {[{ v: 'all', l: 'Tất cả' }, { v: 'pending', l: 'Chờ' }, { v: 'approved', l: 'Duyệt' }, { v: 'rejected', l: 'Huỷ' }].map((item) => (
              <button
                key={item.v}
                onClick={() => setStatus(item.v)}
                className={`py-2 text-xs font-bold rounded-lg border transition-all active:scale-95
                  ${status === item.v 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
                `}
              >
                {item.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- PHẦN UI PHÂN TRANG (Mới thêm) --- */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
         <span className="text-xs text-slate-400 font-medium">
            Tổng: <b className="text-slate-600">{totalRecords}</b> đơn
         </span>

         <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1 || totalRecords === 0}
              onClick={() => onPageChange(currentPage - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            
            <span className="text-xs font-bold text-slate-600">
               {totalPages === 0 ? 0 : currentPage} / {totalPages}
            </span>

            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminFilter;