export interface KnowledgeItem {
  id: string; // UUID
  title: string;
  content: string; // Markdown content
  community: string; // e.g., 'prajnanam', 'mysore'
  zone?: string | null; // optional zone
  type: 'quote' | 'song' | 'shloka' | 'annual_plan';
  scope: 'global' | 'community' | 'zone';
  category: 'routine' | 'wiki' | 'calendar';
  media: { type: string, url: string } | null; // e.g., { type: 'image', url: 'http://...' }
  is_visible: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

export interface EventType {
  title: string;
  date: string;
  status: 'current' | 'past';
}