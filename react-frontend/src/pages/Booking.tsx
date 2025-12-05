import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TimeSlotPicker from '../components/booking/TimeSlotPicker';
import type { TimeSlot, SlotStatus } from '../components/booking/TimeSlotPicker';
import { useBookingSystem } from '../hooks/useBookingSystem';
import { useTimeSlots } from '../hooks/useTimeSlots';

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const { addBooking } = useBookingSystem();
  
  // Lấy cả hàm sinh giờ VÀ config hiện tại
  const { generateSlots, config } = useTimeSlots(); 
  
  // State chỉ còn date và selectedSlot (fullName sẽ lấy từ User đã login)
  const [formData, setFormData] = useState({ date: '', selectedSlot: '' });
  const [currentUser, setCurrentUser] = useState<{ fullName: string; phone: string } | null>(null);
  const [dailySlots, setDailySlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Lấy thông tin user từ localStorage ngay khi vào trang
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    } else {
      // Nếu chưa có thông tin user (truy cập trái phép), đẩy về trang đầu
      navigate('/');
    }
  }, [navigate]);

  // Xử lý khi chọn ngày -> Load slot
  useEffect(() => {
    if (formData.date) {
      setLoading(true);
      setFormData(prev => ({ ...prev, selectedSlot: '' }));
      
      // Giả lập call API lấy slot trống/bận
      setTimeout(() => {
        const allFrames = generateSlots();
        const slots: TimeSlot[] = allFrames.map((frame, index) => {
          const rand = Math.random();
          let status: SlotStatus = 'available';
          if (rand < 0.1) status = 'busy';      
          else if (rand < 0.2) status = 'booked'; 
          return { id: index, timeLabel: frame.label, fullTime: frame.value, status };
        });
        setDailySlots(slots);
        setLoading(false);
      }, 500);
    }
  }, [formData.date, generateSlots]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedSlot || !currentUser) return;

    // Gọi hàm đặt lịch với tên của User hiện tại
    addBooking({
      fullName: currentUser.fullName, 
      date: formData.date,
      time: formData.selectedSlot
    });

    alert(`Đã gửi yêu cầu đặt lịch lúc ${formData.selectedSlot.split(' - ')[0]} thành công!`);
    navigate('/home'); 
  };

  if (!currentUser) return null; // Hoặc có thể return loading spinner

  return (
    <div className="flex flex-col space-y-4 fade-in-animation pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Đặt lịch khám</h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Hiển thị thông tin người đang đặt (Read-only) */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3 animate-in slide-in-from-top-2">
          <div className="w-10 h-10 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-sm font-bold text-lg border border-blue-50">
            {currentUser.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-slate-500">Khách hàng</p>
            <p className="font-bold text-slate-800">{currentUser.fullName}</p>
          </div>
          <div className="ml-auto">
             <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">Mặc định</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Chọn ngày khám */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Chọn ngày khám</label>
            <input 
              required type="date"
              value={formData.date}
              min={new Date().toISOString().split('T')[0]} // Chặn chọn ngày quá khứ
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700"
            />
          </div>

          {/* Chọn giờ khám (Chỉ hiện khi đã chọn ngày) */}
          {formData.date && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <TimeSlotPicker 
                slots={dailySlots}
                selectedSlot={formData.selectedSlot}
                onSelect={(val) => setFormData({...formData, selectedSlot: val})}
                isLoading={loading}
                duration={config.duration}
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={!formData.selectedSlot || !formData.date || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang tải lịch...' : 'Xác nhận đặt lịch'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;