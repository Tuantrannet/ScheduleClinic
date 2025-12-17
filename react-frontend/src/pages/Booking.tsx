import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as signalR from "@microsoft/signalr"; // Import SignalR
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import type { TimeSlot } from '../components/booking/TimeSlotPicker';
import { slotApi} from '../services/slotService';
import { appointmentApi } from '@/services/appointmentService';
import type {SlotDto } from '../services/slotService';
import { patientApi } from '../services/patientService';


interface SignalRSlotPayload {
  date: string;
}

const Booking: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [formData, setFormData] = useState({ date: '', selectedSlot: '' });
  const [displayDate, setDisplayDate] = useState('');
  const [currentUser, setCurrentUser] = useState<{ fullName: string; phone: string; zaloId: string } | null>(null);
  const [dailySlots, setDailySlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref để giữ connection SignalR không bị reset khi render lại
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  // --- 1. Hàm lấy Slots (Tách ra để dùng lại khi SignalR báo update) ---
  const fetchSlots = useCallback(async (dateStr: string) => {
    const token = localStorage.getItem('accessToken');
    if (!token || !dateStr) return;

    setLoading(true);
    try {
      const data: SlotDto[] = await slotApi.getSlotsByDate(dateStr, token);

      const mappedSlots: TimeSlot[] = data.map((item, index) => {
        const startObj = new Date(item.timeStart);
        const endObj = new Date(item.timeEnd);
        const formatTime = (date: Date) => 
          `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        return {
          id: index,
          timeLabel: formatTime(startObj), 
          fullTime: `${formatTime(startObj)} - ${formatTime(endObj)}`,
          status: item.status
        };
      });

      setDailySlots(mappedSlots);
      setError(null);
    } catch (err: any) {
      console.error("Lỗi lấy lịch:", err);
      setError("Không thể tải lịch khám.");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- 2. Xử lý logic SignalR ---
  useEffect(() => {
    // Chỉ kết nối khi đã có ngày hợp lệ
    if (!formData.date) return;

    const startConnection = async () => {
      // Nếu đã có connection cũ, stop nó trước khi tạo cái mới (để join room mới)
      if (connectionRef.current) {
        await connectionRef.current.stop();
      }

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7296/bookingHub") // URL Backend của bạn
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        console.log("SignalR Connected!");

        // Join vào Room theo ngày (VD: 2025-12-17)
        await newConnection.invoke("JoinDateRoom", formData.date);

        // Lắng nghe sự kiện "SlotChanged" từ Backend
        newConnection.on("SlotChanged", (payload: SignalRSlotPayload) => {
          console.log("Realtime signal received:", payload);
          
          // So sánh payload.date với formData.date
          if (payload && payload.date === formData.date) {
              console.log("Refreshing slots...");
              fetchSlots(formData.date);
          }
      });

        connectionRef.current = newConnection;
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    startConnection();

    // Cleanup: Rời room và ngắt kết nối khi đổi ngày hoặc unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.off("SlotChanged");
        connectionRef.current.stop();
      }
    };
  }, [formData.date, fetchSlots]); // Chạy lại khi ngày thay đổi

  // --- 3. Lấy thông tin User ---
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        // Decode Token lấy ZaloId
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => 
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));

        const decodedToken = JSON.parse(jsonPayload);
        const zaloId = decodedToken["zalo_id"];

        if (zaloId) {
          const data = await patientApi.getDetail(zaloId, token);
          const name = (data as any).patientName || "Khách hàng";
          const phone = (data as any).phoneNumber || "";
          // Lưu cả zaloId vào state để dùng khi submit
          setCurrentUser({ fullName: name, phone: phone, zaloId: zaloId });
        }
      } catch (error) {
        navigate('/');
      }
    };
    fetchUserData();
  }, [navigate]);

  // --- 4. Xử lý khi nhập ngày ---
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setDisplayDate(inputVal);

    if (formData.selectedSlot) {
      setFormData(prev => ({ ...prev, selectedSlot: '' }));
      setDailySlots([]);
    }

    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = inputVal.match(regex);

    if (match) {
      const day = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const year = parseInt(match[3], 10);
      const dateObj = new Date(year, month - 1, day);
      
      const isValidDate = dateObj.getFullYear() === year && dateObj.getMonth() === month - 1 && dateObj.getDate() === day;

      if (isValidDate && year > 1900) {
        const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        // Set state -> Trigger useEffect SignalR & fetchSlots
        setFormData(prev => ({ ...prev, date: isoDate }));
        fetchSlots(isoDate); // Gọi fetch ngay lần đầu
      } else {
        setFormData(prev => ({ ...prev, date: '' }));
      }
    } else {
        if(formData.date) setFormData(prev => ({ ...prev, date: '' }));
    }
  };

  // --- 5. Xử lý Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedSlot || !currentUser || !formData.date) return;

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // selectedSlot format: "08:00 - 08:10"
    const [startTimeStr, endTimeStr] = formData.selectedSlot.split(' - ');
    
    // Tạo chuỗi ISO
    // Input: date="2025-12-17", time="08:00" -> "2025-12-17T08:00:00"
    const timeStartISO = `${formData.date}T${startTimeStr}:00`;
    const timeEndISO = `${formData.date}T${endTimeStr}:00`;

    const payload = {
      patientId: currentUser.zaloId, // Lấy từ user state đã decode
      time_Start: timeStartISO,
      time_End: timeEndISO
    };

    setLoading(true);
    try {
      await appointmentApi.createAppointment(payload, token);
      alert("Đặt lịch thành công!");
      navigate('/home');
    } catch (err: any) {
      console.error("Lỗi đặt lịch:", err);
      // Xử lý lỗi cụ thể (ví dụ: đã có người đặt nhanh tay hơn)
      alert(err.message || "Đặt lịch thất bại. Vui lòng thử lại.");
      // Refresh lại slot để cập nhật tình trạng mới nhất
      fetchSlots(formData.date);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="flex flex-col space-y-4 fade-in-animation pb-24">
      {/* --- Giữ nguyên phần UI Header & User Info như cũ --- */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-blue-600">
           Quay lại
        </button>
        <h2 className="text-xl font-bold text-slate-800">Đặt lịch khám</h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="font-bold text-slate-800">{currentUser.fullName}</p>
            <p className="text-xs text-slate-500">{currentUser.phone}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Ngày khám (dd/mm/yyyy)</label>
            <input 
                type="tel" 
                placeholder="25/12/2025"
                maxLength={10}
                value={displayDate}
                onChange={handleDateChange}
                className="w-full p-3 bg-slate-50 border rounded-xl focus:ring-2 outline-none text-sm"
            />
          </div>

          {formData.date && (
            <div className="space-y-2">
              {error ? (
                <div className="text-red-500 text-sm">{error}</div>
              ) : (
                <TimeSlotPicker 
                  slots={dailySlots}
                  selectedSlot={formData.selectedSlot}
                  onSelect={(val) => setFormData({...formData, selectedSlot: val})}
                  isLoading={loading}
                  duration={10} 
                />
              )}
            </div>
          )}

          <button 
            type="submit"
            disabled={!formData.selectedSlot || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;