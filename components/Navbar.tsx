
import React, { useState } from 'react';
import Logo from './Logo';

interface NavbarProps {
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = () => {
  const [showPrize, setShowPrize] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 px-4 py-2 sm:px-6 sm:py-4">
        <div className="container mx-auto max-w-2xl relative flex items-center justify-center notification-card px-4 sm:px-10 py-2 sm:py-4 min-h-[60px] sm:min-h-[90px] !rounded-[20px] sm:!rounded-[32px] !bg-white/80">
          
          <button
            onClick={() => setShowPrize(true)}
            className="absolute left-2 sm:left-6 p-2 sm:p-3 rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-50 text-yellow-600 shadow-sm border border-yellow-200/50 hover:scale-105 active:scale-95 transition-all duration-300 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="sm:w-6 sm:h-6 drop-shadow-sm group-hover:rotate-6 transition-transform">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33.076 33.076 0 0 1 2.5.5zm.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935zm10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.589-.388 2.885-.72 3.935zM3.504 1c.007.517.026 1.006.056 1.469.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .168.545L6.051 14.5a.5.5 0 0 1 .526-.082l4.898 3.171c.3.194.669.194.969 0l4.898-3.171a.5.5 0 0 1 .526.082l-1.117 3.955A.5.5 0 0 1 16 19H7a.5.5 0 0 1-.168-.545l1.117-3.955a.5.5 0 0 1 .526-.082z"/>
            </svg>
          </button>

          <div className="flex flex-col items-center">
            <Logo className="w-24 sm:w-48" />
            <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase mt-0.5 sm:mt-1">
              Team Challenge
            </span>
          </div>

        </div>
      </nav>

      {/* Prize Modal */}
      {showPrize && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setShowPrize(false)}
        >
          <div 
            className="apple-glass p-0 rounded-[40px] max-w-sm w-full text-center shadow-2xl transform transition-all scale-100 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-white/20 blur-xl scale-150 rounded-full mix-blend-overlay"></div>
               <div className="relative z-10 w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto text-5xl shadow-lg border border-white/30 text-white">
                🏆
               </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="text-right space-y-2" dir="rtl">
                  <p className="text-lg text-gray-800 leading-relaxed font-medium">
                      <span className="font-black text-yellow-600 block text-xl mb-1">2 המקומות הראשונים</span> 
                      מקבלים <span className="font-bold">כרטיס זוגי</span> (כל אחד) להופעה של <span className="font-bold">יובל סמו!</span>
                  </p>
              </div>
              
              <div className="bg-gray-50 rounded-3xl p-5 space-y-3 text-sm font-bold text-gray-600 border border-gray-100">
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm">
                      <span className="text-2xl w-8 text-center">📅</span>
                      <span className="text-gray-900">20/02</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm">
                      <span className="text-2xl w-8 text-center">⏰</span>
                      <span className="text-gray-900">21:30</span>
                  </div>
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm">
                      <span className="text-2xl w-8 text-center">📍</span>
                      <span className="text-gray-900">בית חיל האוויר, הרצליה</span>
                  </div>
              </div>

              <button 
                onClick={() => setShowPrize(false)}
                className="w-full bg-[#1C1C1E] text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
