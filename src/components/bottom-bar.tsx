import { HomeIcon, UsersIcon, BookOpenIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function BottomBar({
  communityName,
  active = "home",
}: {
  communityName: string;
  active?: "home" | "community" | "kaipidi";
}) {
  const { lang } = useApp();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 shadow-lg flex justify-around items-center h-16">
      <button
        className={`flex flex-col items-center justify-center flex-1 py-2 transition ${active === "home" ? "text-pink-400 font-semibold" : "text-gray-400"
          }`}
        onClick={() => router.push(`/`)}
      >
        <HomeIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">{lang == 'kn' ? "ಮುಖಪುಟ" : "Home"}</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-2 transition ${active === "community" ? "text-pink-400 font-semibold" : "text-gray-400"
          }`}
        onClick={() => router.push(`/community`)}
      >
        <UsersIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">{communityName}</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-2 transition ${active === "kaipidi" ? "text-pink-400 font-semibold" : "text-gray-400"
          }`}
        onClick={() => router.push(`/wiki`)}
      >
        <BookOpenIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">{lang == 'kn' ? "ಕೈಪಿಡಿ" : "Wiki"}</span>
      </button>
    </nav>
  );
}