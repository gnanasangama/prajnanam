"use client";
import { useEffect, useState } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import ClippedBanner from "@/components/ClippedBanner";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getGlobalCommunity } from "@/api/getGlobalCommunity";
import type { Community } from "@/models/community";
import { useApp } from "@/context/AppContext";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import EventsWidget from "@/components/eventWidget";

export default function Home() {
  const { community, lang } = useApp();
  const [globalCommunity, setGlobalCommunity] = useState<Community | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  useEffect(() => {
    getGlobalCommunity().then(setGlobalCommunity);
  }, []);

  if (!community || !globalCommunity) return null;

  return (
    <>
      <AppBar title={globalCommunity.name?.[lang] || "ಪ್ರಜ್ಞಾನಂ"} />
      <main className="flex flex-col min-h-[70vh]">
        <ClippedBanner
          title={globalCommunity.name?.[lang] || globalCommunity.name?.en || "Prajnanam"}
          description={globalCommunity.description?.[lang] || globalCommunity.description?.en}
          onMore={() => setShowSheet(true)}
        />
        <BottomTopSheet
          open={showSheet}
          onClose={() => setShowSheet(false)}
          title={globalCommunity.name?.[lang] || globalCommunity.name?.en || "Prajnanam"}
          description={globalCommunity.description?.[lang] || globalCommunity.description?.en}
        />
        
        <EventsWidget />

        <WhatsAppFloatButton />
      </main>

      <BottomBar
        communityName={community.name?.[lang] || community.community_id}
        active="home"
      />
    </>
  );
}