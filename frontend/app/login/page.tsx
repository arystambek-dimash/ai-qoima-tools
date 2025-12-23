'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, Building2, CheckCircle, XCircle } from 'lucide-react';
import { validateEmail, loginWithEmail, isLoggedIn, getStoredUser } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'validating' | 'success' | 'error'>('email');
  const [error, setError] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if already logged in
    if (isLoggedIn()) {
      const user = getStoredUser();
      if (user) {
        router.push('/');
        return;
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setStep('validating');

    try {
      // First validate the email domain
      const validation = await validateEmail(email);

      if (!validation.allowed) {
        setStep('error');
        setError(validation.message || 'Your email domain is not authorized');
        setLoading(false);
        return;
      }

      // If allowed, proceed with login
      const result = await loginWithEmail(email);

      if (result.success && result.user) {
        setCompanyName(result.user.company?.name || '');
        setStep('success');
        // Redirect after short delay
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setStep('error');
        setError(result.error?.message || 'Login failed');
      }
    } catch (err) {
      setStep('error');
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTryAgain = () => {
    setStep('email');
    setError('');
    setEmail('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Qoima AI Tools
            </h1>
            <p className="mt-2 text-gray-600">
              Sign in with your company email
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Work Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {step === 'validating' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your email...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Welcome!
              </h2>
              {companyName && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  <Building2 className="h-4 w-4" />
                  {companyName}
                </div>
              )}
              <p className="mt-4 text-gray-600">
                Redirecting you to the platform...
              </p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">
                Access Denied
              </h2>
              <p className="mt-2 text-gray-600">
                {error}
              </p>
              <button
                onClick={handleTryAgain}
                className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500">
              Only employees from authorized companies can access this platform.
              Contact your administrator for access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
