
import React from 'react';
import { Employee } from '../types';

interface LeaderboardProps {
  employees: Employee[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ employees }) => {
  const sortedEmployees = [...employees].sort((a, b) => b.totalPoints - a.totalPoints);
  
  // Group employees by points
  const groupedEmployees: { points: number; members: Employee[] }[] = [];
  if (sortedEmployees.length > 0) {
      let currentGroup = { points: sortedEmployees[0].totalPoints, members: [sortedEmployees[0]] };
      for (let i = 1; i < sortedEmployees.length; i++) {
          if (sortedEmployees[i].totalPoints === currentGroup.points) {
              currentGroup.members.push(sortedEmployees[i]);
          } else {
              groupedEmployees.push(currentGroup);
              currentGroup = { points: sortedEmployees[i].totalPoints, members: [sortedEmployees[i]] };
          }
      }
      groupedEmployees.push(currentGroup);
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 opacity-30">
        <p className="text-lg tracking-[0.2em] font-light text-gray-500">אין נתונים זמינים</p>
      </div>
    );
  }

  let currentRank = 1;

  return (
    <div className="space-y-2.5 pb-20 animate-in slide-in-from-bottom-8 duration-700">
      {groupedEmployees.map((group, groupIndex) => {
        const rank = currentRank;
        // Standard competition ranking logic: rank jumps by number of people tied.
        // If 2 people are #1, the next person is #3.
        currentRank += group.members.length;

        const isGold = rank === 1;
        const isSilver = rank === 2;
        const isTie = group.members.length > 1;
        
        return (
          <div 
            key={groupIndex}
            className={`group relative flex items-center justify-between p-3 sm:p-4 apple-card transition-all duration-500 hover:scale-[1.01] ${
              isGold ? 'top-one-glow' : isSilver ? 'top-two-glow' : 'hover:bg-white'
            }`}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center rounded-[14px] font-black text-base transition-all duration-500 ${
                isGold ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-105' :
                isSilver ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40' :
                'bg-gray-100 text-gray-500'
              }`}>
                {rank}
              </div>
              <div className="flex flex-col w-full">
                  {isTie ? (
                      <div className="flex flex-wrap items-center gap-2">
                          {group.members.map((member, idx) => (
                              <React.Fragment key={member.id}>
                                  <span className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1E] leading-none whitespace-nowrap">
                                      {member.fullName}
                                  </span>
                                  {idx < group.members.length - 1 && (
                                      <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black tracking-widest mx-1">VS</span>
                                  )}
                              </React.Fragment>
                          ))}
                      </div>
                  ) : (
                    <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#1C1C1E] leading-none">
                      {group.members[0].fullName}
                    </h3>
                  )}

                {(isGold || isSilver) && (
                  <span className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1 block ${isGold ? 'text-blue-600' : 'text-indigo-600'}`}>
                    {isGold ? 'SUPREME CHAMPION' : 'ELITE STAR'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end pl-2">
              <span className={`text-2xl sm:text-3xl font-black tracking-tighter leading-none ${isGold ? 'text-blue-600' : isSilver ? 'text-indigo-600' : 'text-[#1C1C1E]'}`}>
                {group.points}
              </span>
              <span className="text-[8px] uppercase tracking-widest text-gray-400 font-extrabold mt-0.5">Points</span>
            </div>

            {isGold && <div className="absolute -left-2 -top-2 text-3xl animate-bounce">🥇</div>}
            {isSilver && <div className="absolute -left-2 -top-2 text-2xl opacity-90">🥈</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;
