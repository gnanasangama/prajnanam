"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getLang, setLang } from "@/utils/cookies";
import { useApp } from "@/context/AppContext";

const languages = [
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "en", label: "English" },
];

export default function SelectLanguage() {
  const [selected, setSelected] = useState<string>(() => getLang());
  const { setLang: setAppLang } = useApp();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLang(selected);
    setAppLang(selected);
    router.replace("/");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-xl font-semibold mb-6 text-center">ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ</h1>
      <form className="w-full max-w-xs space-y-4" onSubmit={handleSubmit}>
        {languages.map((lang) => (
          <label
            key={lang.code}
            className={`flex items-center p-3 border rounded-4xl cursor-pointer transition-colors ${selected === lang.code
              ? "border-pink-400 text-pink-400 font-semibold bg-pink-50"
              : "border-gray-300 bg-white"
              }`}
          >
            <input
              type="radio"
              name="language"
              value={lang.code}
              checked={selected === lang.code}
              onChange={() => setSelected(lang.code)}
              className="form-radio accent-pink-400 mr-3"
            />
            <span className="text-base">{lang.label}</span>
          </label>
        ))}
        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-4xl font-semibold text-white bg-pink-400 transition"
        >
          ಆಯ್ಕೆಮಾಡಿ
        </button>
      </form>
    </main>
  );
}