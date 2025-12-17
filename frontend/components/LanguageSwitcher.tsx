'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
] as const;

type LocaleCode = (typeof locales)[number]['code'];

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<LocaleCode>('en');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale from cookie on mount
  useEffect(() => {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('NEXT_LOCALE='));
    if (cookie) {
      const locale = cookie.split('=')[1] as LocaleCode;
      if (locales.some(l => l.code === locale)) {
        setCurrentLocale(locale);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (locale: LocaleCode) => {
    // Set cookie for 1 year
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=31536000`;
    setCurrentLocale(locale);
    setIsOpen(false);
    // Reload to apply new locale
    window.location.reload();
  };

  const currentLocaleData = locales.find(l => l.code === currentLocale) || locales[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLocaleData.flag}</span>
        <span className="hidden md:inline">{currentLocaleData.name}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 z-50 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          role="listbox"
          aria-label="Available languages"
        >
          {locales.map((locale) => (
            <button
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                currentLocale === locale.code
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              role="option"
              aria-selected={currentLocale === locale.code}
            >
              <span className="text-base">{locale.flag}</span>
              <span className="flex-1 text-left">{locale.name}</span>
              {currentLocale === locale.code && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
