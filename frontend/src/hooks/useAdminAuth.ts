'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const userStr = localStorage.getItem('adminUser');

      if (!token || !userStr) {
        redirectToLogin();
        return;
      }

      const user = JSON.parse(userStr);
      
      // Verify token with backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      
      // Check if user is still admin
      if (data.user.role !== 'admin') {
        throw new Error('Admin privileges required');
      }

      setAdminUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToLogin = () => {
    setIsAuthenticated(false);
    setIsLoading(false);
    router.push('/admin/login');
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAuthenticated(false);
    setAdminUser(null);
    router.push('/admin/login');
  };

  return {
    isAuthenticated,
    isLoading,
    adminUser,
    logout,
    checkAuthStatus
  };
} 