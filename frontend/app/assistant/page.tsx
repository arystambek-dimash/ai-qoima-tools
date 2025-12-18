'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, Bot, User, Loader2, Sparkles, ArrowRight, Zap, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { sendAssistantMessage, type AssistantResponse } from '@/lib/api';
import { useTranslations, useLocale } from 'next-intl';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  recommendations?: {
    useCases: { id: string; slug: string; title: string }[];
    tools: { id: string; slug: string; name: string }[];
  };
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('assistant');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const suggestedQuestions = [
    {
      icon: Lightbulb,
      question: t('example1'),
      description: t('contentCreation'),
    },
    {
      icon: Target,
      question: t('example2'),
      description: t('visualContent'),
    },
    {
      icon: Zap,
      question: t('example3'),
      description: t('productivity'),
    },
    {
      icon: TrendingUp,
      question: t('freeToolsQuestion'),
      description: t('budgetFriendly'),
    },
  ];

  const capabilities = [
    t('capability1'),
    t('capability2'),
    t('capability3'),
    t('capability4'),
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await sendAssistantMessage(userMessage, locale);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer,
          recommendations: {
            useCases: data.recommended_use_cases,
            tools: data.recommended_tools,
          },
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: t('errorMessage'),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const isEmptyState = messages.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-lg text-gray-500">
          {t('subtitle')}
        </p>
      </div>

      {/* Chat container */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        {/* Messages or Empty State */}
        <div className={`overflow-y-auto p-6 ${isEmptyState ? 'min-h-[400px]' : 'h-[400px]'}`}>
          {isEmptyState ? (
            <div className="flex flex-col items-center justify-center h-full">
              {/* Capabilities */}
              <div className="mb-8 text-center">
                <p className="text-sm font-medium text-gray-500 mb-3">{t('canHelp')}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {capabilities.map((capability, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-xs text-gray-600 ring-1 ring-inset ring-gray-200"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Questions - ChatGPT Style */}
              <div className="w-full max-w-2xl">
                <p className="text-sm font-medium text-gray-500 mb-4 text-center">{t('tryAsking')}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestedQuestions.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(item.question)}
                      className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/50 hover:shadow-sm"
                    >
                      <div className="rounded-lg bg-indigo-100 p-2 transition-colors group-hover:bg-indigo-200">
                        <item.icon className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                          {item.question}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    {/* Recommendations */}
                    {message.recommendations && (
                      <div className="mt-4 space-y-3">
                        {message.recommendations.useCases.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                              {t('recommendedUseCases')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.recommendations.useCases.map((uc) => (
                                <Link
                                  key={uc.id}
                                  href={`/use-cases/${uc.slug}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-indigo-200 transition-colors"
                                >
                                  {uc.title}
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        {message.recommendations.tools.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                              {t('recommendedTools')}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {message.recommendations.tools.map((tool) => (
                                <Link
                                  key={tool.id}
                                  href={`/tools/${tool.slug}`}
                                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-emerald-600 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                                >
                                  {tool.name}
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-200">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="rounded-2xl bg-gray-100 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      <span className="text-sm text-gray-500">{t('thinking')}</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('placeholder')}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label={t('send')}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-white transition-all hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
