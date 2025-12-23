'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { useIsAdminSubdomain } from '@/lib/hooks';

interface LayoutWrapperProps {
  children: ReactNode;
}

// Routes that should not show Header/Footer
const MINIMAL_ROUTES = ['/login'];
const ADMIN_PREFIX = '/admin';

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminSubdomain = useIsAdminSubdomain();
  
  const isMinimalRoute = MINIMAL_ROUTES.includes(pathname);
  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX) || isAdminSubdomain;
  const showHeaderFooter = !isMinimalRoute && !isAdminRoute;

  return (
    <AuthProvider>
      {showHeaderFooter && <Header />}
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      {showHeaderFooter && <Footer />}
    </AuthProvider>
  );
}
