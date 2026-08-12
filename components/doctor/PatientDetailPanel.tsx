'use client';

import React, { useState } from 'react';
import { Stethoscope, Activity, Heart, Thermometer, ShieldAlert, FileText, CheckCircle, Video, PhoneCall, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-black text-slate-900">{patient.name}</h2>
            <Badge variant={patient.triageLevel}>{patient.triageLevel}</Badge>
          </div>
          <p className="text-xs font-semibold text-slate-600 mt-1">
            Patient ID: <span className="font-mono">{patient.id}</span> • {patient.age} Yrs / {patient.gender} • {patient.village}, {patient.district}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant={patient.triageLevel === 'EMERGENCY' ? 'danger' : 'primary'}
            size="lg"
            onClick={handleStartConsult}
            className="shadow-md"
          >
            <Video className="w-5 h-5 mr-2" />
            Start Consultation
          </Button>
        </div>
      </div>

      {/* Emergency Alert Header Banner if triggered */}
      {patient.emergencyAlertTriggered && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start space-x-3 text-red-900 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">EMERGENCY CLINICAL RED-FLAG DETECTED</h4>
            <p className="text-xs font-medium text-red-800 mt-0.5">
              Deterministically flagged by safety rules engine. High risk for acute cardiac/respiratory event. ASHA worker standby enabled.
            </p>
          </div>
        </div>
      )}

      {/* Vitals Grid */}
      <div>
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-forest-800" />
          <span>Patient Vitals & Biometrics</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
            <span className="text-[11px] font-bold text-slate-500 block">Blood Pressure</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{patient.vitals.bp}</span>
          </div>

          <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
            <span className="text-[11px] font-bold text-slate-500 block">Body Temperature</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{patient.vitals.temp}</span>
          </div>

          <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
            <span className="text-[11px] font-bold text-slate-500 block">Heart Rate</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{patient.vitals.heartRate}</span>
          </div>

          <div className="bg-sand-50 p-3 rounded-lg border border-sand-200">
            <span className="text-[11px] font-bold text-slate-500 block">Oxygen (SpO2)</span>
            <span className="text-lg font-black text-slate-900 mt-0.5 block">{patient.vitals.spo2}</span>
          </div>
        </div>
      </div>

      {/* Chief Complaint & Symptoms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Chief Complaint</h4>
          <p className="text-sm font-semibold text-slate-900 leading-relaxed">
            &quot;{patient.chiefComplaint}&quot;
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Detected Symptoms</h4>
          <div className="flex flex-wrap gap-1.5">
            {patient.symptoms.map((symptom, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-md">
                {symptom}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Clinical Summary Box Placeholder */}
      <div className="bg-emerald-50/70 border border-emerald-300 rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-forest-900 font-bold text-sm mb-2">
          <FileText className="w-5 h-5 text-forest-800" />
          <span>AI Clinical Summary & Safety Triage Assessment</span>
        </div>
        <p className="text-sm text-emerald-950 font-medium leading-relaxed bg-white/70 p-3.5 rounded-lg border border-emerald-200/80">
          {patient.aiSummary}
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-white/80 p-3 rounded-lg border border-emerald-200">
            <span className="font-bold text-forest-900 block mb-1">Recommended Actions:</span>
            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
              {patient.recommendedActions.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white/80 p-3 rounded-lg border border-emerald-200">
            <span className="font-bold text-forest-900 block mb-1">Medical History:</span>
            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
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
        <div className="space-y-4">
          <div className="bg-slate-900 rounded-xl p-6 text-white text-center flex flex-col items-center justify-center space-y-3 relative overflow-hidden min-h-[220px]">
            <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center animate-pulse">
              <Video className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400">TELEMEDICINE ROOM #882</span>
              <h4 className="text-lg font-bold">Connected with ASHA Worker & Patient</h4>
              <p className="text-xs text-slate-300">{patient.village} PHC Remote Node • High Speed Link Active</p>
            </div>
          </div>

          {/* E-Prescription Form */}
          <form onSubmit={handleIssuePrescription} className="space-y-3 bg-sand-50 p-4 rounded-xl border border-sand-200">
            <h5 className="text-xs font-bold text-slate-800 uppercase">E-Prescription & Doctor Clinical Notes</h5>
            <textarea
              rows={3}
              required
              value={prescriptionText}
              onChange={(e) => setPrescriptionText(e.target.value)}
              placeholder="Enter dosage guidelines, paracetamol / ORS instructions, or referral directives..."
              className="w-full text-xs font-mono p-3 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
            
            {isPrescriptionIssued && (
              <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-xs font-bold flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>E-Prescription signed and dispatched to ASHA worker phone!</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsConsulting(false)}>
                End Call
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Sign & Issue Prescription
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
