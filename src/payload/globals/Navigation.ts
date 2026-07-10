import type { GlobalConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";
import { linkFields } from "../fields/shared.ts";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navigation",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    {
      name: "headerLinks",
      type: "array",
      fields: linkFields,
      defaultValue: [
        { label: "Portfolio", href: "/portfolio", newTab: false },
        { label: "Pricing", href: "/#pricing", newTab: false },
        { label: "Contact", href: "/contact", newTab: false },
      ],
    },
    {
      name: "mobileCta",
      type: "group",
      fields: linkFields,
      defaultValue: { label: "Contact", href: "/contact", newTab: false },
    },
    {
      name: "adminLink",
      type: "group",
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: true },
        ...linkFields,
      ],
      defaultValue: { enabled: true, label: "Admin", href: "/admin", newTab: false },
    },
    {
      name: "footerLinks",
      type: "array",
      fields: linkFields,
      defaultValue: [
        { label: "Portfolio", href: "/portfolio", newTab: false },
        { label: "Pricing", href: "/#pricing", newTab: false },
        { label: "Contact", href: "/contact", newTab: false },
      ],
    },
  ],
};


