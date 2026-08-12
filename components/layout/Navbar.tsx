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
                ग्रामीण आरोग्य • AI Health
              </span>
            </div>
          </Link>

          {/* Right Actions: Emergency 108, Language Switcher, Future Menu */}
          <div className="flex items-center space-x-3">
            {/* 108 Emergency Call Button */}
            <a
              href="tel:108"
              className="flex items-center space-x-2 px-4 py-2.5 bg-red-600 border-2 border-red-700 text-white rounded-2xl text-sm sm:text-base font-black hover:bg-red-700 transition-all shadow-md active:scale-95 animate-pulse shrink-0"
            >
              <PhoneCall className="w-5 h-5 text-white shrink-0" />
              <span>108 Emergency</span>
            </a>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 bg-forest-50 border-2 border-forest-400 px-3.5 py-2 rounded-2xl shrink-0">
              <Globe className="w-5 h-5 text-forest-800 shrink-0" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-sm sm:text-base font-black text-slate-900 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en" className="font-bold">English</option>
                <option value="hi" className="font-bold">हिंदी (Hindi)</option>
                <option value="mr" className="font-bold">मराठी (Marathi)</option>
                <option value="ta" className="font-bold">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Hidden / Future Portals Dropdown Trigger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-2xl bg-sand-100 border-2 border-sand-300 text-slate-800 hover:bg-sand-200 transition-all"
              title="More Portals (Future Use)"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Collapsible Menu for Future Portal Access */}
        {isMenuOpen && (
          <div className="py-4 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/patient"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-2xl bg-sand-50 border-2 border-sand-200 hover:border-forest-700 text-slate-900 font-extrabold text-sm"
            >
              <User className="w-5 h-5 text-forest-800" />
              <span>Patient Dashboard</span>
            </Link>

            <Link
              href="/health-worker"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-2xl bg-sand-50 border-2 border-sand-200 hover:border-forest-700 text-slate-900 font-extrabold text-sm"
            >
              <Users className="w-5 h-5 text-forest-800" />
              <span>ASHA Health Worker</span>
            </Link>

            <Link
              href="/doctor"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center space-x-3 p-3 rounded-2xl bg-sand-50 border-2 border-sand-200 hover:border-forest-700 text-slate-900 font-extrabold text-sm"
            >
              <Stethoscope className="w-5 h-5 text-forest-800" />
              <span>Doctor Portal</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
