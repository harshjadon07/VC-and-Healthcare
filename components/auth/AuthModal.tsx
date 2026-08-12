'use client';

import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  redirectPath?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'PATIENT',
  redirectPath,
}) => {
  const { signInWithGoogle, signInWithMockPhone } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [authMethod, setAuthMethod] = useState<'GOOGLE' | 'PHONE'>('GOOGLE');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
    onClose();
    if (redirectPath) window.location.href = redirectPath;
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456' && otpCode.length < 4) return;
    setIsSubmitting(true);
    await signInWithMockPhone(phone, selectedRole);
    setIsSubmitting(false);
    onClose();
    if (redirectPath) window.location.href = redirectPath;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Access SevaHealth Portal">
      <div className="space-y-5">
        {/* Role Picker */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            1. Select Your Clinical Role
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'PATIENT', label: 'Patient' },
              { id: 'HEALTH_WORKER', label: 'ASHA Worker' },
              { id: 'DOCTOR', label: 'Tele-Doctor' },
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id as UserRole)}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                  selectedRole === role.id
                    ? 'bg-forest-800 text-white border-forest-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {role.label}
              </button>
            ))}
          </div>
        </div>

        {/* Method Toggle: Google vs Phone OTP */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            2. Choose Sign-In Method
          </label>
          <div className="flex border border-slate-300 rounded-lg p-1 bg-slate-100">
            <button
              type="button"
              onClick={() => setAuthMethod('GOOGLE')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                authMethod === 'GOOGLE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Google Account
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('PHONE')}
              className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${
                authMethod === 'PHONE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Phone OTP (108/Rural)
            </button>
          </div>
        </div>

        {/* Method 1: Google Sign In */}
        {authMethod === 'GOOGLE' && (
          <div className="space-y-3 pt-2">
            <Button
              variant="outline"
              size="lg"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full text-slate-900 border-slate-300 hover:bg-slate-100 py-3 font-bold"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Sign in with Google
            </Button>
          </div>
        )}

        {/* Method 2: Phone Number OTP Verification */}
        {authMethod === 'PHONE' && (
          <div className="pt-2 space-y-3">
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 text-xs font-bold bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-600">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98223 45678"
                      className="flex-1 text-xs font-bold p-2.5 bg-white border border-slate-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full">
                  Send OTP SMS Code →
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-forest-900">OTP Sent to +91 {phone}</span>
                  <button type="button" onClick={() => setOtpSent(false)} className="text-forest-700 underline font-bold">
                    Edit Phone
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Enter 6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 123456"
                    className="w-full text-center text-lg font-mono font-black tracking-widest p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-700"
                  />
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Demo OTP code: <code className="font-bold text-forest-800">123456</code>
                  </span>
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full">
                  Verify & Sign In →
                </Button>
              </form>
            )}
          </div>
        )}

        <div className="text-[11px] text-slate-500 text-center font-medium border-t border-slate-100 pt-3">
          🔒 Secure authentication governed by ABHA & SevaHealth Safety Guidelines.
        </div>
      </div>
    </Modal>
  );
};
