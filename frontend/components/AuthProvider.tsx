'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
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
  // Initialize from localStorage immediately to prevent flash
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      return getStoredUser();
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAdminSubdomain = useIsAdminSubdomain();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  // On admin subdomain, all routes are admin routes (handled by admin layout)
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX) || isAdminSubdomain;
  const isProtectedRoute = !isAdminRoute && PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  const refreshUser = useCallback(async () => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    // Verify with server in background
    const verifiedUser = await verifySession();
    if (verifiedUser) {
      setUser(verifiedUser);
    } else if (!storedUser) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Listen for storage changes (login/logout from other tabs or same tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_data' || e.key === 'user_token') {
        refreshUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshUser]);

  // Also check auth when pathname changes (handles navigation after login)
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && !user) {
      setUser(storedUser);
    }
  }, [pathname, user]);

  const checkAuth = async () => {
    // Skip auth check for admin routes (handled by admin layout)
    if (isAdminRoute) {
      setLoading(false);
      return;
    }

    // Check for existing session
    if (isLoggedIn()) {
      // Get stored user immediately
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
      // Verify with server in background
      const verifiedUser = await verifySession();
      if (verifiedUser) {
        setUser(verifiedUser);
      }
    }

    setLoading(false);
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
