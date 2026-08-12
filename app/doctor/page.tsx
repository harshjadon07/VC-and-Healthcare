'use client';

import React, { useState, useEffect } from 'react';
import { Stethoscope, Activity, RefreshCw, Ticket } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AppointmentList } from '@/components/doctor/AppointmentList';
import { PatientDetailPanel } from '@/components/doctor/PatientDetailPanel';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { MockPatient } from '@/lib/mock-data';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

export default function DoctorDashboard() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [patients, setPatients] = useState<MockPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<MockPatient | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dict = dictionaries[currentLang] || dictionaries.en;

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/appointments');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPatients(data);
        if (data.length > 0) {
          setSelectedPatient(data[0]);
        } else {
          setSelectedPatient(null);
        }
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
          {/* Doctor Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border-4 border-sand-300 shadow-md">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-forest-800 text-white flex items-center justify-center font-black shrink-0 shadow-md">
                <Stethoscope className="w-9 h-9 text-emerald-300" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                    {dict.doctorDashboard}
                  </h1>
                  <span className="px-3 py-1 bg-emerald-200 text-forest-950 text-sm font-black rounded-full border border-emerald-400">
                    Dr. M. Kulkarni (MBBS, MD)
                  </span>
                </div>
                <p className="text-base sm:text-lg text-slate-800 font-extrabold mt-1">
                  District Hospital Tele-Health Command • Satara & Pune District Rural Clusters
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={fetchAppointments}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-3 bg-sand-100 border-2 border-sand-300 hover:bg-sand-200 rounded-2xl text-base font-black text-slate-900 transition-all active:scale-95"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Token Queue</span>
              </button>

              <div className="flex items-center space-x-2 text-base font-black bg-emerald-100 px-4 py-3 rounded-2xl border-2 border-emerald-400 text-forest-950">
                <Activity className="w-5 h-5 text-forest-900" />
                <span>{patients.length} Active Tickets</span>
              </div>
            </div>
          </div>

          {/* SPLIT DASHBOARD LAYOUT */}
          {patients.length === 0 ? (
            <div className="bg-white rounded-3xl border-4 border-sand-300 p-12 text-center shadow-md space-y-4">
              <Ticket className="w-16 h-16 text-slate-400 mx-auto" />
              <h3 className="text-2xl font-black text-slate-950">No Active Token Tickets in Queue</h3>
              <p className="text-base font-extrabold text-slate-700 max-w-md mx-auto">
                Preloaded mock patients have been cleared. When patients or ASHA workers issue unique token tickets, they will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: TODAY'S APPOINTMENT LIST */}
              <div className="lg:col-span-4 h-full">
                <AppointmentList
                  patients={patients}
                  selectedPatientId={selectedPatient?.id || ''}
                  onSelectPatient={(p) => setSelectedPatient(p)}
                />
              </div>

              {/* RIGHT COLUMN: PATIENT DETAIL PANEL */}
              <div className="lg:col-span-8 h-full">
                {selectedPatient ? (
                  <PatientDetailPanel patient={selectedPatient} onRefresh={fetchAppointments} />
                ) : (
                  <div className="bg-white p-8 rounded-3xl border-4 border-sand-300 text-center font-black text-slate-600">
                    Select a patient token ticket from the queue list to inspect.
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </ProtectedRoute>

      <Footer currentLang={currentLang} />
    </div>
  );
}
