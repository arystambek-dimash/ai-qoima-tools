'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Prompt } from '@/lib/api';

interface ExpandablePromptsProps {
  prompts: Prompt[];
}

export default function ExpandablePrompts({ prompts }: ExpandablePromptsProps) {
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = useTranslations('common');

  const togglePrompt = (id: string) => {
    setExpandedPrompts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopy = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => {
        const isExpanded = expandedPrompts.has(prompt.id);
        const isCopied = copiedId === prompt.id;

        return (
          <div
            key={prompt.id}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-all hover:border-gray-300"
          >
            {/* Prompt Header */}
            <div className="flex items-center justify-between px-6 py-4">
              <button
                onClick={() => togglePrompt(prompt.id)}
                className="flex items-center gap-3 text-left hover:bg-gray-50 transition-colors flex-1"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
                <div>
                  <span className="font-medium text-gray-900">{prompt.title}</span>
                  {prompt.category && (
                    <span className="ml-2 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                      {prompt.category}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => handleCopy(prompt.id, prompt.prompt_text)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isCopied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    {t('copied')}
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    {t('copy')}
                  </>
                )}
              </button>
            </div>

            {/* Prompt Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono leading-relaxed">
                  {prompt.prompt_text}
                </pre>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
