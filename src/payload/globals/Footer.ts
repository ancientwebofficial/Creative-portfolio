import type { GlobalConfig } from "payload";
import { ctaGroup } from "../fields/shared.ts";
import { adminsOnly, anyone } from "../lib/access.ts";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    { name: "brandKicker", type: "text", defaultValue: "Premium creative work", maxLength: 120 },
    { name: "description", type: "textarea", defaultValue: "Premium Minecraft design portfolio", maxLength: 500 },
    { name: "ownerProfileNotice", type: "text", defaultValue: "Owner profile active", maxLength: 120 },
    { name: "navigationHeading", type: "text", defaultValue: "Navigation", maxLength: 80 },
    { name: "contactHeading", type: "text", defaultValue: "Contact", maxLength: 80 },
    ctaGroup("primaryCta", "Primary CTA"),
    ctaGroup("secondaryCta", "Secondary CTA"),
    { name: "copyrightText", type: "text", defaultValue: "Cosmic Flare. All rights reserved.", maxLength: 500 },
  ],
};


