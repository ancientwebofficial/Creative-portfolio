"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettingsDto } from "@/lib/cms/mappers";

interface TextEdit {
  id: keyof Pick<
    SiteSettingsDto,
    "hero_title" | "hero_subtitle" | "about_text" | "footer_text"
  >;
  label: string;
  value: string;
}

interface SiteTextEditorProps {
  initialSettings?: SiteSettingsDto | null;
}

function buildTexts(settings?: SiteSettingsDto | null): TextEdit[] {
  return [
    {
      id: "hero_title",
      label: "Hero Title",
      value: settings?.hero_title || "Premium Minecraft Creative Design",
    },
    {
      id: "hero_subtitle",
      label: "Hero Subtitle",
      value: settings?.hero_subtitle || "Crafted thumbnails, logos, texture packs...",
    },
    {
      id: "about_text",
      label: "About Text",
      value: settings?.about_text || "",
    },
    {
      id: "footer_text",
      label: "Footer Text",
      value: settings?.footer_text || "Creative Portfolio. All rights reserved.",
    },
  ];
}

export default function SiteTextEditor({ initialSettings }: SiteTextEditorProps) {
  const router = useRouter();
  const [texts, setTexts] = useState<TextEdit[]>(buildTexts(initialSettings));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (id: string, newValue: string) => {
    setTexts(texts.map((text) => (text.id === id ? { ...text, value: newValue } : text)));
  };

  const saveTexts = async () => {
    setStatus("saving");
    setError("");

    const payload = Object.fromEntries(
      texts.map((text) => [text.id, text.value || null])
    );

    const response = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("");
      setError(result?.error?.message || "Text content could not be saved.");
      return;
    }

    setStatus("saved");
    router.refresh();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#E8E8E8] mb-8">Site Text Editor</h1>

      {error && <p className="mb-6 text-red-400 text-sm font-semibold">{error}</p>}

      <div className="space-y-6">
        {texts.map((text) => (
          <div
            key={text.id}
            className="bg-[#1B1E22] border border-[#252A31] rounded p-6 hover:border-[#6E56CF] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-[#E8E8E8]">{text.label}</h3>
              <button
                type="button"
                onClick={() => setEditingId(editingId === text.id ? null : text.id)}
                className="text-[#6E56CF] hover:text-[#7C66DB] font-semibold transition-colors"
              >
                {editingId === text.id ? "Done" : "Edit"}
              </button>
            </div>

            {editingId === text.id ? (
              <textarea
                value={text.value}
                onChange={(event) => handleChange(text.id, event.target.value)}
                className="w-full p-3 bg-[#252A31] text-[#E8E8E8] border border-[#6E56CF] rounded focus:outline-none min-h-24"
              />
            ) : (
              <p className="text-[#9CA3AF]">{text.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center gap-4">
        <button
          type="button"
          onClick={saveTexts}
          disabled={status === "saving"}
          className="px-6 py-3 bg-[#6E56CF] hover:bg-[#7C66DB] disabled:opacity-60 text-[#E8E8E8] font-semibold rounded transition-colors"
        >
          {status === "saving" ? "Saving..." : "Save All Changes"}
        </button>
        {status === "saved" && (
          <p className="text-[#6E56CF] text-sm font-semibold">Saved</p>
        )}
      </div>
    </div>
  );
}
