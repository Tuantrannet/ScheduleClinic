// src/components/booking/TimeSlotPicker.tsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type SlotStatus = 'available' | 'reserved' | 'confirmed';

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
  duration?: number;
}

const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({ 
  slots, 
  selectedSlot, 
  onSelect, 
  isLoading,
  duration = 0 // Default value
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

  const getSlotStyle = (status: SlotStatus, isSelected: boolean) => {
    if (isSelected) return 'bg-blue-600 text-white font-bold hover:bg-blue-700';
    switch (status) {
      case 'confirmed': return 'bg-red-50 text-red-400 cursor-not-allowed opacity-60';
      case 'reserved': return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-l-4 border-yellow-400';
      case 'available': return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-l-4 border-emerald-400';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  const getStatusLabel = (status: SlotStatus) => {
    switch (status) {
      case 'confirmed': return 'Đã kín';
      case 'reserved': return 'Sắp kín';
      case 'available': return 'Còn trống';
      default: return '';
    }
  };

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
          {isLoading ? 'Đang tải lịch...' : displayLabel}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {slots.length > 0 && !isLoading && (
        <div className="flex flex-wrap gap-3 mt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Còn trống
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Có người giữ
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400"></span> Đã kín
          </div>
        </div>
      )}

      {isOpen && createPortal(
        <>
          <div className="fixed inset-0 z-[9998] bg-transparent" onClick={() => setIsOpen(false)} />
          <div 
            style={{ top: coords.top, left: coords.left, width: coords.width }}
            className="absolute z-[9999] bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] max-h-[300px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100 py-1"
          >
            {slots.map((slot) => {
              const isDisabled = slot.status === 'confirmed';
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
                    w-full text-left px-4 py-3 text-sm border-b border-slate-50 last:border-0 transition-colors flex justify-between items-center mb-1 last:mb-0
                    ${getSlotStyle(slot.status, isSelected)}
                  `}
                >
                  <span className="font-medium">{slot.timeLabel}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ml-2 px-2 py-0.5 rounded
                    ${isSelected ? 'bg-white/20' : ''}
                  `}>
                    {isSelected ? '✓ Đã chọn' : getStatusLabel(slot.status)}
                  </span>
                </button>
              );
            })}
          </div>
        </>,
        document.body
      )}

      {/* CHỈ HIỂN THỊ KHI CÓ SLOT VÀ DURATION > 0 */}
      {slots.length > 0 && duration > 0 && (
        <div className="mt-2 text-xs text-center text-slate-400">
           Thời lượng khám: <span className="font-semibold text-slate-600">{duration} phút</span> / ca
        </div>
      )}
    </>
  );
};

export default TimeSlotPicker;