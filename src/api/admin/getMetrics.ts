import { supabase } from "@/lib/supabaseClient";
import type { KnowledgeItem } from "@/models/KnowledgeItem";

export interface SubtypeMetrics {
  subtype: string;
  count: number;
}

export interface TypeMetrics {
  type: string;
  count: number;
  bySubtype: SubtypeMetrics[];
}

export interface CategoryMetrics {
  category: string;
  count: number;
  byType: TypeMetrics[];
}

export interface AdminCommunityMetricsResponse {
  communityId: string;
  totalItems: number;
  byCategory: CategoryMetrics[];
}

// Admin API - Shows all knowledge items (including hidden ones)
export async function getAdminCommunityKnowledgeMetrics(
  communityId: string
): Promise<AdminCommunityMetricsResponse> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId);

  if (error) throw error;

  const items = data as KnowledgeItem[];

  // Initialize metrics - Category -> Type -> Subtype
  const categoryMetrics: Record<string, Record<string, Record<string, number>>> = {};

  // Process items
  items.forEach((item) => {
    if (!categoryMetrics[item.category]) {
      categoryMetrics[item.category] = {};
    }
    if (!categoryMetrics[item.category][item.type]) {
      categoryMetrics[item.category][item.type] = {};
    }

    // Use subtype if available, otherwise use 'Unassigned'
    const subtype = item.subtype || 'Unassigned';
    
    categoryMetrics[item.category][item.type][subtype] =
      (categoryMetrics[item.category][item.type][subtype] || 0) + 1;
  });

  // Convert to array format
  const byCategory: CategoryMetrics[] = Object.entries(categoryMetrics).map(
    ([category, typeMap]) => {
      const byType = Object.entries(typeMap).map(([type, subtypeMap]) => {
        const typeCount = Object.values(subtypeMap).reduce((a, b) => a + b, 0);
        return {
          type,
          count: typeCount,
          bySubtype: Object.entries(subtypeMap)
            .map(([subtype, count]) => ({
              subtype,
              count,
            }))
            .sort((a, b) => b.count - a.count), // Sort by count descending
        };
      });

      return {
        category,
        count: byType.reduce((sum, t) => sum + t.count, 0),
        byType,
      };
    }
  );

  return {
    communityId,
    totalItems: items.length,
    byCategory,
  };
}
