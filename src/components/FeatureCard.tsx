"use client";

import { useRouter } from "next/navigation";

interface FeatureCardProps {
  title: string;
  subtitle?: string;
  image: string;
  link: string;
}

export default function FeatureCard({ title, subtitle, image, link }: FeatureCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(link)}
      className="relative mb-3 w-full max-w-md h-[180px] rounded-lg overflow-hidden cursor-pointer select-none"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${image}')` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-35 z-10" />

      {/* Text on top */}
      <div className="absolute inset-0 z-20 text-white flex flex-col justify-start items-start p-4">
        <h5 className="text-2xl font-bold mb-0">{title}</h5>
        {subtitle && <p className="text-sm mt-1 font-semibold">{subtitle}</p>}
      </div>
    </div>
  );
}