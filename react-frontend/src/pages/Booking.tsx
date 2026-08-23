import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr";
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import type { TimeSlot } from '../components/booking/TimeSlotPicker';
import { slotApi } from '../services/slotService';
import { appointmentApi } from '@/services/appointmentService';
import type { SlotDto } from '../services/slotService';
import { patientApi } from '../services/patientService';

interface SignalRSlotPayload {
  date: string;
}

const Booking: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ date: '', selectedSlot: '' });
  const [displayDate, setDisplayDate] = useState('');
  const [currentUser, setCurrentUser] =
    useState<{ fullName: string; phone: string; zaloId: string } | null>(null);

  const [dailySlots, setDailySlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // --- STATE MỚI: Lưu thời lượng khám ---
  const [slotDuration, setSlotDuration] = useState<number>(0);

  const [dayError, setDayError] = useState<string | null>(null);
  
  // State để hiển thị lỗi từ API
  const [apiError, setApiError] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);

  const fetchSlots = useCallback(async (dateStr: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token || !dateStr) return;

    setLoading(true);
    try {
      const data: SlotDto[] = await slotApi.getSlotsByDate(dateStr, token);
      const now = new Date();

      // --- LOGIC MỚI: Tính thời lượng khám dựa trên slot đầu tiên ---
      if (data.length > 0) {
        const firstSlot = data[0];
        const s = new Date(firstSlot.timeStart).getTime();
        const e = new Date(firstSlot.timeEnd).getTime();
        // Tính ra phút: (End - Start) / 60000ms
        const diffMinutes = Math.floor((e - s) / 60000);
        setSlotDuration(diffMinutes);
      } else {
        setSlotDuration(0);
      }
      // -------------------------------------------------------------

      const mappedSlots: TimeSlot[] = data.map((item, index) => {
        const startObj = new Date(item.timeStart);
        const endObj = new Date(item.timeEnd);

        const formatTime = (time: Date) =>
          `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;

        let displayStatus = item.status;
        
        if (startObj < now) {
            displayStatus = 'confirmed'; 
        }

        return {
          id: index,
          timeLabel: formatTime(startObj),
          fullTime: `${formatTime(startObj)} - ${formatTime(endObj)}`,
          status: displayStatus
        };
      });

      setDailySlots(mappedSlots);

    } catch {
      setApiError("Không thể tải lịch khám.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!formData.date) return;

    const startConnection = async () => {
      if (connectionRef.current) {
        await connectionRef.current.stop();
      }

      const hubUrl = import.meta.env.VITE_HUB_URL || "https://localhost:7296/bookingHub";
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl)
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        await newConnection.invoke("JoinDateRoom", formData.date);

        newConnection.on("SlotChanged", (payload: SignalRSlotPayload) => {
          if (payload.date === formData.date) fetchSlots(formData.date);
        });

        connectionRef.current = newConnection;
      } catch { }
    };

    startConnection();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("SlotChanged");
        connectionRef.current.stop();
      }
    };
  }, [formData.date, fetchSlots]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c =>
          '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        const decoded = JSON.parse(jsonPayload);
        const zaloId = decoded["zalo_id"];

        if (zaloId) {
          const data = await patientApi.getDetail(zaloId, token);
          setCurrentUser({
            fullName: (data as any).patientName,
            phone: (data as any).phoneNumber,
            zaloId
          });
        }

      } catch {
      }
    };
    fetchUser();
  }, [navigate]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiError(null);

    const val = e.target.value;
    setDisplayDate(val);

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = val.match(regex);

    if (!match) {
      setFormData(prev => ({ ...prev, date: '' }));
      return;
    }

    const [_, dd, mm, yyyy] = match;
    const dateObj = new Date(+yyyy, +mm - 1, +dd);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateObj.getTime() < today.getTime()) {
      setDayError("Không thể đặt lịch cho ngày trong quá khứ.");
      setFormData(prev => ({ ...prev, date: '' }));
      return;
    }

    setDayError(null);

    const isoDate = `${yyyy}-${mm}-${dd}`;
    setFormData(prev => ({ ...prev, date: isoDate }));

    fetchSlots(isoDate);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
  
    if (!formData.selectedSlot || !currentUser || !formData.date) return;
  
    const token = localStorage.getItem('accessToken');
    if (!token) return;
  
    const [start, end] = formData.selectedSlot.split(' - ');
  
    const payload = {
      patientId: currentUser.zaloId,
      time_Start: `${formData.date}T${start}:00`,
      time_End: `${formData.date}T${end}:00`
    };
  
    try {
      await appointmentApi.createAppointment(payload, token);
  
      alert("Đặt lịch thành công!");
      navigate('/home');
  
    } catch (err: any) {
      const messageFromApi =
        err?.response?.data?.message ||
        "Không thể đặt lịch trùng ngày hoặc đặt lịch cùng khung giờ đã hủy.";
  
      setApiError(messageFromApi);
      fetchSlots(formData.date);
    }
  };
  

  if (!currentUser) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="flex flex-col space-y-4 fade-in-animation pb-24">

      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-slate-400 hover:text-blue-600">
          Quay lại
        </button>
        <h2 className="text-xl font-bold text-slate-800">Đặt lịch khám</h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">

        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="font-bold">{currentUser.fullName}</p>
          <p className="text-xs opacity-60">{currentUser.phone}</p>
        </div>

        {/* --- HIỂN THỊ LỖI API --- */}
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm mb-4 flex items-start gap-2 shadow-sm animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 mt-0.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span className="font-medium">{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm font-semibold">Ngày khám (dd/mm/yyyy)</label>

            <input
              type="tel"
              maxLength={10}
              placeholder="ví dụ 25/12/2025"
              value={displayDate}
              onChange={handleDateChange}
              className="w-full p-3 bg-slate-50 border rounded-xl"
            />

            {dayError && (
              <p className="text-red-600 text-xs mt-1">{dayError}</p>
            )}
          </div>

          {formData.date && (
            <TimeSlotPicker
              slots={dailySlots}
              selectedSlot={formData.selectedSlot}
              onSelect={(slot) => {
                setApiError(null); 
                setFormData(prev => ({ ...prev, selectedSlot: slot }));
              }}
              isLoading={loading}
              // --- UPDATE: Truyền state duration ---
              duration={slotDuration}
            />
          )}

          <button
            type="submit"
            disabled={!formData.selectedSlot || loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl disabled:opacity-50 font-bold shadow-lg shadow-blue-200">
            {loading ? "Đang xử lý..." : "Xác nhận đặt lịch"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Booking;