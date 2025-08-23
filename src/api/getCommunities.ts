import { supabase } from "@/lib/supabaseClient";
import type { Community } from "@/models/community";

export async function getCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("type", "community")
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Community[];
}

export async function getCommunityById(communityId: string): Promise<Community> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("community_id", communityId)
    .single();

  if (error) throw error;
  if (!data) throw new Error(`Community not found with id: ${communityId}`);
  
  return data as Community;
}