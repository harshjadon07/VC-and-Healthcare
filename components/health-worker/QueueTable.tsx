'use client';

import React, { useState } from 'react';
import { Search, Filter, Stethoscope, AlertTriangle, Eye, Activity, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { MOCK_PATIENTS, MockPatient } from '@/lib/mock-data';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

interface QueueTableProps {
  currentLang: Language;
}

export const QueueTable: React.FC<QueueTableProps> = ({ currentLang }) => {
  const dict = dictionaries[currentLang] || dictionaries.en;
  const [patients, setPatients] = useState<MockPatient[]>(MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(null);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = filterLevel === 'ALL' || patient.triageLevel === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const handleUpdateStatus = (patientId: string, newStatus: MockPatient['status']) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, status: newStatus } : p))
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header controls: Search & Triage Filter */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-sand-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{dict.patientQueueTitle}</h3>
          <p className="text-xs text-slate-600 font-medium">
            Manage ASHA community triage queue and route urgent patients to tele-doctors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search patient, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-bold">
            {['ALL', 'EMERGENCY', 'URGENT', 'ROUTINE'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterLevel === lvl
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
              <th className="py-3.5 px-4">{dict.patientName}</th>
              <th className="py-3.5 px-4">{dict.ageGender}</th>
              <th className="py-3.5 px-4">{dict.village}</th>
              <th className="py-3.5 px-4">{dict.chiefComplaint}</th>
              <th className="py-3.5 px-4">{dict.triageStatus}</th>
              <th className="py-3.5 px-4 font-center">{dict.vitals}</th>
              <th className="py-3.5 px-4 text-right">{dict.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm font-medium">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-semibold">
                  No matching patient records found in queue.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    patient.emergencyAlertTriggered ? 'bg-red-50/40' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      {patient.emergencyAlertTriggered && (
                        <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block leading-snug">
                          {patient.name}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">{patient.id} • {patient.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                    {patient.age} yrs / {patient.gender}
                  </td>

                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                    {patient.village} ({patient.district})
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-700 max-w-xs truncate">
                    {patient.chiefComplaint}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={patient.triageLevel}>
                      {patient.triageLevel}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-xs">
                    <div className="bg-slate-100 p-1.5 rounded text-[11px] font-mono leading-tight space-y-0.5 text-slate-800">
                      <div>BP: {patient.vitals.bp}</div>
                      <div>SpO2: {patient.vitals.spo2} | Temp: {patient.vitals.temp}</div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                        className="text-xs"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        Details
                      </Button>

                      {patient.status !== 'COMPLETED' ? (
                        <Button
                          variant={patient.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
                          size="sm"
                          onClick={() => handleUpdateStatus(patient.id, 'COMPLETED')}
                        >
                          <Stethoscope className="w-3.5 h-3.5 mr-1" />
                          Consult
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Done</span>
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Patient Detail Modal */}
      <Modal
        isOpen={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={selectedPatient ? `Clinical Detail: ${selectedPatient.name}` : ''}
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="flex justify-between items-start bg-sand-100 p-3 rounded-lg border border-sand-200">
              <div>
                <p className="text-xs font-bold text-slate-500">ID & Location</p>
                <p className="text-sm font-bold text-slate-900">{selectedPatient.id} • {selectedPatient.village}, {selectedPatient.district}</p>
                <p className="text-xs text-slate-600">Contact: {selectedPatient.phone}</p>
              </div>
              <Badge variant={selectedPatient.triageLevel}>{selectedPatient.triageLevel}</Badge>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase mb-1">Vitals</h5>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded border">
                <div>BP: <span className="font-bold text-slate-900">{selectedPatient.vitals.bp}</span></div>
                <div>Temp: <span className="font-bold text-slate-900">{selectedPatient.vitals.temp}</span></div>
                <div>Pulse: <span className="font-bold text-slate-900">{selectedPatient.vitals.heartRate}</span></div>
                <div>SpO2: <span className="font-bold text-slate-900">{selectedPatient.vitals.spo2}</span></div>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-forest-800 uppercase mb-1">AI Clinical Triage Summary</h5>
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-lg text-xs font-medium leading-relaxed">
                {selectedPatient.aiSummary}
              </div>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-700 uppercase mb-1">Recommended Actions</h5>
              <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                {selectedPatient.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button
                variant={selectedPatient.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
                size="sm"
                onClick={() => {
                  handleUpdateStatus(selectedPatient.id, 'IN_PROGRESS');
                  setSelectedPatient(null);
                }}
              >
                Forward to Doctor Tele-Queue
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
