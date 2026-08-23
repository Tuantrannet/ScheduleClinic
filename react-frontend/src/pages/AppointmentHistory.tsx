import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentApi } from '../services/appointmentService'; 
import type { AppointmentDto, StatusDto } from '../services/appointmentService';

// ✅ BẢNG MAPPING TIẾNG VIỆT
const STATUS_MAPPING: Record<string, string> = {
  'Pending': 'Chờ duyệt',
  'Confirmed': 'Đã xác nhận',
  'SelfCancel': 'Lịch chờ duyệt đã hủy',
  'PendingCancel': 'Bác sĩ hủy',
  'ConfirmedCancel': 'Lịch xác nhận đã hủy',
  'Wait': 'Chờ xác nhận hủy'
};

const AppointmentHistory: React.FC = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [zaloId, setZaloId] = useState<string | null>(null);
  
  // --- FILTER ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterMode, setFilterMode] = useState<'single' | 'range'>('single'); 
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');
  
  const [singleDate, setSingleDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

  // 1. Lấy ZaloId từ Token
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        navigate('/'); 
        return;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const decoded = JSON.parse(jsonPayload);
      setZaloId(decoded["zalo_id"]);
    } catch (e) {
      navigate('/');
    }
  }, [navigate]);

  // 2. Lấy danh sách Status
  const fetchStatuses = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
        const data = await appointmentApi.getAllStatuses(token);
        setStatusOptions(data);
    } catch (error) {
        console.error("Lỗi lấy danh sách trạng thái:", error);
    }
  }, []);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // 3. Gọi API Lịch sử (Logic giống Manager.tsx)
  const fetchAppointments = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
    const token = localStorage.getItem('accessToken');
    if (!token || !zaloId) return;

    setLoading(true);
    setDateError(null);

    try {
      // ✅ Cấu trúc params giống Manager
      const params: any = {
        zaloId: zaloId,
        page: pageNum,
      };

      // Nếu có chọn status thì thêm param statusId
      if (statusFilter !== 'all') {
          params.statusId = statusFilter;
      }

      // Xử lý logic ngày tháng
      if (filterMode === 'single' && singleDate) {
         params.date = singleDate;
      } else if (filterMode === 'range') {
         if (fromDate && toDate) {
             if (new Date(fromDate) > new Date(toDate)) {
                 setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
                 setLoading(false);
                 return; 
             }
             params.fromDate = fromDate;
             params.toDate = toDate;
         }
      }

      const data = await appointmentApi.getAppointmentsByFilter(params, token);
      
      if (isNewSearch) {
        setAppointments(data);
      } else {
        setAppointments(prev => [...prev, ...data]);
      }

      // Logic phân trang đơn giản: nếu trả về ít hơn 5 item thì coi như hết dữ liệu
      setHasMore(data.length >= 5);

    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, [zaloId, statusFilter, filterMode, singleDate, fromDate, toDate]);

  // ✅ AUTO FETCH: Khi bộ lọc thay đổi (statusFilter, dates...), fetchAppointments sẽ thay đổi
  // useEffect này sẽ tự động gọi lại API (giống Manager)
  useEffect(() => {
    if (zaloId) {
      // Reset về trang 1 mỗi khi filter thay đổi và gọi API
      setPage(1); 
      fetchAppointments(1, true);
    }
  }, [fetchAppointments, zaloId]); 

  // Hàm xử lý nút Tìm kiếm (Thực ra useEffect đã lo việc này, nhưng giữ lại để clear page state rõ ràng)
  const handleSearch = () => {
    setPage(1);
    fetchAppointments(1, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAppointments(nextPage, false);
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setSingleDate('');
    setFromDate('');
    setToDate('');
    setFilterMode('single');
    setDateError(null);
    setPage(1);
    // Lưu ý: Việc set các state trên sẽ trigger useEffect -> gọi fetchAppointments tự động
  };

  const handleCancelAppointment = async (appointmentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) return;

    try {
      await appointmentApi.updateSelfCancel(appointmentId, token);
      alert("Đã hủy lịch hẹn thành công!");
      await fetchStatuses();
      
      // Reload lại danh sách hiện tại
      setPage(1);
      fetchAppointments(1, true);

    } catch (error) {
      console.error("Lỗi hủy lịch:", error);
      alert("Hủy lịch thất bại.");
    }
  };

  const handleWaitCancelAppointment = async (appointmentId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    if (!window.confirm("Bạn muốn gửi yêu cầu hủy lịch hẹn này? Chúng tôi sẽ xem xét yêu cầu của bạn.")) return;

    try {
      await appointmentApi.updateWait(appointmentId, token);
      alert("Đã gửi yêu cầu hủy thành công!");
      
      // Reload lại danh sách
      setPage(1);
      fetchAppointments(1, true);
    } catch (error) {
      console.error("Lỗi gửi yêu cầu hủy:", error);
      alert("Gửi yêu cầu thất bại.");
    }
  };

  // ✅ HELPER: Cấu hình hiển thị màu sắc
  const getStatusConfig = (statusName: string) => {
    const label = STATUS_MAPPING[statusName] || statusName; 

    switch (statusName) {
      case 'Pending': 
        return { label, color: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'Confirmed': 
        return { label, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'PendingCancel':
        return { label, color: 'bg-red-100 text-red-700 border-red-200' };
      case 'SelfCancel': 
      case 'ConfirmedCancel': 
        return { label, color: 'bg-slate-100 text-slate-500 border-slate-200' };
      case 'Wait': 
        return { label, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      default: 
        return { label, color: 'bg-slate-100 text-slate-700' };
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    if (!start || !end) return "--:--";
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "--:--";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(s.getHours())}:${pad(s.getMinutes())} - ${pad(e.getHours())}:${pad(e.getMinutes())}`;
  };

  const isFiltering = statusFilter !== 'all' || singleDate !== '' || (fromDate !== '' && toDate !== '');

  return (
    <div className="flex flex-col h-full bg-slate-50 pb-24 min-h-screen">
      {/* HEADER & FILTER */}
      <div className="bg-white p-4 sticky top-0 z-20 shadow-sm border-b border-slate-100">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Lịch sử hẹn</h1>
            <p className="text-xs text-slate-500">Danh sách các cuộc hẹn của bạn</p>
          </div>
          {isFiltering && (
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95 transition-transform"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        <div className="space-y-3">
          {/* Chế độ lọc ngày */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
                onClick={() => { setFilterMode('single'); setDateError(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterMode === 'single' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
                Theo ngày
            </button>
            <button
                onClick={() => { setFilterMode('range'); setDateError(null); }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterMode === 'range' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
            >
                Khoảng ngày
            </button>
          </div>

          {/* Input ngày */}
          <div>
            {filterMode === 'single' ? (
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-slate-700"
                />
            ) : (
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-[10px] text-slate-500 ml-1">Từ ngày</label>
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => { setFromDate(e.target.value); setDateError(null); }}
                            className={`w-full p-2.5 bg-slate-50 border rounded-xl text-sm ${dateError ? 'border-red-500' : 'border-slate-200'} outline-none text-slate-700`}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-500 ml-1">Đến ngày</label>
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => { setToDate(e.target.value); setDateError(null); }}
                            className={`w-full p-2.5 bg-slate-50 border rounded-xl text-sm ${dateError ? 'border-red-500' : 'border-slate-200'} outline-none text-slate-700`}
                        />
                    </div>
                </div>
            )}
            {dateError && <p className="text-xs text-red-500 mt-1">{dateError}</p>}
          </div>

          {/* Filter Status & Search Button */}
          <div className="flex gap-2">
            <select
                value={statusFilter}
                onChange={(e) => {
                    const val = e.target.value;
                    setStatusFilter(val === 'all' ? 'all' : Number(val));
                    // Khi thay đổi giá trị này, state cập nhật -> fetchAppointments cập nhật -> useEffect chạy
                }}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none font-medium text-slate-700"
              >
                <option value="all">Tất cả trạng thái</option>
                {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                        {STATUS_MAPPING[status.name] || status.name} 
                    </option>
                ))}
            </select>
            
            <button 
                onClick={handleSearch}
                className="px-5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-md"
            >
                Tìm
            </button>
          </div>
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="flex-1 px-4 space-y-3 mt-4">
        {loading && page === 1 ? (
           <div className="text-center py-10 text-slate-500 text-sm">Đang tải dữ liệu...</div>
        ) : appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-60 gap-3">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
               </svg>
             </div>
             <p className="text-slate-600 font-medium">Không tìm thấy lịch hẹn nào</p>
          </div>
        ) : (
          <>
            {appointments.map((item) => {
              const startDate = new Date(item.timeStart); 
              const statusConfig = getStatusConfig(item.status);
              
              const dayDisplay = isNaN(startDate.getDate()) ? "--" : startDate.getDate();
              const monthDisplay = isNaN(startDate.getTime()) ? "--" : startDate.toLocaleString('vi', { month: 'short' });
              const yearDisplay = isNaN(startDate.getFullYear()) ? "----" : startDate.getFullYear();
              
              const isPending = item.status === 'Pending'; 
              const isConfirmed = item.status === 'Confirmed';
              
              return (
                <div key={item.appointmentId} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3 text-slate-800 font-bold">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center border border-blue-100">
                        <span className="text-[10px] uppercase font-bold">{monthDisplay}</span>
                        <span className="text-xl leading-none">{dayDisplay}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Mã hẹn: #{item.appointmentId}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {yearDisplay} • {formatTimeRange(item.timeStart, item.timeEnd)}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>
                  </div>

                  {(isPending || isConfirmed) && (
                    <div className="flex justify-end pt-2 border-t border-slate-50">
                       {/* Nút hủy trực tiếp cho Pending */}
                       {isPending && (
                           <button 
                             onClick={() => handleCancelAppointment(item.appointmentId)}
                             className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-100 flex items-center gap-1"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                             </svg>
                             Hủy hẹn
                           </button>
                       )}

                       {/* ✅ Nút Gửi yêu cầu hủy cho Confirmed (Màu vàng) */}
                       {isConfirmed && (
                           <button 
                             onClick={() => handleWaitCancelAppointment(item.appointmentId)}
                             className="px-4 py-1.5 bg-yellow-50 text-yellow-700 text-xs font-semibold rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-100 flex items-center gap-1"
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                             </svg>
                             Gửi yêu cầu hủy
                           </button>
                       )}
                    </div>
                  )}
                </div>
              );
            })}

            {hasMore && (
              <button 
                onClick={handleLoadMore}
                disabled={loading}
                className="w-full py-3 text-sm font-semibold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors shadow-sm mt-2"
              >
                {loading ? 'Đang tải...' : 'Xem cũ hơn'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistory;