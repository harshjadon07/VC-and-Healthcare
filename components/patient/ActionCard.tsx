import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-forest-700 rounded-xl"
      tabIndex={0}
      role="button"
    >
      <Card variant={variant} className="h-full flex flex-col justify-between group-hover:translate-y-[-2px] transition-transform">
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              variant === 'emergency'
                ? 'bg-red-100 text-red-600'
                : variant === 'highlight'
                ? 'bg-emerald-100 text-forest-800'
                : 'bg-sand-100 text-forest-800 group-hover:bg-forest-800 group-hover:text-white'
            } transition-colors`}>
              <Icon className="w-6 h-6" />
            </div>
            {badgeText && (
              <span className="text-[11px] font-extrabold px-2.5 py-1 bg-forest-100 text-forest-900 rounded-full">
                {badgeText}
              </span>
            )}
          </div>
          <CardTitle className="group-hover:text-forest-800 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="mt-2 text-slate-600">
            {description}
          </CardDescription>
        </CardHeader>
        <div className="pt-2 text-xs font-bold text-forest-800 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
          <span>Access feature →</span>
        </div>
      </Card>
    </div>
  );
};
