import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import React from "react";
import { useRouter } from "next/navigation";

export default function BottomBar({
  communityId,
  communityName,
  active = "home",
}: {
  communityId: string;
  communityName: string;
  active?: "home" | "community" | "kaipidi";
}) {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg flex justify-around items-center h-16">
      <button
        className={`flex flex-col items-center justify-center flex-1 py-2 transition ${
          active === "home" ? "text-pink-400 font-semibold" : "text-gray-400"
        }`}
        onClick={() => router.push(`/${communityId}`)}
      >
        <HomeIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">ಮುಖಪುಟ</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-2 transition ${
          active === "community" ? "text-pink-400 font-semibold" : "text-gray-400"
        }`}
        onClick={() => router.push(`/${communityId}/community`)}
      >
        <UsersIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">{communityName}</span>
      </button>
      <button
        className={`flex flex-col items-center justify-center flex-1 py-2 transition ${
          active === "kaipidi" ? "text-pink-400 font-semibold" : "text-gray-400"
        }`}
        onClick={() => router.push(`/${communityId}/guide`)}
      >
        <BookOpenIcon className="w-6 h-6 mb-1" />
        <span className="text-xs">ಕೈಪಿಡಿ</span>
      </button>
    </nav>
  );
}