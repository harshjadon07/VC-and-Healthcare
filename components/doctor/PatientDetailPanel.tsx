'use client';

import React, { useState } from 'react';
import { Activity, FileText, CheckCircle, Video, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { MockPatient } from '@/lib/mock-data';

interface PatientDetailPanelProps {
  patient: MockPatient;
  onRefresh?: () => void;
}

export const PatientDetailPanel: React.FC<PatientDetailPanelProps> = ({ patient, onRefresh }) => {
  const [isConsulting, setIsConsulting] = useState(false);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [isPrescriptionIssued, setIsPrescriptionIssued] = useState(false);

  const handleStartConsult = () => {
    setIsConsulting(true);
  };

  const handleIssuePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prescriptionText.trim()) return;

    try {
      await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: patient.id, prescription: prescriptionText }),
      });
      setIsPrescriptionIssued(true);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Prescription dispatch error:", err);
      setIsPrescriptionIssued(true);
    }
  };

  return (
    <div className="bg-white rounded-3xl border-4 border-sand-300 shadow-md p-6 sm:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-4 border-sand-200 pb-5">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-black text-slate-950">{patient.name}</h2>
            <Badge variant={patient.triageLevel} className="text-sm px-3 py-1 font-black">{patient.triageLevel}</Badge>
          </div>
          <p className="text-base font-extrabold text-slate-700 mt-1">
            Patient ID: <span className="font-mono font-black">{patient.id}</span> • {patient.age} Yrs / {patient.gender} • {patient.village}, {patient.district}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Button
            variant={patient.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
            size="lg"
            onClick={handleStartConsult}
            className="shadow-md text-base font-black px-6 py-4 rounded-2xl"
          >
            <Video className="w-6 h-6 mr-2 text-white" />
            <span>Start Consultation</span>
          </Button>
        </div>
      </div>

      {/* Emergency Alert Header Banner */}
      {patient.emergencyAlertTriggered && (
        <div className="bg-red-50 border-4 border-red-500 rounded-2xl p-5 flex items-start space-x-4 text-red-950 animate-pulse">
          <AlertTriangle className="w-8 h-8 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-lg">EMERGENCY CLINICAL RED-FLAG DETECTED</h4>
            <p className="text-base font-extrabold text-red-900 mt-0.5">
              Deterministically flagged by safety rules engine. High risk for acute cardiac/respiratory event. ASHA worker standby enabled.
            </p>
          </div>
        </div>
      )}

      {/* Vitals Grid */}
      <div>
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-2">
          <Activity className="w-5 h-5 text-forest-800" />
          <span>Patient Vitals & Biometrics</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300">
            <span className="text-xs font-black text-slate-600 block uppercase">Blood Pressure</span>
            <span className="text-2xl font-black text-slate-950 mt-1 block">{patient.vitals.bp}</span>
          </div>

          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300">
            <span className="text-xs font-black text-slate-600 block uppercase">Body Temp</span>
            <span className="text-2xl font-black text-slate-950 mt-1 block">{patient.vitals.temp}</span>
          </div>

          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300">
            <span className="text-xs font-black text-slate-600 block uppercase">Heart Rate</span>
            <span className="text-2xl font-black text-slate-950 mt-1 block">{patient.vitals.heartRate}</span>
          </div>

          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300">
            <span className="text-xs font-black text-slate-600 block uppercase">Oxygen (SpO2)</span>
            <span className="text-2xl font-black text-slate-950 mt-1 block">{patient.vitals.spo2}</span>
          </div>
        </div>
      </div>

      {/* Chief Complaint & Symptoms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-sand-50 p-5 rounded-2xl border-2 border-sand-300">
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Chief Complaint</h4>
          <p className="text-base font-extrabold text-slate-950 leading-relaxed">
            &quot;{patient.chiefComplaint}&quot;
          </p>
        </div>

        <div className="bg-sand-50 p-5 rounded-2xl border-2 border-sand-300">
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-wider mb-2">Detected Symptoms</h4>
          <div className="flex flex-wrap gap-2">
            {patient.symptoms.map((symptom, idx) => (
              <span key={idx} className="px-3 py-1.5 bg-white border-2 border-slate-300 text-slate-950 text-sm font-black rounded-xl">
                {symptom}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Clinical Summary Box */}
      <div className="bg-emerald-100 border-4 border-emerald-400 rounded-3xl p-6 relative overflow-hidden space-y-4">
        <div className="flex items-center space-x-2 text-forest-950 font-black text-base">
          <FileText className="w-6 h-6 text-forest-800" />
          <span>AI Clinical Summary & Safety Triage Assessment</span>
        </div>
        <p className="text-base text-emerald-950 font-extrabold leading-relaxed bg-white/90 p-4 rounded-2xl border-2 border-emerald-300">
          {patient.aiSummary}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-extrabold">
          <div className="bg-white/90 p-4 rounded-2xl border-2 border-emerald-300">
            <span className="font-black text-forest-950 block mb-2 text-base">Recommended Actions:</span>
            <ul className="list-disc pl-5 text-slate-900 space-y-1">
              {patient.recommendedActions.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/90 p-4 rounded-2xl border-2 border-emerald-300">
            <span className="font-black text-forest-950 block mb-2 text-base">Medical History:</span>
            <ul className="list-disc pl-5 text-slate-900 space-y-1">
              {patient.history.map((hist, idx) => (
                <li key={idx}>{hist}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Live Tele-Consultation Modal Window */}
      <Modal
        isOpen={isConsulting}
        onClose={() => setIsConsulting(false)}
        title={`Live Tele-Consultation: ${patient.name}`}
      >
        <div className="space-y-5">
          <div className="bg-slate-950 rounded-3xl p-8 text-white text-center flex flex-col items-center justify-center space-y-4 border-4 border-slate-900 min-h-[220px]">
            <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center animate-pulse shadow-lg">
              <Video className="w-10 h-10 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 font-bold">TELEMEDICINE ROOM #882</span>
              <h4 className="text-2xl font-black mt-1 text-white">Connected with ASHA Worker & Patient</h4>
              <p className="text-sm font-bold text-slate-300 mt-1">{patient.village} PHC Remote Node • High Speed Link Active</p>
            </div>
          </div>

          {/* E-Prescription Form */}
          <form onSubmit={handleIssuePrescription} className="space-y-4 bg-sand-100 p-5 rounded-3xl border-4 border-sand-300">
            <h4 className="text-sm font-black text-slate-900 uppercase">E-Prescription & Doctor Clinical Notes</h4>
            <textarea
              rows={3}
              required
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="Enter dosage guidelines, paracetamol / ORS instructions, or referral directives..."
              className="w-full text-base font-bold p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
            />
            
            {isPrescriptionIssued && (
              <div className="p-4 bg-emerald-200 border-2 border-emerald-500 text-emerald-950 rounded-2xl text-sm font-black flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-800 shrink-0" />
                <span>E-Prescription signed and dispatched to ASHA worker phone!</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button type="button" variant="outline" size="md" onClick={() => setIsConsulting(false)}>
                End Call
              </Button>
              <Button type="submit" variant="primary" size="lg" className="text-base font-black">
                Sign & Issue E-Prescription
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
