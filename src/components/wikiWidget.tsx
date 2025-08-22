"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getKnowledgeItemsGroupedByType } from "@/api/getKnowledgeItemsByCommunity";
import type { KnowledgeItem } from "@/models/KnowledgeItem";
import { useApp } from "@/context/AppContext";

export default function WikiWidget() {
  const { community, lang } = useApp();
  const [communityWikiItems, setCommunityWikiItems] = useState<{ type: string; items: KnowledgeItem[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCommunityIndex, setOpenCommunityIndex] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [showSheet, setShowSheet] = useState(false);

  const toggleIndex = (index: number) => {
    setOpenCommunityIndex(openCommunityIndex === index ? null : index);
  };

  useEffect(() => {
    if (!community) return;

    setLoading(true);

    getKnowledgeItemsGroupedByType(community.community_id, "wiki").then(setCommunityWikiItems)
      .catch((error) => console.error("Failed to fetch wiki items:", error))
      .finally(() => setLoading(false));
  }, [community]);

  if (!community || (!loading && communityWikiItems.length === 0)) {
    return <p className="text-center text-gray-500 mt-20">ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</p>;
  }

  if (loading) return Loader();

  const renderWikiSection = (
    title: string,
    items: { type: string; items: KnowledgeItem[] }[],
  ) => (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-pink-400 my-4">{title}</h2>
      {items.map((group, index) => (
        <div key={index} className="border-b border-gray-300">
          <button
            onClick={() => toggleIndex(index)}
            className={`w-full text-left px-4 py-3 ${openCommunityIndex === index
              ? "bg-gray-100"
              : "bg-white"
              } transition-all flex justify-between items-center`}
            aria-expanded={openCommunityIndex === index}
          >
            <span className="text-lg font-semibold">{group.type}</span>
            <span>{openCommunityIndex === index ? "−" : "+"}</span>
          </button>

          {openCommunityIndex === index && (
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
      {communityWikiItems.length != 0 &&
        <>
          <hr className="my-4 border-gray-400" />
          {renderWikiSection(`${community.name?.[lang] || community.community_id} - ಕೈಪಿಡಿ`, communityWikiItems)}
        </>}

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
    </>
  );
}
