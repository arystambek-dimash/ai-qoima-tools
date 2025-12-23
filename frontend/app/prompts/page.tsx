'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, Copy, Check, ChevronDown, Filter, Sparkles, X, ExternalLink, Tag } from 'lucide-react';
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

  // Get tools that have prompts associated
  const toolsWithPrompts = useMemo(() => {
    const toolIds = new Set<string>();
    prompts.forEach(p => {
      if (p.tool_ids && Array.isArray(p.tool_ids)) {
        p.tool_ids.forEach(id => toolIds.add(id));
      }
    });
    return tools.filter(t => toolIds.has(t.id));
  }, [prompts, tools]);

  // Filter prompts based on search, tool, and category
  const filteredPrompts = useMemo(() => {
    let filtered = prompts;

    if (selectedToolId !== 'all') {
      filtered = filtered.filter(prompt => 
        prompt.tool_ids && Array.isArray(prompt.tool_ids) && prompt.tool_ids.includes(selectedToolId)
      );
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

  // Group prompts by their primary tool (first tool in the array)
  const groupedPrompts = useMemo(() => {
    if (selectedToolId !== 'all') {
      // When filtered by tool, show flat list
      return [{ toolId: selectedToolId, tool: toolMap[selectedToolId], prompts: filteredPrompts }];
    }

    const groups: Record<string, { tool: Tool | null; prompts: Prompt[] }> = {};

    filteredPrompts.forEach(prompt => {
      const primaryToolId = prompt.tool_ids && prompt.tool_ids.length > 0 ? prompt.tool_ids[0] : 'general';
      if (!groups[primaryToolId]) {
        groups[primaryToolId] = {
          tool: primaryToolId !== 'general' ? toolMap[primaryToolId] || null : null,
          prompts: []
        };
      }
      groups[primaryToolId].prompts.push(prompt);
    });

    return Object.entries(groups)
      .map(([toolId, data]) => ({ toolId, ...data }))
      .sort((a, b) => {
        if (a.toolId === 'general') return 1;
        if (b.toolId === 'general') return -1;
        return (a.tool?.name || '').localeCompare(b.tool?.name || '');
      });
  }, [filteredPrompts, toolMap, selectedToolId]);

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

  // Get tools for a prompt
  const getPromptTools = (prompt: Prompt): Tool[] => {
    if (!prompt.tool_ids || !Array.isArray(prompt.tool_ids)) return [];
    return prompt.tool_ids.map(id => toolMap[id]).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 mb-6 shadow-xl shadow-indigo-200/50">
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Filters Section - Redesigned */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-100 p-6 mb-8 shadow-xl shadow-gray-100/50">
          <div className="flex flex-col gap-6">
            {/* Tool Filter - Horizontal Pills */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-indigo-600" />
                <span className="text-sm font-semibold text-gray-700">{t('selectTool')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* All Tools Button */}
                <button
                  onClick={() => setSelectedToolId('all')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    selectedToolId === 'all'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  {t('allTools')}
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                    selectedToolId === 'all' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {prompts.length}
                  </span>
                </button>

                {/* Tool Pills */}
                {toolsWithPrompts.map(tool => {
                  const count = prompts.filter(p => 
                    p.tool_ids && Array.isArray(p.tool_ids) && p.tool_ids.includes(tool.id)
                  ).length;
                  const isSelected = selectedToolId === tool.id;
                  
                  return (
                    <button
                      key={tool.id}
                      onClick={() => setSelectedToolId(tool.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <ToolIcon slug={tool.slug} name={tool.name} size="sm" className="w-5 h-5" />
                      {tool.name}
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category and Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Tag className="inline h-4 w-4 mr-1" />
                  {t('category')}
                </label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 font-medium text-gray-900 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Search className="inline h-4 w-4 mr-1" />
                  {tCommon('search')}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t('searchPrompts')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-12 pr-4 font-medium text-gray-900 placeholder-gray-400 hover:border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Filters & Clear */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-500">{t('activeFilters')}</span>
                  {selectedTool && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700">
                      <ToolIcon slug={selectedTool.slug} name={selectedTool.name} size="sm" className="w-4 h-4" />
                      {selectedTool.name}
                      <button onClick={() => setSelectedToolId('all')} className="ml-1 hover:text-indigo-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="ml-1.5 hover:text-purple-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {search && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700">
                      &quot;{search}&quot;
                      <button onClick={() => setSearch('')} className="ml-1.5 hover:text-gray-900">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  {tCommon('clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600 font-medium">
            {t('promptsFound', { count: filteredPrompts.length })}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-24">
            <div className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-indigo-600 border-r-transparent" />
            <p className="mt-6 text-gray-500 font-medium">{tCommon('loading')}</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-3xl border-2 border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 mb-6">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-2xl font-semibold text-gray-600">{t('noPrompts')}</p>
            <p className="mt-2 text-gray-400 max-w-md mx-auto">{tCommon('noResults')}</p>
            <button
              onClick={clearFilters}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              <X className="h-4 w-4" />
              {tCommon('clearAll')}
            </button>
          </div>
        ) : (
          /* Prompts Grid */
          <div className="space-y-12">
            {groupedPrompts.map(({ toolId, tool, prompts: toolPrompts }) => (
              <div key={toolId}>
                {/* Tool Section Header */}
                {selectedToolId === 'all' && (
                  <div className="flex items-center gap-4 mb-6">
                    {tool ? (
                      <>
                        <div className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200">
                          <ToolIcon slug={tool.slug} name={tool.name} size="lg" />
                        </div>
                        <div className="flex-1">
                          <h2 className="text-xl font-bold text-gray-900">{tool.name}</h2>
                          <p className="text-sm text-gray-500">{t('promptsOptimized', { count: toolPrompts.length, tool: tool.name })}</p>
                        </div>
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition-all"
                        >
                          {tCommon('viewDetails')}
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 border border-purple-200">
                          <Sparkles className="h-8 w-8 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">General Prompts</h2>
                          <p className="text-sm text-gray-500">{toolPrompts.length} prompts for any AI tool</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Prompts Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                  {toolPrompts.map(prompt => {
                    const isExpanded = expandedPrompt === prompt.id;
                    const isCopied = copiedId === prompt.id;
                    const promptToolsList = getPromptTools(prompt);

                    return (
                      <div
                        key={prompt.id}
                        className={`group bg-white rounded-2xl border transition-all duration-300 ${
                          isExpanded
                            ? 'border-indigo-300 shadow-2xl shadow-indigo-100/50 md:col-span-2 ring-2 ring-indigo-100'
                            : 'border-gray-200 hover:border-indigo-200 hover:shadow-xl hover:shadow-gray-100/50'
                        }`}
                      >
                        <div className="p-6">
                          {/* Header Row */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {prompt.title}
                              </h3>
                              
                              {/* Meta: Category + Tools */}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {prompt.category && (
                                  <span className="inline-flex items-center rounded-lg bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700 border border-purple-100">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {prompt.category}
                                  </span>
                                )}
                                {promptToolsList.length > 0 && (
                                  <div className="flex items-center gap-1">
                                    {promptToolsList.slice(0, 3).map(toolItem => (
                                      <Link
                                        key={toolItem.id}
                                        href={`/tools/${toolItem.slug}`}
                                        className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-100 transition-colors"
                                        title={toolItem.name}
                                      >
                                        <ToolIcon slug={toolItem.slug} name={toolItem.name} size="sm" className="w-3.5 h-3.5" />
                                        <span className="hidden sm:inline">{toolItem.name}</span>
                                      </Link>
                                    ))}
                                    {promptToolsList.length > 3 && (
                                      <span className="text-xs text-gray-400 ml-1">+{promptToolsList.length - 3}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Copy Button */}
                            <button
                              onClick={() => handleCopy(prompt.id, prompt.prompt_text)}
                              className={`flex-shrink-0 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                                isCopied
                                  ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-200/70'
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
                            className="mt-2 text-left w-full"
                          >
                            {isExpanded ? (
                              <div className="rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50/30 p-5 border border-gray-100">
                                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                                  {prompt.prompt_text}
                                </pre>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                {prompt.prompt_text.slice(0, 180)}...
                              </p>
                            )}
                            <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                              {isExpanded ? (
                                <>
                                  <ChevronDown className="h-4 w-4 rotate-180" />
                                  {t('hidePrompt')}
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  {t('showFullPrompt')}
                                </>
                              )}
                            </span>
                          </button>
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
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-10 text-white shadow-2xl shadow-indigo-200/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2NGgtNHpNMjAgMjBoNHY0aC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <div className="max-w-4xl mx-auto text-center relative">
            <h3 className="text-3xl font-bold mb-4">{t('howToUse')}</h3>
            <p className="text-indigo-100 mb-10 text-lg">Master the art of prompt engineering with these simple steps</p>
            <div className="grid sm:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors border border-white/10">
                    <span className="text-2xl font-bold">{step}</span>
                  </div>
                  <p className="text-sm text-indigo-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.raw(`step${step}`) }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
