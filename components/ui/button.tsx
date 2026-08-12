import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.97] select-none';

  const variants = {
    primary: 'bg-forest-800 hover:bg-forest-900 text-white shadow-md hover:shadow-lg focus:ring-forest-700',
    secondary: 'bg-forest-100 hover:bg-forest-200 text-forest-950 border-2 border-forest-300 focus:ring-forest-500 font-extrabold',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-md font-black',
    outline: 'border-3 border-forest-800 text-forest-900 hover:bg-forest-50 focus:ring-forest-700 font-extrabold',
    ghost: 'text-slate-800 hover:bg-slate-200/70 focus:ring-slate-400 font-bold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-bold min-h-[44px]',
    md: 'px-5 py-3 text-base font-extrabold min-h-[52px]',
    lg: 'px-6 py-4 text-lg font-black min-h-[58px]',
    xl: 'px-8 py-5 text-xl font-black min-h-[64px] rounded-2xl tracking-wide',
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
