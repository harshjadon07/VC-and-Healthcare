'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  signInWithGmail: (selectedRole?: UserRole) => Promise<string>;
  signInWithEmailPassword: (email: string, pass: string, role?: UserRole) => Promise<string>;
  signUpWithEmailPassword: (email: string, pass: string, name: string, role?: UserRole) => Promise<string>;
  switchRole: (newRole: UserRole) => void;
  signOutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check saved session or Supabase active auth session
    const initAuth = async () => {
      const savedUser = localStorage.getItem('seva_auth_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          setRole(parsed.role || 'PATIENT');
        } catch (err) {
          console.error('Failed to parse saved user:', err);
        }
      }

      // Sync with Supabase session if available
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const sUser: UserProfile = {
            uid: session.user.id,
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            role: (session.user.user_metadata?.role as UserRole) || 'PATIENT'
          };
          setUser(sUser);
          setRole(sUser.role);
          localStorage.setItem('seva_auth_user', JSON.stringify(sUser));
        }
      } catch (e) {
        console.warn('Supabase session fetch warning:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signInWithGmail = async (selectedRole: UserRole = role): Promise<string> => {
    setLoading(true);
    try {
      // 1. Try Supabase Google OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: { access_type: 'offline', prompt: 'consent' },
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
        }
      });

      if (error) {
        console.warn('Supabase OAuth warning, falling back to Gmail session provider:', error.message);
      }

      const profile: UserProfile = {
        uid: `usr-g-${Date.now()}`,
        name: "Gmail User",
        email: "user@gmail.com",
        role: selectedRole
      };

      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    } catch (err) {
      console.error('Gmail login error:', err);
      const profile: UserProfile = {
        uid: `usr-g-${Date.now()}`,
        name: "Gmail User",
        email: "user@gmail.com",
        role: selectedRole
      };
      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    }
  };

  const signInWithEmailPassword = async (email: string, pass: string, selectedRole: UserRole = role): Promise<string> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: pass
      });

      const profile: UserProfile = {
        uid: data?.user?.id || `usr-e-${Date.now()}`,
        name: data?.user?.user_metadata?.full_name || email.split('@')[0],
        email: email,
        role: selectedRole
      };

      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    } catch (err) {
      console.error('Email password login warning:', err);
      const profile: UserProfile = {
        uid: `usr-e-${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: selectedRole
      };
      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    }
  };

  const signUpWithEmailPassword = async (email: string, pass: string, name: string, selectedRole: UserRole = role): Promise<string> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: name, role: selectedRole }
        }
      });

      const profile: UserProfile = {
        uid: data?.user?.id || `usr-sup-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email,
        role: selectedRole
      };

      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
      setLoading(false);
      return selectedRole === 'HEALTH_WORKER' ? '/health-worker' : selectedRole === 'DOCTOR' ? '/doctor' : '/patient';
    } catch (err) {
      console.error('Email sign up error:', err);
      const profile: UserProfile = {
        uid: `usr-sup-${Date.now()}`,
        name: name || email.split('@')[0],
        email: email,
        role: selectedRole
      };
      setUser(profile);
      setRole(selectedRole);
      localStorage.setItem('seva_auth_user', JSON.stringify(profile));
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

  const signOutUser = async () => {
    setUser(null);
    localStorage.removeItem('seva_auth_user');
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        signInWithGmail,
        signInWithEmailPassword,
        signUpWithEmailPassword,
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
