import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect } from "react";

export default function BottomTopSheet({
  open,
  onClose,
  title,
  description,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
}) {
  // 🧠 Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 pb-16">
      <div className="bg-white rounded-t-2xl w-full max-w-md shadow-lg animate-slideup h-[70vh] flex flex-col">
        {/* Header (fixed) */}
        <div className="px-4 py-3 flex items-start justify-between border-b border-gray-300">
          <h2 className="text-lg font-semibold text-pink-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-pink-400 transition"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="px-4 py-2 overflow-y-auto flex-1">
          <p className="text-gray-700 text-justify whitespace-pre-line">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
