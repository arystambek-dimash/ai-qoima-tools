'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  Users,
  Check,
  X,
  Globe,
} from 'lucide-react';
import {
  getCompanies,
  createCompany,
  deleteCompany,
  Company,
} from '@/lib/admin-api';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email_domain: '',
    description: '',
    max_users: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const response = await getCompanies();
      setCompanies(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCompany({
        name: formData.name,
        email_domain: formData.email_domain,
        description: formData.description || undefined,
        max_users: formData.max_users ? parseInt(formData.max_users) : undefined,
        is_active: formData.is_active,
      });
      setShowModal(false);
      setFormData({ name: '', email_domain: '', description: '', max_users: '', is_active: true });
      loadCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will not affect existing users but they will lose access.`)) {
      return;
    }
    try {
      await deleteCompany(id);
      loadCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete company');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">
            Manage authorized company email domains
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          <Plus className="h-5 w-5" />
          Add Company
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Users
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No companies yet</p>
                  <p className="mt-1">Add your first company to allow their employees access</p>
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded-lg">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {company.name}
                        </div>
                        {company.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {company.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Globe className="h-4 w-4 text-gray-400" />
                      @{company.email_domain}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-900">
                      <Users className="h-4 w-4 text-gray-400" />
                      {company.user_count || 0}
                      {company.max_users && (
                        <span className="text-gray-400">/ {company.max_users}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.is_active ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="h-3 w-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <X className="h-3 w-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(company.id, company.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Add New Company
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Kyzyltu LLP"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Domain *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-1">@</span>
                  <input
                    type="text"
                    value={formData.email_domain}
                    onChange={(e) =>
                      setFormData({ ...formData, email_domain: e.target.value.replace('@', '') })
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g., kyzyltu.kz"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Users with this email domain can access the platform
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Optional description..."
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Users (Optional)
                </label>
                <input
                  type="number"
                  value={formData.max_users}
                  onChange={(e) =>
                    setFormData({ ...formData, max_users: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Leave empty for unlimited"
                  min={1}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active (users can access immediately)
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {saving ? 'Creating...' : 'Create Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
