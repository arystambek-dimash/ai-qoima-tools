'use client';

import { useState, Children, ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface ExpandableSectionProps {
  children: ReactNode;
  initialCount: number;
  totalCount: number;
  itemLabel: string;
}

export default function ExpandableSection({
  children,
  initialCount,
  totalCount,
  itemLabel,
}: ExpandableSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = totalCount > initialCount;
  const t = useTranslations('common');

  if (!hasMore) {
    return <>{children}</>;
  }

  return (
    <div>
      <div className={expanded ? '' : 'relative'}>
        {/* Content wrapper with optional fade */}
        <div
          className={
            expanded
              ? ''
              : 'max-h-[700px] overflow-hidden'
          }
          style={
            expanded
              ? {}
              : {
                  maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                }
          }
        >
          {children}
        </div>
      </div>

      {/* Show more/less button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        >
          {expanded ? (
            <>
              {t('showLess')}
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              {t('showMore')} ({totalCount - initialCount})
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
