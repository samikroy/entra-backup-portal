
import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

const Logo: React.FC<LogoProps> = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-10 h-10',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} bg-azure-500 text-white rounded-md flex items-center justify-center`}>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-3/4 h-3/4" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M7 8h10" />
          <path d="M7 12h10" />
          <path d="M7 16h10" />
        </svg>
      </div>
      <div className="font-semibold text-lg">Entra Vault Keeper</div>
    </div>
  );
};

export default Logo;
