import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";
import { displayOrderField, publishedStatusField } from "../fields/shared.ts";

export const PortfolioCategories: CollectionConfig = {
  slug: "portfolio-categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "displayOrder", "status"],
  },
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 120 },
    { name: "slug", type: "text", required: true, unique: true, maxLength: 140 },
    { name: "description", type: "textarea", maxLength: 1000 },
    displayOrderField,
    publishedStatusField,
  ],
};


