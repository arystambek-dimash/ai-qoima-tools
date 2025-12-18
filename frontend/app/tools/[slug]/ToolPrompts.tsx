'use client';

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Prompt } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface ToolPromptsProps {
  prompts: Prompt[];
  toolName: string;
}

export default function ToolPrompts({ prompts, toolName }: ToolPromptsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const tCommon = useTranslations('common');
  const t = useTranslations('tools');

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => {
        const isCopied = copiedId === prompt.id;
        const isExpanded = expandedId === prompt.id;

        return (
          <div
            key={prompt.id}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:border-indigo-200 hover:shadow-sm"
          >
            {/* Prompt Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => toggleExpand(prompt.id)}
                className="flex items-center gap-3 text-left flex-1"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {prompt.title}
                  </h3>
                  {prompt.category && (
                    <span className="mt-1 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                      {prompt.category}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleCopy(prompt.id, prompt.prompt_text)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  isCopied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
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
                    {t('copyPrompt')}
                  </>
                )}
              </button>
            </div>

            {/* Prompt Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gradient-to-b from-gray-50 to-white">
                <div className="rounded-lg bg-white p-4 ring-1 ring-gray-200">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                    {prompt.prompt_text}
                  </pre>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  {t('clickCopyToUse', { toolName })}
                </p>
              </div>
            )}

            {/* Preview when collapsed */}
            {!isExpanded && (
              <div className="px-6 pb-4">
                <p className="text-sm text-gray-500 line-clamp-2">
                  {prompt.prompt_text.slice(0, 150)}...
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
