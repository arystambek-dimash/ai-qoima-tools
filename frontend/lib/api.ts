const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface UseCase {
  id: string;
  slug: string;
  title: string;
  summary: string;
  when_to_use: string | null;
  audience: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  long_description: string | null;
  categories: string[];
  limitations: string | null;
  external_url: string | null;
  badges: { popular?: boolean; free_tier?: boolean };
  created_at: string;
  updated_at: string;
}

export interface UseCaseWithTools extends UseCase {
  tools: (Tool & { rank: number; why_this_tool: string | null })[];
}

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  use_case_id: string | null;
  tool_id: string | null;
  prompt_text: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  description: string;
  source_url: string | null;
  published_on: string;
  created_at: string;
  content: string | null;
  slug: string | null;
  category: string | null;
  image_url: string | null;
  tags: string[] | null;
  is_featured: boolean;
}

export interface NewsWithRelated extends News {
  related: News[];
}

export interface AssistantResponse {
  answer: string;
  recommended_use_cases: { id: string; slug: string; title: string }[];
  recommended_tools: { id: string; slug: string; name: string }[];
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(error.error?.message || 'Request failed');
  }

  return res.json();
}

// Helper to add locale to query params
function addLocaleParam(searchParams: URLSearchParams, locale?: string): void {
  if (locale && locale !== 'en') {
    searchParams.set('locale', locale);
  }
}

// Use Cases
export async function getUseCases(locale?: string): Promise<ApiResponse<UseCase[]>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/use-cases${query ? `?${query}` : ''}`);
}

export async function getUseCaseBySlug(slug: string, locale?: string): Promise<ApiResponse<UseCase>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/use-cases/slug/${slug}${query ? `?${query}` : ''}`);
}

export async function getUseCaseWithTools(id: string, locale?: string): Promise<ApiResponse<UseCaseWithTools>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/use-cases/${id}/tools${query ? `?${query}` : ''}`);
}

// Tools
export async function getTools(params?: { category?: string; search?: string; locale?: string }): Promise<ApiResponse<Tool[]>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.search) searchParams.set('search', params.search);
  addLocaleParam(searchParams, params?.locale);
  const query = searchParams.toString();
  return fetchApi(`/tools${query ? `?${query}` : ''}`);
}

export async function getToolBySlug(slug: string, locale?: string): Promise<ApiResponse<Tool>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/tools/slug/${slug}${query ? `?${query}` : ''}`);
}

export async function getToolCategories(): Promise<ApiResponse<string[]>> {
  return fetchApi('/tools/categories');
}

// Prompts
export async function getPrompts(params?: { category?: string; use_case_id?: string; tool_id?: string; locale?: string }): Promise<ApiResponse<Prompt[]>> {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);
  if (params?.use_case_id) searchParams.set('use_case_id', params.use_case_id);
  if (params?.tool_id) searchParams.set('tool_id', params.tool_id);
  addLocaleParam(searchParams, params?.locale);
  const query = searchParams.toString();
  return fetchApi(`/prompts${query ? `?${query}` : ''}`);
}

export async function getPromptBySlug(slug: string, locale?: string): Promise<ApiResponse<Prompt>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/prompts/slug/${slug}${query ? `?${query}` : ''}`);
}

export async function getPromptCategories(): Promise<ApiResponse<string[]>> {
  return fetchApi('/prompts/categories');
}

// News
export async function getNews(locale?: string): Promise<ApiResponse<News[]>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/news${query ? `?${query}` : ''}`);
}

export async function getNewsById(idOrSlug: string, locale?: string): Promise<ApiResponse<NewsWithRelated>> {
  const searchParams = new URLSearchParams();
  addLocaleParam(searchParams, locale);
  const query = searchParams.toString();
  return fetchApi(`/news/${idOrSlug}${query ? `?${query}` : ''}`);
}

// Newsletter
export async function subscribe(email: string): Promise<ApiResponse<{ message: string }>> {
  return fetchApi('/subscribers', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// AI Assistant
export async function sendAssistantMessage(message: string, locale?: string): Promise<ApiResponse<AssistantResponse>> {
  return fetchApi('/ai/assistant-messages', {
    method: 'POST',
    body: JSON.stringify({ message, locale }),
  });
}
