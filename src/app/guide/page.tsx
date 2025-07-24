"use client";
import { useEffect, useState } from "react";
import AppBar from "@/components/AppBar";
import BottomBar from "@/components/BottomBar";
import { Community } from "@/models/community";

export default function GuideTab() {
  const [communityId, setCommunityId] = useState<string>("prajnanam");
  const [community, setCommunity] = useState<Community | null>(null);
  const [lang, setLang] = useState("kn");

  useEffect(() => {
    // Get language preference
    const storedLang = localStorage.getItem("preferences.lang") || "kn";
    setLang(storedLang);

    // Get community ID from localStorage
    setCommunityId(localStorage.getItem("community") || "prajnanam");
  }, []);


  useEffect(() => {
    // Get community object from localStorage
    const data = localStorage.getItem(`selectedCommunity`);
    if (data) setCommunity(JSON.parse(data));
  }, [communityId]);

  if (!community) return null;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${community.name?.[lang] || community.community_id}`} />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-14 pb-16">
        <h1 className="text-xl font-semibold text-center">{community.name?.[lang] || community.community_id} - ಕೈಪಿಡಿ</h1>
      </main>
      <BottomBar communityId={communityId} communityName={community.name?.[lang] || community.community_id} active="kaipidi" />
    </>
  );
}