import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getSiteSettingsData } from "@/lib/cms/public-data";
import { getSiteBrandName } from "@/lib/cms/owner";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsData();
  const siteName = getSiteBrandName(settings);

  return {
    title: settings?.seo_title || siteName,
    description:
      settings?.seo_description ||
      settings?.owner_bio ||
      "Premium Minecraft design portfolio featuring thumbnails, logos, texture packs, and artwork. Professional quality, creative vision.",
    icons: settings?.favicon_url
      ? {
          icon: settings.favicon_url,
          shortcut: settings.favicon_url,
        }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettingsData();

  return (
    <html
      lang="en"
      className={`h-full antialiased ${bodyFont.variable} ${headingFont.variable}`}
    >
      {settings?.favicon_url && (
        <head>
          <link rel="icon" href={settings.favicon_url} />
          <link rel="shortcut icon" href={settings.favicon_url} />
        </head>
      )}
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <Header settings={settings} />
        <main className="flex-grow relative isolate">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
