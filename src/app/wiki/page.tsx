"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import Loader from "@/components/Loader";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getKnowledgeItemsGroupedByType } from "@/api/getKnowledgeItemsByCommunity";
import type { Community } from "@/models/community";
import type { KnowledgeItem } from "@/models/KnowledgeItem";

export default function WikiTab() {
  const [community, setCommunity] = useState<Community | null>(null);
  const [lang, setLang] = useState("kn");

  const [communityWikiItems, setCommunityWikiItems] = useState<{ type: string; items: KnowledgeItem[] }[]>([]);
  const [globalWikiItems, setGlobalWikiItems] = useState<{ type: string; items: KnowledgeItem[] }[]>([]);

  const [loading, setLoading] = useState(true);

  const [openCommunityIndex, setOpenCommunityIndex] = useState<number | null>(null);
  const [openGlobalIndex, setOpenGlobalIndex] = useState<number | null>(null);

  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const router = useRouter();

  const toggleIndex = (index: number, type: "community" | "global") => {
    if (type === "community") {
      setOpenCommunityIndex(openCommunityIndex === index ? null : index);
    } else {
      setOpenGlobalIndex(openGlobalIndex === index ? null : index);
    }
  };

  useEffect(() => {
    const storedLang = localStorage.getItem("preferences.lang") || "kn";
    setLang(storedLang);

    const selectedCommunity = localStorage.getItem("selectedCommunity");
    if (!selectedCommunity) {
      router.replace("/select-community");
    } else {
      setCommunity(JSON.parse(selectedCommunity));
    }
  }, []);

  useEffect(() => {
    if (!community) return;

    setLoading(true);

    Promise.all([
      getKnowledgeItemsGroupedByType(community.community_id, "wiki").then(setCommunityWikiItems),
      getKnowledgeItemsGroupedByType("prajnanam", "wiki").then(setGlobalWikiItems),
    ])
      .catch((error) => console.error("Failed to fetch wiki items:", error))
      .finally(() => setLoading(false));
  }, [community]);

  if (!community || (!loading && communityWikiItems.length === 0 && globalWikiItems.length === 0)) {
    return <p className="text-center text-gray-500 mt-20">ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</p>;
  }

  if (loading) return Loader();

  const renderWikiSection = (
    title: string,
    items: { type: string; items: KnowledgeItem[] }[],
    openIndex: number | null,
    type: "community" | "global"
  ) => (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center my-4">{title}</h2>
      {items.map((group, index) => (
        <div key={index} className="border-b border-gray-300">
          <button
            onClick={() => toggleIndex(index, type)}
            className={`w-full text-left px-4 py-3 ${(type === "community" ? openCommunityIndex : openGlobalIndex) === index
              ? "bg-gray-100"
              : "bg-white"
              } transition-all flex justify-between items-center`}
            aria-expanded={(type === "community" ? openCommunityIndex : openGlobalIndex) === index}
          >
            <span className="text-lg font-semibold">{group.type}</span>
            <span>{(type === "community" ? openCommunityIndex : openGlobalIndex) === index ? "−" : "+"}</span>
          </button>

          {(type === "community" ? openCommunityIndex : openGlobalIndex) === index && (
            <div className="py-3 bg-white">
              <div className="flex flex-col space-y-2 overflow-hidden px-2">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowSheet(true);
                    }}
                    className="w-full border border-gray-200 p-3 rounded-lg shadow-sm bg-white hover:bg-gray-100 cursor-pointer transition"
                  >
                    <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${community.name?.[lang] || community.community_id}`} />

      <main className="flex flex-col items-center min-h-[70vh]">
        {communityWikiItems.length != 0 &&
          <>
            {renderWikiSection(`${community.name?.[lang] || community.community_id} - ಕೈಪಿಡಿ`, communityWikiItems, openCommunityIndex, "community")}
            <hr className="my-4" />
          </>}

        {renderWikiSection("ಪ್ರಜ್ಞಾನಂ - ಕೈಪಿಡಿ", globalWikiItems, openGlobalIndex, "global")}
      </main>

      {selectedItem && (
        <BottomTopSheet
          open={showSheet}
          onClose={() => {
            setShowSheet(false);
            setSelectedItem(null);
          }}
          title={selectedItem.title}
          description={selectedItem.content || "ವಿವರಗಳು ಲಭ್ಯವಿಲ್ಲ"}
        />
      )}

      <BottomBar
        communityName={community.name?.[lang] || community.community_id}
        active="kaipidi"
      />
    </>
  );
}
