// API Response Types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface ApiError {
  error: {
    code: 'VALIDATION_ERROR' | 'NOT_FOUND' | 'CONFLICT' | 'UNAUTHORIZED' | 'RATE_LIMITED' | 'INTERNAL';
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

// Database Entity Types
export interface UseCase {
  id: string;
  slug: string;
  title: string;
  summary: string;
  when_to_use: string | null;
  audience: string | null;
  created_at: Date;
  updated_at: Date;
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
  badges: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface UseCaseTool {
  use_case_id: string;
  tool_id: string;
  rank: number;
  why_this_tool: string | null;
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
  prompt_text: string;
  created_at: Date;
  updated_at: Date;
}

export interface PromptWithTools extends Prompt {
  tool_ids: string[];
}

export interface PromptTool {
  prompt_id: string;
  tool_id: string;
}

export interface ToolUpdate {
  id: string;
  tool_id: string;
  updated_on: Date;
  change_summary: string;
  created_at: Date;
}

export interface News {
  id: string;
  title: string;
  description: string;
  source_url: string | null;
  published_on: Date;
  created_at: Date;
  // Extended fields for automated collection
  category: string | null;
  image_url: string | null;
  source_type: 'manual' | 'twitter' | 'rss' | 'scrape';
  ai_generated: boolean;
  tool_id: string | null;
  tags: string[] | null;
  engagement_score: number;
  is_featured: boolean;
  // Full article content
  content: string | null;
  slug: string | null;
}

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  unsubscribe_token: string;
  created_at: Date;
  unsubscribed_at: Date | null;
}

// AI Request/Response Types
export interface WrapperRunRequest {
  userTask: string;
  input?: string;
}

export interface WrapperRunResponse {
  result: string;
  suggestions?: string[];
}

export interface AssistantMessageRequest {
  message: string;
}

export interface AssistantMessageResponse {
  answer: string;
  recommended_use_cases: { id: string; slug: string; title: string }[];
  recommended_tools: { id: string; slug: string; name: string }[];
}

// Admin Types
export interface CreateUseCaseRequest {
  slug: string;
  title: string;
  summary: string;
  when_to_use?: string;
  audience?: string;
}

export interface UpdateUseCaseRequest {
  slug?: string;
  title?: string;
  summary?: string;
  when_to_use?: string;
  audience?: string;
}

export interface CreateToolRequest {
  slug: string;
  name: string;
  short_description: string;
  long_description?: string;
  categories?: string[];
  limitations?: string;
  external_url?: string;
  badges?: Record<string, unknown>;
}

export interface UpdateToolRequest {
  slug?: string;
  name?: string;
  short_description?: string;
  long_description?: string;
  categories?: string[];
  limitations?: string;
  external_url?: string;
  badges?: Record<string, unknown>;
}

export interface CreatePromptRequest {
  slug: string;
  title: string;
  category?: string;
  use_case_id?: string;
  prompt_text: string;
}

export interface UpdatePromptRequest {
  slug?: string;
  title?: string;
  category?: string;
  use_case_id?: string;
  prompt_text?: string;
}

export interface CreateNewsRequest {
  title: string;
  description: string;
  source_url?: string;
  published_on?: string;
}

export interface UpdateNewsRequest {
  title?: string;
  description?: string;
  source_url?: string;
  published_on?: string;
}

export interface CreateToolUpdateRequest {
  tool_id: string;
  updated_on?: string;
  change_summary: string;
}
