export interface Community {
  id: string;
  community_id: string;
  name: { [lang: string]: string };
  description: { [lang: string]: string };
  type: 'global' | 'community' | 'zone';
  parent_community?: string | null;
  features: Record<string, boolean>;
  created_at: string;
  updated_at: string;
}