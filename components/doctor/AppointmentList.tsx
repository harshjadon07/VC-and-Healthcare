'use client';

import React from 'react';
import { Calendar, Clock, AlertTriangle, ChevronRight, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { MockPatient } from '@/lib/mock-data';

interface AppointmentListProps {
  patients: MockPatient[];
  selectedPatientId: string;
  onSelectPatient: (patient: MockPatient) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  patients,
  selectedPatientId,
  onSelectPatient,
}) => {
  // Sort patients so Emergency & Urgent are at the top
  const sortedPatients = [...patients].sort((a, b) => {
    const priority = { EMERGENCY: 1, URGENT: 2, ROUTINE: 3 };
    return priority[a.triageLevel] - priority[b.triageLevel];
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-sand-50/60 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-forest-800 text-xs font-bold uppercase tracking-wider mb-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Tele-Clinic Schedule</span>
          </div>
          <h3 className="text-base font-bold text-slate-900">Today&apos;s Consultations</h3>
        </div>
        <span className="text-xs font-extrabold px-2.5 py-1 bg-forest-100 text-forest-900 rounded-full">
          {patients.length} Total
        </span>
      </div>

      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[620px]">
        {sortedPatients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`p-4 cursor-pointer transition-all border-l-4 ${
                isSelected
                  ? 'bg-forest-50/80 border-l-forest-800 shadow-2xs'
                  : patient.triageLevel === 'EMERGENCY'
                  ? 'bg-red-50/30 hover:bg-red-50/60 border-l-red-500'
                  : 'hover:bg-slate-50 border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {patient.triageLevel === 'EMERGENCY' && (
                    <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{patient.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{patient.village} • {patient.age} yrs ({patient.gender})</p>
                  </div>
                </div>
                <Badge variant={patient.triageLevel}>{patient.triageLevel}</Badge>
              </div>

              <p className="text-xs text-slate-700 mt-2 line-clamp-1 font-medium italic">
                &quot;{patient.chiefComplaint}&quot;
              </p>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100/60 text-xs">
                <span className="text-slate-500 font-mono flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.dateTime}</span>
                </span>
                <span className={`font-bold flex items-center space-x-1 ${isSelected ? 'text-forest-800' : 'text-slate-400'}`}>
                  <span>Select</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
