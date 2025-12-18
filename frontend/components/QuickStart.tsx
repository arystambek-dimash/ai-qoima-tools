'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PenTool, BarChart3, Globe, Presentation, Cog, Image, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

const quickStartOptions = [
  {
    id: 'marketing',
    icon: PenTool,
    titleKey: 'marketingCopy',
    descKey: 'marketingCopyDesc',
    slug: 'write-marketing-copy',
    color: 'indigo',
  },
  {
    id: 'data',
    icon: BarChart3,
    titleKey: 'dataAnalysis',
    descKey: 'dataAnalysisDesc',
    slug: 'analyze-business-data',
    color: 'emerald',
  },
  {
    id: 'website',
    icon: Globe,
    titleKey: 'buildWebsite',
    descKey: 'buildWebsiteDesc',
    slug: 'build-website',
    color: 'blue',
  },
  {
    id: 'presentations',
    icon: Presentation,
    titleKey: 'presentations',
    descKey: 'presentationsDesc',
    slug: 'create-presentations',
    color: 'amber',
  },
  {
    id: 'automation',
    icon: Cog,
    titleKey: 'automation',
    descKey: 'automationDesc',
    slug: 'automate-workflows',
    color: 'purple',
  },
  {
    id: 'images',
    icon: Image,
    titleKey: 'images',
    descKey: 'imagesDesc',
    slug: 'generate-images',
    color: 'pink',
  },
];

const colorClasses = {
  indigo: {
    bg: 'bg-indigo-50',
    hover: 'hover:bg-indigo-100',
    icon: 'text-indigo-600',
    ring: 'ring-indigo-200',
  },
  emerald: {
    bg: 'bg-emerald-50',
    hover: 'hover:bg-emerald-100',
    icon: 'text-emerald-600',
    ring: 'ring-emerald-200',
  },
  blue: {
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    icon: 'text-blue-600',
    ring: 'ring-blue-200',
  },
  amber: {
    bg: 'bg-amber-50',
    hover: 'hover:bg-amber-100',
    icon: 'text-amber-600',
    ring: 'ring-amber-200',
  },
  purple: {
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-100',
    icon: 'text-purple-600',
    ring: 'ring-purple-200',
  },
  pink: {
    bg: 'bg-pink-50',
    hover: 'hover:bg-pink-100',
    icon: 'text-pink-600',
    ring: 'ring-pink-200',
  },
};

export default function QuickStart() {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const t = useTranslations('quickStart');

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 mb-4">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            {t('badge')}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-gray-500">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickStartOptions.map((option) => {
            const colors = colorClasses[option.color as keyof typeof colorClasses];
            return (
              <Link
                key={option.id}
                href={`/use-cases/${option.slug}`}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`group relative flex items-center gap-4 rounded-2xl p-5 transition-all duration-200 ring-1 ring-inset ${colors.ring} ${colors.bg} ${colors.hover}`}
              >
                <div className={`rounded-xl bg-white p-3 shadow-sm transition-transform group-hover:scale-105`}>
                  <option.icon className={`h-6 w-6 ${colors.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-900">
                    {t(option.titleKey)}
                  </h3>
                  <p className="text-sm text-gray-500">{t(option.descKey)}</p>
                </div>
                <ArrowRight className={`h-5 w-5 text-gray-300 transition-all group-hover:translate-x-1 group-hover:${colors.icon}`} />
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/use-cases"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            {t('viewAllUseCases')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
