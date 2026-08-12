import React from 'react';
import { Users, Clock, AlertTriangle, Stethoscope } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

interface StatsBarProps {
  currentLang: Language;
}

export const StatsBar: React.FC<StatsBarProps> = ({ currentLang }) => {
  const dict = dictionaries[currentLang] || dictionaries.en;

  const stats = [
    {
      label: dict.statsTodayPatients,
      value: "24",
      subtext: "14 Male, 10 Female",
      icon: Users,
      color: "bg-emerald-50 text-forest-800 border-emerald-200",
    },
    {
      label: dict.statsWaiting,
      value: "6",
      subtext: "Avg wait time: 12 mins",
      icon: Clock,
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      label: dict.statsEmergencyAlerts,
      value: "2",
      subtext: "1 High priority chest pain",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-700 border-red-200 animate-pulse",
    },
    {
      label: dict.statsDoctorConsults,
      value: "12",
      subtext: "Dr. Kulkarni & Dr. Sharma",
      icon: Stethoscope,
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className={`border ${stat.color} p-4 transition-all hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  {stat.label}
                </span>
                <span className="text-3xl font-black text-slate-900 mt-1 block">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-slate-600 mt-1 block">
                  {stat.subtext}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/80 border border-slate-200/60 flex items-center justify-center shadow-2xs">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
