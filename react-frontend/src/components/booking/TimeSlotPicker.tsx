import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type SlotStatus = 'available' | 'booked' | 'busy';

export interface TimeSlot {
  id: number;
  timeLabel: string;
  fullTime: string;
  status: SlotStatus;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: string;
  onSelect: (slotFullTime: string) => void;
  isLoading?: boolean;
  duration?: number; // <--- THÊM PROP NÀY (Mặc định có thể để 10)
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  slots, 
  selectedSlot, 
  onSelect, 
  isLoading,
  duration = 10 // <--- Giá trị mặc định nếu không truyền
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const toggleDropdown = () => {
    if (isLoading || slots.length === 0) return;
    
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const displayLabel = selectedSlot 
    ? slots.find(s => s.fullTime === selectedSlot)?.timeLabel || selectedSlot
    : "-- Chọn khung giờ --";

  return (
    <>
      <label className="text-sm font-semibold text-slate-700">Chọn giờ khám</label>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleDropdown}
        disabled={isLoading || slots.length === 0}
        className={`w-full p-3 pl-4 pr-3 bg-slate-50 border rounded-xl flex items-center justify-between transition-all group
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'}
          ${(isLoading || slots.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className={`flex-1 text-left ${selectedSlot ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
          {displayLabel}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* PORTAL CONTENT */}
      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-transparent" onClick={() => setIsOpen(false)} />
          <div 
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            className="absolute z-[9999] bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100"
          >
            {slots.map((slot) => {
              const isDisabled = slot.status !== 'available';
              const isSelected = selectedSlot === slot.fullTime;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    onSelect(slot.fullTime);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full text-left px-4 py-3.5 text-sm border-b border-slate-50 last:border-0 transition-colors flex justify-between items-center
                    ${isSelected ? 'bg-blue-50 text-blue-700 font-bold' : ''}
                    ${isDisabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'hover:bg-slate-50 text-slate-700'}
                  `}
                >
                  <span className="font-medium">{slot.timeLabel}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider ml-2">
                    {isSelected && <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded">✓ Chọn</span>}
                    {!isSelected && slot.status === 'booked' && 'Đã kín'}
                    {!isSelected && slot.status === 'busy' && 'Bận'}
                    {!isSelected && slot.status === 'available' && <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Trống</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}

      {slots.length > 0 && (
        <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-xs text-blue-800 leading-5">
            Mỗi ca khám dự kiến kéo dài <strong>{duration} phút</strong>.
          </p>
        </div>
      )}
    </>
  );
};

export default TimeSlotPicker;