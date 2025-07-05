import { supabase } from "@/lib/supabaseClient";
import type { Community } from "@/models/community";

export async function getCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("type", "community")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Community[];
}