
import React, { useState, useEffect, useCallback } from 'react';
import { View, Employee } from './types';
import Leaderboard from './components/Leaderboard';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [manualUpdateTime, setManualUpdateTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
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
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Poll for changes every 30 seconds
    const interval = setInterval(fetchData, 30000);
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
    <div className="min-h-screen text-[#1C1C1E] pb-24">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 pt-0 max-w-xl">
        <StatsSummary />

        {manualUpdateTime && (
          <div className="mb-2 px-2 flex justify-start animate-in fade-in slide-in-from-top-1 duration-500">
            <span className="text-[10px] font-bold text-gray-400 tracking-wider bg-gray-100/50 px-2 py-0.5 rounded-md">
              עודכן לאחרונה: <span className="text-gray-600">{manualUpdateTime}</span>
            </span>
          </div>
        )}
        <Leaderboard employees={employees} />
      </main>
    </div>
  );
};

export default App;
