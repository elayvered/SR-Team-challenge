
import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "w-48" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="logo.png" 
        alt="SUSHI ROOM Logo" 
        className="max-w-full h-auto object-contain brightness-0"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            // Reduced tracking from 0.4em to 0.2em
            fallback.className = "text-[#1C1C1E] font-black tracking-[0.2em] text-2xl sm:text-3xl uppercase whitespace-nowrap";
            fallback.innerText = "SUSHI ROOM";
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
};

export default Logo;
