
import React, { useState, useEffect } from 'react';
import { DEADLINE, START_DATE } from '../types';

const StatsSummary: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeInfo, setActiveInfo] = useState<{title: string, desc: string, color: string} | null>(null);

  useEffect(() => {
    const updateStats = () => {
      const now = new Date();
      const difference = DEADLINE.getTime() - now.getTime();
      if (difference <= 0) {
        setTimeLeft(null);
        setProgress(100);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });

        const totalDuration = DEADLINE.getTime() - START_DATE.getTime();
        const elapsed = now.getTime() - START_DATE.getTime();
        const calculatedProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setProgress(calculatedProgress);
      }
    };

    updateStats();
    const timer = setInterval(updateStats, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleIconClick = (type: 'shift' | 'alcohol' | 'average') => {
    switch (type) {
      case 'shift':
        setActiveInfo({
          title: 'משמרת',
          desc: 'על כל משמרת מקבלים 1 נקודה',
          color: 'text-blue-600'
        });
        break;
      case 'alcohol':
        setActiveInfo({
          title: 'אלכוהול',
          desc: 'המלצר שמכר הכי הרבה אלכוהול סה״כ במשמרת מקבל 6 נקודות',
          color: 'text-indigo-600'
        });
        break;
      case 'average':
        setActiveInfo({
          title: 'ממוצע',
          desc: 'המלצר עם הממוצע לסועד הכי גבוה במשמרת מקבל 6 נקודות',
          color: 'text-pink-600'
        });
        break;
    }
  };

  return (
    <>
      <div className="mb-2 space-y-2 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="flex flex-col items-center">
          
          {/* Timer - significantly smaller */}
          <div className="flex gap-4 sm:gap-8 items-center justify-center mb-3 mt-1" dir="ltr">
            {timeLeft ? (
              <>
                <TimeUnit value={timeLeft.days} label="ימים" />
                <div className="w-[1px] h-6 bg-black/10 self-center"></div>
                <TimeUnit value={timeLeft.hours} label="שעות" />
                <div className="w-[1px] h-6 bg-black/10 self-center"></div>
                <TimeUnit value={timeLeft.minutes} label="דקות" />
              </>
            ) : (
              <span className="text-black font-extrabold text-2xl tracking-tighter uppercase">הסתיים!</span>
            )}
          </div>

          <div className="w-full max-w-xl space-y-3 notification-card p-3 sm:p-4 !bg-white/60 !rounded-[24px]">
            {/* Progress Bar - Compact */}
            <div className="space-y-1.5">
               <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-black tracking-tighter leading-none">{Math.round(progress)}%</span>
                <span className="text-[8px] font-extrabold text-black/40 uppercase tracking-widest">סיום: 05/02</span>
              </div>
              <div className="relative h-2.5 w-full bg-black/5 rounded-full overflow-hidden border border-white/80 p-[2px]">
                <div 
                  className="absolute top-0 right-0 h-full bg-gradient-to-l from-[#007AFF] to-[#5856D6] transition-all duration-1000 ease-in-out shadow-lg rounded-full"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute left-0 top-0 h-full w-[6px] bg-white/60 blur-[2px]"></div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-1">
              <ScoringIcon 
                label="משמרת" 
                points="1" 
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />}
                color="text-blue-600"
                bg="bg-blue-500/10"
                onClick={() => handleIconClick('shift')}
              />
              <ScoringIcon 
                label="אלכוהול" 
                points="6" 
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747c.224-.863-.105-1.707-.708-2.253l-4.703-4.252a1.875 1.875 0 0 1 0-2.824l1.235-1.117a.937.937 0 1 0-1.26-1.388l-1.235 1.117a3.75 3.75 0 0 0 0 5.648l4.703 4.252c.23.208.34.542.234.845A7.125 7.125 0 0 1 5.284 14.253c-.106-.303.004-.637.234-.845l4.703-4.252a3.75 3.75 0 0 0 0-5.648l-1.235-1.117a.937.937 0 1 0-1.26 1.388l1.235 1.117a1.875 1.875 0 0 1 0 2.824l-4.703 4.252c-.603.546-.932 1.39-.708 2.253A9.004 9.004 0 0 0 12 21Z" />}
                color="text-indigo-600"
                bg="bg-indigo-500/10"
                onClick={() => handleIconClick('alcohol')}
              />
              <ScoringIcon 
                label="ממוצע" 
                points="6" 
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />}
                color="text-pink-600"
                bg="bg-pink-500/10"
                onClick={() => handleIconClick('average')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {activeInfo && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveInfo(null)}
        >
          <div 
            className="apple-glass p-6 sm:p-8 rounded-[32px] max-w-xs sm:max-w-sm w-full text-center shadow-2xl transform transition-all scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={`text-xl sm:text-2xl font-black mb-3 ${activeInfo.color}`}>{activeInfo.title}</h3>
            <p className="text-base sm:text-lg font-medium text-gray-700 leading-relaxed mb-6">{activeInfo.desc}</p>
            <button 
              onClick={() => setActiveInfo(null)}
              className="w-full bg-black/5 hover:bg-black/10 text-black font-bold py-2.5 rounded-xl transition-colors text-sm"
            >
              סגור
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl sm:text-4xl font-normal tracking-tighter text-[#1d1d1f]">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[8px] mt-0.5 font-extrabold uppercase tracking-[0.2em] text-black/30">{label}</span>
  </div>
);

const ScoringIcon: React.FC<{ label: string; points: string; icon: React.ReactNode; color: string; bg: string; onClick: () => void }> = ({ label, points, icon, color, bg, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 p-1.5 rounded-[16px] hover:bg-black/5 active:scale-95 transition-all group w-full"
  >
    <div className={`w-8 h-8 rounded-[12px] ${bg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${color}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
        {icon}
      </svg>
    </div>
    <div className="text-center leading-none">
      <span className="block text-[8px] uppercase tracking-[0.1em] text-black/50 font-extrabold mb-0.5">{label}</span>
      <span className={`text-sm font-black ${color}`}>{points} PT</span>
    </div>
  </button>
);

export default StatsSummary;
