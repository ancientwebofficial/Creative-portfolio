import type { GlobalConfig } from "payload";
import { ctaGroup, seoFields } from "../fields/shared.ts";
import { adminsOnly, anyone } from "../lib/access.ts";

export const PortfolioPage: GlobalConfig = {
  slug: "portfolio-page",
  label: "Portfolio Page",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            { name: "filterHeading", type: "text", defaultValue: "Categories", maxLength: 80 },
            { name: "allCategoriesLabel", type: "text", defaultValue: "All", maxLength: 80 },
            { name: "sortHeading", type: "text", defaultValue: "Sort by", maxLength: 80 },
            {
              name: "sortOptions",
              type: "array",
              fields: [
                { name: "id", type: "text", required: true, maxLength: 40 },
                { name: "label", type: "text", required: true, maxLength: 80 },
              ],
              defaultValue: [
                { id: "popular", label: "Most Popular" },
                { id: "recent", label: "Newest" },
                { id: "oldest", label: "Oldest" },
                { id: "featured", label: "Featured" },
              ],
            },
            { name: "eyebrow", type: "text", defaultValue: "Portfolio", maxLength: 120 },
            { name: "heading", type: "text", defaultValue: "Portfolio", maxLength: 240 },
            { name: "workSingular", type: "text", defaultValue: "work", maxLength: 40 },
            { name: "workPlural", type: "text", defaultValue: "works", maxLength: 40 },
            { name: "categorySuffix", type: "text", defaultValue: "in this category", maxLength: 120 },
            { name: "emptyState", type: "text", defaultValue: "No portfolio items found", maxLength: 160 },
            { name: "featuredBadge", type: "text", defaultValue: "Featured", maxLength: 80 },
            { name: "cardCtaLabel", type: "text", defaultValue: "View", maxLength: 80 },
          ],
        },
        {
          label: "Modal",
          fields: [
            { name: "modalEyebrow", type: "text", defaultValue: "Portfolio item", maxLength: 120 },
            { name: "categoryLabel", type: "text", defaultValue: "Category", maxLength: 80 },
            { name: "dateLabel", type: "text", defaultValue: "Date", maxLength: 80 },
            { name: "descriptionLabel", type: "text", defaultValue: "Description", maxLength: 80 },
            { name: "tagsLabel", type: "text", defaultValue: "Tags", maxLength: 80 },
            ctaGroup("modalCta", "Modal CTA"),
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              type: "group",
              fields: seoFields,
            },
          ],
        },
      ],
    },
  ],
};


