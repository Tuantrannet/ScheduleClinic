import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click backdrop để đóng */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl scale-100 relative z-10">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
          {/* Icon info mặc định */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
        </div>
        
        <h3 className="text-lg font-bold text-center text-slate-800 mb-2">{title}</h3>
        <div className="text-sm text-center text-slate-500 mb-6">
          {children}
        </div>
        
        {footer && <div className="flex gap-3">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;