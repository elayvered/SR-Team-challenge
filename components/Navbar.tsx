
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  // Fix: Change parameter type from void to View to allow passing View enum values
  setView: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="sticky top-0 z-50 px-6 py-6">
      <div className="container mx-auto flex justify-between items-center max-w-4xl silk-glass rounded-full px-8 py-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-lg text-[#0B3037] shadow-[0_0_20px_rgba(20,184,166,0.4)]">
            SR
          </div>
          <h1 className="text-lg font-light tracking-widest-luxury uppercase hidden sm:block">
            Sushi <span className="font-bold text-teal-400">Room</span>
          </h1>
        </div>

        <div className="flex bg-black/20 p-1 rounded-full border border-white/5">
          <button
            onClick={() => setView(View.LEADERBOARD)}
            className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
              currentView === View.LEADERBOARD 
              ? 'bg-teal-500 text-[#0B3037] shadow-lg shadow-teal-500/20' 
              : 'text-teal-200/50 hover:text-white'
            }`}
          >
            דירוג
          </button>
          <button
            onClick={() => setView(View.ADMIN)}
            className={`px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-500 ${
              currentView === View.ADMIN 
              ? 'bg-teal-500 text-[#0B3037] shadow-lg shadow-teal-500/20' 
              : 'text-teal-200/50 hover:text-white'
            }`}
          >
            ניהול
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
