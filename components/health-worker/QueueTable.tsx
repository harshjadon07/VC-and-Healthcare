'use client';

import React, { useState } from 'react';
import { Search, Stethoscope, AlertTriangle, Eye, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-white rounded-3xl border-4 border-sand-300 shadow-md overflow-hidden space-y-4">
      {/* Header controls */}
      <div className="p-6 border-b-4 border-sand-200 bg-sand-50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">{dict.patientQueueTitle}</h2>
          <p className="text-base sm:text-lg text-slate-800 font-extrabold mt-1">
            Manage ASHA community triage queue and route urgent patients to tele-doctors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Search box */}
          <div className="relative flex-1 lg:flex-none">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Search patient, village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-base font-black bg-white border-2 border-slate-400 rounded-2xl w-full sm:w-64 focus:outline-none focus:ring-4 focus:ring-forest-800"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-sand-200 p-1.5 rounded-2xl text-sm font-black">
            {['ALL', 'EMERGENCY', 'URGENT', 'ROUTINE'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterLevel(lvl)}
                className={`px-3 py-2 rounded-xl transition-all ${
                  filterLevel === lvl
                    ? 'bg-forest-800 text-white shadow-sm font-black'
                    : 'text-slate-800 hover:text-slate-950 font-bold'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sand-100 border-b-2 border-slate-300 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              <th className="py-4 px-4">{dict.patientName}</th>
              <th className="py-4 px-4">{dict.ageGender}</th>
              <th className="py-4 px-4">{dict.village}</th>
              <th className="py-4 px-4">{dict.chiefComplaint}</th>
              <th className="py-4 px-4">{dict.triageStatus}</th>
              <th className="py-4 px-4">{dict.vitals}</th>
              <th className="py-4 px-4 text-right">{dict.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-slate-200 text-base font-extrabold text-slate-900">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-slate-600 font-black text-lg">
                  No matching patient records found in queue.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className={`hover:bg-sand-100/80 transition-colors ${
                    patient.emergencyAlertTriggered ? 'bg-red-50' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-3">
                      {patient.emergencyAlertTriggered && (
                        <AlertTriangle className="w-6 h-6 text-red-600 animate-bounce shrink-0" />
                      )}
                      <div>
                        <span className="font-black text-slate-950 text-lg block leading-snug">
                          {patient.name}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-600">{patient.id} • {patient.phone}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-sm sm:text-base font-black text-slate-800">
                    {patient.age} yrs / {patient.gender}
                  </td>

                  <td className="py-4 px-4 text-sm sm:text-base font-black text-slate-900">
                    {patient.village} ({patient.district})
                  </td>

                  <td className="py-4 px-4 text-sm sm:text-base text-slate-800 max-w-xs truncate font-extrabold">
                    {patient.chiefComplaint}
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={patient.triageLevel} className="text-xs px-3 py-1 font-black">
                      {patient.triageLevel}
                    </Badge>
                  </td>

                  <td className="py-4 px-4 text-xs font-black">
                    <div className="bg-sand-100 p-2.5 rounded-xl border border-sand-300 text-xs font-mono leading-tight space-y-1 text-slate-950">
                      <div>BP: {patient.vitals.bp}</div>
                      <div>SpO2: {patient.vitals.spo2} | Temp: {patient.vitals.temp}</div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                        className="text-sm font-black border-2"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>

                      {patient.status !== 'COMPLETED' ? (
                        <Button
                          variant={patient.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
                          size="sm"
                          onClick={() => handleUpdateStatus(patient.id, 'COMPLETED')}
                          className="text-sm font-black"
                        >
                          <Stethoscope className="w-4 h-4 mr-1" />
                          Consult
                        </Button>
                      ) : (
                        <span className="text-sm font-black text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
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
          <div className="space-y-5">
            <div className="flex justify-between items-start bg-sand-100 p-4 rounded-2xl border-2 border-sand-300">
              <div>
                <p className="text-xs font-black text-slate-600 uppercase">ID & Location</p>
                <p className="text-lg font-black text-slate-950">{selectedPatient.id} • {selectedPatient.village}, {selectedPatient.district}</p>
                <p className="text-sm font-bold text-slate-700">Contact: {selectedPatient.phone}</p>
              </div>
              <Badge variant={selectedPatient.triageLevel} className="text-sm px-3 py-1 font-black">{selectedPatient.triageLevel}</Badge>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase mb-2">Vitals & Biometrics</h4>
              <div className="grid grid-cols-2 gap-3 text-sm font-mono bg-white p-4 rounded-2xl border-2 border-slate-300">
                <div>BP: <span className="font-black text-slate-950">{selectedPatient.vitals.bp}</span></div>
                <div>Temp: <span className="font-black text-slate-950">{selectedPatient.vitals.temp}</span></div>
                <div>Pulse: <span className="font-black text-slate-950">{selectedPatient.vitals.heartRate}</span></div>
                <div>SpO2: <span className="font-black text-slate-950">{selectedPatient.vitals.spo2}</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-forest-900 uppercase mb-2">AI Clinical Triage Summary</h4>
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl text-base font-bold leading-relaxed">
                {selectedPatient.aiSummary}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase mb-2">Recommended Actions</h4>
              <ul className="list-disc pl-5 text-sm text-slate-900 font-extrabold space-y-1">
                {selectedPatient.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t-2 border-slate-200 flex justify-end space-x-3">
              <Button variant="outline" size="md" onClick={() => setSelectedPatient(null)}>
                Close
              </Button>
              <Button
                variant={selectedPatient.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
                size="lg"
                onClick={() => {
                  handleUpdateStatus(selectedPatient.id, 'IN_PROGRESS');
                  setSelectedPatient(null);
                }}
                className="text-base font-black"
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
