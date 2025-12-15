import { Router, Request, Response, NextFunction } from 'express';
import { query } from '../db/index.js';
import {
  ApiResponse,
  WrapperRunRequest,
  WrapperRunResponse,
  AssistantMessageRequest,
  AssistantMessageResponse,
  UseCase,
  Tool,
} from '../types/index.js';
import { validationError } from '../middleware/errorHandler.js';
import OpenAI from 'openai';

const router = Router();

// Initialize OpenAI client (if API key is available)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// POST /api/v1/ai/wrapper-runs
router.post('/wrapper-runs', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userTask, input } = req.body as WrapperRunRequest;

    if (!userTask || typeof userTask !== 'string') {
      throw validationError('userTask is required');
    }

    let result: string;
    let suggestions: string[] = [];

    if (openai) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant that helps users complete tasks.
You are part of the Qoima AI Tools Navigator platform.
Be concise and provide actionable results.
If the user provides input data, use it in your response.`,
          },
          {
            role: 'user',
            content: input
              ? `Task: ${userTask}\n\nInput data:\n${input}`
              : `Task: ${userTask}`,
          },
        ],
        max_tokens: 1000,
      });

      result = completion.choices[0]?.message?.content || 'Unable to generate result';
      suggestions = [
        'Try being more specific with your task description',
        'Include examples of the desired output',
        'Break down complex tasks into smaller steps',
      ];
    } else {
      // Mock response when no API key
      result = `[Demo Mode] Here's a sample response for: "${userTask}"

Since no AI API key is configured, this is a demonstration response.

To enable real AI responses:
1. Set OPENAI_API_KEY in your .env file
2. Restart the server

Your task: ${userTask}
${input ? `\nYour input: ${input}` : ''}`;
      suggestions = [
        'Configure OPENAI_API_KEY for real responses',
        'Try different AI tools from our catalog',
      ];
    }

    const response: ApiResponse<WrapperRunResponse> = {
      data: { result, suggestions },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/ai/assistant-messages
router.post('/assistant-messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body as AssistantMessageRequest;

    if (!message || typeof message !== 'string') {
      throw validationError('message is required');
    }

    // Get use cases and tools for context
    const useCases = await query<UseCase>(`SELECT id, slug, title, summary FROM use_cases`);
    const tools = await query<Tool>(`SELECT id, slug, name, short_description, categories FROM tools`);

    let answer: string;
    let recommendedUseCases: { id: string; slug: string; title: string }[] = [];
    let recommendedTools: { id: string; slug: string; name: string }[] = [];

    if (openai) {
      const systemPrompt = `You are the Qoima AI Tools Navigator assistant. Help users find the right AI tools and use cases for their needs.

Available Use Cases:
${useCases.map((uc) => `- ${uc.title}: ${uc.summary}`).join('\n')}

Available Tools:
${tools.map((t) => `- ${t.name}: ${t.short_description} (Categories: ${t.categories.join(', ')})`).join('\n')}

Based on the user's question:
1. Provide a helpful, concise answer
2. Recommend relevant use cases (if any match)
3. Recommend relevant tools (if any match)

Format your response as JSON:
{
  "answer": "Your helpful response",
  "use_case_slugs": ["slug1", "slug2"],
  "tool_slugs": ["slug1", "slug2"]
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 1000,
      });

      try {
        const parsed = JSON.parse(completion.choices[0]?.message?.content || '{}');
        answer = parsed.answer || 'I can help you find the right AI tools. Could you tell me more about what you want to accomplish?';

        if (parsed.use_case_slugs?.length) {
          recommendedUseCases = useCases
            .filter((uc) => parsed.use_case_slugs.includes(uc.slug))
            .map((uc) => ({ id: uc.id, slug: uc.slug, title: uc.title }));
        }

        if (parsed.tool_slugs?.length) {
          recommendedTools = tools
            .filter((t) => parsed.tool_slugs.includes(t.slug))
            .map((t) => ({ id: t.id, slug: t.slug, name: t.name }));
        }
      } catch {
        answer = completion.choices[0]?.message?.content || 'I can help you find the right AI tools.';
      }
    } else {
      // Mock response when no API key
      answer = `[Demo Mode] Thanks for your question: "${message}"

I'm the Qoima AI assistant, here to help you find the right AI tools for your needs.

Since no AI API key is configured, I'll suggest some popular options:

To get personalized recommendations, configure OPENAI_API_KEY in the backend .env file.`;

      // Provide some default recommendations
      recommendedUseCases = useCases.slice(0, 2).map((uc) => ({
        id: uc.id,
        slug: uc.slug,
        title: uc.title,
      }));

      recommendedTools = tools.slice(0, 3).map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
      }));
    }

    const response: ApiResponse<AssistantMessageResponse> = {
      data: {
        answer,
        recommended_use_cases: recommendedUseCases,
        recommended_tools: recommendedTools,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
