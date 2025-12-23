'use client';

import { useState, useEffect } from 'react';

// Hook to detect if we're on admin subdomain
export function useIsAdminSubdomain() {
  const [isAdminSubdomain, setIsAdminSubdomain] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      setIsAdminSubdomain(hostname.startsWith('admin.'));
    }
  }, []);
  
  return isAdminSubdomain;
}

// Hook to get admin-aware path
export function useAdminPath() {
  const isAdminSubdomain = useIsAdminSubdomain();
  
  const getPath = (path: string) => {
    if (isAdminSubdomain) {
      // On admin subdomain: /admin/tools -> /tools
      return path.replace('/admin', '') || '/';
    }
    return path;
  };
  
  return { getPath, isAdminSubdomain };
}

// Hook to get the main site URL
export function useMainSiteUrl() {
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

// Helper to get admin path (for use in components)
export function getAdminPathHelper(isAdminSubdomain: boolean, path: string): string {
  if (isAdminSubdomain) {
    return path.replace('/admin', '') || '/';
  }
  return path;
}
