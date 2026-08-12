import React from 'react';
import { Users, Clock, AlertTriangle, Stethoscope } from 'lucide-react';
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
      color: "bg-emerald-50 text-forest-950 border-emerald-400",
    },
    {
      label: dict.statsWaiting,
      value: "6",
      subtext: "Avg wait time: 12 mins",
      icon: Clock,
      color: "bg-amber-50 text-amber-950 border-amber-400",
    },
    {
      label: dict.statsEmergencyAlerts,
      value: "2",
      subtext: "1 Chest pain red alert",
      icon: AlertTriangle,
      color: "bg-red-50 text-red-950 border-red-500 animate-pulse",
    },
    {
      label: dict.statsDoctorConsults,
      value: "12",
      subtext: "Dr. Kulkarni & Dr. Sharma",
      icon: Stethoscope,
      color: "bg-blue-50 text-blue-950 border-blue-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div key={idx} className={`border-4 rounded-3xl ${stat.color} p-5 shadow-md flex items-center justify-between`}>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                {stat.label}
              </span>
              <span className="text-4xl sm:text-5xl font-black text-slate-950 mt-1 block">
                {stat.value}
              </span>
              <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                {stat.subtext}
              </span>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-300 flex items-center justify-center shadow-sm shrink-0">
              <Icon className="w-9 h-9 text-slate-900" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
