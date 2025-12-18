'use client';

import Link from 'next/link';
import { ArrowRight, Users } from 'lucide-react';
import type { UseCase } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface UseCaseCardProps {
  useCase: UseCase;
}

export default function UseCaseCard({ useCase }: UseCaseCardProps) {
  const tCommon = useTranslations('common');

  return (
    <Link
      href={`/use-cases/${useCase.slug}`}
      className="group flex min-h-[200px] flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50"
    >
      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
        {useCase.title}
      </h3>
      <p className="mt-2 flex-1 text-sm text-gray-500 line-clamp-2">
        {useCase.summary}
      </p>
      {useCase.audience && (
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <Users className="h-4 w-4" />
          <span className="line-clamp-1">{useCase.audience}</span>
        </div>
      )}
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
        {tCommon('exploreTools')}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
