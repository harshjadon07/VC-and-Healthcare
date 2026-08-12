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
  signInWithGoogle: () => Promise<void>;
  signInWithMockPhone: (phone: string, role: UserRole) => Promise<void>;
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

  const signInWithGoogle = async () => {
    setLoading(true);
    // Standard Google authentication flow profile
    const mockUser: UserProfile = {
      uid: `usr-g-${Date.now()}`,
      name: "Ramesh Patil",
      email: "ramesh.patil@ruralhealth.org",
      phone: "+91 98223 45678",
      role: role,
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
    };

    setUser(mockUser);
    localStorage.setItem('seva_auth_user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const signInWithMockPhone = async (phone: string, selectedRole: UserRole) => {
    setLoading(true);
    const mockUser: UserProfile = {
      uid: `usr-p-${Date.now()}`,
      name: selectedRole === 'HEALTH_WORKER' ? "ASHA Worker Sarita" : selectedRole === 'DOCTOR' ? "Dr. M. Kulkarni" : "Ramesh Patil",
      phone: phone || "+91 98223 45678",
      role: selectedRole,
    };

    setUser(mockUser);
    setRole(selectedRole);
    localStorage.setItem('seva_auth_user', JSON.stringify(mockUser));
    setLoading(false);
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
