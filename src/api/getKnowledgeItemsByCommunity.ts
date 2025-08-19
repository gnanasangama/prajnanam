import { supabase } from "@/lib/supabaseClient";
import type { KnowledgeItem } from "@/models/KnowledgeItem";

export async function getKnowledgeItemsByCommunity(
  communityId: string
): Promise<KnowledgeItem[]> {
  const { data, error } = await supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as KnowledgeItem[];
}

export async function getRoutinesByCommunity(communityId: string): Promise<KnowledgeItem[]> {
  const query = supabase
    .from("knowledge_items")
    .select("*")
    .eq("community", communityId)
    .eq("is_visible", true)
    .eq("category", 'routine');

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
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as KnowledgeItem[];
}