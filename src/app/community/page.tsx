"use client";

import React, { useEffect } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import FeatureCard from "@/components/FeatureCard";
import { useApp } from "@/context/AppContext";
import WikiWidget from "@/components/wikiWidget";
import WhatsAppFloatButton from "@/components/WhatsAppFloatButton";

export default function CommunityTab() {
  const { community, lang } = useApp();

  useEffect(() => {
    if (community) {
      document.title = `Community - ${community.name?.['en'] || community.community_id}`;
    }
  }, [community]);

  if (!community) return null;

  return (
    <>
      <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${community.name?.[lang] || community.community_id}`} />
      {community.features.routine &&
        <FeatureCard
          title="ಶಾಖಾ ದಿನಚರಿ"
          subtitle="ಶ್ರೀ ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ"
          image={`/images/features/${community.community_id}.webp`}
          link="/community/routine"
        />}

      {community.features.annual_plan &&
        <FeatureCard
          title="ವಾರ್ಷಿಕ ಯೋಜನೆ"
          subtitle="ಶ್ರೀ ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ"
          image={`/images/features/annual-plan.webp`}
          link="/community/annual-plan"
        />}

      {community.features.wiki &&
        <WikiWidget />}

      <WhatsAppFloatButton />

      <BottomBar
        communityName={community.name?.[lang] || community.community_id}
        active="community"
      />
    </>
  );
}
