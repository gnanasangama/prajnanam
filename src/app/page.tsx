"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppBar from "@/components/appbar";
import BottomBar from "@/components/bottombar";

const communityNames: Record<string, string> = {
  sangh: "ರಾ. ಸ್ವ. ಸಂಘ",
  balagokula: "ಬಾಲಗೋಕುಲ",
};

export default function Home() {
  const [community, setCommunity] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("community");
    if (!stored) {
      router.replace("/select-community");
    } else {
      setCommunity(stored);
    }
  }, [router]);

  if (!community) return null;

  const name = communityNames[community] || community;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${name}`} />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-14 pb-16">
        <h1 className="text-xl font-semibold text-center">ಪ್ರಜ್ಞಾನಂ - ಮುಖಪುಟ</h1>
      </main>
      <BottomBar communityId={community} communityName={name} active="home" />
    </>
  );
}