-- Qoima AI Tools Navigator - Seed Data

-- Insert Use Cases (5+ use cases)
INSERT INTO use_cases (id, slug, title, summary, when_to_use, audience) VALUES
('11111111-1111-1111-1111-111111111111', 'write-marketing-copy',
 'Write Marketing Copy',
 'Create compelling marketing content, ads, and promotional materials with AI assistance.',
 'When you need to write product descriptions, ad copy, email campaigns, social media posts, or any promotional content.',
 'Marketers, small business owners, content creators'),

('22222222-2222-2222-2222-222222222222', 'analyze-business-data',
 'Analyze Business Data',
 'Turn raw data into actionable insights using AI-powered analysis tools.',
 'When you have spreadsheets, sales data, customer feedback, or any business metrics that need interpretation.',
 'Business analysts, managers, entrepreneurs'),

('33333333-3333-3333-3333-333333333333', 'build-website',
 'Build a Website',
 'Design and develop websites faster with AI assistance for code, design, and content.',
 'When starting a new website project, redesigning an existing site, or need help with web development.',
 'Web developers, designers, business owners'),

('44444444-4444-4444-4444-444444444444', 'create-presentations',
 'Create Presentations',
 'Design professional slides and visual content with AI-powered tools.',
 'When preparing for meetings, pitches, training sessions, or any presentation needs.',
 'Professionals, educators, salespeople'),

('55555555-5555-5555-5555-555555555555', 'automate-workflows',
 'Automate Workflows',
 'Streamline repetitive tasks and processes using AI automation tools.',
 'When you spend too much time on repetitive tasks like data entry, email responses, or file organization.',
 'Operations teams, administrators, anyone doing repetitive work'),

('66666666-6666-6666-6666-666666666666', 'generate-images',
 'Generate Images',
 'Create stunning visuals, illustrations, and graphics using AI image generators.',
 'When you need custom images, illustrations, product mockups, or creative visuals without hiring a designer.',
 'Content creators, marketers, designers, social media managers'),

('77777777-7777-7777-7777-777777777777', 'write-code',
 'Write Code',
 'Accelerate software development with AI coding assistants and code generation tools.',
 'When building software, debugging issues, learning new programming concepts, or need code explanations.',
 'Developers, programmers, students learning to code')
ON CONFLICT (id) DO NOTHING;

-- Insert Tools (10+ tools)
INSERT INTO tools (id, slug, name, short_description, long_description, categories, limitations, external_url, badges) VALUES
('aaaa1111-1111-1111-1111-111111111111', 'chatgpt',
 'ChatGPT',
 'Versatile AI assistant for writing, analysis, coding, and creative tasks.',
 'ChatGPT by OpenAI is one of the most popular AI assistants. It can help with writing, answering questions, brainstorming, coding, and much more. The free version uses GPT-3.5, while Plus subscribers get access to GPT-4.',
 ARRAY['Writing', 'Coding', 'Analysis', 'General'],
 'May produce outdated information. Free version has usage limits. Cannot browse the internet in the free tier.',
 'https://chat.openai.com',
 '{"popular": true, "free_tier": true}'),

('aaaa2222-2222-2222-2222-222222222222', 'claude',
 'Claude',
 'AI assistant with strong reasoning and coding capabilities.',
 'Claude by Anthropic excels at thoughtful, nuanced responses. It is particularly good at coding tasks, analysis, and handling long documents. Known for being helpful while avoiding harmful outputs.',
 ARRAY['Writing', 'Coding', 'Analysis', 'Research'],
 'No image generation. Usage limits on free tier. Cannot browse the internet.',
 'https://claude.ai',
 '{"popular": true, "free_tier": true}'),

('aaaa3333-3333-3333-3333-333333333333', 'midjourney',
 'Midjourney',
 'Create stunning AI-generated artwork and images.',
 'Midjourney is a leading AI image generator known for its artistic, high-quality outputs. It works through Discord and can create everything from realistic photos to fantastical artwork based on text prompts.',
 ARRAY['Image Generation', 'Design', 'Art'],
 'Requires Discord. No free tier anymore. Can struggle with text in images and specific details.',
 'https://www.midjourney.com',
 '{"popular": true, "free_tier": false}'),

('aaaa4444-4444-4444-4444-444444444444', 'dall-e',
 'DALL-E',
 'OpenAI''s image generation tool integrated with ChatGPT.',
 'DALL-E 3 is OpenAI''s latest image generation model, now integrated into ChatGPT. It creates high-quality images from text descriptions and is particularly good at following complex prompts.',
 ARRAY['Image Generation', 'Design'],
 'Limited free generations. Part of ChatGPT Plus subscription. Some content restrictions.',
 'https://openai.com/dall-e-3',
 '{"popular": true, "free_tier": true}'),

('aaaa5555-5555-5555-5555-555555555555', 'canva',
 'Canva',
 'Design platform with AI features for creating marketing materials.',
 'Canva is a popular design tool that now includes AI features like Magic Write for text and Magic Design for layouts. Perfect for creating social media posts, presentations, and marketing materials.',
 ARRAY['Design', 'Presentations', 'Marketing'],
 'Advanced AI features require Pro subscription. Limited customization compared to professional tools.',
 'https://www.canva.com',
 '{"popular": true, "free_tier": true}'),

('aaaa6666-6666-6666-6666-666666666666', 'notion-ai',
 'Notion AI',
 'AI-powered writing and organization within Notion workspace.',
 'Notion AI helps you write, brainstorm, summarize, and organize content directly in your Notion workspace. Great for note-taking, documentation, and project management.',
 ARRAY['Writing', 'Productivity', 'Organization'],
 'Requires Notion subscription plus AI add-on. Works only within Notion ecosystem.',
 'https://www.notion.so/product/ai',
 '{"popular": true, "free_tier": false}'),

('aaaa7777-7777-7777-7777-777777777777', 'github-copilot',
 'GitHub Copilot',
 'AI pair programmer that suggests code as you type.',
 'GitHub Copilot uses AI to suggest code completions, entire functions, and help you write code faster. It integrates with VS Code, JetBrains, and other popular editors.',
 ARRAY['Coding', 'Development'],
 'Paid subscription required. May suggest code with licensing issues. Best with popular languages.',
 'https://github.com/features/copilot',
 '{"popular": true, "free_tier": false}'),

('aaaa8888-8888-8888-8888-888888888888', 'jasper',
 'Jasper',
 'AI writing assistant focused on marketing and business content.',
 'Jasper is designed specifically for marketing teams. It helps create blog posts, ads, emails, and social media content with templates optimized for conversion.',
 ARRAY['Writing', 'Marketing', 'Content'],
 'Relatively expensive. Works best with specific templates. May need editing for brand voice.',
 'https://www.jasper.ai',
 '{"popular": true, "free_tier": false}'),

('aaaa9999-9999-9999-9999-999999999999', 'copy-ai',
 'Copy.ai',
 'Generate marketing copy and content quickly.',
 'Copy.ai specializes in short-form marketing content like ads, product descriptions, and social media posts. It offers many templates for different content types.',
 ARRAY['Writing', 'Marketing', 'Content'],
 'Free tier is limited. Better for short-form than long-form content.',
 'https://www.copy.ai',
 '{"popular": false, "free_tier": true}'),

('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'runway',
 'Runway',
 'AI-powered video editing and generation platform.',
 'Runway offers AI tools for video editing, including background removal, text-to-video, and image-to-video generation. Popular among content creators and filmmakers.',
 ARRAY['Video', 'Design', 'Content'],
 'Complex videos require significant credits. Learning curve for advanced features.',
 'https://runwayml.com',
 '{"popular": true, "free_tier": true}'),

('bbbb1111-1111-1111-1111-111111111111', 'cursor',
 'Cursor',
 'AI-first code editor built for pair programming with AI.',
 'Cursor is a code editor designed from the ground up for AI assistance. It features built-in AI chat, code generation, and intelligent code editing with context awareness.',
 ARRAY['Coding', 'Development'],
 'New product, still evolving. Requires subscription for full features.',
 'https://cursor.sh',
 '{"popular": true, "free_tier": true}'),

('bbbb2222-2222-2222-2222-222222222222', 'perplexity',
 'Perplexity',
 'AI search engine with cited sources and real-time information.',
 'Perplexity combines AI with real-time web search to answer questions with cited sources. Great for research and getting up-to-date information.',
 ARRAY['Research', 'Search', 'Analysis'],
 'Pro features require subscription. May not always find niche information.',
 'https://www.perplexity.ai',
 '{"popular": true, "free_tier": true}')
ON CONFLICT (id) DO NOTHING;

-- Link Use Cases to Tools
INSERT INTO use_case_tools (use_case_id, tool_id, rank, why_this_tool) VALUES
-- Write Marketing Copy
('11111111-1111-1111-1111-111111111111', 'aaaa8888-8888-8888-8888-888888888888', 1, 'Purpose-built for marketing content with optimized templates'),
('11111111-1111-1111-1111-111111111111', 'aaaa9999-9999-9999-9999-999999999999', 2, 'Quick generation of short-form marketing copy'),
('11111111-1111-1111-1111-111111111111', 'aaaa1111-1111-1111-1111-111111111111', 3, 'Versatile for any type of marketing content'),

-- Analyze Business Data
('22222222-2222-2222-2222-222222222222', 'aaaa1111-1111-1111-1111-111111111111', 1, 'Can analyze data, create summaries, and explain trends'),
('22222222-2222-2222-2222-222222222222', 'aaaa2222-2222-2222-2222-222222222222', 2, 'Excellent at detailed analysis and handling large documents'),
('22222222-2222-2222-2222-222222222222', 'bbbb2222-2222-2222-2222-222222222222', 3, 'Great for research and finding supporting data'),

-- Build a Website
('33333333-3333-3333-3333-333333333333', 'aaaa7777-7777-7777-7777-777777777777', 1, 'Accelerates coding with intelligent suggestions'),
('33333333-3333-3333-3333-333333333333', 'bbbb1111-1111-1111-1111-111111111111', 2, 'AI-native editor perfect for web development'),
('33333333-3333-3333-3333-333333333333', 'aaaa2222-2222-2222-2222-222222222222', 3, 'Excellent for explaining code and debugging'),

-- Create Presentations
('44444444-4444-4444-4444-444444444444', 'aaaa5555-5555-5555-5555-555555555555', 1, 'Easy-to-use design tool with AI-powered layouts'),
('44444444-4444-4444-4444-444444444444', 'aaaa4444-4444-4444-4444-444444444444', 2, 'Generate custom images for slides'),
('44444444-4444-4444-4444-444444444444', 'aaaa1111-1111-1111-1111-111111111111', 3, 'Help write and structure presentation content'),

-- Automate Workflows
('55555555-5555-5555-5555-555555555555', 'aaaa6666-6666-6666-6666-666666666666', 1, 'Combines organization with AI automation'),
('55555555-5555-5555-5555-555555555555', 'aaaa1111-1111-1111-1111-111111111111', 2, 'Can help design and plan automation workflows'),

-- Generate Images
('66666666-6666-6666-6666-666666666666', 'aaaa3333-3333-3333-3333-333333333333', 1, 'Best quality for artistic and creative images'),
('66666666-6666-6666-6666-666666666666', 'aaaa4444-4444-4444-4444-444444444444', 2, 'Easy to use, integrated with ChatGPT'),
('66666666-6666-6666-6666-666666666666', 'aaaa5555-5555-5555-5555-555555555555', 3, 'Good for quick social media graphics'),

-- Write Code
('77777777-7777-7777-7777-777777777777', 'aaaa7777-7777-7777-7777-777777777777', 1, 'Industry-leading code completion and suggestions'),
('77777777-7777-7777-7777-777777777777', 'bbbb1111-1111-1111-1111-111111111111', 2, 'Full AI-native development environment'),
('77777777-7777-7777-7777-777777777777', 'aaaa2222-2222-2222-2222-222222222222', 3, 'Excellent at explaining code and debugging')
ON CONFLICT (use_case_id, tool_id) DO NOTHING;

-- Insert Prompts (2+ per use case)
INSERT INTO prompts (id, slug, title, category, use_case_id, prompt_text) VALUES
-- Marketing Copy Prompts
('00001111-1111-1111-1111-111111111111', 'product-description-generator',
 'Product Description Generator', 'Marketing',
 '11111111-1111-1111-1111-111111111111',
 'Write a compelling product description for [PRODUCT NAME]. Target audience: [AUDIENCE]. Key features: [FEATURES]. Tone: [professional/casual/luxury]. Include a headline, 2-3 benefit-focused paragraphs, and a call to action.'),

('00001112-1111-1111-1111-111111111111', 'social-media-ad-copy',
 'Social Media Ad Copy', 'Marketing',
 '11111111-1111-1111-1111-111111111111',
 'Create 3 variations of ad copy for [PLATFORM: Facebook/Instagram/LinkedIn] promoting [PRODUCT/SERVICE]. Include: attention-grabbing hook, key benefit, social proof element, and clear CTA. Character limit: [LIMIT].'),

-- Data Analysis Prompts
('00002221-2222-2222-2222-222222222222', 'data-insight-extractor',
 'Data Insight Extractor', 'Analysis',
 '22222222-2222-2222-2222-222222222222',
 'Analyze this data and provide: 1) Top 3 key insights, 2) Any concerning trends, 3) Recommended actions, 4) Questions to investigate further. Data: [PASTE DATA]'),

('00002222-2222-2222-2222-222222222222', 'report-summarizer',
 'Business Report Summarizer', 'Analysis',
 '22222222-2222-2222-2222-222222222222',
 'Summarize this business report for [AUDIENCE: executives/team/stakeholders]. Include: executive summary (3 sentences), key metrics, main findings, and recommended next steps. Report: [PASTE REPORT]'),

-- Website Building Prompts
('00003331-3333-3333-3333-333333333333', 'landing-page-structure',
 'Landing Page Structure', 'Development',
 '33333333-3333-3333-3333-333333333333',
 'Design a landing page structure for [PRODUCT/SERVICE]. Include sections for: hero with value proposition, problem/solution, features/benefits, social proof, FAQ, and CTA. Target conversion: [GOAL].'),

('00003332-3333-3333-3333-333333333333', 'responsive-component',
 'Responsive Component Code', 'Development',
 '33333333-3333-3333-3333-333333333333',
 'Create a responsive [COMPONENT TYPE] using [React/Vue/HTML+CSS]. Requirements: mobile-first, accessible (ARIA labels), modern styling with [Tailwind/CSS modules]. Include hover states and loading states.'),

-- Presentation Prompts
('00004441-4444-4444-4444-444444444444', 'pitch-deck-outline',
 'Pitch Deck Outline', 'Presentations',
 '44444444-4444-4444-4444-444444444444',
 'Create a 10-slide pitch deck outline for [COMPANY/PRODUCT]. Include: problem, solution, market size, business model, traction, team, competition, financials, ask, and closing. Make it compelling for [INVESTOR TYPE].'),

('00004442-4444-4444-4444-444444444444', 'presentation-talking-points',
 'Presentation Talking Points', 'Presentations',
 '44444444-4444-4444-4444-444444444444',
 'Generate talking points for each slide about [TOPIC]. Duration: [MINUTES]. For each slide, provide: key message (1 sentence), 3 supporting points, transition to next slide.'),

-- Workflow Automation Prompts
('00005551-5555-5555-5555-555555555555', 'workflow-analyzer',
 'Workflow Analyzer', 'Productivity',
 '55555555-5555-5555-5555-555555555555',
 'Analyze this workflow and identify automation opportunities: [DESCRIBE WORKFLOW]. For each opportunity, explain: what to automate, tools to use, time saved, implementation difficulty (easy/medium/hard).'),

('00005552-5555-5555-5555-555555555555', 'email-template-generator',
 'Email Template Generator', 'Productivity',
 '55555555-5555-5555-5555-555555555555',
 'Create email templates for [SCENARIO: follow-up/meeting request/thank you/etc]. Include: subject line options, email body with personalization placeholders, and appropriate sign-off. Tone: [professional/friendly/formal].'),

-- Image Generation Prompts
('00006661-6666-6666-6666-666666666666', 'product-image-prompt',
 'Product Image Prompt', 'Design',
 '66666666-6666-6666-6666-666666666666',
 'Create a detailed prompt for generating a product image: [PRODUCT] photographed in [SETTING], [LIGHTING TYPE] lighting, [ANGLE] angle, [STYLE: minimalist/lifestyle/studio], background: [DESCRIPTION]. Include styling details for consistency.'),

('00006662-6666-6666-6666-666666666666', 'social-media-visual',
 'Social Media Visual Prompt', 'Design',
 '66666666-6666-6666-6666-666666666666',
 'Generate an image prompt for [PLATFORM] post about [TOPIC]. Style: [modern/vintage/minimalist/bold]. Colors: [BRAND COLORS or preference]. Mood: [inspiring/professional/playful]. Include text overlay area.'),

-- Code Writing Prompts
('00007771-7777-7777-7777-777777777777', 'code-reviewer',
 'Code Review Assistant', 'Development',
 '77777777-7777-7777-7777-777777777777',
 'Review this code for: 1) Bugs and potential issues, 2) Performance optimizations, 3) Security vulnerabilities, 4) Best practices and style. Provide specific suggestions with examples. Code: [PASTE CODE]'),

('00007772-7777-7777-7777-777777777777', 'api-endpoint-generator',
 'API Endpoint Generator', 'Development',
 '77777777-7777-7777-7777-777777777777',
 'Create a REST API endpoint for [RESOURCE] with: CRUD operations, input validation, error handling, and TypeScript types. Framework: [Express/Fastify/NestJS]. Include request/response examples.')
ON CONFLICT (id) DO NOTHING;

-- Insert News (5+ items)
INSERT INTO news (id, title, description, source_url, published_on) VALUES
('ee001111-1111-1111-1111-111111111111',
 'OpenAI Launches GPT-4 Turbo with Vision',
 'OpenAI announced GPT-4 Turbo, offering improved performance, lower costs, and the ability to understand images. The model can now process up to 128K tokens of context.',
 'https://openai.com/blog',
 '2024-11-15'),

('ee002222-2222-2222-2222-222222222222',
 'Anthropic Releases Claude 3.5 Sonnet',
 'Claude 3.5 Sonnet brings significant improvements in coding, analysis, and creative writing. It is faster than previous versions while maintaining high-quality outputs.',
 'https://anthropic.com/news',
 '2024-10-20'),

('ee003333-3333-3333-3333-333333333333',
 'Midjourney V6 Brings Photorealistic Images',
 'The latest version of Midjourney dramatically improves photorealism and text rendering in generated images. Users report more consistent results with complex prompts.',
 'https://midjourney.com',
 '2024-12-01'),

('ee004444-4444-4444-4444-444444444444',
 'GitHub Copilot Adds Chat Feature',
 'GitHub Copilot now includes an inline chat feature, allowing developers to have conversations about code directly in their editor. The update includes improved context awareness.',
 'https://github.blog',
 '2024-09-30'),

('ee005555-5555-5555-5555-555555555555',
 'Google Releases Gemini Pro 1.5',
 'Google Gemini Pro 1.5 offers a massive 1 million token context window, enabling analysis of entire codebases or lengthy documents in a single conversation.',
 'https://blog.google/technology/ai',
 '2024-11-01'),

('ee006666-6666-6666-6666-666666666666',
 'Canva Introduces Magic Studio AI Suite',
 'Canva Magic Studio brings AI-powered design tools including Magic Write, Magic Design, and AI image generation directly into the popular design platform.',
 'https://canva.com/newsroom',
 '2024-10-15')
ON CONFLICT (id) DO NOTHING;

-- Insert Tool Updates
INSERT INTO tool_updates (id, tool_id, updated_on, change_summary) VALUES
('ff001111-1111-1111-1111-111111111111',
 'aaaa1111-1111-1111-1111-111111111111',
 '2024-11-15',
 'GPT-4 Turbo released with 128K context window and vision capabilities'),

('ff002222-2222-2222-2222-222222222222',
 'aaaa2222-2222-2222-2222-222222222222',
 '2024-10-20',
 'Claude 3.5 Sonnet released with improved coding and analysis'),

('ff003333-3333-3333-3333-333333333333',
 'aaaa3333-3333-3333-3333-333333333333',
 '2024-12-01',
 'Midjourney V6 launched with enhanced photorealism'),

('ff004444-4444-4444-4444-444444444444',
 'aaaa7777-7777-7777-7777-777777777777',
 '2024-09-30',
 'GitHub Copilot Chat feature added to all editors')
ON CONFLICT (id) DO NOTHING;
