"use client";
import { useEffect, useState } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import BottomTopSheet from "@/components/BottomTopSheet";
import { getGlobalCommunity } from "@/api/getGlobalCommunity";
import type { Community } from "@/models/community";
import { useApp } from "@/context/AppContext";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";
import EventsWidget from "@/components/eventWidget";
import AndroidPwaToAppModal from "@/components/AndroidPwaToAppModal";
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


  const isAndroid =
    typeof navigator !== "undefined" &&
    /Android/i.test(navigator.userAgent);

  console.log("Detected platform is Android:", isAndroid);

  return (
    <>
      <AppBar title={globalCommunity.name?.[lang] || "ಪ್ರಜ್ಞಾನಂ"} />
      <AndroidPwaToAppModal />
      <main className="flex flex-col min-h-[70vh]">
        {/* <ClippedBanner
          title={globalCommunity.name?.[lang] || globalCommunity.name?.en || "Prajnanam"}
          description={globalCommunity.description?.[lang] || globalCommunity.description?.en}
          onMore={() => setShowSheet(true)}
        /> */}

        {isAndroid && (
          <div className="bg-pink-50 border border-pink-200 rounded-xl pt-2 mb-2 text-center px-2">
            <div className="text-center">
              <h4 className="text-xl text-red-600 font-semibold mb-2">
                ಸೂಚನೆ
              </h4>

              <p className="text-gray-700 text-md leading-relaxed">
                ಈ ಆಪ್‌ನಲ್ಲಿ <span className="font-semibold">ಮಾರ್ಚ್ 31 ರಿಂದ ಹೊಸ ಅಪ್‌ಡೇಟ್‌ಗಳು ಲಭ್ಯವಿರುವುದಿಲ್ಲ.</span>.
                <br />
                ದಯವಿಟ್ಟು
                ನಮ್ಮ ಹೊಸ
                <span className="font-semibold text-pink-500"> Prajnanam </span>
                ಆಪ್ ಅನ್ನು Play Store ನಿಂದ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ
                ಮತ್ತು ನಿಮ್ಮ ಕಲಿಕೆಯ ಪಯಣವನ್ನು ಮುಂದುವರಿಸಿ.
              </p>

              {/* Play Store Button */}
              <a
                href="https://play.google.com/store/apps/details?id=app.gnanasangama"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src="/images/google-play-badge.png" // 👈 your image
                  alt="Get it on Google Play"
                />
              </a>
            </div>
          </div>)}
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