'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, X, Plus } from 'lucide-react';
import { getTool, createTool, updateTool, type Tool } from '@/lib/admin-api';

export default function ToolEditor() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const [form, setForm] = useState({
    slug: '',
    name: '',
    short_description: '',
    long_description: '',
    categories: [] as string[],
    limitations: '',
    external_url: '',
    badges: { popular: false, free_tier: false },
  });

  useEffect(() => {
    if (!isNew) {
      loadTool();
    }
  }, [id, isNew]);

  const loadTool = async () => {
    try {
      const { data } = await getTool(id);
      setForm({
        slug: data.slug,
        name: data.name,
        short_description: data.short_description,
        long_description: data.long_description || '',
        categories: data.categories || [],
        limitations: data.limitations || '',
        external_url: data.external_url || '',
        badges: {
          popular: data.badges?.popular ?? false,
          free_tier: data.badges?.free_tier ?? false
        },
      });
    } catch (error) {
      console.error('Failed to load tool:', error);
      setError('Failed to load tool');
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
        name: form.name,
        short_description: form.short_description,
        long_description: form.long_description || undefined,
        categories: form.categories,
        limitations: form.limitations || undefined,
        external_url: form.external_url || undefined,
        badges: form.badges,
      };

      if (isNew) {
        await createTool(payload);
      } else {
        await updateTool(id, payload);
      }
      router.push('../tools');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setForm((prev) => ({ ...prev, slug }));
  };

  const addCategory = () => {
    const cat = categoryInput.trim();
    if (cat && !form.categories.includes(cat)) {
      setForm((prev) => ({ ...prev, categories: [...prev.categories, cat] }));
      setCategoryInput('');
    }
  };

  const removeCategory = (cat: string) => {
    setForm((prev) => ({ ...prev, categories: prev.categories.filter((c) => c !== cat) }));
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
          href="../tools"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tools
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {isNew ? 'Create Tool' : 'Edit Tool'}
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
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              onBlur={() => !form.slug && generateSlug()}
              placeholder="e.g., ChatGPT"
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
                placeholder="e.g., chatgpt"
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
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.short_description}
              onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
              placeholder="Brief one-liner about the tool"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Long Description
            </label>
            <textarea
              value={form.long_description}
              onChange={(e) => setForm((prev) => ({ ...prev, long_description: e.target.value }))}
              placeholder="Detailed description of the tool and its capabilities"
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCategory();
                  }
                }}
                placeholder="Add a category"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={addCategory}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => removeCategory(cat)}
                    className="hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              External URL
            </label>
            <input
              type="url"
              value={form.external_url}
              onChange={(e) => setForm((prev) => ({ ...prev, external_url: e.target.value }))}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Limitations
            </label>
            <textarea
              value={form.limitations}
              onChange={(e) => setForm((prev) => ({ ...prev, limitations: e.target.value }))}
              placeholder="Any limitations or drawbacks of this tool"
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Badges
            </label>
            <div className="flex gap-6">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.badges.popular}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      badges: { ...prev.badges, popular: e.target.checked },
                    }))
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Popular</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.badges.free_tier}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      badges: { ...prev.badges, free_tier: e.target.checked },
                    }))
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">Free Tier</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Link
              href="../tools"
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
