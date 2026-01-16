
import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Employee, POINT_VALUES } from './types';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
// Note: AdminPanel component logic is now inline in index.html for simplicity in this file structure, 
// but in a real React app, it would be a separate import. We will simulate the structure here.

const App: React.FC = () => {
  const [view, setView] = useState('LEADERBOARD');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [manualUpdateTime, setManualUpdateTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsSyncing(true);
    setError(null);
    try {
      const response = await fetch(`./ranking.xlsx?t=${new Date().getTime()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('קובץ ranking.xlsx לא נמצא. אנא העלה אותו לתיקייה הראשית ב-GitHub.');
        }
        throw new Error('שגיאה בטעינת הקובץ');
      }

      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data: any[] = XLSX.utils.sheet_to_json(sheet);

      const pointsMap = new Map<string, number>();

      data.forEach((row) => {
        const rawName = row['שם'] || row['Name'] || row['name'];
        if (!rawName) return;

        const normalizedName = String(rawName).trim();
        if (!normalizedName || normalizedName === 'שם לא ידוע') return;

        const points = Number(row['נקודות'] || row['Points'] || row['points'] || 0);

        if (pointsMap.has(normalizedName)) {
          pointsMap.set(normalizedName, (pointsMap.get(normalizedName) || 0) + points);
        } else {
          pointsMap.set(normalizedName, points);
        }
      });

      const mappedEmployees: Employee[] = Array.from(pointsMap.entries()).map(([name, points], index) => ({
        id: String(index),
        fullName: name,
        totalPoints: points
      }));

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

  const handleUpdateEmployee = (name: string, pointsToAdd: number) => {
      const normalizedName = name.trim();
      setEmployees(prev => {
          const exists = prev.find(e => e.fullName === normalizedName);
          if (exists) {
              return prev.map(e => e.fullName === normalizedName ? { ...e, totalPoints: e.totalPoints + pointsToAdd } : e);
          } else {
              return [...prev, { id: String(Date.now()), fullName: normalizedName, totalPoints: pointsToAdd }];
          }
      });
  };

  const handleDownloadExcel = () => {
      const exportData = employees.map((emp, index) => ({
          'שם': emp.fullName,
          'נקודות': emp.totalPoints,
          'עדכון': index === 0 ? manualUpdateTime : ''
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ranking");
      XLSX.writeFile(workbook, "ranking.xlsx");
  };

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
      <Navbar onAdminClick={() => setView(view === 'LEADERBOARD' ? 'ADMIN' : 'LEADERBOARD')} />
      
      <main className="container mx-auto px-4 sm:px-6 pt-0 max-w-xl">
        <StatsSummary />

        {error && view !== 'ADMIN' ? (
           <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl text-center space-y-2">
             <p className="text-red-600 font-bold">שגיאה בטעינת נתונים</p>
             <p className="text-red-400 text-sm">{error}</p>
             <p className="text-gray-400 text-xs mt-4">
               אנא וודא שקיים קובץ בשם <span className="font-mono bg-gray-100 px-1 rounded">ranking.xlsx</span> בתיקייה הראשית.
               <br/>
               עמודות חובה: <span className="font-bold">שם</span>, <span className="font-bold">נקודות</span>
             </p>
           </div>
        ) : (
          <>
            {view === 'LEADERBOARD' && (
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

            {view === 'ADMIN' && (
                // This would be the actual AdminPanel component call
                <div className="p-4 text-center">Admin Panel Placeholder</div>
            )}
          </>
        )}
      </main>

      {/* Floating Sync Button */}
      {!error && view === 'LEADERBOARD' && (
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

export default App;
