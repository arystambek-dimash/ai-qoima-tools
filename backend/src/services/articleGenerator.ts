import OpenAI from 'openai';
import { query, queryOne } from '../db/index.js';
import { News } from '../types/index.js';

// Initialize OpenAI with gpt-4o-mini for cost efficiency
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface GeneratedContent {
  content: string;
  translations: {
    ru: {
      title: string;
      description: string;
      content: string;
    };
    kk: {
      title: string;
      description: string;
      content: string;
    };
  };
}

// Generate full article content in 3 languages using gpt-4o-mini (cheapest)
export async function generateArticleContent(
  newsId: string
): Promise<GeneratedContent | null> {
  if (!openai) {
    console.error('OpenAI API key not configured');
    return null;
  }

  // Get the news item
  const news = await queryOne<News>(
    'SELECT * FROM news WHERE id = $1',
    [newsId]
  );

  if (!news) {
    console.error(`News item ${newsId} not found`);
    return null;
  }

  try {
    // Generate full article content in English
    const englishContent = await generateEnglishArticle(news);

    // Generate translations in Russian and Kazakh
    const translations = await generateTranslations(news, englishContent);

    // Save to database
    await saveArticleContent(newsId, englishContent, translations);

    return {
      content: englishContent,
      translations,
    };
  } catch (error) {
    console.error('Error generating article content:', error);
    return null;
  }
}

async function generateEnglishArticle(news: News): Promise<string> {
  const prompt = `You are a professional tech journalist. Write a full, engaging article based on this news summary.

Title: ${news.title}
Summary: ${news.description}
Category: ${news.category || 'AI News'}
${news.tags?.length ? `Tags: ${news.tags.join(', ')}` : ''}

Write a professional news article (400-600 words) that:
1. Expands on the summary with relevant context
2. Explains why this matters to AI tool users
3. Includes practical implications or tips where relevant
4. Uses clear, accessible language
5. Has proper paragraph structure (use \\n\\n between paragraphs)

Do NOT include the title - just the article body. Start directly with the first paragraph.
Write in a professional but engaging journalistic style.`;

  const completion = await openai!.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
    temperature: 0.7,
  });

  return completion.choices[0]?.message?.content || news.description;
}

async function generateTranslations(
  news: News,
  englishContent: string
): Promise<GeneratedContent['translations']> {
  // Generate Russian translation
  const ruPrompt = `Translate this news article to Russian. Keep the professional journalistic tone.
Provide the translation in JSON format:
{
  "title": "translated title",
  "description": "translated summary (1-2 sentences)",
  "content": "full translated article"
}

English Title: ${news.title}
English Summary: ${news.description}
English Article:
${englishContent}

Respond ONLY with valid JSON, no markdown.`;

  const ruCompletion = await openai!.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: ruPrompt }],
    max_tokens: 1500,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  let ruTranslation = { title: '', description: '', content: '' };
  try {
    ruTranslation = JSON.parse(ruCompletion.choices[0]?.message?.content || '{}');
  } catch (e) {
    console.error('Failed to parse Russian translation');
  }

  // Generate Kazakh translation
  const kkPrompt = `Translate this news article to Kazakh (Қазақша). Keep the professional journalistic tone.
Provide the translation in JSON format:
{
  "title": "translated title in Kazakh",
  "description": "translated summary in Kazakh (1-2 sentences)",
  "content": "full translated article in Kazakh"
}

English Title: ${news.title}
English Summary: ${news.description}
English Article:
${englishContent}

Respond ONLY with valid JSON, no markdown.`;

  const kkCompletion = await openai!.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: kkPrompt }],
    max_tokens: 1500,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  let kkTranslation = { title: '', description: '', content: '' };
  try {
    kkTranslation = JSON.parse(kkCompletion.choices[0]?.message?.content || '{}');
  } catch (e) {
    console.error('Failed to parse Kazakh translation');
  }

  return {
    ru: ruTranslation,
    kk: kkTranslation,
  };
}

async function saveArticleContent(
  newsId: string,
  englishContent: string,
  translations: GeneratedContent['translations']
): Promise<void> {
  // Update the news content field
  await query(
    'UPDATE news SET content = $1 WHERE id = $2',
    [englishContent, newsId]
  );

  // Save translations
  const fields = ['title', 'description', 'content'] as const;
  const locales = ['ru', 'kk'] as const;

  for (const locale of locales) {
    for (const field of fields) {
      const value = translations[locale][field];
      if (value) {
        await query(
          `INSERT INTO translations (id, entity_type, entity_id, locale, field_name, translated_value, created_at, updated_at)
           VALUES (gen_random_uuid(), 'news', $1, $2, $3, $4, NOW(), NOW())
           ON CONFLICT (entity_type, entity_id, locale, field_name)
           DO UPDATE SET translated_value = EXCLUDED.translated_value, updated_at = NOW()`,
          [newsId, locale, field, value]
        );
      }
    }
  }

  console.log(`Saved article content and translations for news ${newsId}`);
}

// Batch generate articles for news without content
export async function generateMissingArticles(limit: number = 5): Promise<number> {
  const newsWithoutContent = await query<News>(
    `SELECT id FROM news WHERE content IS NULL OR content = '' LIMIT $1`,
    [limit]
  );

  let generated = 0;
  for (const news of newsWithoutContent) {
    const result = await generateArticleContent(news.id);
    if (result) generated++;
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return generated;
}

export default { generateArticleContent, generateMissingArticles };
