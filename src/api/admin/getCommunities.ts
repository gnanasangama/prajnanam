import { supabase } from "@/lib/supabaseClient";
import type { Community } from "@/models/community";

// Admin API - Shows all communities (including hidden ones)
export async function getAdminCommunities(): Promise<Community[]> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .in("type", ["community", "global"])
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Community[];
}
