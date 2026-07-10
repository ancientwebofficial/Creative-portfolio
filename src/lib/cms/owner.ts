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

const ownerSocialKinds: OwnerSocialKind[] = [
  "email",
  "discord",
  "discord_server",
  "instagram",
  "x",
  "youtube",
  "fiverr",
  "behance",
  "website",
  "github",
  "modrinth",
];

function isOwnerSocialKind(value: unknown): value is OwnerSocialKind {
  return typeof value === "string" && ownerSocialKinds.includes(value as OwnerSocialKind);
}

function getPayloadSocialLinks(settings?: SiteSettingsDto | null) {
  const socials = settings?.socials;

  if (!socials || typeof socials !== "object" || Array.isArray(socials)) {
    return [];
  }

  const rawLinks = socials.ownerSocialLinks as unknown;

  if (!Array.isArray(rawLinks)) {
    return [];
  }

  return (rawLinks as unknown[])
    .filter((link): link is Record<string, unknown> => Boolean(link && typeof link === "object" && !Array.isArray(link)))
    .filter((link) => isOwnerSocialKind(link.kind) && typeof link.href === "string")
    .map((link): OwnerSocialLink => ({
      kind: link.kind as OwnerSocialKind,
      label: typeof link.label === "string" ? link.label : String(link.kind),
      href: link.href as string,
      value: typeof link.value === "string" ? link.value : (link.href as string),
      external: link.external !== false,
    }));
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
  const payloadLinks = getPayloadSocialLinks(settings);

  if (payloadLinks.length > 0) {
    return payloadLinks;
  }

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
