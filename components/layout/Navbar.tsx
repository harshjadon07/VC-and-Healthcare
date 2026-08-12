'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartPulse, Globe, PhoneCall, Menu, X, User, Users, Stethoscope } from 'lucide-react';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dict = dictionaries[currentLang] || dictionaries.en;

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-forest-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md group-hover:bg-forest-900 transition-all">
              <HeartPulse className="w-8 h-8 animate-pulse text-emerald-400" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight block leading-none">
                {dict.appName}
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-forest-800">
                ग्रामीण आरोग्य • AI Health Platform
              </span>
            </div>
          </Link>

          {/* Center Direct Navigation Portals (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href="/patient"
              className="px-3.5 py-2 rounded-2xl bg-emerald-50 border-2 border-emerald-300 hover:border-forest-700 text-forest-950 font-black text-sm flex items-center space-x-1.5 transition-all shadow-2xs"
            >
              <User className="w-4 h-4 text-forest-800" />
              <span>Patient Portal</span>
            </Link>

            <Link
              href="/health-worker"
              className="px-3.5 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 hover:border-forest-700 text-amber-950 font-black text-sm flex items-center space-x-1.5 transition-all shadow-2xs"
            >
              <Users className="w-4 h-4 text-amber-800" />
              <span>ASHA Worker</span>
            </Link>

            <Link
              href="/doctor"
              className="px-3.5 py-2 rounded-2xl bg-blue-50 border-2 border-blue-300 hover:border-forest-700 text-blue-950 font-black text-sm flex items-center space-x-1.5 transition-all shadow-2xs"
            >
              <Stethoscope className="w-4 h-4 text-blue-800" />
              <span>Doctor Portal</span>
            </Link>
          </div>

          {/* Right Actions: 108 Emergency Call & Language Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 108 Emergency Call Button */}
            <a
              href="tel:108"
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-red-600 border-2 border-red-700 text-white rounded-2xl text-xs sm:text-base font-black hover:bg-red-700 transition-all shadow-md shrink-0"
            >
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-white shrink-0" />
              <span>108 Emergency</span>
            </a>

            {/* Language Selector */}
            <div className="flex items-center space-x-1.5 bg-forest-50 border-2 border-forest-400 px-3 py-2 rounded-2xl shrink-0">
              <Globe className="w-4 h-4 text-forest-800 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-xs sm:text-base font-black text-slate-950 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="font-bold">English</option>
                <option value="hi" className="font-bold">हिंदी (Hindi)</option>
                <option value="mr" className="font-bold">मराठी (Marathi)</option>
                <option value="ta" className="font-bold">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Mobile / Collapsible Portal Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-2xl bg-sand-100 border-2 border-sand-300 text-slate-800 hover:bg-sand-200 transition-all lg:hidden"
              title="Toggle Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Collapsible Menu for Mobile View Direct Portal Access */}
        {isMenuOpen && (
          <div className="py-4 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 lg:hidden">
            <Link
              href="/patient"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 hover:border-forest-700 text-slate-900 font-black text-sm shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-forest-800" />
                <span>Patient Dashboard</span>
              </div>
              <span className="text-xs text-forest-800 font-mono font-bold">/patient →</span>
            </Link>

            <Link
              href="/health-worker"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 hover:border-forest-700 text-slate-900 font-black text-sm shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-amber-800" />
                <span>ASHA Health Worker</span>
              </div>
              <span className="text-xs text-amber-800 font-mono font-bold">/health-worker →</span>
            </Link>

            <Link
              href="/doctor"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50 border-2 border-blue-300 hover:border-forest-700 text-slate-900 font-black text-sm shadow-2xs"
            >
              <div className="flex items-center space-x-2">
                <Stethoscope className="w-5 h-5 text-blue-800" />
                <span>Doctor Telemedicine</span>
              </div>
              <span className="text-xs text-blue-800 font-mono font-bold">/doctor →</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
