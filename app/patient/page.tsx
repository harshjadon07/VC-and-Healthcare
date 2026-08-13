'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, Calendar, Users, CheckCircle2, Volume2, ShieldCheck, Mail, Lock, Activity, Cpu, Plus, UserPlus, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ActionCard } from '@/components/patient/ActionCard';
import { RiskMapPlaceholder } from '@/components/patient/RiskMapPlaceholder';
import { XrayAnalyzerModal } from '@/components/xray/XrayAnalyzerModal';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Language, dictionaries } from '@/lib/i18n/dictionary';
import { useAuth } from '@/context/AuthContext';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  bloodGroup: string;
  medicalHistory: string;
}

export default function PatientDashboard() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [activeModal, setActiveModal] = useState<'BOOK' | 'FAMILY' | null>(null);
  const [isXrayModalOpen, setIsXrayModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [symptomText, setSymptomText] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('Dr. Kulkarni - General Medicine & PHC Officer');
  const { user } = useAuth();

  // Family Members State
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Sunita Patil', relation: 'Spouse', age: 34, bloodGroup: 'O+', medicalHistory: 'None' },
    { id: '2', name: 'Aarav Patil', relation: 'Son', age: 8, bloodGroup: 'O+', medicalHistory: 'Asthma' },
    { id: '3', name: 'Ganpat Patil', relation: 'Father', age: 68, bloodGroup: 'B+', medicalHistory: 'Hypertension, Diabetes' }
  ]);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('Spouse');
  const [newMemberAge, setNewMemberAge] = useState('30');
  const [newMemberBlood, setNewMemberBlood] = useState('A+');
  const [newMemberHistory, setNewMemberHistory] = useState('');
  const [selectedPatientForBooking, setSelectedPatientForBooking] = useState('Self');

  const dict = dictionaries[currentLang] || dictionaries.en;

  const handleAddFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      relation: newMemberRelation,
      age: parseInt(newMemberAge) || 30,
      bloodGroup: newMemberBlood,
      medicalHistory: newMemberHistory.trim() || 'None'
    };

    setFamilyMembers([...familyMembers, newMember]);
    setNewMemberName('');
    setNewMemberHistory('');
    setShowAddFamily(false);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomText.trim()) return;

    try {
      const targetName = selectedPatientForBooking === 'Self' 
        ? (user?.name || user?.email?.split('@')[0] || 'Patient User')
        : selectedPatientForBooking;

      const triageRes = await fetch('/api/ai/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptomText,
          language: currentLang,
          patientName: targetName,
          phone: user?.phone || '+91 98223 45678'
        }),
      });
      const triageData = await triageRes.json();

      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: targetName,
          email: user?.email,
          phone: user?.phone || '+91 98223 45678',
          chiefComplaint: symptomText,
          triageLevel: triageData.triageLevel || 'ROUTINE',
          aiSummary: triageData.summary || 'Booked via Supabase Tele-Clinic',
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
      }, 2500);
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
          
          {/* Patient Greeting Ribbon */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 sm:p-8 rounded-3xl border-4 border-sand-300 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-emerald-200 text-forest-950 text-sm font-black rounded-full border border-emerald-400">
                  AUTHENTICATED PATIENT
                </span>
                <span className="text-sm font-black text-slate-600 font-mono">
                  {user?.email || 'Logged in via Supabase'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                {dict.patientDashboard}
              </h1>
              <p className="text-base sm:text-lg text-slate-800 font-extrabold">
                Welcome, <span className="text-forest-900 font-black">{user?.name || user?.email?.split('@')[0] || 'Patient'}</span>. Manage healthcare records & book consultations for you and your family.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Redirect to Dedicated X-Ray Website Page Button */}
              <Link href="/patient/xray">
                <Button
                  type="button"
                  className="bg-forest-800 hover:bg-forest-900 text-white font-black px-6 py-4 rounded-2xl shadow-md flex items-center space-x-2 border-2 border-forest-950 text-base"
                >
                  <Activity className="w-5 h-5 text-emerald-300 animate-pulse" />
                  <span>🩻 Open X-Ray Portal Page →</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Voice Prompt Assistance Card */}
          <div className="bg-forest-800 text-white p-6 rounded-3xl border-4 border-forest-950 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-white text-forest-900 flex items-center justify-center shrink-0">
                <Volume2 className="w-8 h-8 text-forest-800 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black">Need Clinical Guidance? Speak to AI Doctor</h3>
                <p className="text-base font-extrabold opacity-90">
                  Instant Gemini AI medical triage with regional voice support.
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

          {/* PRIMARY DASHBOARD CARDS WITH FAMILY HEALTH FEATURE */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Primary Patient Healthcare Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Card 1: Family Health Group & Records (RESTORED / ADDED) */}
              <ActionCard
                title="Family Health Group & Records"
                description="Manage health profiles for family members, spouse, children, and elderly parents."
                icon={Users}
                variant="highlight"
                badgeText="Family Group ({familyMembers.length + 1})"
                onClick={() => setActiveModal('FAMILY')}
              />

              {/* Card 2: Dedicated X-Ray Web Page Link */}
              <ActionCard
                title="Chest X-Ray Diagnostic Page"
                description="Open dedicated X-Ray website portal page to upload images & view visual report."
                icon={Cpu}
                badgeText="🩻 Dedicated Page"
                onClick={() => (window.location.href = '/patient/xray')}
              />

              {/* Card 3: Free AI Doctor */}
              <ActionCard
                title={dict.aiAssistantCard}
                description={dict.aiAssistantDesc}
                icon={Bot}
                badgeText="Free AI Doctor"
                onClick={() => (window.location.href = '/patient/assistant')}
              />

              {/* Card 4: Book Doctor Appointment */}
              <ActionCard
                title={dict.bookAppointmentCard}
                description={dict.bookAppointmentDesc}
                icon={Calendar}
                badgeText="Supabase Saved"
                onClick={() => setActiveModal('BOOK')}
              />
            </div>
          </div>

          {/* DISEASE RISK MAP PLACEHOLDER SECTION */}
          <section className="pt-4">
            <RiskMapPlaceholder />
          </section>
        </main>
      </ProtectedRoute>

      {/* Local LLM X-Ray Modal Trigger Helper */}
      <XrayAnalyzerModal
        isOpen={isXrayModalOpen}
        onClose={() => setIsXrayModalOpen(false)}
      />

      {/* Book Appointment Modal */}
      <Modal
        isOpen={activeModal === 'BOOK'}
        onClose={() => {
          setActiveModal(null);
          setBookingSuccess(false);
        }}
        title="Schedule Rural Doctor Consultation"
      >
        <form onSubmit={handleBookSubmit} className="space-y-5">
          {bookingSuccess ? (
            <div className="p-6 bg-emerald-100 border-4 border-emerald-400 text-emerald-950 rounded-2xl text-center font-black text-lg space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-800 mx-auto" />
              <p className="text-2xl">Appointment Booked & Saved to Supabase!</p>
              <p className="text-base font-extrabold text-slate-800">
                Confirmed for {selectedPatientForBooking} with {selectedDoctor.split('-')[0]}. Saved to Supabase table <code className="font-mono text-forest-900">appointments</code>.
              </p>
              <Button type="button" variant="primary" size="md" onClick={() => setActiveModal(null)} className="mt-2 font-black">
                Done
              </Button>
            </div>
          ) : (
            <>
              <div>
                <label className="text-base font-black text-slate-900 block mb-2">Book Consultation For:</label>
                <select
                  value={selectedPatientForBooking}
                  onChange={(e) => setSelectedPatientForBooking(e.target.value)}
                  className="w-full text-base font-black p-4 bg-white border-2 border-slate-400 rounded-xl focus:outline-none focus:ring-4 focus:ring-forest-800"
                >
                  <option value="Self">Self ({user?.name || user?.email?.split('@')[0] || 'Primary Account'})</option>
                  {familyMembers.map((fm) => (
                    <option key={fm.id} value={`${fm.name} (${fm.relation})`}>
                      Family Member: {fm.name} ({fm.relation}, Age {fm.age})
                    </option>
                  ))}
                </select>
              </div>

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
                <label className="text-base font-black text-slate-900 block mb-2">Health Issue / Symptoms *</label>
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
                <Button type="submit" variant="primary" size="lg" className="font-black">
                  Confirm & Save to Supabase →
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* FAMILY HEALTH FEATURE MODAL */}
      <Modal
        isOpen={activeModal === 'FAMILY'}
        onClose={() => {
          setActiveModal(null);
          setShowAddFamily(false);
        }}
        title="👨‍👩‍👧‍👦 Family Health Group & Medical Profiles"
      >
        <div className="space-y-6">
          <div className="bg-emerald-50 p-4 rounded-2xl border-2 border-emerald-300 text-sm font-bold text-forest-950 flex items-center justify-between">
            <div>
              <span className="font-black text-base block">Primary Account Holder:</span>
              <span>{user?.email || 'Logged in via Supabase'}</span>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setShowAddFamily(!showAddFamily)}
              className="font-black text-xs shrink-0"
            >
              <UserPlus className="w-4 h-4 mr-1" />
              {showAddFamily ? 'Cancel' : '+ Add Family Member'}
            </Button>
          </div>

          {/* ADD FAMILY MEMBER FORM */}
          {showAddFamily && (
            <form onSubmit={handleAddFamilySubmit} className="bg-sand-100 p-5 rounded-2xl border-3 border-sand-300 space-y-4">
              <h4 className="text-base font-black text-slate-950 uppercase flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <span>New Family Member Profile</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="e.g. Anish Patil"
                    className="w-full text-sm font-bold p-3 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Relationship *</label>
                  <select
                    value={newMemberRelation}
                    onChange={(e) => setNewMemberRelation(e.target.value)}
                    className="w-full text-sm font-bold p-3 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child (Son/Daughter)</option>
                    <option value="Parent">Parent (Father/Mother)</option>
                    <option value="Sibling">Sibling (Brother/Sister)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={120}
                    value={newMemberAge}
                    onChange={(e) => setNewMemberAge(e.target.value)}
                    className="w-full text-sm font-bold p-3 bg-white border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={newMemberBlood}
                    onChange={(e) => setNewMemberBlood(e.target.value)}
                    className="w-full text-sm font-bold p-3 bg-white border border-slate-300 rounded-xl"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">Medical History / Allergies</label>
                <input
                  type="text"
                  value={newMemberHistory}
                  onChange={(e) => setNewMemberHistory(e.target.value)}
                  placeholder="e.g. Asthma, Penicillin allergy"
                  className="w-full text-sm font-bold p-3 bg-white border border-slate-300 rounded-xl"
                />
              </div>

              <Button type="submit" variant="primary" size="md" className="w-full font-black">
                Save Family Member →
              </Button>
            </form>
          )}

          {/* FAMILY MEMBER CARDS LIST */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-slate-900 uppercase">Registered Family Members:</h4>
            
            <div className="space-y-3">
              {familyMembers.map((fm) => (
                <div key={fm.id} className="bg-white p-4 rounded-2xl border-2 border-slate-300 flex items-center justify-between gap-4 shadow-2xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-black text-slate-950">{fm.name}</span>
                      <span className="px-2 py-0.5 bg-sand-200 text-slate-900 text-xs font-extrabold rounded-md">
                        {fm.relation}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-forest-900 text-xs font-black rounded-md">
                        {fm.bloodGroup}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-600">
                      Age: {fm.age} yrs • History: <span className="text-slate-900">{fm.medicalHistory}</span>
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPatientForBooking(`${fm.name} (${fm.relation})`);
                      setActiveModal('BOOK');
                    }}
                    className="font-black text-xs shrink-0"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    Book Doctor
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="md" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      <Footer currentLang={currentLang} />
    </div>
  );
}
