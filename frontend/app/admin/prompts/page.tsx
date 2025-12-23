'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, Search, Wrench } from 'lucide-react';
import { getPrompts, deletePrompt, getTools, type Prompt, type Tool } from '@/lib/admin-api';

export default function PromptsAdmin() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [promptsRes, toolsRes] = await Promise.all([
        getPrompts(),
        getTools()
      ]);
      setPrompts(promptsRes.data);
      setTools(toolsRes.data);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create tool map for quick lookup
  const toolMap = useMemo(() => {
    const map: Record<string, Tool> = {};
    tools.forEach(tool => {
      map[tool.id] = tool;
    });
    return map;
  }, [tools]);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deletePrompt(id);
      setPrompts((prev) => prev.filter((p) => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      alert('Failed to delete prompt');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(search.toLowerCase()) ||
      prompt.prompt_text.toLowerCase().includes(search.toLowerCase()) ||
      (prompt.category && prompt.category.toLowerCase().includes(search.toLowerCase()))
  );

  const getToolsForPrompt = (prompt: Prompt): Tool[] => {
    if (!prompt.tool_ids || !Array.isArray(prompt.tool_ids)) return [];
    return prompt.tool_ids.map(id => toolMap[id]).filter(Boolean);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
          <p className="text-gray-600 mt-1">Manage prompt templates and link them to tools</p>
        </div>
        <Link
          href="./prompts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Prompt
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {search ? 'No prompts found matching your search' : 'No prompts yet'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Category</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">
                  <div className="flex items-center gap-1">
                    <Wrench className="h-4 w-4" />
                    Linked Tools
                  </div>
                </th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Slug</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrompts.map((prompt) => {
                const linkedTools = getToolsForPrompt(prompt);
                return (
                  <tr key={prompt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{prompt.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{prompt.prompt_text.slice(0, 80)}...</p>
                    </td>
                    <td className="px-6 py-4">
                      {prompt.category && (
                        <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          {prompt.category}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {linkedTools.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {linkedTools.slice(0, 3).map(tool => (
                            <span
                              key={tool.id}
                              className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded"
                            >
                              {tool.name}
                            </span>
                          ))}
                          {linkedTools.length > 3 && (
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              +{linkedTools.length - 3}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No tools linked</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{prompt.slug}</code>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`./prompts/${prompt.id}`}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(prompt.id)}
                          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Prompt?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition inline-flex items-center gap-2"
              >
                {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
