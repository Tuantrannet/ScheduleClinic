import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { patientApi } from '../services/patientService'; // Import service

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);

  // --- STATE QUẢN LÝ KÉO THẢ (DRAG) ---
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}`;

  // State tên người dùng
  const [userName, setUserName] = useState("Khách hàng");

  // --- LOGIC MỚI: GỌI API LẤY TÊN ---
  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Lấy token từ localStorage
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        try {
          // 2. Giải mã token để lấy zalo_id
          // Token gồm 3 phần tách nhau bởi dấu chấm. Payload là phần thứ 2.
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          const decodedToken = JSON.parse(jsonPayload);
          // Trong JwtMiddleware, claim type là "zalo_id"
          const zaloId = decodedToken["zalo_id"];

          if (zaloId) {
            // 3. Gọi API lấy thông tin chi tiết
            const data = await patientApi.getDetail(zaloId, token);
            
            // Backend trả về PatientInfoDto, map field PatientName (hoặc patientName tùy config JSON của C#)
            if (data && (data as any).patientName) {
                setUserName((data as any).patientName);
            } else if (data && (data as any).PatientName) {
                setUserName((data as any).PatientName);
            }
          }
        } catch (error) {
          console.error("Không thể lấy thông tin người dùng:", error);
          // Fallback: Nếu lỗi API, thử lấy từ localStorage cũ nếu có
          const localUser = localStorage.getItem('currentUser');
          if (localUser) {
             setUserName(JSON.parse(localUser).fullName);
          }
        }
      }
    };

    fetchUserData();
  }, []); // Chỉ chạy 1 lần khi mount

  const banners = [
    { id: 1, src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=2091&auto=format&fit=crop", title: "Chăm sóc toàn diện" },
    { id: 2, src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2028&auto=format&fit=crop", title: "Môi trường tiện ích" }
  ];

  // Auto-play banner
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

  return (
    <div className="flex flex-col space-y-6 relative pb-20">
      
      {/* Greeting Section */}
      <div className="flex justify-between items-end">
        <div>
          <p className="text-slate-500 text-sm">Hôm nay, {dateStr}</p>
          <h2 className="text-2xl font-bold text-slate-800">Xin Chào, <span className="text-blue-600">{userName}</span> 👋</h2>
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
        onClick={() => navigate('/booking')}
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

      {/* Footer Info */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mt-4">
        <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase">Thông tin phòng khám</h3>
        <div className="space-y-3 text-sm text-slate-600">
           <div className="flex items-start gap-3">
             <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 mt-0.5">📍</div>
             <span>123 Nguyễn Văn Cừ, Q.5, TP.HCM</span>
           </div>
           <div className="flex items-start gap-3">
             <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 mt-0.5">📞</div>
             <span>1900 123 456</span>
           </div>
           <div className="flex items-start gap-3">
             <div className="w-5 h-5 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 mt-0.5">⏰</div>
             <span>07:00 - 17:00 (T2 - T7)</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;