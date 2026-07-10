import type { GlobalConfig } from "payload";
import { ctaGroup, seoFields } from "../fields/shared.ts";
import { adminsOnly, anyone } from "../lib/access.ts";

const sectionIntroFields = [
  { name: "enabled", type: "checkbox" as const, defaultValue: true },
  { name: "eyebrow", type: "text" as const, maxLength: 120 },
  { name: "heading", type: "text" as const, maxLength: 240 },
  { name: "description", type: "textarea" as const, maxLength: 1000 },
];

export const Homepage: GlobalConfig = {
  slug: "homepage",
  label: "Homepage",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                { name: "badge", type: "text", defaultValue: "Premium creative agency design", maxLength: 160 },
                { name: "heading", type: "text", defaultValue: "Minecraft Creative Design", maxLength: 240 },
                {
                  name: "description",
                  type: "textarea",
                  defaultValue: "Artwork crafted for creators. Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.",
                  maxLength: 1000,
                },
                ctaGroup("primaryCta", "Primary CTA"),
                ctaGroup("secondaryCta", "Secondary CTA"),
                {
                  name: "statistics",
                  type: "array",
                  fields: [
                    { name: "value", type: "text", required: true, maxLength: 40 },
                    { name: "label", type: "text", required: true, maxLength: 120 },
                  ],
                  defaultValue: [
                    { value: "70+", label: "Projects delivered" },
                    { value: "200+", label: "Creators served" },
                    { value: "4+", label: "Years of work" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Sections",
          fields: [
            {
              name: "featuredWork",
              type: "group",
              fields: [
                ...sectionIntroFields,
                ctaGroup("cta", "CTA"),
                { name: "autoplayDelayMs", type: "number", defaultValue: 5000, min: 1000, max: 30000 },
              ],
              defaultValue: {
                enabled: true,
                eyebrow: "Selected work",
                heading: "Featured Work",
                description:
                  "A cinematic look at recent creative projects, built to feel closer to an agency showcase than a static portfolio grid.",
                cta: { label: "View all work", href: "/portfolio", newTab: false },
                autoplayDelayMs: 5000,
              },
            },
            {
              name: "ownerProfilePresentation",
              type: "group",
              fields: [...sectionIntroFields, ctaGroup("cta", "CTA")],
              defaultValue: {
                enabled: true,
                eyebrow: "Owner profile",
                cta: { label: "See portfolio", href: "/portfolio", newTab: false },
              },
            },
            {
              name: "servicesPresentation",
              type: "group",
              fields: [
                ...sectionIntroFields,
                { name: "countSuffix", type: "text", defaultValue: "Projects", maxLength: 80 },
                { name: "cardCtaLabel", type: "text", defaultValue: "Explore", maxLength: 80 },
              ],
              defaultValue: {
                enabled: true,
                eyebrow: "Services",
                heading: "Specialized Creative Services",
                description: "Tailored design solutions for Minecraft creators, streamers, and content studios.",
                countSuffix: "Projects",
                cardCtaLabel: "Explore",
              },
            },
            {
              name: "testimonialsPresentation",
              type: "group",
              fields: [
                ...sectionIntroFields,
                {
                  name: "statistics",
                  type: "array",
                  fields: [
                    { name: "value", type: "text", required: true, maxLength: 40 },
                    { name: "label", type: "text", required: true, maxLength: 120 },
                  ],
                  defaultValue: [
                    { value: "98%", label: "Satisfaction rate" },
                    { value: "50+", label: "Testimonials" },
                    { value: "200+", label: "Happy creators" },
                  ],
                },
              ],
              defaultValue: {
                enabled: true,
                eyebrow: "Testimonials",
                heading: "Client Stories",
                description: "What creators and studios say about working with me.",
              },
            },
            {
              name: "pricingPresentation",
              type: "group",
              fields: [
                ...sectionIntroFields,
                { name: "highlightBadge", type: "text", defaultValue: "Most Popular", maxLength: 80 },
                { name: "priceSuffix", type: "text", defaultValue: "/ project", maxLength: 80 },
                { name: "moreFeaturesLabel", type: "text", defaultValue: "more features", maxLength: 120 },
                { name: "planCtaLabel", type: "text", defaultValue: "Get started", maxLength: 80 },
                { name: "customPackageHeading", type: "text", defaultValue: "Need a custom package?", maxLength: 160 },
                { name: "customPackageFallbackKicker", type: "text", defaultValue: "Direct owner contact", maxLength: 160 },
                { name: "customPackageOwnerKickerTemplate", type: "text", defaultValue: "Work directly with {ownerName}", maxLength: 180 },
                {
                  name: "customPackageDescription",
                  type: "textarea",
                  defaultValue: "Bulk rates and specialized projects available. Let's discuss your needs.",
                  maxLength: 500,
                },
                ctaGroup("customPackageCta", "Custom Package CTA"),
              ],
              defaultValue: {
                enabled: true,
                eyebrow: "Pricing",
                heading: "Simple, Transparent Pricing",
                description: "Flexible rates for custom Minecraft creative work. Each project tailored to your needs.",
                customPackageCta: { label: "Contact", href: "/contact", newTab: false },
              },
            },
            {
              name: "faqPresentation",
              type: "group",
              fields: [
                ...sectionIntroFields,
                { name: "ctaKicker", type: "text", defaultValue: "Still have questions?", maxLength: 120 },
                ctaGroup("cta", "CTA"),
              ],
              defaultValue: {
                enabled: true,
                eyebrow: "FAQ",
                heading: "Frequently Asked Questions",
                description: "Everything you need to know about working on projects together.",
                ctaKicker: "Still have questions?",
                cta: { label: "Reach out on the contact page", href: "/contact", newTab: false },
              },
            },
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


