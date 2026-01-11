
import React, { useState, useEffect } from 'react';
import { Employee, ScoreEntry, DEADLINE } from '../types';

interface StatsSummaryProps {
  entries: ScoreEntry[];
  employees: Employee[];
}

const StatsSummary: React.FC<StatsSummaryProps> = ({ entries, employees }) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = DEADLINE.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalPoints = employees.reduce((acc, curr) => acc + curr.totalPoints, 0);

  return (
    <div className="mb-16 space-y-12">
      {/* Countdown - Minimal Luxury */}
      <div className="flex flex-col items-center">
        <h2 className="text-[10px] uppercase tracking-widest-luxury text-teal-400 font-bold mb-6 italic">דירוג תחרות — סיום ב-05.02.26</h2>
        
        {/* Added dir="ltr" to ensure chronological order from left to right */}
        <div className="flex gap-8 sm:gap-12 items-center justify-center" dir="ltr">
          {timeLeft ? (
            <>
              <TimeUnit value={timeLeft.days} label="ימים" />
              <div className="w-1 h-1 bg-teal-500/30 rounded-full hidden sm:block"></div>
              <TimeUnit value={timeLeft.hours} label="שעות" />
              <div className="w-1 h-1 bg-teal-500/30 rounded-full hidden sm:block"></div>
              <TimeUnit value={timeLeft.minutes} label="דקות" />
              <div className="w-1 h-1 bg-teal-500/30 rounded-full hidden sm:block"></div>
              <TimeUnit value={timeLeft.seconds} label="שניות" />
            </>
          ) : (
            <span className="text-teal-400 font-extralight text-5xl tracking-tighter text-glow uppercase">התחרות הסתיימה</span>
          )}
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
        <div className="silk-card p-4 text-center border-none bg-white/5">
           <span className="block text-[8px] uppercase tracking-widest text-teal-500/50 mb-1">סה"כ נקודות</span>
           <span className="text-xl font-light text-white">{totalPoints} <span className="text-[10px] opacity-30">PTS</span></span>
        </div>
        <div className="silk-card p-4 text-center border-none bg-white/5">
           <span className="block text-[8px] uppercase tracking-widest text-teal-500/50 mb-1">הישגים</span>
           <span className="text-xl font-light text-white">{entries.length}</span>
        </div>
      </div>
    </div>
  );
};

const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center group">
    <span className="text-4xl sm:text-5xl font-extralight tracking-tighter text-white/90 group-hover:text-teal-400 transition-colors duration-700">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-[8px] mt-2 font-bold uppercase tracking-widest text-teal-500/40">{label}</span>
  </div>
);

export default StatsSummary;
