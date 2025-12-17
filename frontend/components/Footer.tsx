'use client';

import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('common');
  const tFooter = useTranslations('footer');

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="text-lg font-semibold text-gray-900">Qoima AI Tools Navigator</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/use-cases" className="text-sm text-gray-600 hover:text-gray-900">
              {t('useCases')}
            </Link>
            <Link href="/tools" className="text-sm text-gray-600 hover:text-gray-900">
              {t('tools')}
            </Link>
            <Link href="/prompts" className="text-sm text-gray-600 hover:text-gray-900">
              {t('prompts')}
            </Link>
            <Link href="/news" className="text-sm text-gray-600 hover:text-gray-900">
              {t('news')}
            </Link>
            <Link href="/assistant" className="text-sm text-gray-600 hover:text-gray-900">
              {t('aiAssistant')}
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            {tFooter('tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
