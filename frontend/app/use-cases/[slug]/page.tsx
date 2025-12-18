import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Users, Clock, FileText, Sparkles } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { getUseCaseBySlug, getUseCaseWithTools, getPrompts } from '@/lib/api';
import ExpandableSection from '@/components/ExpandableSection';
import ExpandablePrompts from '@/components/ExpandablePrompts';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function UseCaseDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('useCases');
  const tPrompts = await getTranslations('prompts');

  try {
    const { data: useCase } = await getUseCaseBySlug(slug, locale);
    const { data: useCaseWithTools } = await getUseCaseWithTools(useCase.id, locale);
    const { data: prompts } = await getPrompts({ use_case_id: useCase.id, locale });

    const initialToolsCount = 3;

    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/use-cases"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToUseCases')}
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
            {useCase.title}
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-3xl">{useCase.summary}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            {useCase.audience && (
              <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{t('audience')}: {useCase.audience}</span>
              </div>
            )}
            {useCaseWithTools.tools.length > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm text-indigo-700">
                <Sparkles className="h-4 w-4" />
                <span>{t('toolsCount', { count: useCaseWithTools.tools.length })}</span>
              </div>
            )}
          </div>
        </div>

        {/* When to use */}
        {useCase.when_to_use && (
          <div className="mb-12 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6 ring-1 ring-inset ring-indigo-100">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-white p-2.5 shadow-sm">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{t('whenToUse')}</h2>
                <p className="mt-1 text-gray-700">{useCase.when_to_use}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recommended Tools */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              {t('recommendedTools')}
            </h2>
            {useCaseWithTools.tools.length > 0 && (
              <span className="text-sm text-gray-500">
                {t('toolsCount', { count: useCaseWithTools.tools.length })}
              </span>
            )}
          </div>

          {useCaseWithTools.tools.length > 0 ? (
            <ExpandableSection
              initialCount={initialToolsCount}
              totalCount={useCaseWithTools.tools.length}
              itemLabel="tools"
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {useCaseWithTools.tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    whyThisTool={tool.why_this_tool}
                  />
                ))}
              </div>
            </ExpandableSection>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <p className="text-gray-500">{t('noToolsForUseCase')}</p>
            </div>
          )}
        </section>

        {/* Prompts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-indigo-100 p-2">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t('readyToUsePrompts')}</h2>
          </div>

          {prompts.length > 0 ? (
            <ExpandablePrompts prompts={prompts} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <p className="text-gray-500">{tPrompts('noPrompts')}</p>
            </div>
          )}
        </section>
      </div>
    );
  } catch {
    notFound();
  }
}
