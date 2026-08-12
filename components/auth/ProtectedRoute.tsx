'use client';

import React from 'react';
import { UserRole } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

// All pages are directly accessible without login restrictions
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};
