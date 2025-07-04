"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function AppBar({ title }: { title?: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex items-center h-14 px-4 border-b border-gray-100">
      <span className="font-bold text-lg tracking-wide text-pink-400 flex-1">
        {title || "ಪ್ರಜ್ಞಾನಂ"}
      </span>
      <div className="relative" ref={menuRef}>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="4" cy="10" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="16" cy="10" r="1.5" />
          </svg>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-60 bg-white border rounded shadow-lg z-50">
            <button
              className="w-full text-left px-4 py-2 hover:bg-pink-50 text-gray-700"
              onClick={() => {
                setOpen(false);
                router.push("/select-community");
              }}
            >
              ಕಮ್ಯೂನಿಟಿ ಬದಲಾಯಿಸಿ
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
