// src/components/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
      <div className="flex items-center justify-between px-5 py-3">
        {/* --- PHẦN LOGO (BÊN TRÁI) --- */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl shadow-blue-200 shadow-md text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          
          <div className="flex flex-col">
            <h1 className="text-base font-extrabold text-blue-900 leading-none">KTechnical</h1>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wide uppercase mt-0.5">
              Chăm sóc sức khỏe
            </span>
          </div>
        </div>

        {/* --- PHẦN ICON Y TẾ (BÊN PHẢI) --- */}
        {/* Icon Trái tim trang trí để lấp khoảng trống & tạo điểm nhấn */}
        <div className="flex items-center gap-2">
           <div className="flex items-center justify-center w-9 h-9 bg-rose-50 rounded-full border border-rose-100 shadow-sm">
             <svg 
               xmlns="http://www.w3.org/2000/svg" 
               viewBox="0 0 24 24" 
               fill="currentColor" 
               className="w-5 h-5 text-rose-500"
             >
               <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
             </svg>
           </div>
        </div>
      </div>
    </header>
  );
};

export default Header;