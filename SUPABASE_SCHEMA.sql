-- Aivee Editorial OS - Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE issue_status AS ENUM (
  'collecting_signals',
  'shortlisting', 
  'drafting',
  'in_review',
  'approved',
  'published',
  'archived'
);

CREATE TYPE section_status AS ENUM (
  'empty',
  'drafted',
  'needs_review',
  'approved'
);

CREATE TYPE story_disposition AS ENUM (
  'use_this_week',
  'save_for_later',
  'ignore'
);

CREATE TYPE content_pillar AS ENUM (
  'bim_authority',
  'standards_authority', 
  'ai_authority',
  'industry_intelligence'
);

CREATE TYPE linkedin_status AS ENUM (
  'not_started',
  'drafted',
  'approved',
  'scheduled',
  'published'
);

CREATE TYPE review_priority AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE source_type AS ENUM (
  'official_vendor',
  'standards_body',
  'industry_publication',
  'consultancy',
  'thought_leader',
  'research_source'
);

CREATE TYPE trust_tier AS ENUM (
  'Tier 1',
  'Tier 2',
  'Tier 3'
);

-- ISSUES TABLE
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  subtitle TEXT,
  weekly_angle TEXT,
  opening_note TEXT,
  standards_spotlight TEXT,
  ai_spotlight TEXT,
  what_to_watch TEXT,
  cta TEXT,
  content_pillar content_pillar DEFAULT 'industry_intelligence',
  target_audience TEXT,
  status issue_status DEFAULT 'collecting_signals',
  readiness_score INTEGER,
  publish_date DATE,
  newsletter_url TEXT,
  linkedin_status linkedin_status DEFAULT 'not_started',
  performance_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ISSUE SECTIONS TABLE
CREATE TABLE issue_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  title TEXT,
  content TEXT,
  status section_status DEFAULT 'empty',
  order_index INTEGER NOT NULL,
  approval_state TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STORIES TABLE
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_url TEXT,
  source_type source_type,
  published_date DATE,
  detected_date DATE DEFAULT CURRENT_DATE,
  summary TEXT,
  why_it_matters TEXT,
  who_it_affects TEXT,
  action_takeaway TEXT,
  category TEXT,
  tags TEXT[],
  credibility_score INTEGER DEFAULT 5,
  relevance_score INTEGER DEFAULT 5,
  novelty_score INTEGER DEFAULT 5,
  actionability_score INTEGER DEFAULT 5,
  overall_score NUMERIC(4,2),
  disposition story_disposition DEFAULT 'save_for_later',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SOURCES TABLE
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  source_type source_type,
  category TEXT,
  trust_tier trust_tier DEFAULT 'Tier 2',
  website_url TEXT,
  notes TEXT,
  times_used INTEGER DEFAULT 0,
  average_quality_score NUMERIC(3,1),
  last_used_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ISSUE SOURCES (JUNCTION)
CREATE TABLE issue_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
  source_title TEXT,
  source_url TEXT,
  source_note TEXT,
  linked_section_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LINKEDIN POSTS TABLE
CREATE TABLE linkedin_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE UNIQUE,
  main_post TEXT,
  hook_variant_1 TEXT,
  hook_variant_2 TEXT,
  hook_variant_3 TEXT,
  cta_variant_1 TEXT,
  cta_variant_2 TEXT,
  hashtags TEXT,
  status linkedin_status DEFAULT 'not_started',
  scheduled_publish_at TIMESTAMPTZ,
  performance_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- REVIEW ITEMS TABLE
CREATE TABLE review_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  priority review_priority DEFAULT 'medium',
  linked_section_id UUID REFERENCES issue_sections(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EDITORIAL CHECKLISTS TABLE
CREATE TABLE editorial_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  item_label TEXT NOT NULL,
  item_key TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ANALYTICS SNAPSHOTS TABLE
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  issue_id UUID REFERENCES issues(id) ON DELETE SET NULL,
  metric_key TEXT NOT NULL,
  metric_value NUMERIC(10,2),
  snapshot_date DATE DEFAULT CURRENT_DATE,
  notes TEXT
);

-- INDEXES
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_publish_date ON issues(publish_date);
CREATE INDEX idx_stories_issue_id ON stories(issue_id);
CREATE INDEX idx_stories_disposition ON stories(disposition);
CREATE INDEX idx_review_items_issue_id ON review_items(issue_id);
CREATE INDEX idx_checklist_issue_id ON editorial_checklists(issue_id);
CREATE INDEX idx_linkedin_posts_issue_id ON linkedin_posts(issue_id);

-- TRIGGER FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issue_sections_updated_at BEFORE UPDATE ON issue_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sources_updated_at BEFORE UPDATE ON sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_linkedin_posts_updated_at BEFORE UPDATE ON linkedin_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_items_updated_at BEFORE UPDATE ON review_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_editorial_checklists_updated_at BEFORE UPDATE ON editorial_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ROW LEVEL SECURITY (Optional - enable if needed)
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_posts ENABLE ROW LEVEL SECURITY;

-- Default policies (owner can do everything)
CREATE POLICY "Enable all for owners" ON issues FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for owners" ON stories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for owners" ON sources FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for owners" ON linkedin_posts FOR ALL USING (true) WITH CHECK (true);
