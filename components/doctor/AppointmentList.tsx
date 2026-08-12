'use client';

import React from 'react';
import { Calendar, Clock, AlertTriangle, ChevronRight } from 'lucide-react';
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
  const sortedPatients = [...patients].sort((a, b) => {
    const priority = { EMERGENCY: 1, URGENT: 2, ROUTINE: 3 };
    return priority[a.triageLevel] - priority[b.triageLevel];
  });

  return (
    <div className="bg-white rounded-3xl border-4 border-sand-300 shadow-md overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b-4 border-sand-200 bg-sand-50 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-forest-800 text-xs font-black uppercase tracking-wider mb-0.5">
            <Calendar className="w-4 h-4" />
            <span>Tele-Clinic Schedule</span>
          </div>
          <h3 className="text-xl font-black text-slate-950">Today&apos;s Consultations</h3>
        </div>
        <span className="text-sm font-black px-3 py-1 bg-forest-100 text-forest-950 rounded-full border border-forest-300">
          {patients.length} Total
        </span>
      </div>

      <div className="divide-y-2 divide-slate-200 overflow-y-auto max-h-[620px]">
        {sortedPatients.map((patient) => {
          const isSelected = patient.id === selectedPatientId;
          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`p-5 cursor-pointer transition-all border-l-8 ${
                isSelected
                  ? 'bg-forest-100/90 border-l-forest-800 shadow-sm'
                  : patient.triageLevel === 'EMERGENCY'
                  ? 'bg-red-50 hover:bg-red-100/80 border-l-red-600'
                  : 'hover:bg-sand-50 border-l-transparent'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {patient.triageLevel === 'EMERGENCY' && (
                    <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce shrink-0" />
                  )}
                  <div>
                    <h4 className="text-lg font-black text-slate-950">{patient.name}</h4>
                    <p className="text-sm font-extrabold text-slate-700">{patient.village} • {patient.age} yrs ({patient.gender})</p>
                  </div>
                </div>
                <Badge variant={patient.triageLevel} className="text-xs px-2.5 py-0.5 font-black">{patient.triageLevel}</Badge>
              </div>

              <p className="text-sm text-slate-800 mt-2 line-clamp-1 font-extrabold italic">
                &quot;{patient.chiefComplaint}&quot;
              </p>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 text-xs font-black">
                <span className="text-slate-600 font-mono flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>{patient.dateTime}</span>
                </span>
                <span className={`flex items-center space-x-1 text-sm ${isSelected ? 'text-forest-900 font-black' : 'text-slate-500'}`}>
                  <span>Select</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
