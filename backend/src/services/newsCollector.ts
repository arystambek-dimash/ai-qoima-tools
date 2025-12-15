import OpenAI from 'openai';
import { query, queryOne } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';

// Initialize OpenAI
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// News sources to fetch from
const NEWS_SOURCES = {
  rss: [
    { name: 'OpenAI Blog', url: 'https://openai.com/blog/rss.xml', category: 'AI Updates' },
    { name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss.xml', category: 'AI Updates' },
    { name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', category: 'AI Research' },
    { name: 'MIT Technology Review AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', category: 'AI News' },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'AI Business' },
  ],
  // AI tool-related search queries for web search
  searchQueries: [
    'ChatGPT new features update',
    'Claude AI update Anthropic',
    'Midjourney new version',
    'Cursor AI IDE update',
    'GitHub Copilot news',
    'AI tools productivity tips',
    'best AI prompts',
    'AI assistant tips tricks',
  ],
};

// Tool name to ID mapping (will be loaded from DB)
let toolMapping: Record<string, string> = {};

interface RawNewsItem {
  title: string;
  description: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: Date;
  category: string;
  imageUrl?: string;
  relatedToolSlug?: string;
}

interface GeneratedArticle {
  title: string;
  description: string;
  category: string;
  tags: string[];
  toolSlug?: string;
}

// Load tool mapping from database
async function loadToolMapping(): Promise<void> {
  try {
    const tools = await query<{ id: string; slug: string; name: string }>(
      'SELECT id, slug, name FROM tools'
    );
    toolMapping = {};
    tools.forEach(tool => {
      toolMapping[tool.slug.toLowerCase()] = tool.id;
      toolMapping[tool.name.toLowerCase()] = tool.id;
    });
    console.log(`Loaded ${Object.keys(toolMapping).length / 2} tools for mapping`);
  } catch (error) {
    console.error('Error loading tool mapping:', error);
  }
}

// Parse RSS feed
async function parseRSSFeed(url: string): Promise<RawNewsItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'QoimaAI News Collector/1.0',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch RSS from ${url}: ${response.status}`);
      return [];
    }

    const xml = await response.text();
    const items: RawNewsItem[] = [];

    // Simple XML parsing for RSS items
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    for (const itemXml of itemMatches.slice(0, 10)) { // Limit to 10 items per feed
      const title = extractXMLValue(itemXml, 'title') || '';
      const description = extractXMLValue(itemXml, 'description') ||
                         extractXMLValue(itemXml, 'content:encoded') || '';
      const link = extractXMLValue(itemXml, 'link') || '';
      const pubDate = extractXMLValue(itemXml, 'pubDate') || '';
      const imageUrl = extractImageFromContent(itemXml);

      if (title && link) {
        items.push({
          title: cleanHTML(title),
          description: cleanHTML(description).slice(0, 500),
          sourceUrl: link,
          sourceName: url,
          publishedAt: pubDate ? new Date(pubDate) : new Date(),
          category: 'AI News',
          imageUrl,
        });
      }
    }

    return items;
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error);
    return [];
  }
}

// Extract value from XML tag
function extractXMLValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? (match[1] || match[2] || '').trim() : null;
}

// Extract image URL from content
function extractImageFromContent(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  const mediaMatch = content.match(/<media:content[^>]+url=["']([^"']+)["']/i);
  const enclosureMatch = content.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  return imgMatch?.[1] || mediaMatch?.[1] || enclosureMatch?.[1];
}

// Clean HTML tags
function cleanHTML(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Detect which AI tool the news is about
function detectRelatedTool(title: string, description: string): string | undefined {
  const text = `${title} ${description}`.toLowerCase();

  const toolKeywords: Record<string, string[]> = {
    'chatgpt': ['chatgpt', 'chat gpt', 'openai gpt', 'gpt-4', 'gpt-5', 'gpt4', 'gpt5'],
    'claude': ['claude', 'anthropic claude', 'claude 3', 'claude-3'],
    'midjourney': ['midjourney', 'mid journey', 'mj v6', 'mj v7'],
    'cursor': ['cursor ai', 'cursor ide', 'cursor editor'],
    'github-copilot': ['copilot', 'github copilot'],
    'dall-e': ['dall-e', 'dalle', 'dall e 3'],
    'canva': ['canva ai', 'canva magic'],
    'perplexity': ['perplexity', 'perplexity ai'],
    'gemini': ['gemini', 'google gemini', 'bard'],
    'notion-ai': ['notion ai', 'notion'],
  };

  for (const [slug, keywords] of Object.entries(toolKeywords)) {
    if (keywords.some(kw => text.includes(kw))) {
      return slug;
    }
  }

  return undefined;
}

// Use AI to enhance and categorize news
async function enhanceWithAI(items: RawNewsItem[]): Promise<GeneratedArticle[]> {
  if (!openai || items.length === 0) {
    return items.map(item => ({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: [],
      toolSlug: item.relatedToolSlug,
    }));
  }

  const enhanced: GeneratedArticle[] = [];

  for (const item of items) {
    try {
      const prompt = `Analyze this AI news item and provide:
1. A concise, engaging title (max 80 chars)
2. A clear summary (2-3 sentences, max 200 chars) explaining why this matters to AI tool users
3. A category from: "New Features", "Tips & Tricks", "Industry News", "Tutorial", "Product Launch", "AI Research"
4. 3-5 relevant tags
5. If this is about a specific AI tool, identify it

News Title: ${item.title}
Description: ${item.description}

Respond in JSON format:
{
  "title": "...",
  "description": "...",
  "category": "...",
  "tags": ["tag1", "tag2"],
  "toolSlug": "chatgpt|claude|midjourney|cursor|etc or null"
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        max_tokens: 300,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        enhanced.push({
          title: parsed.title || item.title,
          description: parsed.description || item.description,
          category: parsed.category || item.category,
          tags: parsed.tags || [],
          toolSlug: parsed.toolSlug || item.relatedToolSlug,
        });
      }
    } catch (error) {
      console.error('Error enhancing news with AI:', error);
      enhanced.push({
        title: item.title,
        description: item.description,
        category: item.category,
        tags: [],
        toolSlug: item.relatedToolSlug,
      });
    }
  }

  return enhanced;
}

// Check if news already exists (deduplication)
async function newsExists(title: string, sourceUrl: string): Promise<boolean> {
  const existing = await queryOne<{ id: string }>(
    `SELECT id FROM news WHERE title = $1 OR source_url = $2`,
    [title, sourceUrl]
  );
  return !!existing;
}

// Save news to database
async function saveNews(
  item: GeneratedArticle,
  raw: RawNewsItem
): Promise<boolean> {
  try {
    // Check for duplicates
    if (await newsExists(item.title, raw.sourceUrl)) {
      console.log(`Skipping duplicate: ${item.title}`);
      return false;
    }

    const toolId = item.toolSlug ? toolMapping[item.toolSlug.toLowerCase()] : null;

    await query(
      `INSERT INTO news (
        id, title, description, source_url, published_on, created_at,
        category, image_url, source_type, ai_generated, tool_id, tags
      ) VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, $10, $11)`,
      [
        uuidv4(),
        item.title,
        item.description,
        raw.sourceUrl,
        raw.publishedAt,
        item.category,
        raw.imageUrl,
        'rss',
        openai ? true : false,
        toolId,
        item.tags,
      ]
    );

    console.log(`Saved news: ${item.title}`);
    return true;
  } catch (error) {
    console.error('Error saving news:', error);
    return false;
  }
}

// Generate AI tips/tricks articles
async function generateTipsArticle(toolSlug: string): Promise<GeneratedArticle | null> {
  if (!openai) return null;

  const toolNames: Record<string, string> = {
    'chatgpt': 'ChatGPT',
    'claude': 'Claude',
    'midjourney': 'Midjourney',
    'cursor': 'Cursor',
    'dall-e': 'DALL-E',
  };

  const toolName = toolNames[toolSlug];
  if (!toolName) return null;

  try {
    const prompt = `Generate a useful tip or trick for using ${toolName} that would help users get better results.
Focus on practical advice that even beginners can use.

Respond in JSON:
{
  "title": "A catchy title for the tip (max 60 chars)",
  "description": "The tip explained clearly (2-3 sentences, max 200 chars)",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 250,
    });

    const content = completion.choices[0]?.message?.content;
    if (content) {
      const parsed = JSON.parse(content);
      return {
        title: parsed.title,
        description: parsed.description,
        category: 'Tips & Tricks',
        tags: parsed.tags || [],
        toolSlug,
      };
    }
  } catch (error) {
    console.error(`Error generating tips for ${toolName}:`, error);
  }

  return null;
}

// Main collection function
export async function collectNews(): Promise<{ collected: number; saved: number }> {
  console.log('Starting news collection...');
  let collected = 0;
  let saved = 0;

  // Load tool mapping
  await loadToolMapping();

  // Collect from RSS feeds
  const allRawItems: RawNewsItem[] = [];

  for (const source of NEWS_SOURCES.rss) {
    console.log(`Fetching from ${source.name}...`);
    const items = await parseRSSFeed(source.url);
    items.forEach(item => {
      item.category = source.category;
      item.relatedToolSlug = detectRelatedTool(item.title, item.description);
    });
    allRawItems.push(...items);
    collected += items.length;
  }

  console.log(`Collected ${collected} raw items from RSS feeds`);

  // Filter to only last 24 hours
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentItems = allRawItems.filter(item => item.publishedAt > oneDayAgo);

  console.log(`${recentItems.length} items from last 24 hours`);

  // Enhance with AI
  const enhancedItems = await enhanceWithAI(recentItems);

  // Save to database
  for (let i = 0; i < enhancedItems.length; i++) {
    const success = await saveNews(enhancedItems[i], recentItems[i]);
    if (success) saved++;
  }

  // Generate tips articles (1 per run, rotating through tools)
  const toolSlugs = ['chatgpt', 'claude', 'midjourney', 'cursor', 'dall-e'];
  const randomTool = toolSlugs[Math.floor(Math.random() * toolSlugs.length)];
  const tipsArticle = await generateTipsArticle(randomTool);

  if (tipsArticle) {
    const tipsRaw: RawNewsItem = {
      title: tipsArticle.title,
      description: tipsArticle.description,
      sourceUrl: `https://qoima.ai/tips/${randomTool}/${Date.now()}`,
      sourceName: 'Qoima AI',
      publishedAt: new Date(),
      category: tipsArticle.category,
    };

    const tipsSaved = await saveNews(tipsArticle, tipsRaw);
    if (tipsSaved) saved++;
  }

  console.log(`News collection complete. Collected: ${collected}, Saved: ${saved}`);
  return { collected, saved };
}

// Export for use in cron job
export default { collectNews };
