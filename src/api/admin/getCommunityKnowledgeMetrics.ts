import { supabase } from "@/lib/supabaseClient";
import type { KnowledgeItem } from "@/models/KnowledgeItem";

export interface TypeMetrics {
  type: string;
  count: number;
}

export interface CategoryMetrics {
  category: string;
  count: number;
  byType: TypeMetrics[];
}

export interface CommunityMetricsResponse {
  communityId: string;
  totalItems: number;
  byCategory: CategoryMetrics[];
}

export async function getCommunityKnowledgeMetrics(
  communityId: string
): Promise<CommunityMetricsResponse> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId)
    .eq("is_visible", true);

  if (error) throw error;

  const items = data as KnowledgeItem[];

  // Initialize metrics
  const categoryMetrics: Record<string, Record<string, number>> = {};

  // Process items
  items.forEach((item) => {
    if (!categoryMetrics[item.category]) {
      categoryMetrics[item.category] = {};
    }
    categoryMetrics[item.category][item.type] =
      (categoryMetrics[item.category][item.type] || 0) + 1;
  });

  // Convert to array format
  const byCategory: CategoryMetrics[] = Object.entries(categoryMetrics).map(
    ([category, typeMap]) => ({
      category,
      count: Object.values(typeMap).reduce((a, b) => a + b, 0),
      byType: Object.entries(typeMap).map(([type, count]) => ({
        type,
        count,
      })),
    })
  );

  return {
    communityId,
    totalItems: items.length,
    byCategory,
  };
}
