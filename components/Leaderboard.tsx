
import React from 'react';
import { Employee } from '../types';

interface LeaderboardProps {
  employees: Employee[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ employees }) => {
  const sortedEmployees = [...employees].sort((a, b) => b.totalPoints - a.totalPoints);

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 opacity-30">
        <div className="w-20 h-20 border-2 border-teal-500/30 rounded-full mb-6 flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-teal-500/50 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xl tracking-widest">אין נתונים</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center mb-10">
        <h2 className="text-xs uppercase tracking-widest-luxury text-teal-400 font-bold mb-2">Sushi Room Team</h2>
        <h3 className="text-4xl font-extralight tracking-tight">דירוג תחרות</h3>
      </div>

      <div className="space-y-4">
        {sortedEmployees.map((employee, index) => {
          const isTopTwo = index < 2;
          return (
            <div 
              key={employee.id}
              className={`relative flex items-center justify-between p-4 px-8 silk-card transition-all duration-700 hover:scale-[1.01] ${
                isTopTwo 
                ? 'silk-pill-active scale-[1.03] shadow-[0_0_40px_rgba(20,184,166,0.15)]' 
                : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-8">
                <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-sm ${
                  index === 0 ? 'bg-teal-400 text-[#0B3037] shadow-[0_0_20px_rgba(45,212,191,0.6)]' :
                  index === 1 ? 'bg-teal-700 text-teal-100 shadow-[0_0_15px_rgba(19,78,94,0.4)]' :
                  'bg-white/5 text-teal-500/50 border border-white/5'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className={`text-lg font-medium tracking-wide ${isTopTwo ? 'text-white' : 'text-teal-100/80'}`}>
                    {employee.fullName}
                  </h3>
                  {isTopTwo && (
                    <span className="text-[10px] uppercase tracking-widest text-teal-300 font-bold opacity-80">
                      {index === 0 ? 'Supreme Leader' : 'Rising Star'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-3xl font-light tracking-tighter ${isTopTwo ? 'text-teal-400 text-glow' : 'text-white/70'}`}>
                  {employee.totalPoints}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-teal-500/40">ניקוד כולל</span>
              </div>
              
              {isTopTwo && (
                <div className="absolute top-1/2 -right-1 -translate-y-1/2">
                   <div className="h-12 w-[3px] bg-teal-400 rounded-full blur-[1px]"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
