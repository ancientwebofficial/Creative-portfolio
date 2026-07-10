export const cosmicPurpleTheme = {
  primary: "#8b5cf6",
  primaryHover: "#9d6eff",
  primaryForeground: "#ffffff",
  secondary: "#b794f6",
  accent: "#b794f6",
  background: "#0b0814",
  backgroundAlternate: "#0c1118",
  surface: "#171126",
  surfaceElevated: "#241b3b",
  textPrimary: "#ffffff",
  textMuted: "#9aa7b9",
  border: "#7a5cba",
  glow: "#8b5cf6",
  focusRing: "#b794f6",
} as const;

export const themePresets = {
  cosmicPurple: cosmicPurpleTheme,
  midnightBlue: {
    primary: "#3b82f6",
    primaryHover: "#60a5fa",
    primaryForeground: "#ffffff",
    secondary: "#38bdf8",
    accent: "#93c5fd",
    background: "#07111f",
    backgroundAlternate: "#0b1628",
    surface: "#111827",
    surfaceElevated: "#172033",
    textPrimary: "#ffffff",
    textMuted: "#a8b3c7",
    border: "#2d4f7c",
    glow: "#3b82f6",
    focusRing: "#93c5fd",
  },
  crimson: {
    primary: "#dc2626",
    primaryHover: "#ef4444",
    primaryForeground: "#ffffff",
    secondary: "#fb7185",
    accent: "#fda4af",
    background: "#14080a",
    backgroundAlternate: "#1b0b10",
    surface: "#211014",
    surfaceElevated: "#32151b",
    textPrimary: "#ffffff",
    textMuted: "#d6aab0",
    border: "#7f1d1d",
    glow: "#dc2626",
    focusRing: "#fda4af",
  },
  emerald: {
    primary: "#10b981",
    primaryHover: "#34d399",
    primaryForeground: "#04120d",
    secondary: "#6ee7b7",
    accent: "#a7f3d0",
    background: "#06110d",
    backgroundAlternate: "#071a13",
    surface: "#102018",
    surfaceElevated: "#173126",
    textPrimary: "#ffffff",
    textMuted: "#a8c8b8",
    border: "#166534",
    glow: "#10b981",
    focusRing: "#a7f3d0",
  },
} as const;

export type ThemeTokenKey = keyof typeof cosmicPurpleTheme;
export type ThemePresetKey = keyof typeof themePresets | "custom";
export type ThemeColors = Record<ThemeTokenKey, string>;

const HEX_COLOR_PATTERN = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

function safeColor(value: unknown, fallback: string) {
  return typeof value === "string" && HEX_COLOR_PATTERN.test(value) ? value : fallback;
}

export function resolveThemeColors(settings?: {
  preset?: string | null;
  colors?: Partial<Record<ThemeTokenKey, string | null>> | null;
}) {
  if (settings?.preset && settings.preset !== "custom" && settings.preset in themePresets) {
    return themePresets[settings.preset as keyof typeof themePresets];
  }

  const custom = settings?.colors || {};

  return Object.fromEntries(
    Object.entries(cosmicPurpleTheme).map(([key, fallback]) => [
      key,
      safeColor(custom[key as ThemeTokenKey], fallback),
    ])
  ) as ThemeColors;
}

export function themeToCssVariables(colors: ThemeColors) {
  return {
    "--color-primary": colors.primary,
    "--color-primary-hover": colors.primaryHover,
    "--color-primary-foreground": colors.primaryForeground,
    "--color-secondary": colors.secondary,
    "--color-accent": colors.accent,
    "--color-main-background": colors.background,
    "--color-background-alternate": colors.backgroundAlternate,
    "--color-card-surface": colors.surface,
    "--color-elevated-surface": colors.surfaceElevated,
    "--color-primary-text": colors.textPrimary,
    "--color-muted-text": colors.textMuted,
    "--color-border-token": colors.border,
    "--color-glow": colors.glow,
    "--color-focus-ring": colors.focusRing,
    "--background": colors.background,
    "--background-muted": colors.backgroundAlternate,
    "--surface": colors.surface,
    "--surface-strong": colors.surfaceElevated,
    "--surface-elevated": colors.surfaceElevated,
    "--surface-alt": colors.surface,
    "--border": colors.border,
    "--border-strong": colors.focusRing,
    "--accent": colors.primary,
    "--accent-hover": colors.primaryHover,
    "--accent-strong": colors.secondary,
    "--text-primary": colors.textPrimary,
    "--text-secondary": colors.accent,
    "--text-muted": colors.textMuted,
  };
}


