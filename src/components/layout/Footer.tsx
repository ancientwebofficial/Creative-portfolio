import Link from "next/link";
import Image from "next/image";
import type { SiteSettingsDto } from "@/lib/cms/mappers";
import SocialLinks from "@/components/shared/SocialLinks";
import { getSiteBrandName } from "@/lib/cms/owner";

interface FooterProps {
  settings?: SiteSettingsDto | null;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const siteName = getSiteBrandName(settings);
  const footerText = settings?.footer_text || `${siteName}. All rights reserved.`;

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#070b10]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="surface-panel-strong rounded-[2rem] p-8 sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr,0.8fr]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                {settings?.logo_url ? (
                  <Image
                    src={settings.logo_url}
                    alt={siteName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-2xl object-cover"
                  />
                ) : settings?.owner_avatar_url ? (
                  <Image
                    src={settings.owner_avatar_url}
                    alt={siteName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white">
                    P
                  </div>
                )}
                <div>
                  <p className="font-heading text-xl font-semibold text-white">{siteName}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#9aa7b9]">{settings?.owner_location || "Premium creative work"}</p>
                </div>
              </div>
              <p className="max-w-md text-sm leading-7 text-[#9aa7b9]">
                {settings?.owner_bio || settings?.seo_description || "Premium Minecraft design portfolio"}
              </p>
              <div className="mt-8 inline-flex flex-wrap gap-3">
                <Link href="/portfolio" className="glass-button">
                  View portfolio
                </Link>
                <Link href="/contact" className="ghost-button">
                  Start a project
                </Link>
              </div>
              {settings?.owner_avatar_url && (
                <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#748095]">
                  Owner profile active
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#9aa7b9]">Navigation</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/portfolio" className="text-[#ffffff] hover:text-[#b794f6]">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="/#pricing" className="text-[#ffffff] hover:text-[#b794f6]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-[#ffffff] hover:text-[#b794f6]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#9aa7b9]">Contact</h3>
              <SocialLinks settings={settings} variant="list" />
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-[#748095]">
            © {currentYear} {footerText}
          </div>
        </div>
      </div>
    </footer>
  );
}
