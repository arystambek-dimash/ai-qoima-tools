'use client';

import { useState, useEffect } from 'react';
import { Search, Wrench, Filter } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { getTools, getToolCategories, type Tool } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const t = useTranslations('tools');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    getToolCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    getTools({ category: selectedCategory || undefined, search: search || undefined, locale })
      .then(({ data }) => setTools(data))
      .finally(() => setLoading(false));
  }, [selectedCategory, search, locale]);

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

      {/* Sticky Filters */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200/50 mb-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchTools')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {(search || selectedCategory) && (
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedCategory('');
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>
        {/* Results count */}
        {!loading && (
          <div className="mt-3 text-sm text-gray-500">
            {t('toolsFound', { count: tools.length })}
            {(search || selectedCategory) && ` ${t('matchingCriteria')}`}
          </div>
        )}
      </div>

      {/* Tools grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-500">{tCommon('loading')}</p>
        </div>
      ) : tools.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">{t('noTools')}</h3>
          <p className="mt-1 text-gray-500">{t('adjustSearch')}</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('');
            }}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {tCommon('clearAll')}
          </button>
        </div>
      )}
    </div>
  );
}
