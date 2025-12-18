'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { getPrompt, createPrompt, updatePrompt, getUseCases, type Prompt, type UseCase } from '@/lib/admin-api';

export default function PromptEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [useCases, setUseCases] = useState<UseCase[]>([]);

  const [form, setForm] = useState({
    slug: '',
    title: '',
    prompt_text: '',
    category: '',
    use_case_id: '',
  });

  useEffect(() => {
    loadUseCases();
    if (!isNew) {
      loadPrompt();
    }
  }, [id, isNew]);

  const loadUseCases = async () => {
    try {
      const { data } = await getUseCases();
      setUseCases(data);
    } catch (error) {
      console.error('Failed to load use cases:', error);
    }
  };

  const loadPrompt = async () => {
    try {
      const { data } = await getPrompt(id);
      setForm({
        slug: data.slug,
        title: data.title,
        prompt_text: data.prompt_text,
        category: data.category || '',
        use_case_id: data.use_case_id || '',
      });
    } catch (error) {
      console.error('Failed to load prompt:', error);
      setError('Failed to load prompt');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        slug: form.slug,
        title: form.title,
        prompt_text: form.prompt_text,
        category: form.category || undefined,
        use_case_id: form.use_case_id || undefined,
      };

      if (isNew) {
        await createPrompt(payload);
      } else {
        await updatePrompt(id, payload);
      }
      router.push('/admin/prompts');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setForm((prev) => ({ ...prev, slug }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/prompts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Prompts
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Create Prompt' : 'Edit Prompt'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              onBlur={() => !form.slug && generateSlug()}
              placeholder="e.g., Blog Post Generator"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="e.g., blog-post-generator"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm"
              >
                Generate
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Content Creation"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Linked Use Case
            </label>
            <select
              value={form.use_case_id}
              onChange={(e) => setForm((prev) => ({ ...prev, use_case_id: e.target.value }))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">None</option>
              {useCases.map((uc) => (
                <option key={uc.id} value={uc.id}>
                  {uc.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prompt Text <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.prompt_text}
              onChange={(e) => setForm((prev) => ({ ...prev, prompt_text: e.target.value }))}
              placeholder="Enter the full prompt template here. You can use placeholders like [TOPIC], [AUDIENCE], etc."
              rows={10}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-sm"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use [BRACKETED_PLACEHOLDERS] for variables users should replace
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="/admin/prompts"
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition inline-flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isNew ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
