'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import ToolCard from '@/components/ToolCard';
import { getTools, type Tool } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface ToolsClientProps {
  initialTools: Tool[];
  categories: string[];
  locale: string;
}

export default function ToolsClient({ initialTools, categories, locale }: ToolsClientProps) {
  const [tools, setTools] = useState<Tool[]>(initialTools);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const t = useTranslations('tools');
  const tCommon = useTranslations('common');

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  // Filter tools client-side for instant feedback
  const filteredTools = useMemo(() => {
    let result = tools;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(searchLower) ||
          tool.short_description.toLowerCase().includes(searchLower)
      );
    }

    if (selectedCategory) {
      result = result.filter((tool) =>
        tool.categories.includes(selectedCategory)
      );
    }

    return result;
  }, [tools, search, selectedCategory]);

  // Fetch from server when category changes (for accurate filtering)
  const handleCategoryChange = async (category: string) => {
    setSelectedCategory(category);

    // For better UX, we could also fetch from server but client filtering is faster
    // If you want server-side filtering:
    // setLoading(true);
    // const { data } = await getTools({ category: category || undefined, locale });
    // setTools(data);
    // setLoading(false);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setTools(initialTools);
  };

  return (
    <>
      {/* Sticky Filters */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-4 bg-gray-50/95 backdrop-blur-sm border-b border-gray-200/50 mb-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchTools')}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
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
                onClick={handleClearFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                {t('clearFilters')}
              </button>
            )}
          </div>
        </div>
        {/* Results count */}
        <div className="mt-3 text-sm text-gray-500">
          {t('toolsFound', { count: filteredTools.length })}
          {(search || selectedCategory) && ` ${t('matchingCriteria')}`}
        </div>
      </div>

      {/* Tools grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-3 text-gray-500">{tCommon('loading')}</p>
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
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
            onClick={handleClearFilters}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            {tCommon('clearAll')}
          </button>
        </div>
      )}
    </>
  );
}
