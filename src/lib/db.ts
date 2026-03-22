// Aivee Editorial OS - Database Client
import { createClient } from '@supabase/supabase-js';

// Supabase configuration - set these in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Check if Supabase is configured
export const isSupabaseConfigured = !!supabase;

// Database types (for when Supabase is connected)
export interface DbIssue {
  id: string;
  issue_number: number;
  title: string;
  subtitle?: string;
  weekly_angle?: string;
  content_pillar: string;
  status: string;
  readiness_score?: number;
  linkedin_status: string;
  created_at: string;
  updated_at: string;
}

export interface DbStory {
  id: string;
  issue_id?: string;
  title: string;
  source_name: string;
  source_url?: string;
  credibility_score: number;
  relevance_score: number;
  novelty_score: number;
  actionability_score: number;
  overall_score?: number;
  disposition: string;
  created_at: string;
}

// Mock database functions (use these when Supabase isn't configured)
export const mockDb = {
  // Issues
  async getIssues() {
    const { mockIssues } = await import('./mock-data');
    return { data: mockIssues, error: null };
  },
  
  async getIssueById(id: string) {
    const { mockIssues } = await import('./mock-data');
    return { data: mockIssues.find(i => i.id === id) || null, error: null };
  },
  
  async getCurrentIssue() {
    const { mockIssues } = await import('./mock-data');
    return { data: mockIssues.find(i => i.status !== 'archived') || null, error: null };
  },
  
  // Stories
  async getStories() {
    const { mockStories } = await import('./mock-data');
    return { data: mockStories, error: null };
  },
  
  async getStoriesByIssue(issueId: string) {
    const { mockStories } = await import('./mock-data');
    return { data: mockStories.filter(s => s.issue_id === issueId), error: null };
  },
  
  async getShortlistedStories(issueId: string) {
    const { mockStories } = await import('./mock-data');
    return { data: mockStories.filter(s => s.issue_id === issueId && s.disposition === 'use_this_week'), error: null };
  },
  
  // Sources
  async getSources() {
    const { mockSources } = await import('./mock-data');
    return { data: mockSources, error: null };
  },
  
  // LinkedIn Posts
  async getLinkedInPostByIssue(issueId: string) {
    const { mockLinkedInPosts } = await import('./mock-data');
    return { data: mockLinkedInPosts.find(p => p.issue_id === issueId) || null, error: null };
  },
  
  // Review Items
  async getReviewItemsByIssue(issueId: string) {
    const { mockReviewItems } = await import('./mock-data');
    return { data: mockReviewItems.filter(r => r.issue_id === issueId), error: null };
  },
  
  // Checklist
  async getChecklistByIssue(issueId: string) {
    const { mockChecklist } = await import('./mock-data');
    return { data: mockChecklist.filter(c => c.issue_id === issueId), error: null };
  },
};

// Unified data access - uses Supabase if configured, otherwise falls back to mock
export const db = {
  async getIssues() {
    if (supabase) {
      const { data, error } = await supabase.from('issues').select('*').order('issue_number', { ascending: false });
      return { data: data as DbIssue[], error };
    }
    return mockDb.getIssues();
  },
  
  async getIssueById(id: string) {
    if (supabase) {
      const { data, error } = await supabase.from('issues').select('*').eq('id', id).single();
      return { data: data as DbIssue, error };
    }
    return mockDb.getIssueById(id);
  },
  
  async getCurrentIssue() {
    if (supabase) {
      const { data, error } = await supabase.from('issues').select('*').neq('status', 'archived').order('created_at', { ascending: false }).limit(1).single();
      return { data: data as DbIssue, error };
    }
    return mockDb.getCurrentIssue();
  },
  
  async getStories() {
    if (supabase) {
      const { data, error } = await supabase.from('stories').select('*').order('detected_date', { ascending: false });
      return { data: data as DbStory[], error };
    }
    return mockDb.getStories();
  },
  
  async getStoriesByIssue(issueId: string) {
    if (supabase) {
      const { data, error } = await supabase.from('stories').select('*').eq('issue_id', issueId).order('overall_score', { ascending: false });
      return { data: data as DbStory[], error };
    }
    return mockDb.getStoriesByIssue(issueId);
  },
  
  async getShortlistedStories(issueId: string) {
    if (supabase) {
      const { data, error } = await supabase.from('stories').select('*').eq('issue_id', issueId).eq('disposition', 'use_this_week').order('overall_score', { ascending: false });
      return { data: data as DbStory[], error };
    }
    return mockDb.getShortlistedStories(issueId);
  },
  
  async getSources() {
    if (supabase) {
      const { data, error } = await supabase.from('sources').select('*').order('times_used', { ascending: false });
      return { data, error };
    }
    return mockDb.getSources();
  },
  
  async getLinkedInPostByIssue(issueId: string) {
    if (supabase) {
      const { data, error } = await supabase.from('linkedin_posts').select('*').eq('issue_id', issueId).single();
      return { data, error };
    }
    return mockDb.getLinkedInPostByIssue(issueId);
  },
  
  async getReviewItemsByIssue(issueId: string) {
    if (supabase) {
      const { data, error } = await supabase.from('review_items').select('*').eq('issue_id', issueId).order('priority');
      return { data, error };
    }
    return mockDb.getReviewItemsByIssue(issueId);
  },
  
  async getChecklistByIssue(issueId: string) {
    if (supabase) {
      const { data, error } = await supabase.from('editorial_checklists').select('*').eq('issue_id', issueId).order('sort_order');
      return { data, error };
    }
    return mockDb.getChecklistByIssue(issueId);
  },
};
