import Link from "next/link";
import Image from "next/image";
import type { SiteSettingsDto } from "@/lib/cms/mappers";
import SocialLinks from "@/components/shared/SocialLinks";
import { getSiteBrandName } from "@/lib/cms/owner";
import type { PayloadGlobals } from "@/lib/payload/public-data";

interface HeaderProps {
  settings?: SiteSettingsDto | null;
  payload?: PayloadGlobals;
}

export default function Header({ settings, payload }: HeaderProps) {
  const siteName = getSiteBrandName(settings);
  const headerLinks = payload?.navigation.headerLinks || [
    { label: "Portfolio", href: "/portfolio", newTab: false },
    { label: "Pricing", href: "/#pricing", newTab: false },
    { label: "Contact", href: "/contact", newTab: false },
  ];
  const mobileCta = payload?.navigation.mobileCta || { label: "Contact", href: "/contact", newTab: false };
  const adminLink = payload?.navigation.adminLink || { enabled: true, label: "Admin", href: "/admin", newTab: false };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090d12]/78 backdrop-blur-xl supports-[backdrop-filter]:bg-[#090d12]/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-60" />
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          {settings?.logo_url ? (
            <Image
              src={settings.logo_url}
              alt={siteName}
              width={144}
              height={40}
              className="h-9 w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.35)]"
              priority
            />
          ) : settings?.owner_avatar_url ? (
            <Image
              src={settings.owner_avatar_url}
              alt={siteName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-2xl object-cover shadow-[0_18px_40px_-20px_rgba(125,211,199,0.45)]"
              priority
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white shadow-[0_18px_40px_-20px_rgba(125,211,199,0.45)]">
              P
            </div>
          )}
          <div className="hidden sm:block">
            <p className="font-heading text-lg font-semibold text-white">{siteName}</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <SocialLinks settings={settings} />
          {headerLinks.map((link, index) => (
            <Link
              key={`${link.href}-${link.label}`}
              href={link.href}
              target={link.newTab ? "_blank" : undefined}
              rel={link.newTab ? "noopener noreferrer" : undefined}
              className={
                index === headerLinks.length - 1
                  ? "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10"
                  : "rounded-full border border-transparent px-4 py-2 text-sm font-medium text-[#9aa7b9] hover:border-white/10 hover:bg-white/5 hover:text-white"
              }
            >
              {link.label}
            </Link>
          ))}
          {adminLink.enabled && adminLink.href && (
            <Link
              href={adminLink.href}
              target={adminLink.newTab ? "_blank" : undefined}
              rel={adminLink.newTab ? "noopener noreferrer" : undefined}
              className="ml-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-[#9aa7b9] hover:bg-white/5 hover:text-white"
            >
              {adminLink.label}
            </Link>
          )}
        </div>

        {mobileCta?.href && (
          <div className="lg:hidden">
            <Link
              href={mobileCta.href}
              target={mobileCta.newTab ? "_blank" : undefined}
              rel={mobileCta.newTab ? "noopener noreferrer" : undefined}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-[#8b5cf6]/40 hover:bg-[#8b5cf6]/10"
            >
              {mobileCta.label}
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
