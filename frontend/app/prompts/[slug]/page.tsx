import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import { getPromptBySlug } from '@/lib/api';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PromptDetailPage({ params }: Props) {
  const { slug } = await params;

  try {
    const { data: prompt } = await getPromptBySlug(slug);

    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/prompts"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prompts
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{prompt.title}</h1>
              {prompt.category && (
                <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                  {prompt.category}
                </span>
              )}
            </div>
            <CopyButton content={prompt.prompt_text} />
          </div>
        </div>

        {/* Prompt text */}
        <div className="rounded-xl bg-gray-50 p-6">
          <h2 className="mb-4 font-semibold text-gray-900">Prompt Template</h2>
          <pre className="whitespace-pre-wrap rounded-lg bg-white p-4 font-mono text-sm text-gray-700 border border-gray-200">
            {prompt.prompt_text}
          </pre>
        </div>

        {/* Usage tips */}
        <div className="mt-8 rounded-xl bg-indigo-50 p-6">
          <h2 className="font-semibold text-gray-900">How to Use</h2>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-gray-700">
            <li>Copy the prompt using the button above</li>
            <li>Replace the placeholders in [BRACKETS] with your specific information</li>
            <li>Paste into your preferred AI tool (ChatGPT, Claude, etc.)</li>
            <li>Adjust the response as needed for your specific use case</li>
          </ol>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
