'use client';

import { useRouter } from 'next/navigation';
import { ExternalLink, Star, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Tool } from '@/lib/api';
import ToolIcon from './ToolIcon';

interface ToolCardProps {
  tool: Tool;
  whyThisTool?: string | null;
}

export default function ToolCard({ tool, whyThisTool }: ToolCardProps) {
  const router = useRouter();
  const t = useTranslations('tools');
  const tUseCases = useTranslations('useCases');

  const handleCardClick = () => {
    router.push(`/tools/${tool.slug}`);
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className="group relative flex min-h-[240px] flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <ToolIcon slug={tool.slug} name={tool.name} size="lg" className="flex-shrink-0" />

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {tool.name}
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {tool.badges?.popular && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                {t('popular')}
              </span>
            )}
            {tool.badges?.free_tier && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles className="h-3 w-3" />
                {t('freeTier')}
              </span>
            )}
          </div>
        </div>

        {tool.external_url && (
          <a
            href={tool.external_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${tool.name} website`}
            onClick={handleExternalClick}
            className="ml-auto rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-indigo-600"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        )}
      </div>

      <p className="mt-4 flex-1 text-sm text-gray-500 line-clamp-2">{tool.short_description}</p>

      {whyThisTool && (
        <div className="mt-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3 ring-1 ring-inset ring-indigo-100">
          <p className="text-sm text-indigo-700 line-clamp-2">
            <span className="font-semibold">{tUseCases('whyThisTool')}:</span> {whyThisTool}
          </p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.categories.slice(0, 3).map((category) => (
          <span
            key={category}
            className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-200"
          >
            {category}
          </span>
        ))}
        {tool.categories.length > 3 && (
          <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-400">
            +{tool.categories.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}
