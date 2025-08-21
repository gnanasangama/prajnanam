import { supabase } from "@/lib/supabaseClient";
import type { KnowledgeItem } from "@/models/KnowledgeItem";

export async function getKnowledgeItemsByCommunity(
  communityId: string
): Promise<KnowledgeItem[]> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId)
    .eq("is_visible", true)
    .order("sequence", { ascending: true });

  if (error) throw error;
  return data as KnowledgeItem[];
}

export async function getRoutinesByCommunity(communityId: string): Promise<KnowledgeItem[]> {
  const query = supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId)
    .eq("is_visible", true)
    .eq("category", 'routine')
    .order("sequence", { ascending: true });

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data as KnowledgeItem[];
}


export async function getKnowledgeItemsByCategory(
  communityId: string,
  category: string
): Promise<KnowledgeItem[]> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId)
    .eq("category", category)
    .eq("is_visible", true)
    .order("sequence", { ascending: true });

  if (error) throw error;
  return data as KnowledgeItem[];
}


export async function getKnowledgeItemsGroupedByType(
  communityId: string,
  category: string
): Promise<{ type: string; items: KnowledgeItem[] }[]> {
  const { data, error } = await supabase
    .rpc("get_knowledge_items_grouped_by_type", {
      community_id: communityId,
      input_category: category
    });

  if (error) throw error;

  return data.map((group: { type: string; items: KnowledgeItem[]; }) => ({
    type: group.type,
    items: group.items as KnowledgeItem[]
  }));
}