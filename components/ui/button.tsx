import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]';

  const variants = {
    primary: 'bg-forest-800 hover:bg-forest-900 text-white shadow-sm focus:ring-forest-700',
    secondary: 'bg-forest-100 hover:bg-forest-500 hover:text-white text-forest-900 focus:ring-forest-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm animate-pulse',
    outline: 'border-2 border-forest-800 text-forest-900 hover:bg-forest-50 focus:ring-forest-700',
    ghost: 'text-slate-700 hover:bg-slate-200/60 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold min-h-[36px]',
    md: 'px-4 py-2.5 text-sm font-semibold min-h-[44px]',
    lg: 'px-6 py-3.5 text-base font-bold min-h-[52px]',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
};
