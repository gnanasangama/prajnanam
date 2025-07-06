import React from "react";

export default function ClippedBanner({
  title,
  description,
  onMore,
}: {
  title: string;
  description: string;
  onMore: () => void;
}) {
  return (
    <div className="bg-pink-50 border border-pink-200 rounded-xl p-2 my-4 text-center">
      <h2 className="text-lg font-semibold text-pink-400 mb-1">{title}</h2>
      <div className="relative inline-block text-left text-gray-700 max-w-full">
        <p
          className="line-clamp-3 text-gray-700"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
        <div className="absolute right-0 bottom-0 bg-pink-50">
          &nbsp;... <button
            onClick={onMore}
            className="text-pink-400 font-semibold underline text-sm"
          >
            ಇನ್ನೂ ಹೆಚ್ಚು
          </button>
        </div>
      </div>
    </div>
  );
}
