import type { GlobalConfig } from "payload";
import { adminsOnly, anyone } from "../lib/access.ts";

export const OwnerProfile: GlobalConfig = {
  slug: "owner-profile",
  label: "Owner Profile",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Profile",
          fields: [
            { name: "name", type: "text", required: true, defaultValue: "WatereyeFx", maxLength: 160 },
            { name: "role", type: "text", defaultValue: "Creative Director", maxLength: 160 },
            { name: "biography", type: "textarea", maxLength: 4000 },
            { name: "location", type: "text", maxLength: 180 },
            { name: "avatar", type: "upload", relationTo: "media" },
            { name: "avatarUrl", type: "text", maxLength: 2048 },
          ],
        },
        {
          label: "Social Profiles",
          fields: [
            {
              name: "socialProfiles",
              type: "array",
              fields: [
                {
                  name: "kind",
                  type: "select",
                  required: true,
                  options: [
                    "email",
                    "discord",
                    "discord_server",
                    "instagram",
                    "x",
                    "youtube",
                    "fiverr",
                    "behance",
                    "website",
                    "github",
                    "modrinth",
                  ].map((value) => ({ label: value, value })),
                },
                { name: "label", type: "text", required: true, maxLength: 80 },
                { name: "value", type: "text", maxLength: 240 },
                { name: "href", type: "text", required: true, maxLength: 2048 },
                { name: "external", type: "checkbox", defaultValue: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};


