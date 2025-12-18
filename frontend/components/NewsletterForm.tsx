'use client';

import { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { subscribe } from '@/lib/api';
import { useTranslations } from 'next-intl';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await subscribe(email);
      setStatus('success');
      setMessage(response.data.message);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe');
    }
  };

  return (
    <div className="rounded-2xl bg-indigo-600 px-6 py-10 sm:px-12 sm:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Mail className="mx-auto h-12 w-12 text-indigo-200" />
        <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          {t('newsletterTitle')}
        </h2>
        <p className="mt-2 text-indigo-100">
          {t('newsletterSubtitle')}
        </p>

        {status === 'success' ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-white">
            <CheckCircle className="h-5 w-5" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={tCommon('enterEmail')}
                className="w-full rounded-lg border-0 px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white sm:w-72"
                required
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  tCommon('subscribe')
                )}
              </button>
            </div>
            {status === 'error' && (
              <p className="mt-2 text-sm text-red-200">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
