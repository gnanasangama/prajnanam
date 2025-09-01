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
import { BsFillChatDotsFill } from "react-icons/bs";
// import FeatureCard from "@/components/FeatureCard";

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

        {/* <FeatureCard
          title="ರಸಪ್ರಶ್ನೆ"
          subtitle="ನಿತ್ಯ ಸಾಧನೆಗೆ, ಸವಾಲುಗಳ ಪರೀಕ್ಷೆ"
          image={`/images/features/quiz-cover-photo.webp`}
          link="/quiz"
        /> */}
        
        <EventsWidget />

        <a
          href="https://forms.gle/voubX8XDJjR5jyzc6"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <div className="mt-3 rounded-lg bg-white hover:shadow-sm border border-gray-300 transition duration-200">
            <div className="flex items-center p-4">
              <BsFillChatDotsFill className="text-pink-400 text-4xl mr-3" />
              <div className="mx-auto text-center">
                <div className="text-gray-600 text-sm">
                  ಆಪ್‌ ಅನ್ನು ಇನ್ನಷ್ಟು ಉತ್ತಮವಾಗಿಸಲು
                </div>
                <h6 className="mt-2 text-pink-500 font-semibold">ನಿಮ್ಮ ಸಲಹೆ</h6>
              </div>
            </div>
          </div>
        </a>
        <WhatsAppFloatButton />
      </main>

      <BottomBar
        communityName={community.name?.[lang] || community.community_id}
        active="home"
      />
    </>
  );
}