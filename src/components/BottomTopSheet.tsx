import { XMarkIcon } from "@heroicons/react/24/solid";
import React, { useEffect } from "react";
import CustomMarkdown from "./CustomMarkdown";
import AdsterraAd320x50 from "./AdsterraAd/320x50";

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
    <>
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
            <CustomMarkdown content={description} />
          </div>
        </div>
      </div>
      <div className="fixed bottom-2 left-0 w-full flex justify-center items-center z-100 bg-white">
        <AdsterraAd320x50 />
      </div>
    </>
  );
}
