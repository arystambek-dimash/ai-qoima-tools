import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Tag,
  Sparkles,
  Share2,
  BookOpen,
  TrendingUp,
  User
} from 'lucide-react';
import { getNewsById } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { getTranslations, getLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

// Calculate read time based on content length
function getReadTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Get relative time string with translations
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

// Format content into paragraphs
function formatContent(content: string): string[] {
  return content
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

interface NewsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');

  let newsData;
  try {
    const response = await getNewsById(id, locale);
    newsData = response.data;
  } catch (error) {
    notFound();
  }

  if (!newsData) {
    notFound();
  }

  const { related, ...news } = newsData;
  const contentToShow = news.content || news.description;
  const paragraphs = formatContent(contentToShow);
  const readTime = getReadTime(contentToShow);
  const relativeTime = getRelativeTime(news.published_on, tCommon);
  const hasFullContent = news.content && news.content.length > 300;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Back button */}
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-200 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToNews')}
          </Link>

          {/* Category and badges */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {news.is_featured && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-3 py-1 text-xs font-semibold text-gray-900">
                <Sparkles className="h-3 w-3" />
                {t('featured')}
              </span>
            )}
            {news.category && (
              <span className="inline-flex items-center rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white border border-white/30">
                {news.category}
              </span>
            )}
            {(news as any).ai_generated && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-emerald-200 border border-emerald-400/30">
                <TrendingUp className="h-3 w-3" />
                AI Enhanced
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            {news.title}
          </h1>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-indigo-200">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium text-white">Qoima AI</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <time dateTime={news.published_on} title={formatDate(news.published_on)}>
                {relativeTime}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{tCommon('minRead', { count: readTime })}</span>
            </div>
            {hasFullContent && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{t('fullArticle')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Lead paragraph / Description */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <p className="text-xl text-gray-600 leading-relaxed font-medium">
            {news.description}
          </p>
        </div>

        {/* Main content */}
        <div className="prose prose-lg prose-indigo max-w-none">
          {hasFullContent ? (
            paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-6">
                {paragraph}
              </p>
            ))
          ) : (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center border border-indigo-100">
              <Sparkles className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">
                {t('summaryOnly')}
              </p>
              {news.source_url && (
                <a
                  href={news.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  {t('readOriginal')}
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Source link for full articles */}
        {hasFullContent && news.source_url && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              {t('source')}
            </a>
          </div>
        )}

        {/* Tags */}
        {news.tags && news.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-3 flex-wrap">
              <Tag className="h-4 w-4 text-gray-400" />
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 hover:bg-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-500">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">{t('shareArticle')}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                title="Share on Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                title="Share on LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-green-100 hover:text-green-600 transition-colors"
                title="Share on WhatsApp"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related News Section */}
      {related && related.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{t('relatedNews')}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug || item.id}`}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    {item.category && (
                      <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {getRelativeTime(item.published_on, tCommon)}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {item.description}
                  </p>
                  <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                    {t('readMore')}
                    <ArrowLeft className="ml-1 h-4 w-4 rotate-180 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
