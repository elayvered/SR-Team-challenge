
import React, { useState } from 'react';
import { Employee, ScoreEntry, POINT_VALUES } from '../types';

interface AdminPanelProps {
  employees: Employee[];
  entries: ScoreEntry[];
  onAddScore: (name: string, points: number, reason: string) => void;
  onDeleteEntry: (id: string) => void;
}

const ADMIN_CODE = "77654";

const AdminPanel: React.FC<AdminPanelProps> = ({ employees, entries, onAddScore, onDeleteEntry }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const [fullName, setFullName] = useState('');
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
    } else {
      setError(true);
      setPasscode('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    if (selectedTasks.shift) onAddScore(fullName, POINT_VALUES.SHIFT, 'ביצוע משמרת');
    if (selectedTasks.alcohol) onAddScore(fullName, POINT_VALUES.ALCOHOL, 'אלכוהול');
    if (selectedTasks.average) onAddScore(fullName, POINT_VALUES.AVERAGE, 'ממוצע לסועד');

    setFullName('');
    setSelectedTasks({ shift: false, alcohol: false, average: false });
  };

  const toggleTask = (task: string) => {
    setSelectedTasks(prev => ({ ...prev, [task]: !prev[task] }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
        <div className="silk-glass p-10 rounded-[3rem] w-full max-w-md text-center space-y-8">
          <div>
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-teal-400" viewBox="0 0 16 16">
                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              </svg>
            </div>
            <h3 className="text-2xl font-light tracking-tight">כניסת מנהל</h3>
            <p className="text-xs uppercase tracking-widest text-teal-500/50 mt-2">Authentication Required</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              placeholder="הכנס קוד מנהל"
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-full px-6 py-4 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-teal-500/50 transition-all`}
              autoFocus
            />
            {error && <p className="text-red-400 text-xs font-bold uppercase tracking-widest">קוד שגוי, נסה שוב</p>}
            <button 
              type="submit"
              className="w-full bg-teal-500 text-[#0B3037] font-bold py-4 rounded-full uppercase tracking-widest text-xs hover:bg-teal-400 transition-all active:scale-95"
            >
              התחבר למערכת
            </button>
          </form>
        </div>
      </div>
    );
  }

  const recentEntries = entries.slice(0, 8);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in-95 duration-500">
      <div className="space-y-8">
        <div className="text-right">
          <h2 className="text-xs uppercase tracking-widest-luxury text-teal-400 font-bold mb-2">Operations</h2>
          <h3 className="text-2xl font-light">הזנת נתונים</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <input
              type="text"
              list="employees-list"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="שם העובד"
              className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 focus:outline-none focus:border-teal-500/50 focus:bg-white/10 transition-all text-center text-lg placeholder:text-teal-100/20"
              required
            />
            <datalist id="employees-list">
              {employees.map(emp => <option key={emp.id} value={emp.fullName} />)}
            </datalist>
          </div>

          <div className="space-y-3">
            <TaskToggle 
              label="משמרת" 
              points={POINT_VALUES.SHIFT}
              active={selectedTasks.shift} 
              onClick={() => toggleTask('shift')} 
            />
            <TaskToggle 
              label="אלכוהול" 
              points={POINT_VALUES.ALCOHOL}
              active={selectedTasks.alcohol} 
              onClick={() => toggleTask('alcohol')} 
            />
            <TaskToggle 
              label="ממוצע לסועד" 
              points={POINT_VALUES.AVERAGE}
              active={selectedTasks.average} 
              onClick={() => toggleTask('average')} 
            />
          </div>

          <button 
            type="submit"
            disabled={!fullName || !Object.values(selectedTasks).some(v => v)}
            className="w-full bg-teal-500 hover:bg-teal-400 disabled:opacity-20 text-[#0B3037] font-bold py-5 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.2)] transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            Update Stats
          </button>
        </form>
      </div>

      <div className="space-y-8">
        <div className="text-right">
          <h2 className="text-xs uppercase tracking-widest-luxury text-teal-400 font-bold mb-2">Activity</h2>
          <h3 className="text-2xl font-light">פעולות אחרונות</h3>
        </div>
        
        <div className="space-y-3">
          {recentEntries.length === 0 ? (
            <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-[2rem] opacity-20">
               <p className="text-sm tracking-widest uppercase">No Recent Activity</p>
            </div>
          ) : (
            recentEntries.map(entry => {
              const emp = employees.find(e => e.id === entry.employeeId);
              return (
                <div key={entry.id} className="flex justify-between items-center p-4 px-6 rounded-full bg-white/5 border border-white/5 hover:border-teal-500/20 transition-all group">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-teal-100">{emp?.fullName || '---'}</span>
                    <span className="text-[10px] text-teal-500/50 uppercase tracking-tighter">{entry.reason}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-teal-400 font-black text-lg">+{entry.points}</span>
                    <button 
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-white/10 hover:text-red-400 transition-colors p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const TaskToggle: React.FC<{ label: string; points: number; active: boolean; onClick: () => void }> = ({ label, points, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between p-4 px-8 rounded-full border transition-all duration-300 ${
      active 
      ? 'bg-teal-500/20 border-teal-500 text-teal-100' 
      : 'bg-white/5 border-white/5 text-teal-100/30 hover:bg-white/10'
    }`}
  >
    <span className="text-sm font-medium tracking-wide uppercase">{label}</span>
    <span className={`text-xs font-bold ${active ? 'text-teal-400' : 'text-white/10'}`}>{points} PTS</span>
  </button>
);

export default AdminPanel;
