import type { SiteSettingsDto } from "@/lib/cms/mappers";
import { getOwnerSocialLinks } from "@/lib/cms/owner";

type SocialLinkVariant = "icons" | "list";

interface SocialLinksProps {
  settings?: SiteSettingsDto | null;
  variant?: SocialLinkVariant;
  className?: string;
}

function IconShell({ children }: { children: React.ReactNode }) {
  return (
    <span className="social-icon-shell flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white group-hover:border-[#8b5cf6]/35 group-hover:bg-[#8b5cf6]/10">
      {children}
    </span>
  );
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M7 8.5c3-2 7-2 10 0l1.5 7-2.3 2.2c-2.8-1.1-5.6-1.1-8.4 0L5.5 15.5 7 8.5Z" />
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M10 14.5c1.3.8 2.7.8 4 0" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <rect x="5" y="5" width="14" height="14" rx="4" />
      <circle cx="12" cy="12" r="3.25" />
      <circle cx="16.2" cy="7.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M5 5 19 19" />
      <path d="M19 5 5 19" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <rect x="3.5" y="6" width="17" height="12" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WebsiteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c2.5 2.3 3.8 5 3.8 8S14.5 17.7 12 20c-2.5-2.3-3.8-5-3.8-8S9.5 6.3 12 4Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M12 4.2a8 8 0 0 0-2.5 15.6c.4.1.5-.2.5-.4v-1.4c-2 .4-2.4-.8-2.4-.8-.3-.9-.8-1.1-.8-1.1-.6-.4 0-.4 0-.4.7 0 1.1.7 1.1.7.6 1.1 1.6.8 2 .6.1-.5.3-.8.5-1-1.6-.2-3.3-.8-3.3-3.7 0-.8.3-1.5.8-2.1-.1-.2-.4-1 .1-2 0 0 .7-.2 2.2.8a7.7 7.7 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.5 1 .2 1.8.1 2 .5.6.8 1.3.8 2.1 0 2.9-1.8 3.5-3.4 3.7.3.3.6.9.6 1.8v2.6c0 .2.1.5.5.4A8 8 0 0 0 12 4.2Z" />
    </svg>
  );
}

function ModrinthIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-2">
      <path d="M6 17V7h3.8l2.2 5.5L14.2 7H18v10h-3V11l-2 5h-2l-2-5v6z" />
    </svg>
  );
}

function FiverrIcon() {
  return <span className="text-sm font-bold leading-none">F</span>;
}

function BehanceIcon() {
  return <span className="text-[0.65rem] font-bold leading-none tracking-tight">Be</span>;
}

const iconByKind = {
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
} as const;

export default function SocialLinks({
  settings,
  variant = "icons",
  className = "",
}: SocialLinksProps) {
  const links = getOwnerSocialLinks(settings);

  if (links.length === 0) {
    return null;
  }

  if (variant === "list") {
    return (
      <div className={`grid gap-3 ${className}`}>
        {links.map((link) => {
          const Icon = iconByKind[link.kind];

          return (
            <a
              key={link.kind}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="social-list-link group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white hover:border-[#8b5cf6]/35 hover:bg-white/10"
            >
              <IconShell>
                <Icon />
              </IconShell>
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9]">{link.label}</p>
                <p className="mt-1 truncate text-sm font-medium text-white">
                  {link.value}
                </p>
              </div>
              <span className="text-[#9aa7b9] transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {links.map((link) => {
        const Icon = iconByKind[link.kind];

        return (
          <a
            key={link.kind}
            href={link.href}
            title={link.label}
            aria-label={link.label}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group inline-flex"
          >
            <IconShell>
              <Icon />
            </IconShell>
          </a>
        );
      })}
    </div>
  );
}
