import type { Metadata } from "next";
import ContactCard from "@/components/contact/ContactCard";
import { getSiteSettingsData } from "@/lib/cms/public-data";
import { getSiteBrandName, getOwnerDisplayName } from "@/lib/cms/owner";
import { getPayloadGlobals } from "@/lib/payload/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, payload] = await Promise.all([
    getSiteSettingsData(),
    getPayloadGlobals(),
  ]);
  const ownerName = getOwnerDisplayName(settings);
  const siteName = getSiteBrandName(settings);
  const contact = payload.contactPage;

  return {
    title: (contact.seoTitleTemplate || "Contact {siteName}").replace("{siteName}", siteName),
    description:
      contact.seo?.description ||
      settings?.owner_bio ||
      settings?.seo_description ||
      (contact.seoFallbackDescription || "Contact {ownerName} for creative work, commissions, and collaborations.").replace("{ownerName}", ownerName),
  };
}

export default async function ContactPage() {
  const [settings, payload] = await Promise.all([
    getSiteSettingsData(),
    getPayloadGlobals(),
  ]);

  return <ContactCard settings={settings} content={payload.contactPage} />;
}
