
import React, { useState, useEffect, useCallback } from 'react';
import { View, Employee } from './types';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [manualUpdateTime, setManualUpdateTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = useCallback(async (showLoading = false) => {
    if (showLoading) setIsSyncing(true);
    try {
      // Adding timestamp to prevent browser caching so updates appear immediately
      const response = await fetch(`./data.json?t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          if (data.employees) setEmployees(data.employees);
          if (data.manualUpdateTime) setManualUpdateTime(data.manualUpdateTime);
        }
      }
    } catch (error) {
      console.error("Data Fetch Error:", error);
    } finally {
      setIsLoading(false);
      if (showLoading) {
        // Minimum spinner time for UX
        setTimeout(() => setIsSyncing(false), 500);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll for changes every 5 minutes (300,000ms)
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

        <div className="mb-4 px-2 flex items-center justify-center animate-in fade-in slide-in-from-top-1 duration-500">
          {manualUpdateTime && (
            <span className="text-[10px] font-bold text-gray-400 tracking-wider bg-gray-100/50 px-3 py-1 rounded-full backdrop-blur-sm">
              עודכן לאחרונה: <span className="text-gray-600">{manualUpdateTime}</span>
            </span>
          )}
        </div>

        <Leaderboard employees={employees} />
      </main>

      {/* Floating Sync Button at Bottom Center */}
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
    </div>
  );
};

export default App;
