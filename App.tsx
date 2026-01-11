
import React, { useState, useEffect, useMemo } from 'react';
import { View, Employee, ScoreEntry, DEADLINE } from './types';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LEADERBOARD);
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('sushi_employees');
    return saved ? JSON.parse(saved) : [];
  });
  const [entries, setEntries] = useState<ScoreEntry[]>(() => {
    const saved = localStorage.getItem('sushi_entries');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sushi_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('sushi_entries', JSON.stringify(entries));
  }, [entries]);

  const addScore = (employeeName: string, points: number, reason: string) => {
    let emp = employees.find(e => e.fullName === employeeName);
    
    if (!emp) {
      emp = {
        id: crypto.randomUUID(),
        fullName: employeeName,
        totalPoints: 0
      };
      setEmployees(prev => [...prev, emp!]);
    }

    const newEntry: ScoreEntry = {
      id: crypto.randomUUID(),
      employeeId: emp.id,
      points,
      reason,
      date: new Date().toISOString()
    };

    setEntries(prev => [newEntry, ...prev]);
    setEmployees(prev => prev.map(e => 
      e.id === emp!.id ? { ...e, totalPoints: e.totalPoints + points } : e
    ));
  };

  const deleteEntry = (entryId: string) => {
    const entryToDelete = entries.find(e => e.id === entryId);
    if (!entryToDelete) return;

    setEntries(prev => prev.filter(e => e.id !== entryId));
    setEmployees(prev => prev.map(e => 
      e.id === entryToDelete.employeeId 
        ? { ...e, totalPoints: Math.max(0, e.totalPoints - entryToDelete.points) } 
        : e
    ));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      <Navbar currentView={currentView} setView={setCurrentView} />
      
      <main className="container mx-auto px-4 pt-6 max-w-4xl">
        <StatsSummary entries={entries} employees={employees} />

        {currentView === View.LEADERBOARD ? (
          <Leaderboard employees={employees} />
        ) : (
          <AdminPanel 
            employees={employees} 
            entries={entries} 
            onAddScore={addScore}
            onDeleteEntry={deleteEntry}
          />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 w-full glass py-3 border-t border-white/10 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} SUSHI ROOM Team Competition
      </footer>
    </div>
  );
};

export default App;
