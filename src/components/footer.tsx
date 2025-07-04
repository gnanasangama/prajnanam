import React from 'react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t text-gray-500 text-center py-2 text-xs">
      © {new Date().getFullYear()} Prajnanam. All rights reserved.
    </footer>
  );
}