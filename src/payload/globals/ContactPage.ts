import type { GlobalConfig } from "payload";
import { seoFields } from "../fields/shared.ts";
import { adminsOnly, anyone } from "../lib/access.ts";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Contact Page",
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
            { name: "seoTitleTemplate", type: "text", defaultValue: "Contact {siteName}", maxLength: 240 },
            {
              name: "seoFallbackDescription",
              type: "textarea",
              defaultValue: "Contact {ownerName} for creative work, commissions, and collaborations.",
              maxLength: 500,
            },
            { name: "eyebrow", type: "text", defaultValue: "Contact", maxLength: 120 },
            { name: "headingTemplate", type: "text", defaultValue: "Get in touch with {ownerName}", maxLength: 240 },
            {
              name: "description",
              type: "textarea",
              defaultValue: "Choose the best place to connect, collaborate, or start a commission.",
              maxLength: 1000,
            },
            { name: "ownerProfileEyebrow", type: "text", defaultValue: "Owner profile", maxLength: 120 },
            {
              name: "bioFallback",
              type: "textarea",
              defaultValue: "Project inquiries, collaborations, and business questions can all go here.",
              maxLength: 500,
            },
            { name: "discordServerDisplayFallback", type: "text", defaultValue: "Join our Discord Community", maxLength: 160 },
          ],
        },
        {
          label: "Contact Labels",
          fields: [
            {
              name: "actions",
              type: "array",
              fields: [
                { name: "kind", type: "text", required: true, maxLength: 80 },
                { name: "platform", type: "text", required: true, maxLength: 80 },
                { name: "action", type: "text", required: true, maxLength: 80 },
              ],
              defaultValue: [
                { kind: "email", platform: "Email", action: "Send Email" },
                { kind: "discord", platform: "Discord", action: "Message" },
                { kind: "discord_server", platform: "Discord", action: "Join Server" },
                { kind: "instagram", platform: "Instagram", action: "Follow" },
                { kind: "x", platform: "X", action: "Follow" },
                { kind: "youtube", platform: "YouTube", action: "Watch" },
                { kind: "fiverr", platform: "Fiverr", action: "Hire" },
                { kind: "behance", platform: "Behance", action: "View Portfolio" },
                { kind: "website", platform: "Website", action: "Visit" },
                { kind: "github", platform: "GitHub", action: "View Profile" },
                { kind: "modrinth", platform: "Modrinth", action: "View Profile" },
              ],
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


