
import React, { useState } from 'react';
import { Employee, ScoreEntry, POINT_VALUES } from '../types';

interface AdminPanelProps {
  employees: Employee[];
  entries: ScoreEntry[];
  manualUpdateTime: string;
  onAddScore: (name: string, points: number, reason: string) => void;
  onDeleteEntry: (id: string) => void;
  onUpdateManualTime: (time: string) => void;
}

const ADMIN_CODE = "77654";

const AdminPanel: React.FC<AdminPanelProps> = ({ employees, entries, onAddScore, onDeleteEntry, manualUpdateTime, onUpdateManualTime }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const [fullName, setFullName] = useState('');
  const [newTime, setNewTime] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<{ [key: string]: boolean }>({
    shift: false,
    alcohol: false,
    average: false
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_CODE) {
      setIsAuthenticated(true);
      setError(false);
      setNewTime(manualUpdateTime);
    } else {
      setError(true);
      setPasscode('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (selectedTasks.shift) onAddScore(fullName, POINT_VALUES.SHIFT, 'משמרת');
    if (selectedTasks.alcohol) onAddScore(fullName, POINT_VALUES.ALCOHOL, 'אלכוהול');
    if (selectedTasks.average) onAddScore(fullName, POINT_VALUES.AVERAGE, 'ממוצע');

    setFullName('');
    setSelectedTasks({ shift: false, alcohol: false, average: false });
  };

  const handleTimeUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateManualTime(newTime);
  };

  const toggleTask = (task: string) => {
    setSelectedTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  const downloadDataFile = () => {
    const data = {
      manualUpdateTime: manualUpdateTime,
      employees: employees,
      entries: entries
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="apple-glass p-8 rounded-[40px] w-full max-w-sm text-center space-y-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">כניסת מנהל</h3>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => { setPasscode(e.target.value); setError(false); }}
              placeholder="קוד גישה"
              className={`w-full bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-200'} rounded-2xl px-6 py-4 text-center text-xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              autoFocus
            />
            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all">התחבר</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500 pb-20">
      
      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl text-center">
        <p className="text-sm text-yellow-800 font-bold mb-2">⚠️ שים לב!</p>
        <p className="text-xs text-yellow-700 leading-relaxed">
          שינויים כאן נשמרים רק בדפדפן שלך. כדי לעדכן את האתר לכולם, עליך ללחוץ על "הורד קובץ נתונים" בתחתית העמוד ולהעלות את הקובץ data.json ל-GitHub.
        </p>
      </div>

      {/* Time Update Section */}
      <div className="apple-glass p-6 rounded-[32px] space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">טקסט ״עודכן לאחרונה״</h3>
        <form onSubmit={handleTimeUpdate} className="flex gap-4">
          <input 
            type="text" 
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="לדוגמא: 12:00"
            className="flex-1 bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
          <button type="submit" className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform">
            שמור
          </button>
        </form>
      </div>

      <div className="apple-glass p-8 rounded-[40px] space-y-8">
        <h3 className="text-lg font-bold text-gray-900">הזנת נתונים חדשים</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            list="employees-list"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="שם העובד"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-right"
            required
          />
          <datalist id="employees-list">
            {employees.map(emp => <option key={emp.id} value={emp.fullName} />)}
          </datalist>

          <div className="grid grid-cols-3 gap-3">
            <TaskToggle label="משמרת" active={selectedTasks.shift} onClick={() => toggleTask('shift')} color="blue" />
            <TaskToggle label="אלכוהול" active={selectedTasks.alcohol} onClick={() => toggleTask('alcohol')} color="indigo" />
            <TaskToggle label="ממוצע" active={selectedTasks.average} onClick={() => toggleTask('average')} color="pink" />
          </div>

          <button type="submit" disabled={!fullName || !Object.values(selectedTasks).some(v => v)} className="w-full bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-500/20 disabled:opacity-30">עדכן דירוג</button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-4">היסטוריית פעולות</h3>
        <div className="space-y-2">
          {entries.slice(0, 10).map(entry => {
            const emp = employees.find(e => e.id === entry.employeeId);
            return (
              <div key={entry.id} className="apple-card p-4 flex justify-between items-center group">
                <div className="text-right">
                  <span className="block font-bold text-gray-900">{emp?.fullName}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{entry.reason}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-black text-blue-500">+{entry.points}</span>
                  <button onClick={() => confirm('מחק?') && onDeleteEntry(entry.id)} className="text-gray-200 hover:text-red-500 p-2"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1z"/></svg></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Section */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-gray-200 z-50 animate-in slide-in-from-bottom-10">
         <button 
          onClick={downloadDataFile}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
             <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
             <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
           </svg>
           הורד קובץ נתונים (להעלאה ל-GitHub)
         </button>
      </div>
    </div>
  );
};

const TaskToggle: React.FC<{ label: string; active: boolean; onClick: () => void; color: string }> = ({ label, active, onClick, color }) => {
  const colorMap: any = {
    blue: active ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500',
    indigo: active ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-500',
    pink: active ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-500'
  };
  return (
    <button type="button" onClick={onClick} className={`flex flex-col items-center justify-center p-4 rounded-[20px] transition-all duration-300 border ${active ? 'border-transparent shadow-lg' : 'border-transparent'} ${colorMap[color]}`}>
      <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
    </button>
  );
};

export default AdminPanel;
