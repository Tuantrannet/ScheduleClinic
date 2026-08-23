import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr";

// Import Component & Service
import AdminTimeSettings from '../components/admin/AdminTimeSettings';
import PatientDetailModal from '../components/admin/PatientDetailModal';
import AdminFooter from '../components/admin/AdminFooter';
import { adminApi } from '../services/adminService';
import type { AdminAppointmentDto, PatientInformationDto, StatusDto } from '../services/adminService';

const STATUS_MAPPING: Record<string, string> = {
  'Pending': 'Chờ duyệt',
  'Confirmed': 'Đã xác nhận',
  'SelfCancel': 'Lịch chờ duyệt đã hủy',
  'PendingCancel': 'Bác sĩ hủy',
  'ConfirmedCancel': 'Lịch xác nhận đã hủy',
  'Wait': 'Chờ xác nhận hủy'
};

const Manager: React.FC = () => {
  const navigate = useNavigate();

  // --- STATE UI ---
  const [activeTab, setActiveTab] = useState<'appointments' | 'settings'>('appointments');

  // --- STATE DATA ---
  const [appointments, setAppointments] = useState<AdminAppointmentDto[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusDto[]>([]); 
  const [loading, setLoading] = useState(false);

  // --- STATE MODAL ---
  const [showModal, setShowModal] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState<number | null>(null);
  const [patientDetail, setPatientDetail] = useState<PatientInformationDto | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- FILTER & PAGINATION ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterMode, setFilterMode] = useState<'single' | 'range'>('single');
  const [statusFilter, setStatusFilter] = useState<number | 'all'>('all');

  const [singleDate, setSingleDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [dateError, setDateError] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;
      try {
        const data = await adminApi.getAllStatuses(token);
        setStatusOptions(data);
      } catch (error) {
        console.error("Lỗi lấy danh sách trạng thái:", error);
      }
    };
    fetchStatuses();
  }, []);

  // API Lấy danh sách Lịch hẹn
  const fetchAppointments = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setLoading(true);
    setDateError(null);

    try {
      const params: any = { page: pageNum };

      if (statusFilter !== 'all') {
        params.statusId = statusFilter;
      }

      if (filterMode === 'single' && singleDate) {
        params.date = singleDate;
      } else if (filterMode === 'range') {
        if (fromDate && toDate) {
          if (new Date(fromDate) > new Date(toDate)) {
            setDateError("Ngày bắt đầu không được lớn hơn ngày kết thúc.");
            setLoading(false); return;
          }
          params.fromDate = fromDate;
          params.toDate = toDate;
        }
      }

      const data = await adminApi.getAllBookings(params, token);

      if (isNewSearch) {
        setAppointments(data);
      } else {
        setAppointments(prev => [...prev, ...data]);
      }

      if (data.length < 5) setHasMore(false);
      else setHasMore(true);

    } catch (error) {
      console.error("Lỗi lấy dữ liệu Manager:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, filterMode, singleDate, fromDate, toDate]);

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments(1, true);
    }
  }, [fetchAppointments, activeTab]);

  const resetAndReload = async () => {
    setStatusFilter('all');
    setSingleDate('');
    setFromDate('');
    setToDate('');
    setFilterMode('single');
    setDateError(null);
    setPage(1);
    fetchAppointments(1, true);
  };

  useEffect(() => {
    if (activeTab !== 'appointments') return;

    const startConnection = async () => {
      if (connectionRef.current) await connectionRef.current.stop();

      const hubUrl = import.meta.env.VITE_HUB_URL || "https://localhost:7296/bookingHub";
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        await newConnection.invoke("JoinAdminRoom"); 

        newConnection.on("SlotChanged", () => {
          resetAndReload();
        });

        connectionRef.current = newConnection;
      } catch (err) {
        console.error("SignalR Failed: ", err);
      }
    };
    startConnection();
    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("SlotChanged");
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [activeTab]);

  const handleViewDetail = async (apptId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    setSelectedApptId(apptId);
    setShowModal(true);
    setLoadingDetail(true);
    setPatientDetail(null);
    try {
      const data = await adminApi.getPatientDetail(apptId, token);
      setPatientDetail(data);
    } catch (error) { console.error(error); }
    finally { setLoadingDetail(false); }
  };

  const handleSearch = () => { setPage(1); fetchAppointments(1, true); };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAppointments(nextPage, false);
  };

  // 1. Hàm Từ chối (Pending -> PendingCancel)
  const handleRejectAppointment = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    if (window.confirm("Bạn có chắc muốn từ chối lịch hẹn này? Trạng thái sẽ chuyển thành 'Bác sĩ hủy'.")) {
      try {
        await adminApi.updatePendingCancel(id, token);
        await fetchAppointments(1, true); // Reload danh sách mới nhất
        setPage(1);
        alert("Đã từ chối lịch hẹn.");
      } catch (e) {
        console.error(e);
        alert("Có lỗi xảy ra khi cập nhật trạng thái.");
      }
    }
  }

  // ✅ 2. THÊM MỚI: Hàm Đồng ý (Pending -> Confirmed)
  const handleApproveAppointment = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    if (window.confirm("Bạn có chắc muốn DUYỆT lịch hẹn này không?")) {
      try {
        await adminApi.updateConfirmPending(id, token);
        await fetchAppointments(1, true); // Reload danh sách mới nhất
        setPage(1);
        alert("Đã duyệt lịch hẹn thành công!");
      } catch (e) {
        console.error(e);
        alert("Có lỗi xảy ra khi duyệt lịch.");
      }
    }
  }

  const getStatusConfig = (statusName: string) => {
    const label = STATUS_MAPPING[statusName] || statusName;

    switch (statusName) {
      case 'Pending':
        return { label, color: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'Confirmed':
        return { label, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'PendingCancel': 
        return { label, color: 'bg-red-100 text-red-700 border-red-200' };
      case 'Wait': 
        return { label, color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'SelfCancel':
      case 'ConfirmedCancel':
        return { label, color: 'bg-slate-100 text-slate-500 border-slate-200' };
      default:
        return { label, color: 'bg-slate-100 text-slate-700' };
    }
  };

  const formatTimeRange = (start: string, end: string) => {
    if (!start || !end) return "--:--";
    const s = new Date(start); const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return "Invalid Time";
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(s.getHours())}:${pad(s.getMinutes())} - ${pad(e.getHours())}:${pad(e.getMinutes())}`;
  };

  const isFiltering = statusFilter !== 'all' || singleDate !== '' || (fromDate !== '' && toDate !== '');

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24">
      {/* HEADER */}
      <div className="bg-white p-4 pt-12 pb-4 shadow-sm sticky top-0 z-50 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Admin Portal</h1>
          <p className="text-xs text-slate-500">Quản lý hệ thống</p>
        </div>
        <button onClick={() => { localStorage.removeItem('accessToken'); navigate('/login'); }} className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">Thoát</button>
      </div>

      <div className="p-4">
        {activeTab === 'appointments' && (
          <div className="fade-in-animation space-y-3">
            {/* PANEL BỘ LỌC */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-700">Bộ lọc tìm kiếm</span>
                {isFiltering && <button onClick={resetAndReload} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Xóa lọc</button>}
              </div>

              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setFilterMode('single')} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${filterMode === 'single' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Theo ngày</button>
                <button onClick={() => setFilterMode('range')} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg ${filterMode === 'range' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Khoảng ngày</button>
              </div>

              {filterMode === 'single' ? (
                <input type="date" value={singleDate} onChange={(e) => setSingleDate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl text-sm outline-none" />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl text-sm outline-none" />
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full p-2 bg-slate-50 border rounded-xl text-sm outline-none" />
                </div>
              )}
              {dateError && <p className="text-xs text-red-500">{dateError}</p>}

              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStatusFilter(val === 'all' ? 'all' : Number(val));
                  }}
                  className="flex-1 p-2 bg-slate-50 border rounded-xl text-sm outline-none"
                >
                  <option value="all">Tất cả trạng thái</option>
                  {statusOptions.map((status) => (
                    <option key={status.id} value={status.id}>
                      {STATUS_MAPPING[status.name] || status.name}
                    </option>
                  ))}
                </select>
                <button onClick={handleSearch} className="px-4 bg-blue-600 text-white rounded-xl text-sm font-bold">Tìm</button>
              </div>
            </div>

            {/* DANH SÁCH LỊCH HẸN */}
            <div className="space-y-3">
              {appointments.length === 0 && !loading ? (
                <div className="text-center py-10 text-slate-400">Không tìm thấy dữ liệu</div>
              ) : (
                appointments.map((booking) => {
                  const statusConfig = getStatusConfig(booking.status);
                  const startDate = new Date(booking.timeStart);
                  const isValidDate = !isNaN(startDate.getTime());
                  const dayDisplay = isValidDate ? startDate.getDate() : "--"; 
                  const monthDisplay = isValidDate ? startDate.toLocaleString('vi', { month: 'short' }) : "--";

                  const isPending = booking.status === 'Pending';

                  return (
                    <div key={booking.appointmentId}
                      onClick={() => handleViewDetail(booking.appointmentId)}
                      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-3 active:scale-[0.98] transition-transform cursor-pointer">

                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex flex-col items-center justify-center border border-blue-100">
                            <span className="text-[10px] uppercase font-bold">{monthDisplay}</span>
                            <span className="text-xl font-bold leading-none">{dayDisplay}</span>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">Mã hẹn: #{booking.appointmentId}</p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              {formatTimeRange(booking.timeStart, booking.timeEnd)}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${statusConfig.color}`}>{statusConfig.label}</span>
                      </div>

                      {/* ACTION BUTTONS CHO TRẠNG THÁI PENDING */}
                      {isPending && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                          
                          {/* 1. Nút Từ chối */}
                          <button
                            onClick={(e) => handleRejectAppointment(booking.appointmentId, e)}
                            className="flex items-center gap-1 px-3 py-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 text-xs font-bold transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Từ chối
                          </button>

                          {/* 2. Nút Đồng ý */}
                          <button
                            onClick={(e) => handleApproveAppointment(booking.appointmentId, e)}
                            className="flex items-center gap-1 px-3 py-1.5 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 text-xs font-bold transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Đồng ý
                          </button>

                        </div>
                      )}
                    </div>
                  );
                })
              )}
              {hasMore && (
                <button onClick={handleLoadMore} disabled={loading} className="w-full py-3 text-sm font-semibold text-blue-600 bg-white border border-blue-100 rounded-xl hover:bg-blue-50 shadow-sm">{loading ? 'Đang tải...' : 'Xem cũ hơn'}</button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CẤU HÌNH */}
        {activeTab === 'settings' && <AdminTimeSettings />}
      </div>

      <AdminFooter activeTab={activeTab} onTabChange={setActiveTab} />

      <PatientDetailModal
        isOpen={showModal}
        isLoading={loadingDetail}
        patientData={patientDetail}
        appointmentId={selectedApptId}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default Manager;