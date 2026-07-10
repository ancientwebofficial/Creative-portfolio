import type { GlobalConfig } from "payload";
import { seoFields } from "../fields/shared.ts";
import { adminsOnly, anyone } from "../lib/access.ts";

export const DefaultSEO: GlobalConfig = {
  slug: "default-seo",
  label: "Default SEO",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: seoFields,
};


