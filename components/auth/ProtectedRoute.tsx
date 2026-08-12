'use client';

import React, { useState } from 'react';
import { ShieldAlert, Lock, UserCheck, HeartPulse, RefreshCw } from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { AuthModal } from './AuthModal';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-3">
        <RefreshCw className="w-8 h-8 text-forest-800 animate-spin" />
        <p className="text-xs font-bold text-slate-600">Verifying SevaHealth Authentication Token...</p>
      </div>
    );
  }

  // Not logged in or role mismatch
  if (!user || user.role !== allowedRole) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4">
        <div className="bg-white rounded-2xl border-2 border-forest-200 p-8 text-center shadow-md space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-900 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-mono text-forest-800 font-bold uppercase tracking-widest block mb-1">
              [ Login Required ]
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Access Restricted: {allowedRole} Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-2 max-w-md mx-auto leading-relaxed">
              To view confidential patient records, queue stats, or doctor panels, please log in with your verified credentials.
            </p>
          </div>

          <div className="pt-2 flex justify-center space-x-3">
            <Button variant="outline" size="md" onClick={() => (window.location.href = '/')}>
              Return to Home Page
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
              <UserCheck className="w-4 h-4 mr-2" />
              <span>Login / Register Now</span>
            </Button>
          </div>

          <AuthModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            defaultRole={allowedRole}
          />
        </div>
      </div>
    );
  }

  // Authorized
  return <>{children}</>;
};
