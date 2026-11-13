import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const LogoMark: React.FC<LogoProps> = ({ className = '', size = 32 }) => {
  return (
    <div 
      className={`flex items-center justify-center overflow-hidden rounded-xl border border-white/5 shadow-sm bg-[#0F1410] ${className}`}
      style={{ 
        width: size, 
        height: size,
      }}
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1"
      >
        <defs>
          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A7C59" />
            <stop offset="100%" stopColor="#0F1410" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>
        <path 
          d="M50 10 L85 22 V50 C85 70 50 90 50 90 C50 90 15 70 15 50 V22 Z" 
          fill="url(#shieldGrad)" 
          stroke="url(#goldGrad)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M35 48 V38 C35 30 41.7 24 50 24 C58.3 24 65 30 65 38 V48" 
          stroke="url(#goldGrad)" 
          strokeWidth="5" 
          strokeLinecap="round" 
        />
        <rect 
          x="30" 
          y="44" 
          width="40" 
          height="30" 
          rx="8" 
          fill="#161C17" 
          stroke="url(#goldGrad)" 
          strokeWidth="3.5" 
        />
        <circle cx="50" cy="55" r="5" fill="url(#goldGrad)" />
        <path d="M47 55 L53 55 L52 68 L48 68 Z" fill="url(#goldGrad)" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps & { showText?: boolean; showTagline?: boolean }> = ({ 
  className = '', 
  size = 40, 
  showText = true,
  showTagline = false
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <div className="flex flex-col leading-[0.9]">
          <span className="text-xl font-display font-bold text-primary tracking-tight">
            Transfer Legacy
          </span>
          {showTagline && (
            <span className="text-[10px] text-muted font-bold uppercase tracking-[0.15em] mt-1.5 max-w-[280px] leading-normal">
              Transfer the access. Protect the legacy.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

