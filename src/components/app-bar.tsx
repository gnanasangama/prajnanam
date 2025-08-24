"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function AppBar({ title, isSpecialGradient = false }: { title?: string, isSpecialGradient?: boolean }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const isDev = process.env.NEXT_PUBLIC_DEPLOY_ENV === "development";

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isDev ? "bg-pink-400" : "bg-white"} shadow-sm flex items-center h-14 px-4 border-b border-gray-100`}>
      <span className={`font-bold text-lg tracking-wide ${isDev ? "text-white" : (isSpecialGradient ? "bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent" : "text-pink-400")} flex-1`}>
        {title || "ಪ್ರಜ್ಞಾನಂ"}
      </span>
      <div className="relative" ref={menuRef}>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg className={`w-6 h-6 ${isDev ? "text-white" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-400 rounded shadow-lg z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700 border-b border-gray-400"
              onClick={() => {
                setOpen(false);
                router.push("/select-community");
              }}
            >
              ಕಮ್ಯೂನಿಟಿ ಬದಲಾಯಿಸಿ
            </button>
            {/* <button
              className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
              onClick={() => {
                setOpen(false);
                router.push("/select-language");
              }}
            >
              ಭಾಷೆ ಬದಲಾಯಿಸಿ
            </button> */}
          </div>
        )}
      </div>
      {isDev && (
        <div className="fixed top-16 right-2 bg-blue-500 text-white px-3 py-1 text-sm rounded shadow-md z-50">
          DEV MODE
        </div>
      )}

    </header>
  );
}
