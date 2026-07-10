import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";
import { displayOrderField, publishedStatusField } from "../fields/shared.ts";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "displayOrder", "status"],
  },
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    { name: "question", type: "text", required: true, maxLength: 240 },
    { name: "answer", type: "textarea", required: true },
    displayOrderField,
    publishedStatusField,
  ],
};


