-- Migration 006: Add content field to news table for full article storage
-- This allows us to show detailed articles in-app instead of redirecting to external sites

-- Add content column for storing full article text
ALTER TABLE news ADD COLUMN IF NOT EXISTS content TEXT;

-- Add slug column for SEO-friendly URLs
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS news_slug_unique ON news(slug) WHERE slug IS NOT NULL;

-- Generate slugs for existing news items based on title
UPDATE news
SET slug = LOWER(REGEXP_REPLACE(
  REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'),
  '\s+', '-', 'g'
)) || '-' || id::text
WHERE slug IS NULL;

-- Add index for faster slug lookups
CREATE INDEX IF NOT EXISTS news_slug_idx ON news(slug);
