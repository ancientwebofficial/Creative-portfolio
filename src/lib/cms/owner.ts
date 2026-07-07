import type { SiteSettingsDto } from "./mappers";

export type OwnerSocialKind =
  | "email"
  | "discord"
  | "discord_server"
  | "instagram"
  | "x"
  | "youtube"
  | "fiverr"
  | "behance"
  | "website"
  | "github"
  | "modrinth";

export interface OwnerSocialLink {
  kind: OwnerSocialKind;
  label: string;
  href: string;
  value: string;
  external: boolean;
}

export function getOwnerDisplayName(settings?: SiteSettingsDto | null) {
  return settings?.owner_name?.trim() || settings?.site_name || "Creative Portfolio";
}

export function getSiteBrandName(settings?: SiteSettingsDto | null) {
  return settings?.site_name?.trim() || "Creative Portfolio";
}

export function getOwnerBio(settings?: SiteSettingsDto | null) {
  return settings?.owner_bio?.trim() || settings?.about_text?.trim() || "";
}

export function getOwnerLocation(settings?: SiteSettingsDto | null) {
  return settings?.owner_location?.trim() || "";
}

export function getOwnerSocialLinks(settings?: SiteSettingsDto | null) {
  const links: OwnerSocialLink[] = [];

  if (settings?.owner_email?.trim()) {
    links.push({
      kind: "email",
      label: "Email",
      href: `mailto:${settings.owner_email.trim()}`,
      value: settings.owner_email.trim(),
      external: false,
    });
  }

  if (settings?.owner_discord?.trim()) {
    const username = settings.owner_discord.trim().replace(/^@+/, "");
    links.push({
      kind: "discord",
      label: "Discord",
      href: `https://discord.com/users/${encodeURIComponent(username)}`,
      value: `@${username}`,
      external: true,
    });
  }

  if (settings?.owner_discord_server_url?.trim()) {
    links.push({
      kind: "discord_server",
      label: "Join Discord",
      href: settings.owner_discord_server_url.trim(),
      value: "Discord Community",
      external: true,
    });
  }

  const urlFields: Array<[OwnerSocialKind, string, string]> = [
    ["instagram", "Instagram", settings?.owner_instagram_url || ""],
    ["x", "X", settings?.owner_x_url || ""],
    ["youtube", "YouTube", settings?.owner_youtube_url || ""],
    ["fiverr", "Fiverr", settings?.owner_fiverr_url || ""],
    ["behance", "Behance", settings?.owner_behance_url || ""],
    ["website", "Website", settings?.owner_website_url || ""],
    ["github", "GitHub", settings?.owner_github_url || ""],
    ["modrinth", "Modrinth", settings?.owner_modrinth_url || ""],
  ];

  for (const [kind, label, href] of urlFields) {
    if (href.trim()) {
      links.push({
        kind,
        label,
        href: href.trim(),
        value: href.trim(),
        external: true,
      });
    }
  }

  return links;
}

export function getOwnerContactHref(settings?: SiteSettingsDto | null) {
  return settings?.owner_email?.trim() || settings?.owner_website_url?.trim() || "/contact";
}
