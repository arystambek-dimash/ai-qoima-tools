'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, verifySession, logout as authLogout, isLoggedIn, getStoredUser } from '@/lib/auth';
import { useIsAdminSubdomain } from '@/lib/hooks';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
  refreshUser: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// Public routes that don't require authentication (landing page + login)
const PUBLIC_ROUTES = ['/', '/login'];

// Admin routes handled separately by admin layout
const ADMIN_PREFIX = '/admin';

// Protected routes that require authentication
const PROTECTED_PREFIXES = ['/tools', '/prompts', '/use-cases', '/news', '/assistant'];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAdminSubdomain = useIsAdminSubdomain();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  // On admin subdomain, all routes are admin routes (handled by admin layout)
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX) || isAdminSubdomain;
  const isProtectedRoute = !isAdminRoute && PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Skip auth check for admin routes (handled by admin layout)
    if (isAdminRoute) {
      setLoading(false);
      return;
    }

    // Check for existing session
    if (isLoggedIn()) {
      // Try to verify with server
      const verifiedUser = await verifySession();
      if (verifiedUser) {
        setUser(verifiedUser);
      } else {
        // Session invalid, check if we have stored user data
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }
      }
    }

    setLoading(false);
  };

  const refreshUser = async () => {
    const verifiedUser = await verifySession();
    setUser(verifiedUser);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    router.push('/');
  };

  // Effect to redirect unauthenticated users from protected routes
  useEffect(() => {
    if (!loading && isProtectedRoute && !user) {
      router.push('/login');
    }
  }, [loading, user, isProtectedRoute, router]);

  // Show loading state only for protected routes
  if (loading && isProtectedRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated and on protected route, show loading (will redirect)
  if (!user && isProtectedRoute && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
