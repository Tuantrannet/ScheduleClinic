import React, { useState, useEffect } from 'react';
import { useTimeSlots } from '../../hooks/useTimeSlots';
import type {TimeSlotConfig } from '../../hooks/useTimeSlots';

const AdminTimeSettings: React.FC = () => {
  const { config, saveConfig } = useTimeSlots();
  const [localConfig, setLocalConfig] = useState<TimeSlotConfig>(config);

  // Đồng bộ khi config load xong
  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  const handleChange = (field: keyof TimeSlotConfig, value: string | number) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    saveConfig(localConfig);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 border-b border-slate-50 pb-2">Cài đặt chung</h3>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Thời lượng 1 khung giờ (phút)</label>
          <div className="flex items-center gap-3">
             <button 
                onClick={() => handleChange('duration', Math.max(5, localConfig.duration - 5))}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
             >-</button>
             <input 
                type="number" 
                value={localConfig.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                className="flex-1 text-center font-bold text-lg p-2 bg-slate-50 border border-slate-200 rounded-xl text-blue-600"
             />
             <button 
                onClick={() => handleChange('duration', localConfig.duration + 5)}
                className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kết thúc</label>
            <input 
              type="time" 
              value={localConfig.morningEnd}
              onChange={(e) => handleChange('morningEnd', e.target.value)}
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
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Kết thúc</label>
            <input 
              type="time" 
              value={localConfig.afternoonEnd}
              onChange={(e) => handleChange('afternoonEnd', e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={handleSave}
          className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          Lưu cấu hình
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">Thay đổi sẽ áp dụng cho tất cả các ngày đặt lịch.</p>
      </div>
    </div>
  );
};

export default AdminTimeSettings;