"use client";
import React, { useEffect, useState } from "react";
import { use } from "react";
import AppBar from "@/components/appbar";
import BottomBar from "@/components/bottombar";
import ClippedBanner from "@/components/ClippedBanner";
import BottomTopSheet from "@/components/BottomTopSheet";

export default function CommunityTab({ params }: { params: Promise<{ community_id: string }> }) {
  const { community_id } = use(params);
  const [community, setCommunity] = useState<any>(null);
  const [lang, setLang] = useState("kn");
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    // Get language preference
    const storedLang = localStorage.getItem("preferences.lang") || "kn";
    setLang(storedLang);

    // Get community object from localStorage
    const data = localStorage.getItem(`selectedCommunity`);
    if (data) setCommunity(JSON.parse(data));
  }, [community_id]);

  if (!community) return null;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${community.name?.[lang] || community.community_id}`} />
      <ClippedBanner
        title={community.name?.[lang] || community.name?.en || "Prajnanam"}
        description={community.description?.[lang] || community.description?.en}
        onMore={() => setShowSheet(true)}
      />
      <BottomTopSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        title={community.name?.[lang] || community.name?.en || "Prajnanam"}
        description={community.description?.[lang] || community.description?.en}
      />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-14 pb-16">
        <h1 className="text-xl font-semibold text-center">{community.name?.[lang] || community.community_id}</h1>
        <p className="mt-4 text-gray-600 text-center">{community.description?.[lang]}</p>
      </main>
      <BottomBar communityId={community_id} communityName={community.name?.[lang] || community.community_id} active="community" />
    </>
  );
}