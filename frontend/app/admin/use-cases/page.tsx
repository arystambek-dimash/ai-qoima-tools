'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Loader2, Search } from 'lucide-react';
import { getUseCases, deleteUseCase, type UseCase } from '@/lib/admin-api';

export default function UseCasesAdmin() {
  const [useCases, setUseCases] = useState<UseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUseCases();
  }, []);

  const loadUseCases = async () => {
    try {
      const { data } = await getUseCases();
      setUseCases(data);
    } catch (error) {
      console.error('Failed to load use cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteUseCase(id);
      setUseCases((prev) => prev.filter((uc) => uc.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Failed to delete use case:', error);
      alert('Failed to delete use case');
    } finally {
      setDeleting(false);
    }
  };

  const filteredUseCases = useCases.filter(
    (uc) =>
      uc.title.toLowerCase().includes(search.toLowerCase()) ||
      uc.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Use Cases</h1>
          <p className="text-gray-600 mt-1">Manage use cases for the platform</p>
        </div>
        <Link
          href="/admin/use-cases/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Use Case
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
            placeholder="Search use cases..."
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
        ) : filteredUseCases.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {search ? 'No use cases found matching your search' : 'No use cases yet'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Title</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-gray-900">Audience</th>
                <th className="text-right px-6 py-3 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUseCases.map((useCase) => (
                <tr key={useCase.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{useCase.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-md">{useCase.summary}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{useCase.slug}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{useCase.audience || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/use-cases/${useCase.id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-indigo-600 transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(useCase.id)}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Use Case?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. All associated tool links will also be deleted.
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
