"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaDto, SiteSettingsDto } from "@/lib/cms/mappers";

interface SettingsPanelProps {
  initialSettings?: SiteSettingsDto | null;
  initialMedia?: MediaDto[];
}

interface SettingsFormState {
  site_name: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  discord_url: string;
  owner_name: string;
  owner_avatar_url: string;
  owner_email: string;
  owner_discord: string;
  owner_discord_server_url: string;
  owner_instagram_url: string;
  owner_x_url: string;
  owner_youtube_url: string;
  owner_fiverr_url: string;
  owner_behance_url: string;
  owner_website_url: string;
  owner_github_url: string;
  owner_modrinth_url: string;
  owner_location: string;
  owner_bio: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  logo_url: string;
  favicon_url: string;
  socials: Record<string, string>;
}

interface FormField {
  key: keyof SettingsFormState;
  label: string;
  type: "text" | "email" | "url" | "textarea";
  placeholder?: string;
}

function buildInitialForm(settings?: SiteSettingsDto | null): SettingsFormState {
  return {
    site_name: settings?.site_name || "Creative Portfolio",
    hero_title: settings?.hero_title || "",
    hero_subtitle: settings?.hero_subtitle || "",
    about_text: settings?.about_text || "",
    discord_url: settings?.discord_url || "https://discord.gg/your-server",
    owner_name: settings?.owner_name || "",
    owner_avatar_url: settings?.owner_avatar_url || "",
    owner_email: settings?.owner_email || "",
    owner_discord: settings?.owner_discord || "",
    owner_discord_server_url: settings?.owner_discord_server_url || "",
    owner_instagram_url: settings?.owner_instagram_url || "",
    owner_x_url: settings?.owner_x_url || "",
    owner_youtube_url: settings?.owner_youtube_url || "",
    owner_fiverr_url: settings?.owner_fiverr_url || "",
    owner_behance_url: settings?.owner_behance_url || "",
    owner_website_url: settings?.owner_website_url || "",
    owner_github_url: settings?.owner_github_url || "",
    owner_modrinth_url: settings?.owner_modrinth_url || "",
    owner_location: settings?.owner_location || "",
    owner_bio: settings?.owner_bio || "",
    footer_text: settings?.footer_text || "Creative Portfolio. All rights reserved.",
    seo_title: settings?.seo_title || "",
    seo_description: settings?.seo_description || "Premium Minecraft design portfolio",
    logo_url: settings?.logo_url || "",
    favicon_url: settings?.favicon_url || "",
    socials: (settings?.socials && typeof settings.socials === "object" && !Array.isArray(settings.socials)
      ? (settings.socials as Record<string, string>)
      : {}),
  };
}

const generalFields: FormField[] = [
  { key: "site_name", label: "Site Title", type: "text" },
  { key: "hero_title", label: "Hero Title", type: "text" },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
  { key: "about_text", label: "About Text", type: "textarea", placeholder: "Short intro shown on the homepage." },
  { key: "seo_title", label: "SEO Title", type: "text" },
  { key: "seo_description", label: "Site Description", type: "text" },
  { key: "discord_url", label: "Discord Server URL", type: "url" },
  { key: "footer_text", label: "Footer Text", type: "text" },
];

const ownerFields: FormField[] = [
  { key: "owner_name", label: "Name", type: "text" },
  { key: "owner_email", label: "Email", type: "email" },
  { key: "owner_discord", label: "Discord Username", type: "text" },
  { key: "owner_discord_server_url", label: "Discord Server Invite URL", type: "url" },
  { key: "owner_instagram_url", label: "Instagram URL", type: "url" },
  { key: "owner_x_url", label: "X URL", type: "url" },
  { key: "owner_youtube_url", label: "YouTube URL", type: "url" },
  { key: "owner_fiverr_url", label: "Fiverr URL", type: "url" },
  { key: "owner_behance_url", label: "Behance URL", type: "url" },
  { key: "owner_website_url", label: "Website URL", type: "url" },
  { key: "owner_github_url", label: "GitHub URL", type: "url" },
  { key: "owner_modrinth_url", label: "Modrinth URL", type: "url" },
  { key: "owner_location", label: "Location", type: "text" },
  { key: "owner_bio", label: "Bio", type: "textarea", placeholder: "A short public bio for contact and about sections." },
];

async function uploadMediaFile(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/uploads", {
    method: "POST",
    body: formData,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.error?.message || "Upload failed.");
  }

  return result.data.items[0] as MediaDto;
}

export default function SettingsPanel({ initialSettings, initialMedia = [] }: SettingsPanelProps) {
  const router = useRouter();
  const [form, setForm] = useState<SettingsFormState>(buildInitialForm(initialSettings));
  const [mediaItems, setMediaItems] = useState<MediaDto[]>(initialMedia);
  const [featureToggles, setFeatureToggles] = useState([
    { id: "theme-mode", label: "Dark Mode", value: true },
    { id: "analytics", label: "Enable Analytics", value: true },
  ]);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = <K extends keyof SettingsFormState>(key: K, value: SettingsFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setStatus("idle");
  };

  const submitSettings = async (nextForm: SettingsFormState) => {
    setStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nextForm),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error?.message || "Settings could not be saved.");
      }

      setStatus("saved");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Settings could not be saved.");
      setStatus("error");
    }
  };

  const handleSave = async () => {
    await submitSettings(form);
  };

  const handleBrandingUpload = async (file: File | undefined, kind: "logo" | "favicon") => {
    if (!file) return;

    try {
      setStatus("saving");
      setErrorMessage("");
      const uploaded = await uploadMediaFile(file, `branding/${kind}`);
      const nextForm = {
        ...form,
        logo_url: kind === "logo" ? uploaded.file_url : form.logo_url,
        favicon_url: kind === "favicon" ? uploaded.file_url : form.favicon_url,
      };
      setForm(nextForm);
      await submitSettings(nextForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
      setStatus("error");
    }
  };

  const handleOwnerAvatarUpload = async (file: File | undefined) => {
    if (!file) return;

    try {
      setStatus("saving");
      setErrorMessage("");
      const uploaded = await uploadMediaFile(file, "owner-profile");
      const nextForm = { ...form, owner_avatar_url: uploaded.file_url };
      setMediaItems((current) => [uploaded, ...current]);
      setForm(nextForm);
      await submitSettings(nextForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Upload failed.");
      setStatus("error");
    }
  };

  const handleAvatarPick = async (mediaUrl: string) => {
    const nextForm = { ...form, owner_avatar_url: mediaUrl };
    setForm(nextForm);
    await submitSettings(nextForm);
  };

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold text-[#E8E8E8]">Settings</h1>

      <div className="max-w-4xl space-y-6">
        <div className="rounded border border-[#252A31] bg-[#1B1E22] p-6">
          <h2 className="mb-6 text-xl font-bold text-[#E8E8E8]">General Settings</h2>
          <div className="space-y-4">
            {generalFields.map((field) => (
              <div key={field.key}>
                <label className="mb-2 block font-semibold text-[#E8E8E8]">{field.label}</label>
                {(() => {
                  const value = form[field.key] as string;

                  return field.type === "textarea" ? (
                    <textarea
                      value={value}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full rounded border border-[#2F3440] bg-[#252A31] px-4 py-2 text-[#E8E8E8] outline-none transition-colors focus:border-[#6E56CF]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={value}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded border border-[#2F3440] bg-[#252A31] px-4 py-2 text-[#E8E8E8] outline-none transition-colors focus:border-[#6E56CF]"
                    />
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded border border-[#252A31] bg-[#1B1E22] p-6">
          <h2 className="mb-6 text-xl font-bold text-[#E8E8E8]">Branding</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold text-[#E8E8E8]">Logo</label>
              <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded border border-[#2F3440] bg-[#252A31]">
                {form.logo_url ? (
                  <Image src={form.logo_url} alt="Current logo" width={220} height={80} className="h-auto max-h-20 w-auto object-contain" />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-[#6E56CF] text-sm font-bold text-white">P</div>
                )}
              </div>
              <label className="inline-flex cursor-pointer rounded bg-[#252A31] px-4 py-2 font-semibold text-[#E8E8E8] transition-colors hover:bg-[#2F3440]">
                Upload Logo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => handleBrandingUpload(event.target.files?.[0], "logo")}
                  className="sr-only"
                />
              </label>
            </div>

            <div>
              <label className="mb-2 block font-semibold text-[#E8E8E8]">Favicon</label>
              <div className="mb-3 flex h-24 items-center justify-center overflow-hidden rounded border border-[#2F3440] bg-[#252A31]">
                {form.favicon_url ? (
                  <Image src={form.favicon_url} alt="Current favicon" width={64} height={64} className="h-12 w-12 object-contain" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[#6E56CF] text-xs font-bold text-white">P</div>
                )}
              </div>
              <label className="inline-flex cursor-pointer rounded bg-[#252A31] px-4 py-2 font-semibold text-[#E8E8E8] transition-colors hover:bg-[#2F3440]">
                Upload Favicon
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(event) => handleBrandingUpload(event.target.files?.[0], "favicon")}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="rounded border border-[#252A31] bg-[#1B1E22] p-6">
          <h2 className="mb-6 text-xl font-bold text-[#E8E8E8]">Owner Profile</h2>
          <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
            <div>
              <label className="mb-2 block font-semibold text-[#E8E8E8]">Profile Picture</label>
              <div className="mb-4 overflow-hidden rounded-2xl border border-[#2F3440] bg-[#252A31]">
                <div className="relative aspect-square w-full">
                  {form.owner_avatar_url ? (
                    <Image
                      src={form.owner_avatar_url}
                      alt={form.owner_name || "Owner avatar"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-[#9CA3AF]">
                      No avatar selected
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="inline-flex cursor-pointer rounded bg-[#252A31] px-4 py-2 font-semibold text-[#E8E8E8] transition-colors hover:bg-[#2F3440]">
                  Upload Profile Picture
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) => handleOwnerAvatarUpload(event.target.files?.[0])}
                    className="sr-only"
                  />
                </label>
                <p className="text-sm text-[#9CA3AF]">Choose from the media library below or upload a new image.</p>
              </div>

              {mediaItems.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#9CA3AF]">Media Library</p>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3">
                    {mediaItems.slice(0, 12).map((media) => {
                      const selected = form.owner_avatar_url === media.file_url;

                      return (
                        <button
                          key={media.id}
                          type="button"
                          onClick={() => handleAvatarPick(media.file_url)}
                          className={`group overflow-hidden rounded-xl border transition-all ${
                            selected ? "border-[#6E56CF] ring-2 ring-[#6E56CF]/30" : "border-[#2F3440] hover:border-[#6E56CF]/60"
                          }`}
                        >
                          <div className="relative aspect-square bg-[#252A31]">
                            <Image src={media.file_url} alt={media.alt_text || media.file_name} fill className="object-cover" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {ownerFields.map((field) => (
                <div key={field.key}>
                  <label className="mb-2 block font-semibold text-[#E8E8E8]">{field.label}</label>
                  {(() => {
                    const value = form[field.key] as string;

                    return field.type === "textarea" ? (
                      <textarea
                        value={value}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={field.key === "owner_bio" ? 6 : 4}
                        className="w-full rounded border border-[#2F3440] bg-[#252A31] px-4 py-2 text-[#E8E8E8] outline-none transition-colors focus:border-[#6E56CF]"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={value}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        className="w-full rounded border border-[#2F3440] bg-[#252A31] px-4 py-2 text-[#E8E8E8] outline-none transition-colors focus:border-[#6E56CF]"
                      />
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded border border-[#252A31] bg-[#1B1E22] p-6">
          <h2 className="mb-6 text-xl font-bold text-[#E8E8E8]">Features</h2>
          <div className="space-y-4">
            {featureToggles.map((toggle, index) => (
              <div key={toggle.id} className="flex items-center justify-between">
                <label className="font-semibold text-[#E8E8E8]">{toggle.label}</label>
                <button
                  type="button"
                  onClick={() =>
                    setFeatureToggles((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, value: !item.value } : item
                      )
                    )
                  }
                  className={`h-6 w-12 rounded-full transition-colors ${
                    toggle.value ? "bg-[#6E56CF]" : "bg-[#252A31]"
                  }`}
                >
                  <div
                    className={`h-5 w-5 rounded-full bg-[#E8E8E8] transition-transform ${
                      toggle.value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={status === "saving"}
            className="rounded bg-[#6E56CF] px-6 py-3 font-semibold text-[#E8E8E8] transition-colors hover:bg-[#7C66DB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "saving" ? "Saving..." : "Save Settings"}
          </button>
          {status === "saved" && <p className="text-sm font-semibold text-[#6E56CF]">Saved</p>}
          {status === "error" && <p className="text-sm font-semibold text-red-400">{errorMessage || "Save failed"}</p>}
        </div>
      </div>
    </div>
  );
}
