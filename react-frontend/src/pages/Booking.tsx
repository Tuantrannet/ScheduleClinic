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
  const { generateSlots, config } = useTimeSlots(); // <--- Lấy thêm config
  
  const [formData, setFormData] = useState({ fullName: '', date: '', selectedSlot: '' });
  const [dailySlots, setDailySlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.date) {
      setLoading(true);
      setFormData(prev => ({ ...prev, selectedSlot: '' }));
      
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
    if (!formData.selectedSlot) return;

    addBooking({
      fullName: formData.fullName,
      date: formData.date,
      time: formData.selectedSlot
    });

    alert(`Đã gửi yêu cầu đặt lịch lúc ${formData.selectedSlot.split(' - ')[0]} thành công!`);
    navigate('/'); 
  };

  return (
    <div className="flex flex-col space-y-4 fade-in-animation pb-24">
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-slate-800">Thông tin đặt khám</h2>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Họ và tên bệnh nhân</label>
            <input 
              required type="text" placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Chọn ngày khám</label>
            <input 
              required type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>

          {formData.date && (
            <div className="space-y-2 animate-in fade-in">
              <TimeSlotPicker 
                slots={dailySlots}
                selectedSlot={formData.selectedSlot}
                onSelect={(val) => setFormData({...formData, selectedSlot: val})}
                isLoading={loading}
                duration={config.duration} // <--- TRUYỀN DURATION TỪ CONFIG ADMIN
              />
            </div>
          )}

          <button 
            type="submit"
            disabled={!formData.selectedSlot || !formData.fullName || !formData.date || loading}
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