// components/WhatsAppFloatButton.js

'use client'; // if you're using Next.js App Router

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloatButton() {
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    // Ensure we get the correct URL on client side
    setShareUrl(window.location.href);
  }, []);

  function shareOnWhatsapp() {
    const shareText = 'Prajnanam App !\n\n';
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + shareUrl)}`;
    window.open(whatsappUrl, '_blank');
  }

  return (
    <button
      onClick={shareOnWhatsapp}
      className="fixed bottom-20 right-3 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 shadow-lg z-50 transition-colors"
      aria-label="Share on WhatsApp"
    >
      <FaWhatsapp size={32} />
    </button>
  );
}