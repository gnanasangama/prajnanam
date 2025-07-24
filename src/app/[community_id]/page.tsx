"use client";
import React, { useEffect, useState } from "react";
import { use } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import ClippedBanner from "@/components/ClippedBanner";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getKnowledgeItemsByCommunity } from "@/api/getKnowledgeItemsByCommunity";
// import type { KnowledgeItem } from "@/models/KnowledgeItem";
import FeatureCard from "@/components/FeatureCard";
import { Community } from "@/models/community";

export default function CommunityTab({ params }: { params: Promise<{ community_id: string }> }) {
  const { community_id } = use(params);
  const [community, setCommunity] = useState<Community|null>(null);
  const [lang, setLang] = useState("kn");
  const [showSheet, setShowSheet] = useState(false);
  // const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedLang = localStorage.getItem("preferences.lang") || "kn";
    setLang(storedLang);

    const data = localStorage.getItem(`selectedCommunity`);
    if (data) setCommunity(JSON.parse(data));
  }, [community_id]);

  useEffect(() => {
    if (!community_id) return;
    // setLoading(true);
    getKnowledgeItemsByCommunity(community_id)
      .then((items) => {
        console.log("Knowledge items fetched:", items);
        // setKnowledgeItems(items);
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch knowledge items:", error);
        // setLoading(false);
      });
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

      <FeatureCard
        title="ಶಾಖಾ ದಿನಚರಿ"
        subtitle="ಶ್ರೀ ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ"
        image="/images/sangh-shaakha.png"
        link="/community/routine"
      />

      <BottomBar
        communityId={community_id}
        communityName={community.name?.[lang] || community.community_id}
        active="community"
      />
    </>
  );
}
