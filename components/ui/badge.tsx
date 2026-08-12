import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'info' | 'success' | 'warning';
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'ROUTINE',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-2xs';

  const variants = {
    EMERGENCY: 'bg-red-100 text-red-800 border border-red-300 animate-pulse',
    URGENT: 'bg-amber-100 text-amber-900 border border-amber-300',
    ROUTINE: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    info: 'bg-blue-100 text-blue-900 border border-blue-300',
    success: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    warning: 'bg-orange-100 text-orange-900 border border-orange-300',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], className))} {...props}>
      {children}
    </span>
  );
};
