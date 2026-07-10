import type { GlobalConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";

export const Branding: GlobalConfig = {
  slug: "branding",
  label: "Branding",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identity",
          fields: [
            { name: "siteName", type: "text", required: true, defaultValue: "Cosmic Flare", maxLength: 160 },
            {
              name: "siteDescription",
              type: "textarea",
              defaultValue: "Professional Minecraft design portfolio featuring thumbnails, logos, texture packs, and artwork.",
              maxLength: 500,
            },
            { name: "browserTitle", type: "text", maxLength: 240 },
          ],
        },
        {
          label: "Media",
          fields: [
            { name: "logo", type: "upload", relationTo: "media" },
            { name: "logoUrl", type: "text", maxLength: 2048, admin: { description: "Existing external logo URL." } },
            { name: "favicon", type: "upload", relationTo: "media" },
            { name: "faviconUrl", type: "text", maxLength: 2048, admin: { description: "Existing external favicon URL." } },
          ],
        },
      ],
    },
  ],
};


