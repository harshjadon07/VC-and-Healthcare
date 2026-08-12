'use client';

import React, { useState } from 'react';
import { Users, AlertTriangle, PhoneCall, ShieldCheck, Activity } from 'lucide-react';
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 bg-forest-100 text-forest-900 text-xs font-bold rounded-full">
                  ASHA Node #402
                </span>
                <span className="text-xs text-slate-500 font-mono">Khed Shivapur PHC Sector</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {dict.healthWorkerDashboard}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
                Live patient triage feed, village health monitoring, and emergency doctor dispatch.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <a href="tel:108">
                <Button variant="danger" size="md">
                  <PhoneCall className="w-4 h-4 mr-2" />
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
