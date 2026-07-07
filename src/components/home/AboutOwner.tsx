import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsDto } from "@/lib/cms/mappers";
import { getOwnerBio, getOwnerDisplayName, getOwnerLocation } from "@/lib/cms/owner";
import SocialLinks from "@/components/shared/SocialLinks";

interface AboutOwnerProps {
  settings?: SiteSettingsDto | null;
}

export default function AboutOwner({ settings }: AboutOwnerProps) {
  const ownerName = getOwnerDisplayName(settings);
  const ownerBio = getOwnerBio(settings);
  const ownerLocation = getOwnerLocation(settings);

  return (
    <section id="about" className="section-shell bg-[#0f141b]">
      <div className="section-grid" />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.08fr,0.92fr] lg:px-8">
        <div className="premium-card-strong relative overflow-hidden rounded-[2.2rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,148,246,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.12),transparent_34%)]" />
          <div className="relative z-10 max-w-2xl">
            <span className="section-kicker mb-5">About</span>
            <h2 className="section-title text-4xl sm:text-5xl lg:text-6xl">
              Meet the owner behind Cosmic Flare
            </h2>
            <p className="section-copy mt-5 text-lg">
              {settings?.about_text || ownerBio || "Creative direction, branding, and production support shaped around each project."}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-[#9aa7b9]">
              {ownerLocation && (
                <span className="nav-pill px-4 py-2 text-white">
                  {ownerLocation}
                </span>
              )}
              <Link href="/contact" className="glass-button">
                Contact {ownerName}
              </Link>
            </div>
          </div>
        </div>

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
                <p className="text-xs uppercase tracking-[0.24em] text-[#9aa7b9]">Owner profile</p>
                <h3 className="mt-2 text-3xl font-semibold text-white">{ownerName}</h3>
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.22em] text-[#d7cdf5]">
                  Creative Director
                </p>
                {ownerBio && (
                  <p className="mt-4 max-w-xl text-sm leading-7 text-[#c5d0df]">{ownerBio}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <SocialLinks settings={settings} />
              <Link href="/portfolio" className="ghost-button nav-pill">
                See portfolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
