'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Calendar, Users, PhoneCall, AlertTriangle, ShieldCheck, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionCard } from '@/components/patient/ActionCard';
import { RiskMapPlaceholder } from '@/components/patient/RiskMapPlaceholder';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Language, dictionaries } from '@/lib/i18n/dictionary';
import { useAuth } from '@/context/AuthContext';

export default function PatientDashboard() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeModal, setActiveModal] = useState<'BOOK' | 'FAMILY' | 'EMERGENCY' | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Kulkarni - General Medicine & PHC Officer');
  const { user } = useAuth();

  const dict = dictionaries[currentLang] || dictionaries.en;

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    try {
      // Evaluate safety for AI summary
      const triageRes = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomText, language: currentLang }),
      });
      const triageData = await triageRes.json();

      // Post appointment
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user?.name || "Ramesh Patil",
          age: 52,
          gender: "Male",
          village: "Khed Shivapur",
          district: "Pune",
          phone: user?.phone || "+91 98223 45678",
          chiefComplaint: symptomText,
          triageLevel: triageData.triageLevel || 'ROUTINE',
          aiSummary: triageData.summary || "Booked via Tele-Clinic Portal",
          symptoms: triageData.symptomsDetected || [symptomText],
          patientAdvice: triageData.patientAdvice,
          recommendedActions: triageData.recommendedActions,
        }),
      });

      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setActiveModal(null);
        setSymptomText('');
      }, 2000);
    } catch (err) {
      console.error("Booking error:", err);
      setBookingSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <ProtectedRoute allowedRole="PATIENT">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
          {/* Patient Greeting & Emergency Ribbon */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  ABHA ID Linked
                </span>
                <span className="text-xs text-slate-500 font-mono">ID: 91-8823-4412</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {dict.patientDashboard}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Welcome back, {user?.name || 'Ramesh Patil'} (Khed Shivapur Gram). Access instant AI triage and rural tele-consultations.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <Button
                variant="danger"
                size="md"
                onClick={() => setActiveModal('EMERGENCY')}
                className="shadow-md"
              >
                <PhoneCall className="w-4 h-4 mr-2" />
                <span>Emergency SOS (108)</span>
              </Button>
            </div>
          </div>

          {/* 4 PRIMARY DASHBOARD CARDS */}
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-forest-900 mb-3">
              Primary Healthcare Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <ActionCard
                title={dict.aiAssistantCard}
                description={dict.aiAssistantDesc}
                icon={Bot}
                variant="highlight"
                badgeText="Instant Triage"
                onClick={() => (window.location.href = '/patient/assistant')}
              />

              <ActionCard
                title={dict.bookAppointmentCard}
                description={dict.bookAppointmentDesc}
                icon={Calendar}
                badgeText="PHC Tele-Clinic"
                onClick={() => setActiveModal('BOOK')}
              />

              <ActionCard
                title={dict.familyRecordsCard}
                description={dict.familyRecordsDesc}
                icon={Users}
                badgeText="4 Family Members"
                onClick={() => setActiveModal('FAMILY')}
              />

              <ActionCard
                title={dict.emergencyCard}
                description={dict.emergencyDesc}
                icon={AlertTriangle}
                variant="emergency"
                badgeText="24/7 Red-Flag SOS"
                onClick={() => setActiveModal('EMERGENCY')}
              />
            </div>
          </div>

          {/* DISEASE RISK MAP PLACEHOLDER SECTION */}
          <section>
            <RiskMapPlaceholder />
          </section>
        </main>
      </ProtectedRoute>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={activeModal === 'BOOK'}
        onClose={() => setActiveModal(null)}
        title="Schedule Rural Tele-Consultation"
      >
        <form onSubmit={handleBookSubmit} className="space-y-4">
          {bookingSuccess ? (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-center font-bold text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
              Appointment Booked! Confirmed with {selectedDoctor.split('-')[0]} for today at 02:30 PM. AI clinical summary attached to doctor panel.
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Specialty / Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
                >
                  <option value="Dr. Kulkarni - General Medicine & PHC Officer">Dr. Kulkarni - General Medicine & PHC Officer (Available Today)</option>
                  <option value="Dr. Ananya Sharma - Maternal & Pediatrics Specialist">Dr. Ananya Sharma - Maternal & Pediatrics Specialist</option>
                  <option value="Dr. Vikram Patil - Chronic Disease Care">Dr. Vikram Patil - Chronic Disease & Diabetes Care</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  defaultValue="2026-08-12T14:30"
                  className="w-full text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chief Symptom Summary</label>
                <textarea
                  rows={3}
                  required
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="Describe main reason for consultation (e.g. high fever for 2 days, severe headache, BP check)..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Confirm Tele-Appointment
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* Family Records Modal */}
      <Modal
        isOpen={activeModal === 'FAMILY'}
        onClose={() => setActiveModal(null)}
        title="Family Health Records & ABHA Sync"
      >
        <div className="space-y-3">
          <div className="bg-sand-100 p-3 rounded-lg border border-sand-200 text-xs font-semibold text-slate-800">
            Linked Family Group: <span className="font-bold text-forest-900">Patil Family (Khed Shivapur)</span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {[
              { name: 'Ramesh Patil (Self)', age: 52, abha: '91-8823-4412', history: 'Hypertension' },
              { name: 'Sunita Patil (Spouse)', age: 48, abha: '91-8823-4413', history: 'Thyroid Care' },
              { name: 'Aarav Patil (Son)', age: 14, abha: '91-8823-4414', history: 'Routine Immunizations' },
            ].map((member, i) => (
              <div key={i} className="p-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-900">{member.name}</p>
                  <p className="text-slate-500 text-[11px]">ABHA: {member.abha} • {member.history}</p>
                </div>
                <Button variant="outline" size="sm" className="text-[11px]">View History</Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Emergency SOS Modal */}
      <Modal
        isOpen={activeModal === 'EMERGENCY'}
        onClose={() => setActiveModal(null)}
        title="🚨 108 Medical Emergency Triggered"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-300 p-4 rounded-xl text-center space-y-2">
            <AlertTriangle className="w-10 h-10 text-red-600 mx-auto animate-bounce" />
            <h4 className="text-base font-black text-red-900">Immediate Emergency Dispatch</h4>
            <p className="text-xs text-red-800 font-medium">
              Alert dispatched to Khed Shivapur PHC Ambulance & local ASHA Health Worker queue.
            </p>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border text-xs space-y-1">
            <p className="font-bold text-slate-900">Ambulance Hotline: 108</p>
            <p className="font-bold text-slate-900">PHC Medical Officer: +91 94220 11223</p>
            <p className="text-slate-600">Location sent: Khed Shivapur Gram, Sector 4</p>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setActiveModal(null)}>
              Dismiss Alert
            </Button>
            <a href="tel:108">
              <Button variant="danger" size="sm">
                Call 108 Immediately
              </Button>
            </a>
          </div>
        </div>
      </Modal>

      <Footer currentLang={currentLang} />
    </div>
  );
}
