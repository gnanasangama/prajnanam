"use client";
import React, { useEffect, useState } from "react";
// import { use } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
// import ClippedBanner from "@/components/ClippedBanner";
// import BottomTopSheet from "@/components/BottomTopSheet";
import { getKnowledgeItemsByCommunity } from "@/api/getKnowledgeItemsByCommunity";
// import type { KnowledgeItem } from "@/models/KnowledgeItem";
import FeatureCard from "@/components/FeatureCard";
import { Community } from "@/models/community";
import { useRouter } from "next/navigation";

export default function CommunityTab() {
  const [community, setCommunity] = useState<Community | null>(null);
  const [lang, setLang] = useState("kn");
  // const [showSheet, setShowSheet] = useState(false);
  // const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  // const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedLang = localStorage.getItem("preferences.lang") || "kn";
    setLang(storedLang);

    const selectedCommunity = localStorage.getItem("selectedCommunity");
    if (!selectedCommunity) {
      router.replace("/select-community");
    } else {
      setCommunity(JSON.parse(selectedCommunity || "{}"));
    }
  }, []);

  useEffect(() => {
    if (!community) return;
    // setLoading(true);
    getKnowledgeItemsByCommunity(community.community_id)
      .then((items) => {
        console.log("Knowledge items fetched:", items);
        // setKnowledgeItems(items);
        // setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch knowledge items:", error);
        // setLoading(false);
      });
  }, [community]);

  if (!community) return null;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${community.name?.[lang] || community.community_id}`} />

      {/* <ClippedBanner
        title={community.name?.[lang] || community.name?.en || "Prajnanam"}
        description={community.description?.[lang] || community.description?.en}
        onMore={() => setShowSheet(true)}
      />
      <BottomTopSheet
        open={showSheet}
        onClose={() => setShowSheet(false)}
        title={community.name?.[lang] || community.name?.en || "Prajnanam"}
        description={community.description?.[lang] || community.description?.en}
      /> */}

      <FeatureCard
        title="ಶಾಖಾ ದಿನಚರಿ"
        subtitle="ಶ್ರೀ ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ"
        image={`/images/features/${community.community_id}.png`}
        link="/community/routine"
      />

      <FeatureCard
        title="ವಾರ್ಷಿಕ ಯೋಜನೆ"
        subtitle="ಶ್ರೀ ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ"
        image={`/images/features/annual-plan.png`}
        link="/community/annual-plan"
      />

      <BottomBar
        communityName={community.name?.[lang] || community.community_id}
        active="community"
      />
    </>
  );
}
