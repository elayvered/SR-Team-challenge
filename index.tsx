
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import * as XLSX from 'xlsx';

// --- TYPES ---
export interface Employee {
  id: string;
  fullName: string;
  totalPoints: number;
}

export const POINT_VALUES = {
  SHIFT: 1,
  ALCOHOL: 6,
  AVERAGE: 6
};

// תקופת התחרות: 11/1 עד 5/2
export const START_DATE = new Date('2026-01-11T00:00:00');
export const DEADLINE = new Date('2026-02-05T23:59:59');

// --- COMPONENTS ---

// 1. Logo Component
const Logo: React.FC<{ className?: string }> = ({ className = "w-48" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="logo.png" 
        alt="SUSHI ROOM Logo" 
        className="max-w-full h-auto object-contain brightness-0"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = "text-[#1C1C1E] font-black tracking-[0.2em] text-2xl sm:text-3xl uppercase whitespace-nowrap";
            fallback.innerText = "SUSHI ROOM";
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
};

// 2. Navbar Component
const Navbar: React.FC = () => {
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

// 3. StatsSummary Component
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
          
          {/* Timer */}
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
            {/* Progress Bar */}
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

// 4. Leaderboard Component
const Leaderboard: React.FC<{ employees: Employee[] }> = ({ employees }) => {
  const sortedEmployees = [...employees].sort((a, b) => b.totalPoints - a.totalPoints);

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-30">
        <p className="text-lg tracking-[0.2em] font-light text-gray-500">אין נתונים זמינים</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 pb-20 animate-in slide-in-from-bottom-8 duration-700">
      {sortedEmployees.map((employee, index) => {
        const isOne = index === 0;
        const isTwo = index === 1;
        
        return (
          <div 
            key={employee.id}
            className={`group relative flex items-center justify-between p-3 sm:p-4 apple-card transition-all duration-500 hover:scale-[1.01] ${
              isOne ? 'top-one-glow' : isTwo ? 'top-two-glow' : 'hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-[14px] font-black text-base transition-all duration-500 ${
                isOne ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105' :
                isTwo ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' :
                'bg-gray-100 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1E] leading-none">
                  {employee.fullName}
                </h3>
                {index < 2 && (
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1 block ${isOne ? 'text-blue-600' : 'text-indigo-600'}`}>
                    {isOne ? 'SUPREME CHAMPION' : 'ELITE STAR'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className={`text-2xl sm:text-3xl font-black tracking-tighter leading-none ${isOne ? 'text-blue-600' : isTwo ? 'text-indigo-600' : 'text-[#1C1C1E]'}`}>
                {employee.totalPoints}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-gray-400 font-extrabold mt-0.5">Points</span>
            </div>

            {isOne && <div className="absolute -left-2 -top-2 text-3xl animate-bounce">🥇</div>}
            {isTwo && <div className="absolute -left-2 -top-2 text-2xl opacity-90">🥈</div>}
          </div>
        );
      })}
    </div>
  );
};

// 5. Main App Component
const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [manualUpdateTime, setManualUpdateTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsSyncing(true);
    setError(null);
    try {
      // Fetch the Excel file
      const response = await fetch(`./ranking.xlsx?t=${new Date().getTime()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('קובץ ranking.xlsx לא נמצא. אנא העלה אותו לתיקייה הראשית ב-GitHub.');
        }
        throw new Error('שגיאה בטעינת הקובץ');
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      
      // Assume first sheet contains the data
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      
      // Convert to JSON
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      // Map Excel columns to Employee structure
      // Supporting Hebrew and English headers
      const mappedEmployees: Employee[] = data.map((row: any, index: number) => ({
        id: String(index),
        fullName: row['שם'] || row['Name'] || row['name'] || 'שם לא ידוע',
        totalPoints: Number(row['נקודות'] || row['Points'] || row['points'] || 0)
      })).filter(emp => emp.fullName !== 'שם לא ידוע'); // Filter empty rows

      // Try to find update time from a specific column if exists, or just use current time string if provided in the sheet
      if (data.length > 0) {
        const firstRow = data[0];
        const timeVal = firstRow['עדכון'] || firstRow['Update'] || firstRow['Time'];
        if (timeVal) {
          setManualUpdateTime(String(timeVal));
        }
      }

      setEmployees(mappedEmployees);

    } catch (err: any) {
      console.error("Data Fetch Error:", err);
      // Even if error, if we have old data we might want to keep it, but here we show error
      setError(err.message || "שגיאה בטעינת הנתונים");
    } finally {
      setIsLoading(false);
      if (showLoading) {
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 300000);
    return () => clearInterval(interval);
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-6">
        <div className="w-12 h-12 border-[3px] border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-gray-400 font-medium tracking-widest uppercase text-[10px]">Sushi Room Cloud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1C1C1E] pb-32">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-0 max-w-xl">
        <StatsSummary />

        {error ? (
           <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl text-center space-y-2 animate-in fade-in slide-in-from-bottom-2">
             <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
               </svg>
             </div>
             <p className="text-red-900 font-bold text-lg">שגיאה בטעינת נתונים</p>
             <p className="text-red-700 text-sm font-medium">{error}</p>
             <div className="text-gray-500 text-xs mt-4 bg-white/50 p-4 rounded-xl text-right" dir="rtl">
               <p className="font-bold mb-1">הוראות לפתרון:</p>
               <ol className="list-decimal list-inside space-y-1">
                 <li>צור קובץ אקסל במחשב בשם <span className="font-mono bg-gray-200 px-1 rounded text-black">ranking.xlsx</span></li>
                 <li>ודא שיש עמודות: <b>שם</b>, <b>נקודות</b></li>
                 <li>העלה את הקובץ לתיקייה הראשית ב-GitHub</li>
               </ol>
             </div>
           </div>
        ) : (
          <>
            <div className="mb-4 px-2 flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-500">
              {manualUpdateTime && (
                <span className="text-[10px] font-bold text-gray-400 tracking-wider bg-gray-100/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  עודכן לאחרונה: <span className="text-gray-600">{manualUpdateTime}</span>
                </span>
              )}
            </div>

            <Leaderboard employees={employees} />
          </>
        )}
      </main>

      {/* Floating Sync Button */}
      {!error && (
        <div className="fixed bottom-8 left-0 right-0 flex justify-center z-40 pointer-events-none">
          <button 
            onClick={() => fetchData(true)}
            disabled={isSyncing}
            className="pointer-events-auto flex items-center gap-2 bg-gray-600/90 backdrop-blur-md hover:bg-gray-500 text-white shadow-xl border border-white/10 px-5 py-2.5 rounded-full transition-all active:scale-95 disabled:opacity-70 cursor-pointer group hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-700 ${isSyncing ? 'animate-spin' : 'group-hover:rotate-180'}`}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">סנכרון נתונים</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- RENDER ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
