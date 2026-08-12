import React from 'react';
import { ShieldCheck, PhoneCall, HeartPulse } from 'lucide-react';
import { Language, dictionaries } from '@/lib/i18n/dictionary';

interface FooterProps {
  currentLang: Language;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const dict = dictionaries[currentLang] || dictionaries.en;

  return (
    <footer className="bg-forest-900 text-white mt-12 border-t border-forest-800">
      {/* Emergency Hotline Bar */}
      <div className="bg-red-700 text-white py-3 px-4 text-center font-bold text-sm flex items-center justify-center space-x-2">
        <PhoneCall className="w-4 h-4 animate-bounce" />
        <span>{dict.emergencyBanner}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <HeartPulse className="w-6 h-6 text-emerald-400" />
              <span className="text-xl font-bold tracking-tight">{dict.appName}</span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              {dict.heroSubtitle}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
              Community Access
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>• ASHA Health Worker Portal</li>
              <li>• PHC Teleconsultation Queue</li>
              <li>• ABHA Digital Health Sync</li>
              <li>• Offline Emergency Protocol</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-3">
              Safety & Compliance
            </h4>
            <div className="flex items-start space-x-2 text-xs text-slate-300 bg-forest-800/60 p-3 rounded-lg border border-forest-700">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                SevaHealth AI operates under strict clinical safety rules. Emergency red-flag symptoms bypass routine queues and trigger immediate alerts.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-forest-800 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SevaHealth (ग्रामीण आरोग्य). Built for accessible rural healthcare empowerment.
        </div>
      </div>
    </footer>
  );
};
