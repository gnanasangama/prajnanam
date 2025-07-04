import React from 'react';

export default function AppBar({ title }: { title?: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm flex items-center h-14 px-4 border-b border-gray-100">
      <span className="font-bold text-lg tracking-wide text-pink-400">
        {title || "ಪ್ರಜ್ಞಾನಂ"}
      </span>
    </header>
  );
}
