import { z } from "zod";
import type { Visibility } from "./database.types";

const MAX_TEXT_LENGTH = 20_000;
const safeUrl = z
  .string()
  .trim()
  .url()
  .max(2048)
  .nullable()
  .optional()
  .or(z.literal("").transform(() => null));

const text = (max = MAX_TEXT_LENGTH) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value.replace(/[\u0000-\u001F\u007F]/g, ""));

const optionalText = (max = MAX_TEXT_LENGTH) =>
  text(max).nullable().optional().or(z.literal("").transform(() => null));

const emailField = z
  .string()
  .trim()
  .email()
  .max(254)
  .nullable()
  .optional()
  .or(z.literal("").transform(() => null));

const usernameField = z
  .string()
  .trim()
  .max(64)
  .nullable()
  .optional()
  .or(z.literal("").transform(() => null));

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(140)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase slugs like texture-packs.");

const visibility = z.enum(["public", "private", "draft"] satisfies [
  Visibility,
  Visibility,
  Visibility,
]);

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}

export const idSchema = z.string().uuid();

export const listQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(24),
  offset: z.coerce.number().int().min(0).default(0),
  search: z.string().trim().max(120).optional(),
});

export const portfolioQuerySchema = listQuerySchema.extend({
  category: z.string().trim().max(140).optional(),
  sort: z
    .enum(["popular", "newest", "oldest", "featured", "recent"])
    .default("newest"),
});

const categoryBaseSchema = z.object({
  name: text(120),
  slug: slug.optional(),
  description: optionalText(1000),
  display_order: z.coerce.number().int().min(0).default(0),
  visibility: visibility.default("public"),
});

export const categoryInputSchema = categoryBaseSchema.transform((value) => ({
  ...value,
  slug: value.slug || slugify(value.name),
}));

export const categoryUpdateSchema = categoryBaseSchema.partial().transform((value) => ({
  ...value,
  slug: value.slug || (value.name ? slugify(value.name) : undefined),
}));

const portfolioBaseSchema = z.object({
  title: text(180),
  slug: slug.optional(),
  short_description: optionalText(1000),
  full_description: optionalText(),
  category_id: z.string().uuid().nullable().optional(),
  thumbnail_url: safeUrl,
  gallery_images: z.array(z.string().trim().url().max(2048)).default([]),
  tags: z.array(text(60)).default([]),
  featured: z.coerce.boolean().default(false),
  popularity_score: z.coerce.number().int().min(0).default(0),
  visibility: visibility.default("draft"),
  client_name: optionalText(180),
  client_permission: z.coerce.boolean().default(false),
  external_link: safeUrl,
  discord_order_link: safeUrl,
});

export const portfolioInputSchema = portfolioBaseSchema.transform((value) => ({
  ...value,
  slug: value.slug || slugify(value.title),
}));

export const portfolioUpdateSchema = portfolioBaseSchema.partial().transform((value) => ({
  ...value,
  slug: value.slug || (value.title ? slugify(value.title) : undefined),
}));

const serviceBaseSchema = z.object({
  title: text(180),
  slug: slug.optional(),
  short_description: optionalText(1000),
  full_description: optionalText(),
  starting_price: z.coerce.number().min(0).default(0),
  delivery_time: optionalText(120),
  revisions: optionalText(120),
  feature_list: z.array(text(240)).default([]),
  featured: z.coerce.boolean().default(false),
  discord_order_link: safeUrl,
  active: z.coerce.boolean().default(true),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const serviceInputSchema = serviceBaseSchema.transform((value) => ({
  ...value,
  slug: value.slug || slugify(value.title),
}));

export const serviceUpdateSchema = serviceBaseSchema.partial().transform((value) => ({
  ...value,
  slug: value.slug || (value.title ? slugify(value.title) : undefined),
}));

export const testimonialInputSchema = z.object({
  client_name: text(180),
  client_role: optionalText(180),
  quote: text(4000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  approved: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const testimonialUpdateSchema = testimonialInputSchema.partial();

export const homepageBlockInputSchema = z.object({
  block_type: text(80),
  title: optionalText(240),
  subtitle: optionalText(500),
  content: optionalText(),
  image_url: safeUrl,
  linked_portfolio_ids: z.array(z.string().uuid()).default([]),
  alignment: z
    .enum(["left", "center", "right", "split-left", "split-right"])
    .default("left"),
  style_variant: text(80).default("default"),
  visibility: visibility.default("public"),
  display_order: z.coerce.number().int().min(0).default(0),
});

export const homepageBlockUpdateSchema = homepageBlockInputSchema.partial();

export const siteSettingsInputSchema = z.object({
  site_name: text(160).default("Creative Portfolio"),
  hero_title: optionalText(240),
  hero_subtitle: optionalText(1000),
  about_text: optionalText(),
  discord_url: safeUrl,
  owner_name: optionalText(160),
  owner_avatar_url: safeUrl,
  owner_email: emailField,
  owner_discord: usernameField,
  owner_discord_server_url: safeUrl,
  owner_instagram_url: safeUrl,
  owner_x_url: safeUrl,
  owner_youtube_url: safeUrl,
  owner_fiverr_url: safeUrl,
  owner_behance_url: safeUrl,
  owner_website_url: safeUrl,
  owner_github_url: safeUrl,
  owner_modrinth_url: safeUrl,
  owner_location: optionalText(180),
  owner_bio: optionalText(4000),
  socials: z.record(z.string(), z.string().trim().max(2048)).default({}),
  footer_text: optionalText(1000),
  seo_title: optionalText(240),
  seo_description: optionalText(500),
  logo_url: safeUrl,
  favicon_url: safeUrl,
});

export const siteSettingsUpdateSchema = siteSettingsInputSchema.partial();

export const mediaRecordInputSchema = z.object({
  file_name: text(260),
  file_url: z.string().trim().url().max(2048),
  file_type: text(120),
  alt_text: optionalText(500),
  uploaded_by: z.string().uuid().nullable().optional(),
  storage_path: text(1024),
  file_size: z.coerce.number().int().min(0).nullable().optional(),
  width: z.coerce.number().int().min(1).nullable().optional(),
  height: z.coerce.number().int().min(1).nullable().optional(),
  metadata: z.record(z.string(), z.any()).default({}),
});

export const mediaRecordUpdateSchema = mediaRecordInputSchema
  .pick({ alt_text: true, metadata: true })
  .partial();

export const allowedUploadTypes = ["image/png", "image/jpeg", "image/webp"] as const;
export const maxUploadBytes = 10 * 1024 * 1024;
