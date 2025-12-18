const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1';

let adminToken: string | null = null;

export function setAdminToken(token: string) {
  adminToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
  }
}

export function getAdminToken(): string | null {
  if (adminToken) return adminToken;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

export function clearAdminToken() {
  adminToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
  }
}

async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getAdminToken();
  if (!token) {
    throw new Error('Admin token not set');
  }

  const res = await fetch(`${API_BASE}/admin${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    let errorMessage = `Request failed with status ${res.status}`;
    try {
      const errorBody = await res.text();
      if (errorBody) {
        const error = JSON.parse(errorBody);
        errorMessage = error.error?.message || error.message || errorMessage;
      }
    } catch {
      // Ignore parse errors, use default message
    }
    throw new Error(errorMessage);
  }

  // Handle 204 No Content (empty response)
  if (res.status === 204) {
    return undefined as T;
  }

  // Check if response has content before parsing
  const contentLength = res.headers.get('content-length');
  const contentType = res.headers.get('content-type');

  if (contentLength === '0' || !contentType?.includes('application/json')) {
    return undefined as T;
  }

  try {
    return await res.json();
  } catch {
    return undefined as T;
  }
}

// Types
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

export interface Prompt {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  use_case_id: string | null;
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
}

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

// Use Cases Admin API
export async function getUseCases(): Promise<ApiResponse<UseCase[]>> {
  return adminFetch('/use-cases');
}

export async function getUseCase(id: string): Promise<ApiResponse<UseCase>> {
  return adminFetch(`/use-cases/${id}`);
}

export async function createUseCase(data: {
  slug: string;
  title: string;
  summary: string;
  when_to_use?: string;
  audience?: string;
}): Promise<ApiResponse<UseCase>> {
  return adminFetch('/use-cases', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateUseCase(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    summary: string;
    when_to_use: string;
    audience: string;
  }>
): Promise<ApiResponse<UseCase>> {
  return adminFetch(`/use-cases/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteUseCase(id: string): Promise<void> {
  await adminFetch(`/use-cases/${id}`, { method: 'DELETE' });
}

// Tools Admin API
export async function getTools(): Promise<ApiResponse<Tool[]>> {
  return adminFetch('/tools');
}

export async function getTool(id: string): Promise<ApiResponse<Tool>> {
  return adminFetch(`/tools/${id}`);
}

export async function createTool(data: {
  slug: string;
  name: string;
  short_description: string;
  long_description?: string;
  categories?: string[];
  limitations?: string;
  external_url?: string;
  badges?: { popular?: boolean; free_tier?: boolean };
}): Promise<ApiResponse<Tool>> {
  return adminFetch('/tools', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateTool(
  id: string,
  data: Partial<{
    slug: string;
    name: string;
    short_description: string;
    long_description: string;
    categories: string[];
    limitations: string;
    external_url: string;
    badges: { popular?: boolean; free_tier?: boolean };
  }>
): Promise<ApiResponse<Tool>> {
  return adminFetch(`/tools/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteTool(id: string): Promise<void> {
  await adminFetch(`/tools/${id}`, { method: 'DELETE' });
}

// Link tool to use case
export async function linkToolToUseCase(
  toolId: string,
  useCaseId: string,
  data: { rank: number; why_this_tool?: string }
): Promise<ApiResponse<{ tool_id: string; use_case_id: string; rank: number; why_this_tool: string | null }>> {
  return adminFetch(`/tools/${toolId}/use-cases/${useCaseId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function unlinkToolFromUseCase(toolId: string, useCaseId: string): Promise<void> {
  await adminFetch(`/tools/${toolId}/use-cases/${useCaseId}`, { method: 'DELETE' });
}

// Prompts Admin API
export async function getPrompts(): Promise<ApiResponse<Prompt[]>> {
  return adminFetch('/prompts');
}

export async function getPrompt(id: string): Promise<ApiResponse<Prompt>> {
  return adminFetch(`/prompts/${id}`);
}

export async function createPrompt(data: {
  slug: string;
  title: string;
  prompt_text: string;
  category?: string;
  use_case_id?: string;
}): Promise<ApiResponse<Prompt>> {
  return adminFetch('/prompts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePrompt(
  id: string,
  data: Partial<{
    slug: string;
    title: string;
    prompt_text: string;
    category: string;
    use_case_id: string;
  }>
): Promise<ApiResponse<Prompt>> {
  return adminFetch(`/prompts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deletePrompt(id: string): Promise<void> {
  await adminFetch(`/prompts/${id}`, { method: 'DELETE' });
}

// News Admin API
export async function getNews(): Promise<ApiResponse<News[]>> {
  return adminFetch('/news');
}

export async function getNewsItem(id: string): Promise<ApiResponse<News>> {
  return adminFetch(`/news/${id}`);
}

export async function createNews(data: {
  title: string;
  description: string;
  source_url?: string;
  published_on: string;
}): Promise<ApiResponse<News>> {
  return adminFetch('/news', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateNews(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    source_url: string;
    published_on: string;
  }>
): Promise<ApiResponse<News>> {
  return adminFetch(`/news/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteNews(id: string): Promise<void> {
  await adminFetch(`/news/${id}`, { method: 'DELETE' });
}

// Fetch news from X via Grok
export async function fetchNewsFromX(): Promise<ApiResponse<News[]>> {
  return adminFetch('/news/fetch-from-x', {
    method: 'POST',
  });
}

// Verify admin token
export async function verifyToken(): Promise<boolean> {
  try {
    await adminFetch('/use-cases');
    return true;
  } catch {
    return false;
  }
}
