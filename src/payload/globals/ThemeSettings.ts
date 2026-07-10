import type { GlobalConfig } from "payload";
import { colorField } from "../fields/shared.ts";
import { adminsOnly, anyone } from "../lib/access.ts";
import { cosmicPurpleTheme } from "../lib/theme.ts";

export const ThemeSettings: GlobalConfig = {
  slug: "theme-settings",
  label: "Theme Settings",
  access: {
    ...adminsOnly,
    read: anyone,
  },
  fields: [
    {
      name: "preset",
      type: "select",
      required: true,
      defaultValue: "cosmicPurple",
      options: [
        { label: "Cosmic Purple", value: "cosmicPurple" },
        { label: "Midnight Blue", value: "midnightBlue" },
        { label: "Crimson", value: "crimson" },
        { label: "Emerald", value: "emerald" },
        { label: "Custom", value: "custom" },
      ],
    },
    {
      name: "colors",
      type: "group",
      fields: [
        colorField("primary", "Primary color", cosmicPurpleTheme.primary),
        colorField("primaryHover", "Primary hover color", cosmicPurpleTheme.primaryHover),
        colorField("primaryForeground", "Primary foreground", cosmicPurpleTheme.primaryForeground),
        colorField("secondary", "Secondary color", cosmicPurpleTheme.secondary),
        colorField("accent", "Accent color", cosmicPurpleTheme.accent),
        colorField("background", "Main background", cosmicPurpleTheme.background),
        colorField("backgroundAlternate", "Alternate background", cosmicPurpleTheme.backgroundAlternate),
        colorField("surface", "Surface/card background", cosmicPurpleTheme.surface),
        colorField("surfaceElevated", "Elevated surface background", cosmicPurpleTheme.surfaceElevated),
        colorField("textPrimary", "Primary text", cosmicPurpleTheme.textPrimary),
        colorField("textMuted", "Muted text", cosmicPurpleTheme.textMuted),
        colorField("border", "Border color", cosmicPurpleTheme.border),
        colorField("glow", "Glow color", cosmicPurpleTheme.glow),
        colorField("focusRing", "Focus-ring color", cosmicPurpleTheme.focusRing),
      ],
    },
    {
      name: "radiusPreset",
      type: "select",
      defaultValue: "large",
      options: ["small", "medium", "large", "extra-large"].map((value) => ({ label: value, value })),
    },
    {
      name: "shadowIntensity",
      type: "select",
      defaultValue: "strong",
      options: ["none", "subtle", "medium", "strong"].map((value) => ({ label: value, value })),
    },
    {
      name: "glowIntensity",
      type: "select",
      defaultValue: "medium",
      options: ["none", "subtle", "medium", "strong"].map((value) => ({ label: value, value })),
    },
  ],
};


