"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@/components/appbar";
import BottomBar from "@/components/bottombar";
import ClippedBanner from "@/components/ClippedBanner";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getGlobalCommunity } from "@/api/getGlobalCommunity";
import type { Community } from "@/models/community";

export default function Home() {
  const [community, setCommunity] = useState<any>(null);
  const [globalCommunity, setGlobalCommunity] = useState<Community | null>(null);
  const [lang, setLang] = useState("kn");
  const [showSheet, setShowSheet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("community");
    if (!stored) {
      router.replace("/select-community");
    } else {
      setCommunity(JSON.parse(localStorage.getItem(`selectedCommunity`) || "{}"));
    }
    setLang(localStorage.getItem("preferences.lang") || "kn");
    getGlobalCommunity().then(setGlobalCommunity);
  }, [router]);

  if (!community) return null;

  return (
    <>
      {globalCommunity && (
        <>
          <AppBar title={'ಪ್ರಜ್ಞಾನಂ'} />
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
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-14 pb-16">
        <h1 className="text-xl font-semibold text-center">{globalCommunity.name?.[lang] || globalCommunity.community_id} - ಮುಖಪುಟ</h1>
      </main>
        </>
      )}
      <BottomBar communityId={community.community_id} communityName={community.name?.[lang] || community.community_id} active="home" />
    </>
  );
}