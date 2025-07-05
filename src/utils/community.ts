export function getSelectedCommunity(): any | null {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem("community");
  if (!id) return null;
  const data = localStorage.getItem(`selectedCommunity`);
  return data ? JSON.parse(data) : null;
}