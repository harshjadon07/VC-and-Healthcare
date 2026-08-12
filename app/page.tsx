'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bot, UserCheck, Stethoscope, Users, HeartPulse, ArrowRight, ShieldCheck, PhoneCall, Sparkles, MapPin, CheckCircle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedLoginRole, setSelectedLoginRole] = useState<'PATIENT' | 'HEALTH_WORKER' | 'DOCTOR'>('PATIENT');

  const dict = dictionaries[currentLang] || dictionaries.en;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-linear-to-b from-sand-50 via-white to-sand-100">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        {/* Top Announcement Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-forest-100 border border-forest-300 text-forest-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-forest-800 animate-spin" />
            <span>Empowering ASHA Workers & Rural Families with AI Triage</span>
          </div>
        </div>

        {/* Hero Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {dict.heroTitle}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-700 font-medium max-w-3xl mx-auto leading-relaxed">
            {dict.heroSubtitle}
          </p>

          {/* TWO PRIMARY ENTRY POINTS */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* 1. Talk to AI Health Assistant (No Login Required) */}
            <Link href="/patient/assistant" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-forest-800 hover:bg-forest-900 text-white text-lg py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Bot className="w-6 h-6 mr-3 text-emerald-400" />
                <span>{dict.talkToAi}</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            {/* 2. Login / Register */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full sm:w-auto border-2 border-forest-800 text-forest-900 hover:bg-forest-50 text-lg py-4 px-8 rounded-xl shadow-sm"
            >
              <UserCheck className="w-6 h-6 mr-3 text-forest-800" />
              <span>{dict.loginRegister}</span>
            </Button>
          </div>

          <p className="mt-3 text-xs text-slate-500 font-semibold">
            ✓ Free immediate AI health assessment • No mandatory registration for initial symptom check
          </p>
        </div>

        {/* Phase 1 Scaffolding Portal Quick Access Cards */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-forest-800 font-bold uppercase tracking-widest block">
              [ Phase 1 Scaffolding Preview ]
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-1">
              Explore SevaHealth Dashboard Portals
            </h2>
            <p className="text-xs text-slate-600 font-semibold">
              Click any role below to view the interactive Phase 1 UI dashboard scaffolding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Portal */}
            <Link href="/patient" className="group">
              <div className="bg-white rounded-2xl p-6 border-2 border-forest-100 group-hover:border-forest-500 shadow-sm group-hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-900 flex items-center justify-center mb-4 group-hover:bg-forest-800 group-hover:text-white transition-colors">
                    <HeartPulse className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-forest-800">
                    Patient Dashboard
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                    AI Health Assistant card, Book Appointment, Family Records, Emergency SOS, and Disease Risk Map.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-forest-800 flex items-center justify-between">
                  <span>Open Patient Portal</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* ASHA Health Worker Portal */}
            <Link href="/health-worker" className="group">
              <div className="bg-white rounded-2xl p-6 border-2 border-forest-100 group-hover:border-forest-500 shadow-sm group-hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-900 flex items-center justify-center mb-4 group-hover:bg-forest-800 group-hover:text-white transition-colors">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-forest-800">
                    Health Worker (ASHA)
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                    Patient triage queue, today&apos;s waiting stats, emergency alert feeds, and tele-doctor routing.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-forest-800 flex items-center justify-between">
                  <span>Open Health Worker Queue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Doctor Portal */}
            <Link href="/doctor" className="group">
              <div className="bg-white rounded-2xl p-6 border-2 border-forest-100 group-hover:border-forest-500 shadow-sm group-hover:shadow-md transition-all h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-900 flex items-center justify-center mb-4 group-hover:bg-forest-800 group-hover:text-white transition-colors">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-forest-800">
                    Doctor Portal
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">
                    Prioritized appointment queue, patient detail panel, vitals monitoring, AI summary, & start tele-consultation.
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 text-xs font-bold text-forest-800 flex items-center justify-between">
                  <span>Open Doctor Panel</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Login / Register Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Login / Register to SevaHealth"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 font-medium">
            Select your role to simulate portal sign-in (Firebase Auth will be wired in Phase 2):
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'PATIENT', label: 'Patient', icon: HeartPulse },
              { id: 'HEALTH_WORKER', label: 'ASHA Worker', icon: Users },
              { id: 'DOCTOR', label: 'Doctor', icon: Stethoscope },
            ].map((role) => {
              const Icon = role.icon;
              const isSel = selectedLoginRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedLoginRole(role.id as any)}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isSel
                      ? 'bg-forest-800 text-white border-forest-900 font-bold shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 font-semibold hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <span className="text-xs">{role.label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="text-center text-xs font-bold text-slate-400 py-1">— OR —</div>

            <Button
              variant="outline"
              className="w-full text-xs font-bold bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
              onClick={() => {
                setIsLoginModalOpen(false);
                const target = selectedLoginRole === 'PATIENT' ? '/patient' : selectedLoginRole === 'HEALTH_WORKER' ? '/health-worker' : '/doctor';
                window.location.href = target;
              }}
            >
              Continue with Google Account
            </Button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsLoginModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsLoginModalOpen(false);
                const target = selectedLoginRole === 'PATIENT' ? '/patient' : selectedLoginRole === 'HEALTH_WORKER' ? '/health-worker' : '/doctor';
                window.location.href = target;
              }}
            >
              Proceed to {selectedLoginRole} Dashboard →
            </Button>
          </div>
        </div>
      </Modal>

      <Footer currentLang={currentLang} />
    </div>
  );
}
