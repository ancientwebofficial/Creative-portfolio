import type { CollectionConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";
import { displayOrderField, publishedStatusField } from "../fields/shared.ts";

export const PricingPlans: CollectionConfig = {
  slug: "pricing-plans",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "highlighted", "displayOrder", "status"],
  },
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    { name: "name", type: "text", required: true, maxLength: 180 },
    { name: "slug", type: "text", required: true, unique: true, maxLength: 140 },
    { name: "description", type: "text", required: true, maxLength: 240 },
    { name: "fullDescription", type: "textarea" },
    { name: "price", type: "number", required: true, min: 0 },
    { name: "currency", type: "select", defaultValue: "USD", options: [{ label: "USD", value: "USD" }] },
    { name: "deliveryTime", type: "text", maxLength: 120 },
    { name: "revisions", type: "text", maxLength: 120 },
    {
      name: "features",
      type: "array",
      fields: [{ name: "feature", type: "text", required: true, maxLength: 240 }],
      defaultValue: [],
    },
    { name: "highlighted", type: "checkbox", defaultValue: false },
    { name: "orderUrl", type: "text", maxLength: 2048 },
    displayOrderField,
    publishedStatusField,
  ],
};


