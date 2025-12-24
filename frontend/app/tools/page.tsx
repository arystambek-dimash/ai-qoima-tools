import { Suspense } from 'react';
import { Wrench } from 'lucide-react';
import { getTools, getToolCategories } from '@/lib/api';
import { getTranslations, getLocale } from 'next-intl/server';
import ToolsClient from './ToolsClient';

// Force dynamic rendering for translations
export const dynamic = 'force-dynamic';

// Loading skeleton component
function ToolsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="flex gap-2 mt-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function ToolsPage() {
  const locale = await getLocale();
  const t = await getTranslations('tools');

  // Fetch initial data on server
  const [toolsResponse, categoriesResponse] = await Promise.all([
    getTools({ locale }),
    getToolCategories(),
  ]);

  const initialTools = toolsResponse.data;
  const categories = categoriesResponse.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-indigo-100 p-2.5">
            <Wrench className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('title')}</h1>
        </div>
        <p className="mt-2 text-lg text-gray-500">
          {t('subtitle')}
        </p>
      </div>

      <Suspense fallback={<ToolsSkeleton />}>
        <ToolsClient
          initialTools={initialTools}
          categories={categories}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
