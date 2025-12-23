'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, Search, Star, Gift } from 'lucide-react';
import { getTools, deleteTool, type Tool } from '@/lib/admin-api';

export default function ToolsAdmin() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const { data } = await getTools();
      setTools(data);
    } catch (error) {
      console.error('Failed to load tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteTool(id);
      setTools((prev) => prev.filter((t) => t.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete tool:', error);
      alert('Failed to delete tool');
    } finally {
      setDeleting(false);
    }
  };

  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.short_description.toLowerCase().includes(search.toLowerCase()) ||
      tool.categories.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
          <p className="text-gray-600 mt-1">Manage AI tools in the catalog</p>
        </div>
        <Link
          href="./tools/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Tool
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
            placeholder="Search tools..."
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
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {search ? 'No tools found matching your search' : 'No tools yet'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Tool</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Categories</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Badges</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{tool.name}</p>
                    <p className="text-sm text-gray-500 truncate max-w-md">{tool.short_description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {tool.categories.slice(0, 3).map((cat) => (
                        <span
                          key={cat}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {cat}
                        </span>
                      ))}
                      {tool.categories.length > 3 && (
                        <span className="text-xs text-gray-500">+{tool.categories.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {tool.badges?.popular && (
                        <span className="inline-flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                          <Star className="h-3 w-3" />
                          Popular
                        </span>
                      )}
                      {tool.badges?.free_tier && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          <Gift className="h-3 w-3" />
                          Free Tier
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`./tools/${tool.id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(tool.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-red-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Tool?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All associated use case links will also be deleted.
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
