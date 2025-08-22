"use client";

import { useEffect, useState } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import Loader from "@/components/Loader";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getKnowledgeItemsGroupedByType } from "@/api/getKnowledgeItemsByCommunity";
import type { KnowledgeItem } from "@/models/KnowledgeItem";
import { useApp } from "@/context/AppContext";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

export default function WikiTab() {
  const { community, lang } = useApp();
  const [globalWikiItems, setGlobalWikiItems] = useState<{ type: string; items: KnowledgeItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [openWikiIndex, setOpenWikiIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const toggleIndex = (index: number) => {
    setOpenWikiIndex(openWikiIndex === index ? null : index);
  };

  useEffect(() => {
    if (!community) return;

    setLoading(true);

    getKnowledgeItemsGroupedByType("prajnanam", "wiki").then(setGlobalWikiItems)
      .catch((error) => console.error("Failed to fetch wiki items:", error))
      .finally(() => setLoading(false));
  }, [community]);

  if (!community || (!loading && globalWikiItems.length === 0)) {
    return <p className="text-center text-gray-500 mt-20">ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</p>;
  }

  if (loading) return Loader();



  const renderWikiSection = (
    items: { type: string; items: KnowledgeItem[] }[],
  ) => (
    <div className="w-full max-w-4xl mx-auto">
      {items.map((group, index) => (
        <div key={index} className="border-b border-gray-300">
          <button
            onClick={() => toggleIndex(index)}
            className={`w-full text-left px-4 py-3 ${openWikiIndex === index
              ? "bg-gray-100"
              : "bg-white"
              } transition-all flex justify-between items-center`}
            aria-expanded={openWikiIndex === index}
          >
            <span className="text-lg font-semibold">{group.type}</span>
            <span>{openWikiIndex === index ? "−" : "+"}</span>
          </button>

          {openWikiIndex === index && (
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
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ಕೈಪಿಡಿ`} />

      <main className="flex flex-col items-center min-h-[70vh]">
        {renderWikiSection(globalWikiItems)}
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

      <WhatsAppFloatButton />

      <BottomBar
        communityName={community.name?.[lang] || community.community_id}
        active="kaipidi"
      />
    </>
  );
}
