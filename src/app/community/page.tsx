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
  // const pdfUrl =
  //   "https://hwgsfolehabqnxcegeyr.supabase.co/storage/v1/object/sign/knowledge-items/prarthana-sapthaha.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV80ZjIzN2FlOC0wNWJkLTRmYWEtYjE1Ni00OWFlMmMyZjYzMGEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJrbm93bGVkZ2UtaXRlbXMvcHJhcnRoYW5hLXNhcHRoYWhhLnBkZiIsImlhdCI6MTc1NzE0ODQ0NCwiZXhwIjoxNzU3NzUzMjQ0fQ.EQP1rrw0DOOWWovWqT4L3i10B-6OouZXW6Kk_zfMQ04";

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
          title={community.properties?.routine.header.title ?? "ಶಾಖಾ ದಿನಚರಿ"}
          subtitle={community.properties?.routine.header.subtitle ?? "ಶ್ರೀ ವಿಶ್ವಾವಸು ಸಂವತ್ಸರ"}
          image={`/images/features/${community.community_id}.webp`}
          link="/community/routine"
        />}

      {community.features.annual_plan &&
        <FeatureCard
          title="ಪ್ರಾರ್ಥನಾ ಸಪ್ತಾಹ"
          subtitle="▶ ಪದ ▶ ಉಚ್ಛಾರ ▶ ರಾಗ ▶ ಭಾವಾಧ್ಧ"
          image={`/images/prarthana-sapthaha.png`}
          link={`/images/prarthana-sapthaha.pdf`}
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
