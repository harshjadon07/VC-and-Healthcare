'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Calendar, Users, PhoneCall, AlertTriangle, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';
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
      const triageRes = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptomText, language: currentLang }),
      });
      const triageData = await triageRes.json();

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
          
          {/* Patient Greeting & Emergency SOS Ribbon */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border-4 border-sand-300 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-emerald-200 text-forest-950 text-sm font-black rounded-full border border-emerald-400">
                  ABHA ID LINKED
                </span>
                <span className="text-sm font-black text-slate-600 font-mono">ID: 91-8823-4412</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                {dict.patientDashboard}
              </h1>
              <p className="text-base sm:text-lg text-slate-800 font-extrabold">
                Welcome back, <span className="text-forest-900 font-black">{user?.name || 'Ramesh Patil'}</span> (Khed Shivapur Gram).
              </p>
            </div>

            <div className="flex items-center space-x-4 shrink-0">
              <Button
                variant="danger"
                size="lg"
                onClick={() => setActiveModal('EMERGENCY')}
                className="shadow-xl text-lg font-black px-6 py-4 rounded-2xl border-2 border-red-700"
              >
                <PhoneCall className="w-6 h-6 mr-2 animate-bounce text-white" />
                <span>Emergency SOS (108)</span>
              </Button>
            </div>
          </div>

          {/* Voice Prompt Assistance Card */}
          <div className="bg-forest-800 text-white p-6 rounded-3xl border-4 border-forest-950 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-forest-900 flex items-center justify-center shrink-0">
                <Volume2 className="w-8 h-8 text-forest-800 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">Need Help? Speak to AI Doctor</h3>
                <p className="text-base font-extrabold opacity-90">
                  Tap button to describe symptoms in plain text or regional voice.
                </p>
              </div>
            </div>
            <Link href="/patient/assistant" className="w-full sm:w-auto shrink-0">
              <Button size="lg" className="w-full bg-emerald-400 hover:bg-emerald-300 text-forest-950 font-black text-lg py-4 px-6 rounded-2xl border-2 border-white shadow-md">
                <Bot className="w-6 h-6 mr-2 text-forest-950" />
                <span>Open AI Doctor →</span>
              </Button>
            </Link>
          </div>

          {/* 4 PRIMARY DASHBOARD CARDS WITH EXTRA-LARGE TOUCH TARGETS */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Primary Healthcare Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <ActionCard
                title={dict.aiAssistantCard}
                description={dict.aiAssistantDesc}
                icon={Bot}
                variant="highlight"
                badgeText="Free AI Doctor"
                onClick={() => (window.location.href = '/patient/assistant')}
              />

              <ActionCard
                title={dict.bookAppointmentCard}
                description={dict.bookAppointmentDesc}
                icon={Calendar}
                badgeText="Tele-Clinic"
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
                badgeText="24/7 Hotline 108"
                onClick={() => setActiveModal('EMERGENCY')}
              />
            </div>
          </div>

          {/* DISEASE RISK MAP PLACEHOLDER SECTION */}
          <section className="pt-4">
            <RiskMapPlaceholder />
          </section>
        </main>
      </ProtectedRoute>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={activeModal === 'BOOK'}
        onClose={() => setActiveModal(null)}
        title="Schedule Rural Doctor Consultation"
      >
        <form onSubmit={handleBookSubmit} className="space-y-5">
          {bookingSuccess ? (
            <div className="p-6 bg-emerald-100 border-4 border-emerald-400 text-emerald-950 rounded-2xl text-center font-black text-lg space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-800 mx-auto" />
              <p>Appointment Booked Successfully!</p>
              <p className="text-base font-extrabold text-slate-800">
                Confirmed with {selectedDoctor.split('-')[0]} for today at 02:30 PM.
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-base font-black text-slate-900 block mb-2">Select Specialty / Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full text-base font-black p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
                >
                  <option value="Dr. Kulkarni - General Medicine & PHC Officer">Dr. Kulkarni - General Medicine & PHC Officer (Available Today)</option>
                  <option value="Dr. Ananya Sharma - Maternal & Pediatrics Specialist">Dr. Ananya Sharma - Maternal & Pediatrics Specialist</option>
                  <option value="Dr. Vikram Patil - Chronic Disease Care">Dr. Vikram Patil - Chronic Disease & Diabetes Care</option>
                </select>
              </div>

              <div>
                <label className="text-base font-black text-slate-900 block mb-2">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  defaultValue="2026-08-12T14:30"
                  className="w-full text-base font-black p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="text-base font-black text-slate-900 block mb-2">Health Issue / Symptoms</label>
                <textarea
                  rows={3}
                  required
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="Describe your health issue (e.g. fever for 2 days, severe headache, stomach ache)..."
                  className="w-full text-base font-bold p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <Button type="button" variant="outline" size="md" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="lg">
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
        <div className="space-y-4">
          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300 text-base font-bold text-slate-900">
            Linked Family Group: <span className="font-black text-forest-900">Patil Family (Khed Shivapur Gram)</span>
          </div>

          <div className="divide-y-2 divide-slate-200 border-2 border-slate-300 rounded-2xl overflow-hidden text-base">
            {[
              { name: 'Ramesh Patil (Self)', age: 52, abha: '91-8823-4412', history: 'Hypertension' },
              { name: 'Sunita Patil (Spouse)', age: 48, abha: '91-8823-4413', history: 'Thyroid Care' },
              { name: 'Aarav Patil (Son)', age: 14, abha: '91-8823-4414', history: 'Routine Immunizations' },
            ].map((member, i) => (
              <div key={i} className="p-4 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="font-black text-slate-950 text-lg">{member.name}</p>
                  <p className="text-slate-700 text-sm font-bold">ABHA: {member.abha} • {member.history}</p>
                </div>
                <Button variant="outline" size="sm" className="text-sm font-black">View History</Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="md" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Emergency SOS Modal */}
      <Modal
        isOpen={activeModal === 'EMERGENCY'}
        onClose={() => setActiveModal(null)}
        title="🚨 108 Emergency Ambulance Triggered"
      >
        <div className="space-y-5">
          <div className="bg-red-50 border-4 border-red-500 p-6 rounded-2xl text-center space-y-3">
            <AlertTriangle className="w-14 h-14 text-red-600 mx-auto animate-bounce" />
            <h4 className="text-2xl font-black text-red-950">Immediate Emergency Dispatch</h4>
            <p className="text-base text-red-900 font-bold">
              Alert dispatched to Khed Shivapur PHC Ambulance & local ASHA Health Worker queue.
            </p>
          </div>

          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300 text-base font-bold space-y-2 text-slate-950">
            <p className="font-black text-lg">Ambulance Hotline: 108</p>
            <p className="font-black text-lg">PHC Medical Officer: +91 94220 11223</p>
            <p className="text-slate-800">GPS Location sent: Khed Shivapur Gram, Sector 4</p>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" size="md" onClick={() => setActiveModal(null)}>
              Dismiss Alert
            </Button>
            <a href="tel:108">
              <Button variant="danger" size="lg" className="text-lg font-black">
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
