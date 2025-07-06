export interface KnowledgeItem {
  id: string; // UUID
  title: string;
  content: string; // Markdown content
  community: string; // e.g., 'prajnanam', 'mysore'
  zone?: string | null; // optional zone
  item_type: 'quote' | 'song' | 'shloka';
  scope: 'global' | 'community' | 'zone';
  category: 'routine' | 'wiki';
  is_visible: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}