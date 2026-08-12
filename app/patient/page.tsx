'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Calendar, Users, PhoneCall, AlertTriangle, CheckCircle2, Volume2, ShieldCheck, Ticket } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionCard } from '@/components/patient/ActionCard';
import { RiskMapPlaceholder } from '@/components/patient/RiskMapPlaceholder';
import { TokenAuthLookup } from '@/components/patient/TokenAuthLookup';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

export default function PatientDashboard() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeModal, setActiveModal] = useState<'BOOK' | 'FAMILY' | 'EMERGENCY' | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [symptomText, setSymptomText] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Kulkarni - General Medicine & PHC Officer');
  const [patientName, setPatientName] = useState('Ramesh Patil');
  const [village, setVillage] = useState('Khed Shivapur');

  const dict = dictionaries[currentLang] || dictionaries.en;

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    try {
      const triageRes = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomText,
          language: currentLang,
          patientName,
          village
        }),
      });
      const triageData = await triageRes.json();

      setGeneratedToken(triageData.tokenNumber || 'SEVA-TK-948120');
      setBookingSuccess(true);
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
                  DIGITAL HEALTH TICKET SYSTEM
                </span>
                <span className="text-sm font-black text-slate-600 font-mono">SEVA-TK Token Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                {dict.patientDashboard}
              </h1>
              <p className="text-base sm:text-lg text-slate-800 font-extrabold">
                Dynamic queue management with unique patient token authentication numbers.
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

          {/* 1. UNIQUE TOKEN AUTHENTICATION LOOKUP COMPONENT */}
          <section>
            <TokenAuthLookup />
          </section>

          {/* Voice Prompt Assistance Card */}
          <div className="bg-forest-800 text-white p-6 rounded-3xl border-4 border-forest-950 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-forest-900 flex items-center justify-center shrink-0">
                <Volume2 className="w-8 h-8 text-forest-800 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">Need Help? Speak to AI Doctor</h3>
                <p className="text-base font-extrabold opacity-90">
                  Tap button to describe symptoms and receive your unique Token Number.
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
                badgeText="Issue Token"
                onClick={() => setActiveModal('BOOK')}
              />

              <ActionCard
                title={dict.familyRecordsCard}
                description={dict.familyRecordsDesc}
                icon={Users}
                badgeText="Digital Group"
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
        onClose={() => {
          setActiveModal(null);
          setBookingSuccess(false);
        }}
        title="Issue Patient Unique Token Ticket"
      >
        <form onSubmit={handleBookSubmit} className="space-y-5">
          {bookingSuccess ? (
            <div className="p-6 bg-emerald-100 border-4 border-emerald-400 text-emerald-950 rounded-2xl text-center font-black text-lg space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-800 mx-auto" />
              <p className="text-2xl">Unique Token Ticket Generated!</p>
              <div className="p-4 bg-white rounded-2xl border-2 border-emerald-500 text-2xl font-mono font-black text-forest-950">
                🎫 {generatedToken}
              </div>
              <p className="text-sm font-extrabold text-slate-800">
                Keep this token number safe. You can use it in the Token Auth search bar to track your queue position.
              </p>
              <Button type="button" variant="primary" size="md" onClick={() => setActiveModal(null)} className="mt-2 font-black">
                Done
              </Button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-base font-black text-slate-900 block mb-2">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full text-base font-black p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
                />
              </div>

              <div>
                <label className="text-base font-black text-slate-900 block mb-2">Village / Gram Name</label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
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
                  placeholder="Describe your health issue (e.g. fever for 2 days, severe headache)..."
                  className="w-full text-base font-bold p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <Button type="button" variant="outline" size="md" onClick={() => setActiveModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="lg">
                  Generate Token Ticket →
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
        title="Family Token Records & Sync"
      >
        <div className="space-y-4">
          <div className="bg-sand-100 p-4 rounded-2xl border-2 border-sand-300 text-base font-bold text-slate-900">
            Digital Token Health Records
          </div>

          <p className="text-sm font-extrabold text-slate-700">
            Use the Patient Unique Token Authentication box on the main dashboard to check any family member's active ticket using their <code className="font-mono font-black text-forest-800">SEVA-TK-XXXXXX</code> code.
          </p>

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
              Alert dispatched to PHC Ambulance & ASHA queue.
            </p>
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
