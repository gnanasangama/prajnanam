import { supabase } from "@/lib/supabaseClient";
import type { Community } from "@/models/community";

export async function getGlobalCommunity(): Promise<Community | null> {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .eq("type", "global")
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return data as Community;
}