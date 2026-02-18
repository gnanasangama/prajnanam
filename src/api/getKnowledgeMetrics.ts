import { supabase } from "@/lib/supabaseClient";
import type { KnowledgeItem } from "@/models/KnowledgeItem";

export interface CategoryMetrics {
  category: string;
  count: number;
  byType: Record<string, number>;
  byCommunity: Record<string, number>;
}

export interface MetricsResponse {
  totalItems: number;
  byCategory: CategoryMetrics[];
  byType: Record<string, number>;
  byCommunity: Record<string, number>;
}

export async function getKnowledgeMetrics(): Promise<MetricsResponse> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("is_visible", true);

  if (error) throw error;

  const items = data as KnowledgeItem[];

  // Initialize metrics
  const categoryMetrics: Record<string, CategoryMetrics> = {};
  const typeMetrics: Record<string, number> = {};
  const communityMetrics: Record<string, number> = {};

  // Process items
  items.forEach((item) => {
    // By category
    if (!categoryMetrics[item.category]) {
      categoryMetrics[item.category] = {
        category: item.category,
        count: 0,
        byType: {},
        byCommunity: {},
      };
    }
    categoryMetrics[item.category].count++;
    categoryMetrics[item.category].byType[item.type] =
      (categoryMetrics[item.category].byType[item.type] || 0) + 1;
    categoryMetrics[item.category].byCommunity[item.community] =
      (categoryMetrics[item.category].byCommunity[item.community] || 0) + 1;

    // By type
    typeMetrics[item.type] = (typeMetrics[item.type] || 0) + 1;

    // By community
    communityMetrics[item.community] = (communityMetrics[item.community] || 0) + 1;
  });

  return {
    totalItems: items.length,
    byCategory: Object.values(categoryMetrics),
    byType: typeMetrics,
    byCommunity: communityMetrics,
  };
}
