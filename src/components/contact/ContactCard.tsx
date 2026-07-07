import Image from "next/image";
import type { ReactNode } from "react";
import type { SiteSettingsDto } from "@/lib/cms/mappers";
import {
  getOwnerBio,
  getOwnerDisplayName,
  getOwnerLocation,
  getOwnerSocialLinks,
  type OwnerSocialKind,
  type OwnerSocialLink,
} from "@/lib/cms/owner";

interface ContactCardProps {
  settings?: SiteSettingsDto | null;
}

type ContactIconProps = {
  className?: string;
};

type ContactPresentation = {
  platform: string;
  display: string;
  action: string;
  Icon: (props: ContactIconProps) => ReactNode;
};

function EmailIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4.5 8 7.5 5.7L19.5 8" />
    </svg>
  );
}

function DiscordIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M7 8.4c3-1.9 7-1.9 10 0l1.5 7.1-2.3 2.1c-2.8-1.1-5.6-1.1-8.4 0l-2.3-2.1L7 8.4Z" />
      <path d="M9.1 12.2h.01" />
      <path d="M14.9 12.2h.01" />
      <path d="M10 14.7c1.3.7 2.7.7 4 0" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="5" y="5" width="14" height="14" rx="4.2" />
      <circle cx="12" cy="12" r="3.2" />
      <circle cx="16.3" cy="7.8" r="0.8" />
    </svg>
  );
}

function WebsiteIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.5 2.4 3.8 5 3.8 8S14.5 17.6 12 20c-2.5-2.4-3.8-5-3.8-8S9.5 6.4 12 4Z" />
    </svg>
  );
}

function GitHubIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M12 4.2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.5c-2 .5-2.4-.8-2.4-.8-.3-.9-.8-1.1-.8-1.1-.6-.4 0-.4 0-.4.7.1 1.1.7 1.1.7.6 1.1 1.6.8 2 .6.1-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.6 0-.9.3-1.6.8-2.1-.1-.3-.4-1 .1-2.1 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1.1.2 1.8.1 2.1.5.5.8 1.2.8 2.1 0 2.8-1.8 3.4-3.4 3.6.3.3.6.9.6 1.8v2.7c0 .2.1.5.5.4A8 8 0 0 0 12 4.2Z" />
    </svg>
  );
}

function ModrinthIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M6 17V7h3.8l2.2 5.5L14.2 7H18v10h-3v-6l-2 5h-2l-2-5v6z" />
    </svg>
  );
}

function XIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

function YouTubeIcon({ className = "" }: ContactIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="3.5" y="6" width="17" height="12" rx="3" />
      <path d="m10 9.3 5 2.7-5 2.7V9.3Z" />
    </svg>
  );
}

function FiverrIcon({ className = "" }: ContactIconProps) {
  return <span className={`font-bold leading-none ${className}`}>F</span>;
}

function BehanceIcon({ className = "" }: ContactIconProps) {
  return <span className={`font-bold leading-none tracking-tight ${className}`}>Be</span>;
}

const iconByKind: Record<OwnerSocialKind, (props: ContactIconProps) => ReactNode> = {
  email: EmailIcon,
  discord: DiscordIcon,
  discord_server: DiscordIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  fiverr: FiverrIcon,
  behance: BehanceIcon,
  website: WebsiteIcon,
  github: GitHubIcon,
  modrinth: ModrinthIcon,
};

const actionByKind: Record<OwnerSocialKind, string> = {
  email: "Send Email",
  discord: "Message",
  discord_server: "Join Server",
  instagram: "Follow",
  x: "Follow",
  youtube: "Watch",
  fiverr: "Hire",
  behance: "View Portfolio",
  website: "Visit",
  github: "View Profile",
  modrinth: "View Profile",
};

const platformByKind: Record<OwnerSocialKind, string> = {
  email: "Email",
  discord: "Discord",
  discord_server: "Discord",
  instagram: "Instagram",
  x: "X",
  youtube: "YouTube",
  fiverr: "Fiverr",
  behance: "Behance",
  website: "Website",
  github: "GitHub",
  modrinth: "Modrinth",
};

function getUrlPart(value: string, fallback: string) {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.at(-1)?.replace(/^@/, "") || url.hostname.replace(/^www\./, "") || fallback;
  } catch {
    return fallback;
  }
}

function getDomain(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
}

function getFriendlyDisplay(link: OwnerSocialLink) {
  if (link.kind === "email" || link.kind === "discord") {
    return link.value;
  }

  if (link.kind === "discord_server") {
    return "Join our Discord Community";
  }

  if (link.kind === "website") {
    return getDomain(link.href);
  }

  if (link.kind === "instagram" || link.kind === "x") {
    const handle = getUrlPart(link.href, link.value).replace(/^@/, "");
    return `@${handle}`;
  }

  if (link.kind === "youtube") {
    return getUrlPart(link.href, "YouTube Channel").replace(/^@/, "@");
  }

  return getUrlPart(link.href, link.value);
}

function getContactPresentation(link: OwnerSocialLink): ContactPresentation {
  return {
    platform: platformByKind[link.kind],
    display: getFriendlyDisplay(link),
    action: actionByKind[link.kind],
    Icon: iconByKind[link.kind],
  };
}

function stripUrlsFromText(value: string) {
  return value.replace(/https?:\/\/\S+|www\.\S+/gi, "").replace(/\s{2,}/g, " ").trim();
}

export default function ContactCard({ settings }: ContactCardProps) {
  const ownerName = getOwnerDisplayName(settings);
  const ownerBio = stripUrlsFromText(getOwnerBio(settings));
  const fallbackBio = stripUrlsFromText(settings?.about_text || "");
  const ownerLocation = getOwnerLocation(settings);
  const links = getOwnerSocialLinks(settings);

  return (
    <section className="section-shell contact-polish-shell py-20 sm:py-24">
      <div className="section-grid" />
      <div className="contact-glow-field" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="section-kicker mb-5 justify-center">Contact</span>
          <h1 className="section-title text-4xl sm:text-5xl lg:text-6xl">
            Get in touch with {ownerName}
          </h1>
          <p className="section-copy mx-auto mt-5 max-w-2xl text-lg">
            Choose the best place to connect, collaborate, or start a commission.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr,1.08fr] lg:items-start">
          <article className="contact-owner-card group relative overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-[0_36px_100px_-62px_rgba(139,92,246,0.52)] sm:p-8">
            <div className="relative z-10">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start xl:flex-row xl:items-center">
                <div className="contact-avatar relative h-36 w-36 shrink-0 overflow-hidden rounded-[1.75rem] border border-[#b794f6]/30 bg-white/5 shadow-[0_24px_70px_-38px_rgba(183,148,246,0.72)] sm:h-44 sm:w-44">
                  {settings?.owner_avatar_url ? (
                    <Image
                      src={settings.owner_avatar_url}
                      alt={ownerName}
                      fill
                      sizes="(min-width: 640px) 176px, 144px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(183,148,246,0.5),rgba(36,27,59,0.9))] text-6xl font-semibold text-white">
                      {ownerName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b794f6]">Owner profile</p>
                  <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{ownerName}</h2>
                  {ownerLocation && (
                    <p className="mt-4 inline-flex rounded-full border border-[#b794f6]/25 bg-[#8b5cf6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#d7cdf5]">
                      {ownerLocation}
                    </p>
                  )}
                </div>
              </div>

              <p className="mt-7 max-w-2xl text-sm leading-8 text-[#cfd7e6] sm:text-base">
                {ownerBio || fallbackBio || "Project inquiries, collaborations, and business questions can all go here."}
              </p>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2">
            {links.map((link, index) => {
              const contact = getContactPresentation(link);
              const Icon = contact.Icon;

              return (
                <a
                  key={link.kind}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="contact-link-card group relative flex min-h-48 flex-col overflow-hidden rounded-[1.5rem] border border-white/10 p-5 text-white shadow-[0_28px_90px_-62px_rgba(139,92,246,0.44)]"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <span className="contact-icon-shell mb-6 inline-flex h-13 w-13 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-[#d7cdf5]">
                    <Icon className="h-5 w-5 fill-none stroke-current stroke-2" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#9aa7b9] transition-colors group-hover:text-[#d7cdf5]">
                    {contact.platform}
                  </span>
                  <span className="mt-2 break-words text-lg font-semibold leading-6 text-white">
                    {contact.display}
                  </span>
                  <span className="mt-auto pt-6 text-sm font-bold text-[#b794f6] transition-colors group-hover:text-white">
                    {contact.action} <span aria-hidden="true">&rarr;</span>
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
