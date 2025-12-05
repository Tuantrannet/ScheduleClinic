import React from 'react';
import type { BookingData } from '../../hooks/useBookingSystem';

interface BookingCardProps {
  booking: BookingData;
  onUpdateStatus: (id: number, status: 'approved' | 'rejected') => void;
  onClick: (booking: BookingData) => void; // <--- Thêm prop này
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onUpdateStatus, onClick }) => {
  return (
    <div 
      onClick={() => onClick(booking)} // <--- Sự kiện click vào thẻ
      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md cursor-pointer group active:scale-[0.99]"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
            {booking.fullName}
          </h3>
          <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
            <span>📅 {booking.date}</span>
            <span>⏰ {booking.time}</span>
          </div>
        </div>
        
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide
          ${booking.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : ''}
          ${booking.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
          ${booking.status === 'rejected' ? 'bg-rose-50 text-rose-600 border border-rose-100' : ''}
        `}>
          {booking.status === 'pending' ? 'Chờ duyệt' : 
           booking.status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
        </span>
      </div>

      {booking.status === 'pending' && (
        <div className="flex gap-3 mt-3 border-t border-slate-50 pt-3">
          <button 
            onClick={(e) => {
              e.stopPropagation(); // <--- Ngăn chặn sự kiện click lan ra thẻ cha
              onUpdateStatus(booking.id, 'rejected');
            }}
            className="flex-1 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Từ chối
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // <--- Ngăn chặn sự kiện click lan ra thẻ cha
              onUpdateStatus(booking.id, 'approved');
            }}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors"
          >
            Chấp nhận
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;