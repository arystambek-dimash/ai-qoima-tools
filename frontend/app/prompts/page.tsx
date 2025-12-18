'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Copy, Check, ChevronDown, Filter, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import ToolIcon from '@/components/ToolIcon';
import { getPrompts, getTools, type Prompt, type Tool } from '@/lib/api';

export default function PromptsPage() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedToolId, setSelectedToolId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isToolDropdownOpen, setIsToolDropdownOpen] = useState(false);

  const t = useTranslations('prompts');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  useEffect(() => {
    Promise.all([
      getPrompts({ locale }),
      getTools({ locale })
    ]).then(([promptsRes, toolsRes]) => {
      setPrompts(promptsRes.data);
      setTools(toolsRes.data);
    }).finally(() => setLoading(false));
  }, [locale]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isToolDropdownOpen && !(e.target as Element).closest('.tool-dropdown')) {
        setIsToolDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isToolDropdownOpen]);

  // Create a map of tool_id to tool for quick lookup
  const toolMap = useMemo(() => {
    const map: Record<string, Tool> = {};
    tools.forEach(tool => {
      map[tool.id] = tool;
    });
    return map;
  }, [tools]);

  // Get unique categories from prompts
  const categories = useMemo(() => {
    const cats = new Set<string>();
    prompts.forEach(p => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [prompts]);

  // Filter prompts based on search, tool, and category
  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    if (selectedToolId !== 'all') {
      filtered = filtered.filter(prompt => prompt.tool_id === selectedToolId);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(prompt => prompt.category === selectedCategory);
    }

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(searchLower) ||
        prompt.prompt_text.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [prompts, selectedToolId, selectedCategory, search]);

  // Group prompts by tool
  const groupedPrompts = useMemo(() => {
    const groups: Record<string, { tool: Tool | null; prompts: Prompt[] }> = {};

    filteredPrompts.forEach(prompt => {
      const toolId = prompt.tool_id || 'general';
      if (!groups[toolId]) {
        groups[toolId] = {
          tool: prompt.tool_id ? toolMap[prompt.tool_id] || null : null,
          prompts: []
        };
      }
      groups[toolId].prompts.push(prompt);
    });

    return Object.entries(groups).sort(([aId, a], [bId, b]) => {
      if (aId === 'general') return 1;
      if (bId === 'general') return -1;
      return (a.tool?.name || '').localeCompare(b.tool?.name || '');
    });
  }, [filteredPrompts, toolMap]);

  // Get tools that have prompts
  const toolsWithPrompts = useMemo(() => {
    const toolIds = new Set(prompts.map(p => p.tool_id).filter(Boolean));
    return tools.filter(t => toolIds.has(t.id));
  }, [prompts, tools]);

  const selectedTool = selectedToolId !== 'all' ? toolMap[selectedToolId] : null;

  const handleCopy = async (promptId: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(promptId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearFilters = () => {
    setSelectedToolId('all');
    setSelectedCategory('all');
    setSearch('');
  };

  const hasActiveFilters = selectedToolId !== 'all' || selectedCategory !== 'all' || search;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-4 mb-4 shadow-lg shadow-indigo-200">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Tool Selector with Icons */}
            <div className="relative tool-dropdown flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Filter className="inline h-4 w-4 mr-1" />
                {t('selectTool')}
              </label>
              <button
                onClick={() => setIsToolDropdownOpen(!isToolDropdownOpen)}
                className="w-full flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
              >
                <div className="flex items-center gap-3">
                  {selectedTool ? (
                    <>
                      <ToolIcon slug={selectedTool.slug} name={selectedTool.name} size="sm" />
                      <span className="font-medium text-gray-900">{selectedTool.name}</span>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900">{t('allTools')}</span>
                    </>
                  )}
                  <span className="text-sm text-gray-400">
                    ({selectedToolId === 'all' ? prompts.length : prompts.filter(p => p.tool_id === selectedToolId).length} {tCommon('prompts').toLowerCase()})
                  </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isToolDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isToolDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {/* All Tools Option */}
                    <button
                      onClick={() => { setSelectedToolId('all'); setIsToolDropdownOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-indigo-50 transition-colors ${selectedToolId === 'all' ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{t('allTools')}</div>
                        <div className="text-sm text-gray-500">{prompts.length} {tCommon('prompts').toLowerCase()}</div>
                      </div>
                      {selectedToolId === 'all' && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </button>

                    <div className="border-t border-gray-100" />

                    {/* Tool Options */}
                    {toolsWithPrompts.map(tool => {
                      const count = prompts.filter(p => p.tool_id === tool.id).length;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => { setSelectedToolId(tool.id); setIsToolDropdownOpen(false); }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-indigo-50 transition-colors ${selectedToolId === tool.id ? 'bg-indigo-50' : ''}`}
                        >
                          <ToolIcon slug={tool.slug} name={tool.name} size="sm" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{tool.name}</div>
                            <div className="text-sm text-gray-500">{count} {tCommon('prompts').toLowerCase()}</div>
                          </div>
                          {selectedToolId === tool.id && (
                            <Check className="h-5 w-5 text-indigo-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('category')}
              </label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 font-medium text-gray-900 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                >
                  <option value="all">{t('allCategories')}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {tCommon('search')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPrompts')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 font-medium text-gray-900 placeholder-gray-400 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Active Filters & Clear */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">{t('activeFilters')}</span>
                {selectedTool && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                    <ToolIcon slug={selectedTool.slug} name={selectedTool.name} size="sm" className="w-4 h-4" />
                    {selectedTool.name}
                  </span>
                )}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                    {selectedCategory}
                  </span>
                )}
                {search && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    "{search}"
                  </span>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
                {tCommon('clearAll')}
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {t('promptsFound', { count: filteredPrompts.length })}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
            <p className="mt-4 text-gray-500">{tCommon('loading')}</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Search className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-xl font-medium text-gray-500">{t('noPrompts')}</p>
            <p className="mt-2 text-gray-400">{tCommon('noResults')}</p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors"
            >
              <X className="h-4 w-4" />
              {tCommon('clearAll')}
            </button>
          </div>
        ) : (
          /* Prompts Grid */
          <div className="space-y-10">
            {groupedPrompts.map(([toolId, { tool, prompts: toolPrompts }]) => (
              <div key={toolId}>
                {/* Tool Section Header */}
                {(selectedToolId === 'all' || toolId === 'general') && (
                  <div className="flex items-center gap-4 mb-6">
                    {tool ? (
                      <>
                        <ToolIcon slug={tool.slug} name={tool.name} size="lg" />
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900">{tool.name}</h2>
                          <p className="text-sm text-gray-500">{t('promptsOptimized', { count: toolPrompts.length, tool: tool.name })}</p>
                        </div>
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
                        >
                          {tCommon('viewDetails')}
                        </Link>
                      </>
                    ) : (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">General Prompts</h2>
                        <p className="text-sm text-gray-500">{toolPrompts.length} prompts for any AI tool</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Prompts Cards Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {toolPrompts.map(prompt => {
                    const isExpanded = expandedPrompt === prompt.id;
                    const isCopied = copiedId === prompt.id;
                    const promptTool = prompt.tool_id ? toolMap[prompt.tool_id] : null;

                    return (
                      <div
                        key={prompt.id}
                        className={`group bg-white rounded-xl border transition-all duration-200 ${
                          isExpanded
                            ? 'border-indigo-300 shadow-lg shadow-indigo-100 col-span-full'
                            : 'border-gray-200 hover:border-indigo-200 hover:shadow-md'
                        }`}
                      >
                        {/* Card Header */}
                        <div className="p-5">
                          <div className="flex items-start gap-4">
                            {/* Tool Icon (only when viewing all tools and tool is selected) */}
                            {selectedToolId === 'all' && promptTool && (
                              <ToolIcon slug={promptTool.slug} name={promptTool.name} size="sm" className="mt-0.5 flex-shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                    {prompt.title}
                                  </h3>
                                  {prompt.category && (
                                    <span className="inline-block mt-1.5 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                      {prompt.category}
                                    </span>
                                  )}
                                </div>
                                <button
                                  onClick={() => handleCopy(prompt.id, prompt.prompt_text)}
                                  className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                                    isCopied
                                      ? 'bg-green-500 text-white'
                                      : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md'
                                  }`}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="h-4 w-4" />
                                      {tCommon('copied')}
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-4 w-4" />
                                      {tCommon('copy')}
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Preview or Full Text */}
                              <button
                                onClick={() => setExpandedPrompt(isExpanded ? null : prompt.id)}
                                className="mt-3 text-left w-full"
                              >
                                {isExpanded ? (
                                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    {prompt.prompt_text}
                                  </pre>
                                ) : (
                                  <p className="text-sm text-gray-500 line-clamp-2">
                                    {prompt.prompt_text.slice(0, 150)}...
                                  </p>
                                )}
                                <span className="inline-block mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                  {isExpanded ? t('hidePrompt') : t('showFullPrompt')}
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">{t('howToUse')}</h3>
            <div className="grid sm:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">1</span>
                </div>
                <p className="text-sm text-indigo-100" dangerouslySetInnerHTML={{ __html: t.raw('step1') }} />
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">2</span>
                </div>
                <p className="text-sm text-indigo-100">{t('step2')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">3</span>
                </div>
                <p className="text-sm text-indigo-100">{t('step3')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold">4</span>
                </div>
                <p className="text-sm text-indigo-100">{t('step4')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
