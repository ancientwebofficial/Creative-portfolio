import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsDto } from "@/lib/cms/mappers";
import { getOwnerBio, getOwnerDisplayName } from "@/lib/cms/owner";
import SocialLinks from "@/components/shared/SocialLinks";

interface AboutOwnerProps {
  settings?: SiteSettingsDto | null;
  content?: {
    eyebrow?: string | null;
    cta?: { label?: string | null; href?: string | null } | null;
  } | null;
}

export default function AboutOwner({ settings, content }: AboutOwnerProps) {
  const ownerName = getOwnerDisplayName(settings);
  const ownerBio = getOwnerBio(settings);

  return (
    <section id="about" className="section-shell bg-[#0f141b]">
      <div className="section-grid" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="premium-card relative overflow-hidden rounded-[2.2rem] p-6 sm:p-8">
          <div className="absolute -right-14 -top-10 h-36 w-36 rounded-full bg-[#8b5cf6]/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-14 h-44 w-44 rounded-full bg-[#b794f6]/12 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-start gap-5">
              <div className="relative h-32 w-32 flex-none overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 shadow-[0_28px_60px_-30px_rgba(139,92,246,0.5)]">
                {settings?.owner_avatar_url ? (
                  <Image
                    src={settings.owner_avatar_url}
                    alt={ownerName}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                    {ownerName.charAt(0)}
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pt-1">
                <p className="text-xs uppercase tracking-[0.24em] text-[#9aa7b9]">{content?.eyebrow || "Owner profile"}</p>
                <h3 className="mt-2 text-3xl font-semibold text-white">{ownerName}</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-[#d7cdf5]">
                  {settings?.owner_role || "Creative Director"}
                </p>
                {ownerBio && (
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#c5d0df]">{ownerBio}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SocialLinks settings={settings} />
              <Link href={content?.cta?.href || "/portfolio"} className="ghost-button nav-pill">
                {content?.cta?.label || "See portfolio"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
