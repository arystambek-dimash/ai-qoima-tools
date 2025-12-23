'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Save,
  Users,
  Mail,
  Clock,
  Check,
  X,
} from 'lucide-react';
import {
  getCompany,
  updateCompany,
  Company,
  CompanyUser,
} from '@/lib/admin-api';

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<CompanyUser[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email_domain: '',
    description: '',
    max_users: '',
    is_active: true,
  });

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const response = await getCompany(id);
      const data = response.data;
      setCompany(data);
      setUsers(data.users || []);
      setFormData({
        name: data.name,
        email_domain: data.email_domain,
        description: data.description || '',
        max_users: data.max_users?.toString() || '',
        is_active: data.is_active,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateCompany(id, {
        name: formData.name,
        email_domain: formData.email_domain,
        description: formData.description || null,
        max_users: formData.max_users ? parseInt(formData.max_users) : null,
        is_active: formData.is_active,
      });
      setSuccess('Company updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Company not found</p>
        <Link href="/admin/companies" className="text-indigo-600 hover:underline mt-2 inline-block">
          Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/companies"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-12 w-12 flex items-center justify-center bg-indigo-100 rounded-xl">
          <Building2 className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
          <p className="text-gray-600">@{company.email_domain}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Company Details
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    required
                  />
                </div>
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
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Users
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
                {users.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Currently {users.length} user(s) registered
                  </p>
                )}
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
                  Active (employees can log in)
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Users Sidebar */}
        <div>
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Users
              </h2>
              <span className="text-sm text-gray-500">
                {users.length} registered
              </span>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No users yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded-full">
                      <Mail className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.email}
                      </p>
                      {user.name && (
                        <p className="text-xs text-gray-500">{user.name}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        {user.is_active ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <Check className="h-3 w-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <X className="h-3 w-3" />
                            Inactive
                          </span>
                        )}
                        {user.last_login_at && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3" />
                            {new Date(user.last_login_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
