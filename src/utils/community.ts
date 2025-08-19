import { Community } from "@/models/community";

export function getSelectedCommunity(): Community | null {
  if (typeof window === "undefined") return null;
  const selectedCommunity = localStorage.getItem("selectedCommunity");
  return selectedCommunity ? JSON.parse(selectedCommunity) : null;
}