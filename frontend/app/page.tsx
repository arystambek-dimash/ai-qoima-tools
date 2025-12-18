import Link from 'next/link';
import { ArrowRight, Sparkles, Target, Wrench, FileText, Bot } from 'lucide-react';
import UseCaseCard from '@/components/UseCaseCard';
import NewsletterForm from '@/components/NewsletterForm';
import QuickStart from '@/components/QuickStart';
import { getUseCases } from '@/lib/api';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const locale = await getLocale();
  const { data: useCases } = await getUseCases(locale);
  const t = await getTranslations('home');
  const tCommon = await getTranslations('common');

  const steps = [
    { icon: Target, titleKey: 'step1Title', descKey: 'step1Desc', step: '01' },
    { icon: Wrench, titleKey: 'step2Title', descKey: 'step2Desc', step: '02' },
    { icon: FileText, titleKey: 'step3Title', descKey: 'step3Desc', step: '03' },
    { icon: Bot, titleKey: 'step4Title', descKey: 'step4Desc', step: '04' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              <Sparkles className="h-4 w-4" />
              {t('badge')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
              {t('title')}{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('titleHighlight')}</span>
              <br />
              {t('titleEnd')}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
              {t('subtitle')}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="flex flex-col items-center">
                <Link
                  href="/use-cases"
                  className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                  {t('startWithUseCase')}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="mt-2 text-sm text-gray-400">{t('takes30Seconds')}</span>
              </div>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
              >
                {t('browseAllTools')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <QuickStart />

      {/* How It Works */}
      <section className="border-t border-gray-200 bg-gray-50/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('howItWorks')}
            </h2>
            <p className="mt-3 text-gray-500">{t('howItWorksSubtitle')}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((item, i) => (
              <div key={i} className="relative text-center group">
                {/* Step number */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-indigo-600/40">
                  {item.step}
                </div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all group-hover:shadow-md group-hover:ring-indigo-100">
                  <item.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="mt-5 font-semibold text-gray-900">{t(item.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-500">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                {t('popularUseCases')}
              </h2>
              <p className="mt-2 text-gray-500">
                {t('startWithGoal')}
              </p>
            </div>
            <Link
              href="/use-cases"
              className="hidden items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors sm:flex group"
            >
              {tCommon('viewAll')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.slice(0, 6).map((useCase) => (
              <UseCaseCard key={useCase.id} useCase={useCase} />
            ))}
          </div>
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-6 py-3 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
            >
              {t('viewAllUseCases')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 sm:p-12">
            <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Sparkles className="h-6 w-6 text-white" />
                  <span className="text-sm font-medium text-indigo-100">{t('aiPowered')}</span>
                </div>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  {t('notSureWhereToStart')}
                </h2>
                <p className="mt-2 text-indigo-100">
                  {t('askAiAssistant')}
                </p>
              </div>
              <Link
                href="/assistant"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-indigo-600 transition hover:bg-indigo-50"
              >
                <Bot className="h-5 w-5" />
                {t('chatWithAssistant')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
