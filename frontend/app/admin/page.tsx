'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderKanban, Wrench, MessageSquareText, Newspaper, Plus, ArrowRight } from 'lucide-react';
import { getUseCases, getTools, getPrompts, getNews } from '@/lib/admin-api';

interface Stats {
  useCases: number;
  tools: number;
  prompts: number;
  news: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ useCases: 0, tools: 0, prompts: 0, news: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [useCasesRes, toolsRes, promptsRes, newsRes] = await Promise.all([
        getUseCases(),
        getTools(),
        getPrompts(),
        getNews(),
      ]);
      setStats({
        useCases: useCasesRes.data.length,
        tools: toolsRes.data.length,
        prompts: promptsRes.data.length,
        news: newsRes.data.length,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Use Cases',
      value: stats.useCases,
      icon: FolderKanban,
      href: './use-cases',
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      label: 'Tools',
      value: stats.tools,
      icon: Wrench,
      href: './tools',
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      label: 'Prompts',
      value: stats.prompts,
      icon: MessageSquareText,
      href: './prompts',
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      label: 'News',
      value: stats.news,
      icon: Newspaper,
      href: './news',
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
    },
  ];

  const quickActions = [
    { label: 'Add Use Case', href: './use-cases/new', icon: FolderKanban },
    { label: 'Add Tool', href: './tools/new', icon: Wrench },
    { label: 'Add Prompt', href: './prompts/new', icon: MessageSquareText },
    { label: 'Add News', href: './news/new', icon: Newspaper },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to the Qoima AI admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition group"
          >
            <div className="flex items-center justify-between">
              <div className={`${stat.bgLight} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 text-gray-700`} />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition" />
            </div>
            <div className="mt-4">
              {loading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              )}
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 group-hover:bg-indigo-200 transition">
                <Plus className="h-5 w-5 text-indigo-600" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-indigo-600 transition">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
