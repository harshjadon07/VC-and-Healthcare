import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: 'default' | 'highlight' | 'emergency';
  onClick: () => void;
  badgeText?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  icon: Icon,
  variant = 'default',
  onClick,
  badgeText,
}) => {
  const getStyles = () => {
    if (variant === 'emergency') {
      return 'bg-red-50 border-4 border-red-500 text-red-950 hover:bg-red-100 hover:border-red-600 shadow-md';
    }
    if (variant === 'highlight') {
      return 'bg-emerald-50 border-4 border-forest-600 text-slate-900 hover:bg-emerald-100 shadow-md';
    }
    return 'bg-white border-4 border-sand-300 text-slate-900 hover:border-forest-700 hover:bg-forest-50/50 shadow-sm hover:shadow-md';
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 cursor-pointer group transition-all transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-forest-800 ${getStyles()}`}
      tabIndex={0}
      role="button"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${
            variant === 'emergency'
              ? 'bg-red-600 text-white'
              : variant === 'highlight'
              ? 'bg-forest-800 text-white'
              : 'bg-forest-100 text-forest-900 group-hover:bg-forest-800 group-hover:text-white'
          } transition-colors`}
        >
          <Icon className="w-9 h-9" />
        </div>
        {badgeText && (
          <span className={`text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${
            variant === 'emergency'
              ? 'bg-red-200 text-red-950 border border-red-400'
              : 'bg-forest-200 text-forest-950 border border-forest-400'
          }`}>
            {badgeText}
          </span>
        )}
      </div>

      <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 group-hover:text-forest-900 leading-tight">
        {title}
      </h3>

      <p className="mt-2 text-base sm:text-lg text-slate-800 font-extrabold leading-relaxed">
        {description}
      </p>

      <div className="mt-5 pt-3 border-t-2 border-slate-200 flex items-center justify-between text-base font-black text-forest-900 group-hover:text-forest-950">
        <span>Tap to Open</span>
        <div className="w-9 h-9 rounded-full bg-forest-800 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
