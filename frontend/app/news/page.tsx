import Link from 'next/link';
import { Calendar, Clock, Sparkles, Newspaper, ArrowRight } from 'lucide-react';
import { getNews } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

// Calculate read time based on description length (average reading speed: 200 words/min)
function getReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Check if news is new (within 3 days)
function isNew(dateStr: string): boolean {
  const newsDate = new Date(dateStr);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - newsDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}

// Get relative time string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRelativeTime(dateStr: string, t: any): string {
  const newsDate = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - newsDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t('today');
  if (diffDays === 1) return t('yesterday');
  if (diffDays < 7) return t('daysAgo', { count: diffDays });
  if (diffDays < 14) return t('weekAgo');
  if (diffDays < 30) return t('weeksAgo', { count: Math.floor(diffDays / 7) });
  return formatDate(dateStr);
}

export default async function NewsPage() {
  const locale = await getLocale();
  const { data: news } = await getNews(locale);
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="rounded-xl bg-indigo-100 p-2.5">
            <Newspaper className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t('title')}</h1>
        </div>
        <p className="mt-2 text-lg text-gray-500">
          {t('subtitle')}
        </p>
      </div>

      {/* News Timeline */}
      <div className="space-y-6">
        {news.map((item) => {
          const readTime = getReadTime(item.description);
          const itemIsNew = isNew(item.published_on);
          const relativeTime = getRelativeTime(item.published_on, tCommon);
          const newsUrl = `/news/${item.slug || item.id}`;

          return (
            <article
              key={item.id}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
            >
              {/* New Badge */}
              {itemIsNew && (
                <div className="absolute -top-2 -right-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    <Sparkles className="h-3 w-3" />
                    {t('new')}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Category badge */}
                  {item.category && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 mb-3">
                      {item.category}
                    </span>
                  )}

                  {/* Title - now links to detail page */}
                  <Link href={newsUrl}>
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                      {item.title}
                    </h2>
                  </Link>

                  {/* Meta info */}
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={item.published_on} title={formatDate(item.published_on)}>
                        {relativeTime}
                      </time>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{tCommon('minRead', { count: readTime })}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-4 text-gray-600 leading-relaxed line-clamp-3">{item.description}</p>

                  {/* Read more link - now links to detail page */}
                  <Link
                    href={newsUrl}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    {t('readFullArticle')}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {news.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Newspaper className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t('noNews')}</h3>
          <p className="mt-1 text-gray-500">{t('noNewsDescription')}</p>
        </div>
      )}
    </div>
  );
}
