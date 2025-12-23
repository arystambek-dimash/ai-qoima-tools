-- Migration: Add prompt_tools junction table
-- This enables many-to-many relationship between prompts and tools

-- Create prompt_tools junction table
CREATE TABLE IF NOT EXISTS prompt_tools (
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
    PRIMARY KEY (prompt_id, tool_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompt_tools_prompt_id ON prompt_tools(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_tools_tool_id ON prompt_tools(tool_id);

-- Seed some relationships between existing prompts and tools
-- This assumes the seed data from 002_seed_data.sql exists
-- We'll link prompts to the most relevant tools based on their content

-- Link "Business Meeting Summary" prompts to Claude/ChatGPT
INSERT INTO prompt_tools (prompt_id, tool_id)
SELECT p.id, t.id
FROM prompts p
CROSS JOIN tools t
WHERE p.slug IN ('business-meeting-summary', 'strategic-brainstorm-prompt', 'persuasive-email-prompt')
  AND t.slug IN ('claude', 'chatgpt')
ON CONFLICT DO NOTHING;

-- Link "Image Generation" prompts to DALL-E/Midjourney
INSERT INTO prompt_tools (prompt_id, tool_id)
SELECT p.id, t.id
FROM prompts p
CROSS JOIN tools t
WHERE p.slug IN ('product-photo-prompt', 'social-media-graphic-prompt')
  AND t.slug IN ('dall-e-3', 'midjourney')
ON CONFLICT DO NOTHING;

-- Link "Code Review" prompts to coding-focused tools
INSERT INTO prompt_tools (prompt_id, tool_id)
SELECT p.id, t.id
FROM prompts p
CROSS JOIN tools t
WHERE p.slug IN ('code-review-prompt', 'bug-fix-prompt', 'refactoring-prompt')
  AND t.slug IN ('github-copilot', 'claude', 'chatgpt')
ON CONFLICT DO NOTHING;

-- Link research prompts to research tools
INSERT INTO prompt_tools (prompt_id, tool_id)
SELECT p.id, t.id
FROM prompts p
CROSS JOIN tools t
WHERE p.slug IN ('research-synthesis-prompt', 'competitor-analysis-prompt')
  AND t.slug IN ('perplexity', 'claude', 'chatgpt')
ON CONFLICT DO NOTHING;
