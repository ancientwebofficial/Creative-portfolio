import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";
import { displayOrderField, publishedStatusField } from "../fields/shared.ts";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  admin: {
    useAsTitle: "clientName",
    defaultColumns: ["clientName", "clientRole", "rating", "featured", "displayOrder"],
  },
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    { name: "clientName", type: "text", required: true, maxLength: 180 },
    { name: "clientRole", type: "text", maxLength: 180 },
    { name: "quote", type: "textarea", required: true, maxLength: 4000 },
    { name: "rating", type: "number", required: true, defaultValue: 5, min: 1, max: 5 },
    { name: "featured", type: "checkbox", defaultValue: true },
    displayOrderField,
    publishedStatusField,
  ],
};


