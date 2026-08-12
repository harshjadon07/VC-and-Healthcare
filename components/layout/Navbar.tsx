'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Globe, PhoneCall, User, Stethoscope, Users, LogOut, LogIn, ChevronDown } from 'lucide-react';
import { Language, dictionaries } from '@/lib/i18n/dictionary';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

interface NavbarProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentLang, onLanguageChange }) => {
  const pathname = usePathname();
  const { user, role, signOutUser, switchRole } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const dict = dictionaries[currentLang] || dictionaries.en;

  const navLinks = [
    { href: '/', label: dict.navHome, icon: HeartPulse },
    { href: '/patient', label: dict.navPatient, icon: User },
    { href: '/health-worker', label: dict.navHealthWorker, icon: Users },
    { href: '/doctor', label: dict.navDoctor, icon: Stethoscope },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-sm group-hover:bg-forest-900 transition-colors">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black text-forest-900 tracking-tight block leading-none">
                {dict.appName}
              </span>
              <span className="text-[11px] font-semibold text-forest-700 hidden sm:block">
                ग्रामीण आरोग्य AI
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-forest-800 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-forest-50 hover:text-forest-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Auth Status, Emergency & Language Selector */}
          <div className="flex items-center space-x-3">
            {/* 108 Helpline */}
            <a
              href="tel:108"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 border border-red-200 text-red-700 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 animate-bounce text-red-600" />
              <span>108 Helpline</span>
            </a>

            {/* Language Selector */}
            <div className="flex items-center space-x-1 bg-sand-100 border border-sand-200 px-2 py-1 rounded-lg">
              <Globe className="w-4 h-4 text-forest-800" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                aria-label="Select Language"
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Auth Profile / Login Button */}
            {user ? (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 p-1.5 rounded-lg text-xs">
                <div className="w-7 h-7 rounded-full bg-forest-800 text-white flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <span className="font-bold text-slate-900 block leading-tight truncate max-w-[100px]">{user.name}</span>
                  <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">{user.role}</span>
                </div>

                <button
                  onClick={signOutUser}
                  title="Sign Out"
                  className="p-1 text-slate-500 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-2 bg-forest-800 text-white rounded-lg text-xs font-bold hover:bg-forest-900 transition-colors shadow-xs"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-100">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center px-2 py-1 rounded text-xs font-bold ${
                  isActive ? 'text-forest-800' : 'text-slate-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] mt-0.5">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
