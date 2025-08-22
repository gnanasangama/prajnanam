"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCommunities } from "@/api/getCommunities";
import type { Community } from "@/models/community";
import { setCommunityData, setCommunityId } from "@/utils/cookies";
import { useApp } from "@/context/AppContext";
import Loader from "@/components/Loader";

export default function SelectCommunity() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { community: currentCommunity, setCommunity: setAppCommunity } = useApp();

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      try {
        const data = await getCommunities();
        setCommunities(data);
        // Initialize selectedId with current context community if available
        if (currentCommunity?.community_id) {
          setSelectedId(currentCommunity.community_id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentCommunity?.community_id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCommunity = communities.find(c => c.community_id === selectedId);
    if (selectedCommunity) {
      setCommunityId(selectedCommunity.community_id);  // Set cookie with just ID
      setCommunityData(selectedCommunity);            // Store full data in localStorage
      setAppCommunity(selectedCommunity);             // Set in context
      router.replace("/");
    }
  };

  if (loading) return Loader();

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-xl font-semibold mb-6 text-center">
        ನಿಮ್ಮ ಕಮ್ಯೂನಿಟಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
      </h1>

      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        {communities.map((community) => {
          const isSelected = selectedId === community.community_id;

          return (
            <label
              key={community.community_id}
              className={`flex items-center p-3 border rounded-4xl cursor-pointer transition-colors
                ${isSelected ? "border-pink-400 text-pink-400 font-semibold bg-pink-50" : "border-gray-300 bg-white"}`}
            >
              <input
                type="radio"
                name="community"
                value={community.community_id}
                checked={isSelected}
                onChange={() => setSelectedId(community.community_id)}
                className="form-radio accent-pink-400 mr-3"
              />
              <span className="text-base">{community.name.kn}</span>
            </label>
          );
        })}

        <button
          type="submit"
          disabled={!selectedId}
          className="w-full mt-2 py-2 rounded-4xl font-semibold text-white bg-pink-400 disabled:bg-gray-300 transition"
        >
          ಆಯ್ಕೆಮಾಡಿ
        </button>
      </form>
    </main>
  );
}
