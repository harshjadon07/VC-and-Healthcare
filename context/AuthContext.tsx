'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'PATIENT' | 'HEALTH_WORKER' | 'DOCTOR';

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  phone?: string;
  role: UserRole;
  photoURL?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signInWithGoogle: (selectedRole?: UserRole) => Promise<string>;
  signInWithMockPhone: (phone: string, role: UserRole) => Promise<string>;
  switchRole: (newRole: UserRole) => void;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for persisted session
    const savedUser = localStorage.getItem('seva_auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        setRole(parsed.role || 'PATIENT');
      } catch (err) {
        console.error('Failed to parse saved auth user:', err);
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = async (selectedRole: UserRole = role): Promise<string> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: selectedRole, method: 'GOOGLE' }),
      });
      const data = await res.json();
      
      const profile: UserProfile = {
        uid: data.user?.id || `usr-g-${Date.now()}`,
        name: data.user?.name || "Ramesh Patil",
        email: data.user?.email || "ramesh.patil@ruralhealth.org",
        phone: "+91 98223 45678",
        role: selectedRole,
      };

      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return data.redirectUrl || (selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient');
    } catch (err) {
      console.error("Google login error:", err);
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    }
  };

  const signInWithMockPhone = async (phone: string, selectedRole: UserRole): Promise<string> => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, role: selectedRole, method: 'PHONE' }),
      });
      const data = await res.json();

      const profile: UserProfile = {
        uid: data.user?.id || `usr-p-${Date.now()}`,
        name: data.user?.name || (selectedRole === 'HEALTH_WORKER' ? "ASHA Worker Sarita" : selectedRole === 'DOCTOR' ? "Dr. M. Kulkarni" : "Ramesh Patil"),
        phone: phone || "+91 98223 45678",
        role: selectedRole,
      };

      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return data.redirectUrl || (selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient');
    } catch (err) {
      console.error("Phone login error:", err);
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    }
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      localStorage.setItem('seva_auth_user', JSON.stringify(updated));
    }
  };

  const signOutUser = () => {
    setUser(null);
    localStorage.removeItem('seva_auth_user');
    document.cookie = 'seva_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        signInWithGoogle,
        signInWithMockPhone,
        switchRole,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
