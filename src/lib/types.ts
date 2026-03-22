// Aivee Editorial OS - Types

export type IssueStatus = 
  | 'collecting_signals'
  | 'shortlisting'
  | 'drafting'
  | 'in_review'
  | 'approved'
  | 'published'
  | 'archived';

export type SectionStatus = 'empty' | 'drafted' | 'needs_review' | 'approved';

export type StoryDisposition = 'use_this_week' | 'save_for_later' | 'ignore';

export type ContentPillar = 'bim_authority' | 'standards_authority' | 'ai_authority' | 'industry_intelligence';

export type LinkedInStatus = 'not_started' | 'drafted' | 'approved' | 'scheduled' | 'published';

export type ReviewItemStatus = 'open' | 'in_progress' | 'resolved';

export type SourceType = 'official_vendor' | 'standards_body' | 'industry_publication' | 'consultancy' | 'thought_leader' | 'research_source';

export type TrustTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export interface Issue {
  id: string;
  issue_number: number;
  title: string;
  subtitle?: string;
  weekly_angle?: string;
  opening_note?: string;
  standards_spotlight?: string;
  ai_spotlight?: string;
  what_to_watch?: string;
  cta?: string;
  content_pillar: ContentPillar;
  target_audience?: string;
  status: IssueStatus;
  readiness_score?: number;
  publish_date?: string;
  newsletter_url?: string;
  linkedin_status: LinkedInStatus;
  performance_score?: number;
  created_at: string;
  updated_at: string;
}

export interface IssueSection {
  id: string;
  issue_id: string;
  section_type: string;
  title?: string;
  content?: string;
  status: SectionStatus;
  order_index: number;
  approval_state?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  issue_id?: string;
  title: string;
  source_name: string;
  source_url?: string;
  source_type: SourceType;
  published_date?: string;
  detected_date: string;
  summary?: string;
  why_it_matters?: string;
  who_it_affects?: string;
  action_takeaway?: string;
  category?: string;
  tags?: string[];
  credibility_score: number;
  relevance_score: number;
  novelty_score: number;
  actionability_score: number;
  overall_score?: number;
  disposition: StoryDisposition;
  created_at: string;
  updated_at: string;
}

export interface Source {
  id: string;
  name: string;
  source_type: SourceType;
  category: string;
  trust_tier: TrustTier;
  website_url?: string;
  notes?: string;
  times_used: number;
  average_quality_score?: number;
  last_used_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IssueSource {
  id: string;
  issue_id: string;
  source_id?: string;
  story_id?: string;
  source_title: string;
  source_url?: string;
  source_note?: string;
  linked_section_type?: string;
  created_at: string;
}

export interface LinkedInPost {
  id: string;
  issue_id: string;
  main_post?: string;
  hook_variant_1?: string;
  hook_variant_2?: string;
  hook_variant_3?: string;
  cta_variant_1?: string;
  cta_variant_2?: string;
  hashtags?: string;
  status: LinkedInStatus;
  scheduled_publish_at?: string;
  performance_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewItem {
  id: string;
  issue_id: string;
  item_type: string;
  label: string;
  description?: string;
  status: ReviewItemStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  linked_section_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EditorialChecklist {
  id: string;
  issue_id: string;
  item_label: string;
  item_key: string;
  is_complete: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsSnapshot {
  id: string;
  issue_id?: string;
  metric_key: string;
  metric_value: number;
  snapshot_date: string;
  notes?: string;
}

// Scoring weights
export const SCORING_WEIGHTS = {
  credibility: 0.35,
  relevance: 0.30,
  novelty: 0.15,
  actionability: 0.20,
} as const;

// Calculate story overall score
export function calculateStoryScore(story: Story): number {
  return (
    story.credibility_score * SCORING_WEIGHTS.credibility +
    story.relevance_score * SCORING_WEIGHTS.relevance +
    story.novelty_score * SCORING_WEIGHTS.novelty +
    story.actionability_score * SCORING_WEIGHTS.actionability
  );
}

// Calculate issue readiness score
export function calculateReadinessScore(issue: Issue, stories: Story[], reviewItems: ReviewItem[]): number {
  let score = 0;
  
  // Source quality (0-25)
  const avgCredibility = stories.length > 0 
    ? stories.reduce((sum, s) => sum + s.credibility_score, 0) / stories.length 
    : 0;
  score += avgCredibility * 2.5;
  
  // Section completeness (0-25)
  // Assuming 8 key sections: opening, 3-5 developments, standards, AI, what to watch, CTA
  const filledSections = 3; // Placeholder - would count actual sections
  score += Math.min(25, filledSections * 5);
  
  // Story count (0-20)
  const strongStories = stories.filter(s => s.overall_score && s.overall_score >= 6).length;
  score += Math.min(20, strongStories * 7);
  
  // LinkedIn status (0-15)
  if (issue.linkedin_status === 'approved') score += 15;
  else if (issue.linkedin_status === 'drafted') score += 10;
  else if (issue.linkedin_status !== 'not_started') score += 5;
  
  // Review items (0-15)
  const criticalOpen = reviewItems.filter(r => r.priority === 'critical' && r.status !== 'resolved').length;
  if (criticalOpen === 0) score += 15;
  else score += Math.max(0, 15 - criticalOpen * 5);
  
  return Math.round(score);
}
