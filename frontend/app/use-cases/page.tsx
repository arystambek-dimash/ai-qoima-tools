import { Target } from 'lucide-react';
import UseCaseCard from '@/components/UseCaseCard';
import { getUseCases } from '@/lib/api';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function UseCasesPage() {
  const locale = await getLocale();
  const { data: useCases } = await getUseCases(locale);
  const t = await getTranslations('useCases');

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-indigo-100 p-2.5">
            <Target className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('title')}</h1>
        </div>
        <p className="mt-2 text-lg text-gray-500">
          {t('subtitle')}
        </p>
        <div className="mt-4 text-sm text-gray-400">
          {t('useCasesCount', { count: useCases.length })}
        </div>
      </div>

      {/* Use Cases Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {useCases.map((useCase) => (
          <UseCaseCard key={useCase.id} useCase={useCase} />
        ))}
      </div>

      {useCases.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Target className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t('noUseCases')}</h3>
          <p className="mt-1 text-gray-500">{t('checkBackLater')}</p>
        </div>
      )}
    </div>
  );
}
