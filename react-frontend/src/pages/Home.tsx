import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  
  // --- STATE QUẢN LÝ KÉO THẢ (DRAG) ---
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  // --- XỬ LÝ NGÀY HIỆN TẠI ---
  // Lấy ngày hôm nay và format thành "dd/mm" (Ví dụ: 03/12)
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

  const banners = [
    { id: 1, src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop", title: "Chăm sóc toàn diện" },
    { id: 2, src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2028&auto=format&fit=crop", title: "Môi trường tiện ích" }
  ];

  // Auto-play
  useEffect(() => {
    if (isDragging) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeBannerIndex, isDragging]);

  const nextSlide = () => {
    setActiveBannerIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // --- LOGIC TOUCH/DRAG ---
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - startX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 50; 
    if (dragOffset < -threshold) nextSlide();
    else if (dragOffset > threshold) prevSlide();
    setDragOffset(0);
  };

  const handleConfirmPhone = () => {
    setShowPhoneModal(false);
    navigate('/booking');
  };

  return (
    <div className="flex flex-col space-y-6 relative">
      
      {/* --- MODAL Component --- */}
      <Modal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        title="Liên kết số điện thoại"
        footer={
          <>
            <button onClick={() => setShowPhoneModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50">Từ chối</button>
            <button onClick={handleConfirmPhone} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-blue-200 shadow-md">Đồng ý</button>
          </>
        }
      >
        Bạn có đồng ý cho phép hệ thống liên kết với số điện thoại của bạn để đặt lịch khám không?
      </Modal>

      {/* Greeting Section */}
      <div className="flex justify-between items-end">
        <div>
          {/* Đã thay thế ngày cứng bằng biến dateStr */}
          <p className="text-slate-500 text-sm">Hôm nay, {dateStr}</p>
          <h2 className="text-2xl font-bold text-slate-800">Xin Chào, <span className="text-blue-600">Khách hàng</span> 👋</h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
             <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Avatar" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Banner Slider */}
      <div 
        className="relative w-full overflow-hidden rounded-2xl shadow-blue-100 shadow-xl group touch-pan-y select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex h-44 w-full"
          style={{ 
            transform: `translateX(calc(-${activeBannerIndex * 100}% + ${dragOffset}px))`,
            transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' 
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="min-w-full h-full relative flex-shrink-0">
              <img src={banner.src} alt="Banner" className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-lg">{banner.title}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 right-4 flex space-x-1.5 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveBannerIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === activeBannerIndex ? 'bg-white w-4' : 'bg-white/40 w-1.5'}`}
            />
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <button 
        onClick={() => setShowPhoneModal(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white p-4 rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
             <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg">Đặt lịch khám ngay</h3>
            <p className="text-blue-100 text-xs">Không cần chờ đợi</p>
          </div>
        </div>
        <svg className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      {/* Quick Menu */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'lookup', label: 'Tra cứu', color: 'bg-emerald-100 text-emerald-600', icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" },
          { id: 'queue', label: 'STT Khám', color: 'bg-orange-100 text-orange-600', icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
          { id: 'contact', label: 'Hỗ trợ', color: 'bg-purple-100 text-purple-600', icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
          { id: 'more', label: 'Thêm', color: 'bg-slate-100 text-slate-600', icon: "M4 6h16M4 12h16M4 18h16" },
        ].map((item) => (
          <button key={item.id} className="flex flex-col items-center gap-2 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} shadow-sm transition-transform group-active:scale-90`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>
            <span className="text-xs font-medium text-slate-600">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Footer Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mt-4">
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase">Thông tin phòng khám</h3>
        <div className="space-y-3 text-sm text-slate-600">
           <div className="flex items-start gap-3">
             <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 mt-0.5">📍</div>
             <span>123 Nguyễn Văn Cừ, Q.5, TP.HCM</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;