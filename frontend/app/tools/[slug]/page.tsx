import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Star, Sparkles, FileText, AlertCircle } from 'lucide-react';
import { getToolBySlug, getPrompts } from '@/lib/api';
import ToolIcon from '@/components/ToolIcon';
import ToolPrompts from './ToolPrompts';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations('tools');
  const tPrompts = await getTranslations('prompts');

  try {
    const { data: tool } = await getToolBySlug(slug, locale);
    const { data: prompts } = await getPrompts({ tool_id: tool.id, locale });

    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToTools')}
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start gap-6">
            <ToolIcon slug={tool.slug} name={tool.name} size="xl" className="flex-shrink-0" />

            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  {tool.name}
                </h1>
                {tool.external_url && (
                  <a
                    href={tool.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    {t('visitWebsite')}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {tool.badges?.popular && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    {t('popular')}
                  </span>
                )}
                {tool.badges?.free_tier && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    <Sparkles className="h-4 w-4" />
                    {t('freeTier')}
                  </span>
                )}
              </div>

              <p className="mt-4 text-lg text-gray-600">{tool.short_description}</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">{t('categories')}</h2>
          <div className="flex flex-wrap gap-2">
            {tool.categories.map((category) => (
              <span
                key={category}
                className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Long description */}
        {tool.long_description && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('aboutTool', { name: tool.name })}</h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{tool.long_description}</p>
            </div>
          </div>
        )}

        {/* Limitations */}
        {tool.limitations && (
          <div className="mb-10 rounded-xl bg-amber-50 p-6 ring-1 ring-inset ring-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-800">{t('limitations')}</h3>
                <p className="mt-1 text-amber-700">{tool.limitations}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prompts Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-indigo-100 p-2">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                {t('promptsForTool', { name: tool.name })}
              </h2>
              <p className="text-gray-500 text-sm mt-0.5">
                {t('readyToUsePrompts')}
              </p>
            </div>
          </div>

          {prompts.length > 0 ? (
            <ToolPrompts prompts={prompts} toolName={tool.name} />
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">{t('noPromptsYet')}</h3>
              <p className="mt-2 text-gray-500">
                {t('workingOnPrompts', { name: tool.name })}
              </p>
              <Link
                href="/prompts"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {tPrompts('browseAllPrompts')}
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
