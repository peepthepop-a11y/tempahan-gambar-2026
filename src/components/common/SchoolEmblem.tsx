import React from 'react';

interface SchoolEmblemProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const OFFICIAL_SCHOOL_LOGO = '/assets/aistudio/4d928634-ab67-4466-8b99-27ecf7bc2106_bfec981b.jpg';

export const SchoolEmblem: React.FC<SchoolEmblemProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-full bg-white p-0.5 shadow-xs border border-slate-200/80 overflow-hidden ${sizeMap[size]} ${className}`}
    >
      <img
        src={OFFICIAL_SCHOOL_LOGO}
        alt="Lencana Rasmi SK Taman Sri Pulai"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
