"use client";
import React from "react";
import AppBar from "@/components/appbar";
import BottomBar from "@/components/bottombar";

const communityNames: Record<string, string> = {
  sangh: "ರಾ. ಸ್ವ. ಸಂಘ",
  balagokula: "ಬಾಲಗೋಕುಲ",
};

export default function CommunityTab({ params }: { params: Promise<{ community_id: string }> }) {
  const { community_id } = React.use(params);
  const name = communityNames[community_id] || community_id;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${name}`} />
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 pt-14 pb-16">
        <h1 className="text-xl font-semibold text-center">{name}</h1>
      </main>
      <BottomBar communityId={community_id} communityName={name} active="community" />
    </>
  );
}