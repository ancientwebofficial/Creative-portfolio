import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";
import { displayOrderField, publishedStatusField } from "../fields/shared.ts";

export const PortfolioItems: CollectionConfig = {
  slug: "portfolio-items",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "featured", "status", "displayOrder"],
  },
  access: {
    ...adminsOnly,
    read: anyone,
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: "title", type: "text", required: true, maxLength: 180 },
    { name: "slug", type: "text", required: true, unique: true, maxLength: 140 },
    {
      name: "category",
      type: "relationship",
      relationTo: "portfolio-categories",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "externalImageUrl",
      type: "text",
      maxLength: 2048,
      admin: {
        description: "Used for existing Supabase-hosted images during migration.",
      },
    },
    { name: "shortDescription", type: "textarea", maxLength: 1000 },
    { name: "fullDescription", type: "textarea" },
    { name: "tags", type: "array", fields: [{ name: "tag", type: "text", required: true, maxLength: 60 }] },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "popularityScore", type: "number", defaultValue: 0, min: 0 },
    { name: "clientName", type: "text", maxLength: 180 },
    { name: "clientPermission", type: "checkbox", defaultValue: false },
    { name: "externalLink", type: "text", maxLength: 2048 },
    { name: "orderLink", type: "text", maxLength: 2048 },
    displayOrderField,
    publishedStatusField,
  ],
};


