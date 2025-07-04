"use client";
import { useParams } from "next/navigation";
import AppBar from "@/components/appbar";
import BottomBar from "@/components/bottombar";

const communityNames: Record<string, string> = {
  sangh: "ರಾಷ್ಟ್ರೀಯ ಸ್ವಯಂಸೇವಕ ಸಂಘ",
  balagokula: "ಬಾಲಗೋಕುಲ",
};

export default function CommunityPage() {
  const params = useParams();
  const id = params?.community_id as string;
  const name = communityNames[id] || id;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${name}`} />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-14 pb-16">
        <h1 className="text-xl font-semibold text-center">
          {name}ಕ್ಕೆ ಸ್ವಾಗತ
        </h1>
      </main>
      <BottomBar communityId={id} communityName={name} active="home" />
    </>
  );
}