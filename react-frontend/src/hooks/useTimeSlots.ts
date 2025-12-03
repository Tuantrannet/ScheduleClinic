import { useState, useEffect, useCallback } from 'react';

export interface TimeSlotConfig {
  duration: number; // phút (ví dụ 10)
  morningStart: string; // "07:00"
  morningEnd: string;   // "11:00"
  afternoonStart: string; // "13:00"
  afternoonEnd: string;   // "17:00"
}

const DEFAULT_CONFIG: TimeSlotConfig = {
  duration: 10,
  morningStart: "07:00",
  morningEnd: "11:00",
  afternoonStart: "13:00",
  afternoonEnd: "17:00"
};

export const useTimeSlots = () => {
  const [config, setConfig] = useState<TimeSlotConfig>(DEFAULT_CONFIG);

  // Load config từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('timeSlotConfig');
    if (saved) {
      setConfig(JSON.parse(saved));
    }
  }, []);

  // Lưu config
  const saveConfig = (newConfig: TimeSlotConfig) => {
    setConfig(newConfig);
    localStorage.setItem('timeSlotConfig', JSON.stringify(newConfig));
    alert('Đã lưu cấu hình khung giờ thành công!');
  };

  // Hàm sinh giờ từ Config
  const generateSlots = useCallback(() => {
    const slots: { label: string, value: string }[] = [];
    const { duration, morningStart, morningEnd, afternoonStart, afternoonEnd } = config;

    const createSlotsInRange = (startStr: string, endStr: string) => {
      const [startH, startM] = startStr.split(':').map(Number);
      const [endH, endM] = endStr.split(':').map(Number);
      
      let currentMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      while (currentMinutes + duration <= endMinutes) {
        // Tính giờ bắt đầu
        const h = Math.floor(currentMinutes / 60);
        const m = currentMinutes % 60;
        const startLabel = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;

        // Tính giờ kết thúc slot
        const nextMinutes = currentMinutes + duration;
        const nextH = Math.floor(nextMinutes / 60);
        const nextM = nextMinutes % 60;
        const endLabel = `${nextH.toString().padStart(2, '0')}:${nextM.toString().padStart(2, '0')}`;

        slots.push({
          label: startLabel,
          value: `${startLabel} - ${endLabel}`
        });

        currentMinutes += duration;
      }
    };

    createSlotsInRange(morningStart, morningEnd);
    createSlotsInRange(afternoonStart, afternoonEnd);

    return slots;
  }, [config]);

  return { config, saveConfig, generateSlots };
};