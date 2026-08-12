'use client';

import React, { useState } from 'react';
import { Users, PhoneCall, ShieldCheck } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { StatsBar } from '@/components/health-worker/StatsBar';
import { QueueTable } from '@/components/health-worker/QueueTable';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

export default function HealthWorkerDashboard() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const dict = dictionaries[currentLang] || dictionaries.en;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-sand-50">
      <Navbar currentLang={currentLang} onLanguageChange={setCurrentLang} />

      <ProtectedRoute allowedRole="HEALTH_WORKER">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
          {/* Header Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border-4 border-sand-300 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-forest-800 text-white text-sm font-black rounded-full">
                  ASHA NODE #402
                </span>
                <span className="text-sm font-mono font-black text-slate-600">Khed Shivapur PHC Sector</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950">
                {dict.healthWorkerDashboard}
              </h1>
              <p className="text-base sm:text-lg text-slate-800 font-extrabold">
                Live patient triage feed, village health monitoring, and emergency doctor dispatch.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <a href="tel:108">
                <Button variant="danger" size="lg" className="text-lg font-black px-6 py-4 rounded-2xl">
                  <PhoneCall className="w-6 h-6 mr-2" />
                  <span>Call PHC Ambulance</span>
                </Button>
              </a>
            </div>
          </div>

          {/* 1. STATS BAR */}
          <section>
            <StatsBar currentLang={currentLang} />
          </section>

          {/* 2. PATIENT QUEUE TABLE */}
          <section>
            <QueueTable currentLang={currentLang} />
          </section>
        </main>
      </ProtectedRoute>

      <Footer currentLang={currentLang} />
    </div>
  );
}
