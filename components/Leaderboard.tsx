
import React from 'react';
import { Employee } from '../types';

interface LeaderboardProps {
  employees: Employee[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ employees }) => {
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

export default Leaderboard;
