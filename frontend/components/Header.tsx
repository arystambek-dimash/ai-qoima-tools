'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Sparkles, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from './AuthProvider';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('common');
  const { user, logout } = useAuth();

  const isLandingPage = pathname === '/';

  // Navigation links for authenticated users
  const navLinks = [
    { href: '/use-cases', label: t('useCases') },
    { href: '/tools', label: t('tools') },
    { href: '/prompts', label: t('prompts') },
    { href: '/news', label: t('news') },
    { href: '/assistant', label: t('aiAssistant') },
  ];

  // Landing page header (simple with login button)
  if (isLandingPage && !user) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Qoima AI - Home"
          >
            <Sparkles className="h-8 w-8 text-indigo-600" aria-hidden="true" />
            <span className="text-xl font-bold text-gray-900">Qoima AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </div>
        </nav>
      </header>
    );
  }

  // Full header for authenticated users
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Qoima AI - Home"
        >
          <Sparkles className="h-8 w-8 text-indigo-600" aria-hidden="true" />
          <span className="text-xl font-bold text-gray-900">Qoima AI</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:gap-1" role="menubar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
                pathname === link.href || pathname.startsWith(link.href + '/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-2 border-l border-gray-200 pl-2 flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <UserIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700 max-w-[120px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu button and language switcher */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-200 bg-white px-4 py-2"
          role="menu"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              role="menuitem"
              aria-current={pathname === link.href ? 'page' : undefined}
              className={cn(
                'block rounded-lg px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
                pathname === link.href
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-200 mt-2 pt-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-600">
                  <UserIcon className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
