import Link from 'next/link';
import { FileText } from 'lucide-react';
import CopyButton from './CopyButton';
import type { Prompt } from '@/lib/api';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <Link
              href={`/prompts/${prompt.slug}`}
              className="font-semibold text-gray-900 hover:text-indigo-600"
            >
              {prompt.title}
            </Link>
            {prompt.category && (
              <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                {prompt.category}
              </span>
            )}
          </div>
        </div>
        <CopyButton content={prompt.prompt_text} />
      </div>

      <div className="mt-4 rounded-lg bg-gray-50 p-4">
        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
          {prompt.prompt_text.length > 300
            ? `${prompt.prompt_text.slice(0, 300)}...`
            : prompt.prompt_text}
        </pre>
      </div>
    </div>
  );
}
