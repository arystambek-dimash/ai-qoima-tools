'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect if we're on the admin subdomain
 * Centralized to avoid duplication across components
 */
export function useIsAdminSubdomain(): boolean {
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsAdminSubdomain(hostname.startsWith('admin.'));
    }
  }, []);
  
  return isAdminSubdomain;
}

/**
 * Hook to get the main site URL (for navigation from admin subdomain)
 */
export function useMainSiteUrl(): string {
  const [mainSiteUrl, setMainSiteUrl] = useState('/');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port;
      const protocol = window.location.protocol;
      
      if (hostname.startsWith('admin.')) {
        // Remove 'admin.' prefix to get main domain
        const mainDomain = hostname.replace('admin.', '');
        setMainSiteUrl(`${protocol}//${mainDomain}${port ? `:${port}` : ''}`);
      } else {
        setMainSiteUrl('/');
      }
    }
  }, []);
  
  return mainSiteUrl;
}

/**
 * Hook to get admin-aware link path
 * On admin subdomain: /admin/tools -> /tools
 * On main domain: /admin/tools -> /admin/tools
 */
export function useAdminPath(path: string): string {
  const isAdminSubdomain = useIsAdminSubdomain();
  
  if (isAdminSubdomain) {
    return path.replace('/admin', '') || '/';
  }
  return path;
}

/**
 * Hook to check if a path is active (for navigation highlighting)
 */
export function useIsPathActive(href: string, pathname: string): boolean {
  const isAdminSubdomain = useIsAdminSubdomain();
  const normalizedPath = isAdminSubdomain ? `/admin${pathname}` : pathname;
  return normalizedPath === href || (href !== '/admin' && normalizedPath.startsWith(href));
}

/**
 * Hook for debounced value (useful for search inputs)
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook to detect if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to track window size
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
