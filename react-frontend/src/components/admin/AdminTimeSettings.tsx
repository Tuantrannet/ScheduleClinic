import React, { useState, useEffect } from 'react';
import { adminApi} from '../../services/adminService';
import type {WorkingHourDto } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';

// State nội bộ dùng chuỗi "HH:mm" để tương thích với input type="time"
interface TimeConfigState {
  workingId: number;
  duration: number;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
}

const AdminTimeSettings: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Giá trị khởi tạo
  const [localConfig, setLocalConfig] = useState<TimeConfigState>({
    workingId: 0,
    duration: 10,
    morningStart: "07:00",
    morningEnd: "11:00",
    afternoonStart: "13:00",
    afternoonEnd: "17:00"
  });

  // Hàm helper: Cắt "HH:mm:ss" -> "HH:mm" cho input
  const formatTimeForInput = (timeStr: string | undefined) => {
    if (!timeStr) return "00:00";
    return timeStr.substring(0, 5);
  };

  // Hàm helper: Thêm ":00" vào "HH:mm" để gửi lên server (TimeOnly format)
  const formatTimeForSubmit = (timeStr: string) => {
      if (!timeStr) return "00:00:00";
      if (timeStr.length === 5) return `${timeStr}:00`;
      return timeStr;
  };

  // 1. Fetch dữ liệu khi mount
  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const data = await adminApi.getWorkingHours(token);
        if (data) {
          setLocalConfig({
            workingId: data.workingId,
            duration: data.duration,
            morningStart: formatTimeForInput(data.mor_Start),
            morningEnd: formatTimeForInput(data.mor_End),
            afternoonStart: formatTimeForInput(data.aff_Start),
            afternoonEnd: formatTimeForInput(data.aff_End),
          });
        }
      } catch (error) {
        console.error("Lỗi lấy cấu hình:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleChange = (field: keyof TimeConfigState, value: string | number) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  // 2. Xử lý Lưu cấu hình
  const handleSave = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    setSaving(true);
    try {
        // Chuẩn bị payload đúng format WorkingHourDto
        const payload: WorkingHourDto = {
            workingId: localConfig.workingId,
            duration: localConfig.duration,
            mor_Start: formatTimeForSubmit(localConfig.morningStart),
            mor_End: formatTimeForSubmit(localConfig.morningEnd),
            aff_Start: formatTimeForSubmit(localConfig.afternoonStart),
            aff_End: formatTimeForSubmit(localConfig.afternoonEnd),
        };

        // Gọi API Update
        const updatedData = await adminApi.updateWorkingHour(payload, token);

        // Cập nhật lại state với dữ liệu mới từ server trả về
        if (updatedData) {
            setLocalConfig({
                workingId: updatedData.workingId,
                duration: updatedData.duration,
                morningStart: formatTimeForInput(updatedData.mor_Start),
                morningEnd: formatTimeForInput(updatedData.mor_End),
                afternoonStart: formatTimeForInput(updatedData.aff_Start),
                afternoonEnd: formatTimeForInput(updatedData.aff_End),
            });
            alert("Cập nhật cấu hình thành công!");
        }

    } catch (error) {
        console.error("Lỗi khi lưu cấu hình:", error);
        alert("Lưu thất bại. Vui lòng thử lại.");
    } finally {
        setSaving(false);
    }
  };

  if (loading && localConfig.workingId === 0) {
    return <div className="p-10 text-center text-slate-500">Đang tải cấu hình...</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Cài đặt chung</h3>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Thời lượng 1 khung giờ (phút)</label>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => handleChange('duration', Math.max(5, localConfig.duration - 5))}
                disabled={saving}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold disabled:opacity-50"
             >-</button>
             <input 
                type="number" 
                value={localConfig.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                disabled={saving}
                className="flex-1 text-center font-bold text-lg p-2 bg-slate-50 border border-slate-200 rounded-xl text-blue-600"
             />
             <button 
                onClick={() => handleChange('duration', localConfig.duration + 5)}
                disabled={saving}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold disabled:opacity-50"
             >+</button>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Ca Sáng</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Bắt đầu</label>
            <input 
              type="time" 
              value={localConfig.morningStart}
              onChange={(e) => handleChange('morningStart', e.target.value)}
              disabled={saving}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kết thúc</label>
            <input 
              type="time" 
              value={localConfig.morningEnd}
              onChange={(e) => handleChange('morningEnd', e.target.value)}
              disabled={saving}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Ca Chiều</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Bắt đầu</label>
            <input 
              type="time" 
              value={localConfig.afternoonStart}
              onChange={(e) => handleChange('afternoonStart', e.target.value)}
              disabled={saving}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kết thúc</label>
            <input 
              type="time" 
              value={localConfig.afternoonEnd}
              onChange={(e) => handleChange('afternoonEnd', e.target.value)}
              disabled={saving}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving && (
             <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
          )}
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">Thay đổi sẽ được áp dụng ngay lập tức.</p>
      </div>
    </div>
  );
};

export default AdminTimeSettings;