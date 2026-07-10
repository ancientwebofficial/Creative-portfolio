import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  admin: {
    useAsTitle: "alt",
    defaultColumns: ["alt", "filename", "mimeType", "createdAt"],
  },
  upload: {
    staticDir: "public/payload-media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 960, height: 600, position: "centre" },
      { name: "hero", width: 1600, height: 900, position: "centre" },
    ],
    mimeTypes: ["image/png", "image/jpeg", "image/webp", "image/svg+xml"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      maxLength: 180,
    },
    {
      name: "caption",
      type: "text",
      maxLength: 240,
    },
  ],
};


