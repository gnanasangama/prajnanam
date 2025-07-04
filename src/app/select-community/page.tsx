"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const communities = [
  { id: "sangh", name: "Sangh", kn: "ರಾಷ್ಟ್ರೀಯ ಸ್ವಯಂಸೇವಕ ಸಂಘ" },
  { id: "balagokula", name: "Balagokula", kn: "ಬಾಲಗೋಕುಲ" },
];

export default function SelectCommunity() {
  const [selected, setSelected] = useState<string>("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      localStorage.setItem("community", selected);
      router.replace("/");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-xl font-semibold mb-6 text-center">
        ನಿಮ್ಮ ಕಮ್ಯೂನಿಟಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
      </h1>
      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        {communities.map((c) => (
          <label
            key={c.id}
            className={`flex items-center p-3 border rounded-4xl cursor-pointer transition-colors ${
              selected === c.id
                ? "border-pink-400 text-pink-400 font-semibold bg-pink-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="community"
              value={c.id}
              checked={selected === c.id}
              onChange={() => setSelected(c.id)}
              className="form-radio accent-pink-400 mr-3"
            />
            <span className="text-base">{c.kn}</span>
          </label>
        ))}
        <button
          type="submit"
          disabled={!selected}
          className="w-full mt-2 py-2 rounded-4xl font-semibold text-white bg-pink-400 disabled:bg-gray-300 transition"
        >
          ಆಯ್ಕೆಮಾಡಿ
        </button>
      </form>
    </main>
  );
}