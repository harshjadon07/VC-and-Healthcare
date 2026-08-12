'use client';

import React, { useState, useEffect } from 'react';
import { Stethoscope, User, Calendar, Activity, CheckCircle2, RefreshCw } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppointmentList } from '@/components/doctor/AppointmentList';
import { PatientDetailPanel } from '@/components/doctor/PatientDetailPanel';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MOCK_PATIENTS, MockPatient } from '@/lib/mock-data';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

export default function DoctorDashboard() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [patients, setPatients] = useState<MockPatient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<MockPatient>(MOCK_PATIENTS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const dict = dictionaries[currentLang] || dictionaries.en;

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPatients(data);
        if (!selectedPatient) setSelectedPatient(data[0]);
      }
    } catch (err) {
      console.error("Failed to load live doctor queue:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <ProtectedRoute allowedRole="DOCTOR">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
          {/* Doctor Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center font-bold">
                <Stethoscope className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {dict.doctorDashboard}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-full">
                    Dr. M. Kulkarni (MBBS, MD)
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  District Hospital Tele-Health Command • Satara & Pune District Rural Clusters
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={fetchAppointments}
                disabled={isLoading}
                className="flex items-center space-x-1.5 px-3 py-2 bg-sand-100 border border-sand-300 hover:bg-sand-200 rounded-lg text-xs font-bold text-slate-800 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Live Queue</span>
              </button>

              <div className="flex items-center space-x-2 text-xs font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-emerald-950">
                <Activity className="w-4 h-4 text-forest-800" />
                <span>{patients.length} Active Queue</span>
              </div>
            </div>
          </div>

          {/* SPLIT DASHBOARD LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: TODAY'S APPOINTMENT LIST */}
            <div className="lg:col-span-4 h-full">
              <AppointmentList
                patients={patients}
                selectedPatientId={selectedPatient.id}
                onSelectPatient={(p) => setSelectedPatient(p)}
              />
            </div>

            {/* RIGHT COLUMN: PATIENT DETAIL PANEL */}
            <div className="lg:col-span-8 h-full">
              <PatientDetailPanel patient={selectedPatient} onRefresh={fetchAppointments} />
            </div>
          </div>
        </main>
      </ProtectedRoute>

      <Footer currentLang={currentLang} />
    </div>
  );
}
