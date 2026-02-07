'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, checkAndRefreshToken } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Check token status and redirect to login if not authenticated
    router.replace('/login');
    return null; // Return null to prevent rendering
  }

  // Handle unauthorized access by checking token validity
  const handleUnauthorizedAccess = () => {
    // In a real app, this would redirect to login
    router.replace('/login');
  };

  return <>{children}</>;
};

export default ProtectedRoute;