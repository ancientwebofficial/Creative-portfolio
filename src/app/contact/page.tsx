import type { Metadata } from "next";
import ContactCard from "@/components/contact/ContactCard";
import { getSiteSettingsData } from "@/lib/cms/public-data";
import { getSiteBrandName, getOwnerDisplayName } from "@/lib/cms/owner";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsData();
  const ownerName = getOwnerDisplayName(settings);
  const siteName = getSiteBrandName(settings);

  return {
    title: `Contact ${siteName}`,
    description:
      settings?.owner_bio ||
      settings?.seo_description ||
      `Contact ${ownerName} for creative work, commissions, and collaborations.`,
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettingsData();

  return <ContactCard settings={settings} />;
}
