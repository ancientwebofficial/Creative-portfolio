import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "payload"."enum_portfolio_categories_status" AS ENUM('draft', 'published', 'private');
  CREATE TYPE "payload"."enum_portfolio_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__portfolio_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_pricing_plans_currency" AS ENUM('USD');
  CREATE TYPE "payload"."enum_pricing_plans_status" AS ENUM('draft', 'published', 'private');
  CREATE TYPE "payload"."enum_testimonials_status" AS ENUM('draft', 'published', 'private');
  CREATE TYPE "payload"."enum_faqs_status" AS ENUM('draft', 'published', 'private');
  CREATE TYPE "payload"."enum_owner_profile_social_profiles_kind" AS ENUM('email', 'discord', 'discord_server', 'instagram', 'x', 'youtube', 'fiverr', 'behance', 'website', 'github', 'modrinth');
  CREATE TYPE "payload"."enum_theme_settings_preset" AS ENUM('cosmicPurple', 'midnightBlue', 'crimson', 'emerald', 'custom');
  CREATE TYPE "payload"."enum_theme_settings_radius_preset" AS ENUM('small', 'medium', 'large', 'extra-large');
  CREATE TYPE "payload"."enum_theme_settings_shadow_intensity" AS ENUM('none', 'subtle', 'medium', 'strong');
  CREATE TYPE "payload"."enum_theme_settings_glow_intensity" AS ENUM('none', 'subtle', 'medium', 'strong');
  CREATE TABLE "payload"."users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "payload"."users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "payload"."enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "payload"."portfolio_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"display_order" numeric DEFAULT 0 NOT NULL,
  	"status" "payload"."enum_portfolio_categories_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_items_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "payload"."portfolio_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"category_id" integer,
  	"image_id" integer,
  	"external_image_url" varchar,
  	"short_description" varchar,
  	"full_description" varchar,
  	"featured" boolean DEFAULT false,
  	"popularity_score" numeric DEFAULT 0,
  	"client_name" varchar,
  	"client_permission" boolean DEFAULT false,
  	"external_link" varchar,
  	"order_link" varchar,
  	"display_order" numeric DEFAULT 0,
  	"status" "payload"."enum_portfolio_items_status" DEFAULT 'published',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_portfolio_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_portfolio_items_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_portfolio_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_image_id" integer,
  	"version_external_image_url" varchar,
  	"version_short_description" varchar,
  	"version_full_description" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_popularity_score" numeric DEFAULT 0,
  	"version_client_name" varchar,
  	"version_client_permission" boolean DEFAULT false,
  	"version_external_link" varchar,
  	"version_order_link" varchar,
  	"version_display_order" numeric DEFAULT 0,
  	"version_status" "payload"."enum__portfolio_items_v_version_status" DEFAULT 'published',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__portfolio_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload"."pricing_plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."pricing_plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"full_description" varchar,
  	"price" numeric NOT NULL,
  	"currency" "payload"."enum_pricing_plans_currency" DEFAULT 'USD',
  	"delivery_time" varchar,
  	"revisions" varchar,
  	"highlighted" boolean DEFAULT false,
  	"order_url" varchar,
  	"display_order" numeric DEFAULT 0 NOT NULL,
  	"status" "payload"."enum_pricing_plans_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_name" varchar NOT NULL,
  	"client_role" varchar,
  	"quote" varchar NOT NULL,
  	"rating" numeric DEFAULT 5 NOT NULL,
  	"featured" boolean DEFAULT true,
  	"display_order" numeric DEFAULT 0 NOT NULL,
  	"status" "payload"."enum_testimonials_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"display_order" numeric DEFAULT 0 NOT NULL,
  	"status" "payload"."enum_faqs_status" DEFAULT 'published' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"portfolio_categories_id" integer,
  	"portfolio_items_id" integer,
  	"pricing_plans_id" integer,
  	"testimonials_id" integer,
  	"faqs_id" integer
  );
  
  CREATE TABLE "payload"."payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload"."payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."branding" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Cosmic Flare' NOT NULL,
  	"site_description" varchar DEFAULT 'Professional Minecraft design portfolio featuring thumbnails, logos, texture packs, and artwork.',
  	"browser_title" varchar,
  	"logo_id" integer,
  	"logo_url" varchar,
  	"favicon_id" integer,
  	"favicon_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."navigation_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "payload"."navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"mobile_cta_label" varchar NOT NULL,
  	"mobile_cta_href" varchar NOT NULL,
  	"mobile_cta_new_tab" boolean DEFAULT false,
  	"admin_link_enabled" boolean DEFAULT true,
  	"admin_link_label" varchar NOT NULL,
  	"admin_link_href" varchar NOT NULL,
  	"admin_link_new_tab" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_kicker" varchar DEFAULT 'Premium creative work',
  	"description" varchar DEFAULT 'Premium Minecraft design portfolio',
  	"owner_profile_notice" varchar DEFAULT 'Owner profile active',
  	"navigation_heading" varchar DEFAULT 'Navigation',
  	"contact_heading" varchar DEFAULT 'Contact',
  	"primary_cta_label" varchar NOT NULL,
  	"primary_cta_href" varchar NOT NULL,
  	"primary_cta_new_tab" boolean DEFAULT false,
  	"secondary_cta_label" varchar NOT NULL,
  	"secondary_cta_href" varchar NOT NULL,
  	"secondary_cta_new_tab" boolean DEFAULT false,
  	"copyright_text" varchar DEFAULT 'Cosmic Flare. All rights reserved.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."owner_profile_social_profiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" "payload"."enum_owner_profile_social_profiles_kind" NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar,
  	"href" varchar NOT NULL,
  	"external" boolean DEFAULT true
  );
  
  CREATE TABLE "payload"."owner_profile" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'WatereyeFx' NOT NULL,
  	"role" varchar DEFAULT 'Creative Director',
  	"biography" varchar,
  	"location" varchar,
  	"avatar_id" integer,
  	"avatar_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."default_seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"open_graph_title" varchar,
  	"open_graph_description" varchar,
  	"open_graph_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."theme_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"preset" "payload"."enum_theme_settings_preset" DEFAULT 'cosmicPurple' NOT NULL,
  	"colors_primary" varchar DEFAULT '#8b5cf6' NOT NULL,
  	"colors_primary_hover" varchar DEFAULT '#9d6eff' NOT NULL,
  	"colors_primary_foreground" varchar DEFAULT '#ffffff' NOT NULL,
  	"colors_secondary" varchar DEFAULT '#b794f6' NOT NULL,
  	"colors_accent" varchar DEFAULT '#b794f6' NOT NULL,
  	"colors_background" varchar DEFAULT '#0b0814' NOT NULL,
  	"colors_background_alternate" varchar DEFAULT '#0c1118' NOT NULL,
  	"colors_surface" varchar DEFAULT '#171126' NOT NULL,
  	"colors_surface_elevated" varchar DEFAULT '#241b3b' NOT NULL,
  	"colors_text_primary" varchar DEFAULT '#ffffff' NOT NULL,
  	"colors_text_muted" varchar DEFAULT '#9aa7b9' NOT NULL,
  	"colors_border" varchar DEFAULT '#7a5cba' NOT NULL,
  	"colors_glow" varchar DEFAULT '#8b5cf6' NOT NULL,
  	"colors_focus_ring" varchar DEFAULT '#b794f6' NOT NULL,
  	"radius_preset" "payload"."enum_theme_settings_radius_preset" DEFAULT 'large',
  	"shadow_intensity" "payload"."enum_theme_settings_shadow_intensity" DEFAULT 'strong',
  	"glow_intensity" "payload"."enum_theme_settings_glow_intensity" DEFAULT 'medium',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."homepage_hero_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage_testimonials_presentation_statistics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_badge" varchar DEFAULT 'Premium creative agency design',
  	"hero_heading" varchar DEFAULT 'Minecraft Creative Design',
  	"hero_description" varchar DEFAULT 'Artwork crafted for creators. Thumbnails, logos, texture packs, and digital assets that bring your Minecraft vision to life.',
  	"hero_primary_cta_label" varchar NOT NULL,
  	"hero_primary_cta_href" varchar NOT NULL,
  	"hero_primary_cta_new_tab" boolean DEFAULT false,
  	"hero_secondary_cta_label" varchar NOT NULL,
  	"hero_secondary_cta_href" varchar NOT NULL,
  	"hero_secondary_cta_new_tab" boolean DEFAULT false,
  	"featured_work_enabled" boolean DEFAULT true,
  	"featured_work_eyebrow" varchar,
  	"featured_work_heading" varchar,
  	"featured_work_description" varchar,
  	"featured_work_cta_label" varchar NOT NULL,
  	"featured_work_cta_href" varchar NOT NULL,
  	"featured_work_cta_new_tab" boolean DEFAULT false,
  	"featured_work_autoplay_delay_ms" numeric DEFAULT 5000,
  	"owner_profile_presentation_enabled" boolean DEFAULT true,
  	"owner_profile_presentation_eyebrow" varchar,
  	"owner_profile_presentation_heading" varchar,
  	"owner_profile_presentation_description" varchar,
  	"owner_profile_presentation_cta_label" varchar NOT NULL,
  	"owner_profile_presentation_cta_href" varchar NOT NULL,
  	"owner_profile_presentation_cta_new_tab" boolean DEFAULT false,
  	"services_presentation_enabled" boolean DEFAULT true,
  	"services_presentation_eyebrow" varchar,
  	"services_presentation_heading" varchar,
  	"services_presentation_description" varchar,
  	"services_presentation_count_suffix" varchar DEFAULT 'Projects',
  	"services_presentation_card_cta_label" varchar DEFAULT 'Explore',
  	"testimonials_presentation_enabled" boolean DEFAULT true,
  	"testimonials_presentation_eyebrow" varchar,
  	"testimonials_presentation_heading" varchar,
  	"testimonials_presentation_description" varchar,
  	"pricing_presentation_enabled" boolean DEFAULT true,
  	"pricing_presentation_eyebrow" varchar,
  	"pricing_presentation_heading" varchar,
  	"pricing_presentation_description" varchar,
  	"pricing_presentation_highlight_badge" varchar DEFAULT 'Most Popular',
  	"pricing_presentation_price_suffix" varchar DEFAULT '/ project',
  	"pricing_presentation_more_features_label" varchar DEFAULT 'more features',
  	"pricing_presentation_plan_cta_label" varchar DEFAULT 'Get started',
  	"pricing_presentation_custom_package_heading" varchar DEFAULT 'Need a custom package?',
  	"pricing_presentation_custom_package_fallback_kicker" varchar DEFAULT 'Direct owner contact',
  	"pricing_presentation_custom_package_owner_kicker_template" varchar DEFAULT 'Work directly with {ownerName}',
  	"pricing_presentation_custom_package_description" varchar DEFAULT 'Bulk rates and specialized projects available. Let''s discuss your needs.',
  	"pricing_presentation_custom_package_cta_label" varchar NOT NULL,
  	"pricing_presentation_custom_package_cta_href" varchar NOT NULL,
  	"pricing_presentation_custom_package_cta_new_tab" boolean DEFAULT false,
  	"faq_presentation_enabled" boolean DEFAULT true,
  	"faq_presentation_eyebrow" varchar,
  	"faq_presentation_heading" varchar,
  	"faq_presentation_description" varchar,
  	"faq_presentation_cta_kicker" varchar DEFAULT 'Still have questions?',
  	"faq_presentation_cta_label" varchar NOT NULL,
  	"faq_presentation_cta_href" varchar NOT NULL,
  	"faq_presentation_cta_new_tab" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_updated_at" timestamp(3) with time zone,
  	"seo_created_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."portfolio_page_sort_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."portfolio_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"filter_heading" varchar DEFAULT 'Categories',
  	"all_categories_label" varchar DEFAULT 'All',
  	"sort_heading" varchar DEFAULT 'Sort by',
  	"eyebrow" varchar DEFAULT 'Portfolio',
  	"heading" varchar DEFAULT 'Portfolio',
  	"work_singular" varchar DEFAULT 'work',
  	"work_plural" varchar DEFAULT 'works',
  	"category_suffix" varchar DEFAULT 'in this category',
  	"empty_state" varchar DEFAULT 'No portfolio items found',
  	"featured_badge" varchar DEFAULT 'Featured',
  	"card_cta_label" varchar DEFAULT 'View',
  	"modal_eyebrow" varchar DEFAULT 'Portfolio item',
  	"category_label" varchar DEFAULT 'Category',
  	"date_label" varchar DEFAULT 'Date',
  	"description_label" varchar DEFAULT 'Description',
  	"tags_label" varchar DEFAULT 'Tags',
  	"modal_cta_label" varchar NOT NULL,
  	"modal_cta_href" varchar NOT NULL,
  	"modal_cta_new_tab" boolean DEFAULT false,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_updated_at" timestamp(3) with time zone,
  	"seo_created_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."contact_page_actions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"kind" varchar NOT NULL,
  	"platform" varchar NOT NULL,
  	"action" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seo_title_template" varchar DEFAULT 'Contact {siteName}',
  	"seo_fallback_description" varchar DEFAULT 'Contact {ownerName} for creative work, commissions, and collaborations.',
  	"eyebrow" varchar DEFAULT 'Contact',
  	"heading_template" varchar DEFAULT 'Get in touch with {ownerName}',
  	"description" varchar DEFAULT 'Choose the best place to connect, collaborate, or start a commission.',
  	"owner_profile_eyebrow" varchar DEFAULT 'Owner profile',
  	"bio_fallback" varchar DEFAULT 'Project inquiries, collaborations, and business questions can all go here.',
  	"discord_server_display_fallback" varchar DEFAULT 'Join our Discord Community',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_open_graph_title" varchar,
  	"seo_open_graph_description" varchar,
  	"seo_open_graph_image_id" integer,
  	"seo_updated_at" timestamp(3) with time zone,
  	"seo_created_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_items_tags" ADD CONSTRAINT "portfolio_items_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_items" ADD CONSTRAINT "portfolio_items_category_id_portfolio_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "payload"."portfolio_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_items" ADD CONSTRAINT "portfolio_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_items_v_version_tags" ADD CONSTRAINT "_portfolio_items_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_portfolio_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_items_v" ADD CONSTRAINT "_portfolio_items_v_parent_id_portfolio_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."portfolio_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_items_v" ADD CONSTRAINT "_portfolio_items_v_version_category_id_portfolio_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "payload"."portfolio_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_portfolio_items_v" ADD CONSTRAINT "_portfolio_items_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pricing_plans_features" ADD CONSTRAINT "pricing_plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "payload"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_categories_fk" FOREIGN KEY ("portfolio_categories_id") REFERENCES "payload"."portfolio_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_portfolio_items_fk" FOREIGN KEY ("portfolio_items_id") REFERENCES "payload"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pricing_plans_fk" FOREIGN KEY ("pricing_plans_id") REFERENCES "payload"."pricing_plans"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "payload"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "payload"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "payload"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."branding" ADD CONSTRAINT "branding_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."branding" ADD CONSTRAINT "branding_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation_header_links" ADD CONSTRAINT "navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."owner_profile_social_profiles" ADD CONSTRAINT "owner_profile_social_profiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."owner_profile"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."owner_profile" ADD CONSTRAINT "owner_profile_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."default_seo" ADD CONSTRAINT "default_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("open_graph_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."homepage_hero_statistics" ADD CONSTRAINT "homepage_hero_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_testimonials_presentation_statistics" ADD CONSTRAINT "homepage_testimonials_presentation_statistics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage" ADD CONSTRAINT "homepage_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_page_sort_options" ADD CONSTRAINT "portfolio_page_sort_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."portfolio_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."portfolio_page" ADD CONSTRAINT "portfolio_page_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."contact_page_actions" ADD CONSTRAINT "contact_page_actions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."contact_page" ADD CONSTRAINT "contact_page_seo_open_graph_image_id_media_id_fk" FOREIGN KEY ("seo_open_graph_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "payload"."users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "payload"."users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "payload"."users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "payload"."users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "payload"."users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "payload"."media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "payload"."media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "payload"."media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "payload"."media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "portfolio_categories_slug_idx" ON "payload"."portfolio_categories" USING btree ("slug");
  CREATE INDEX "portfolio_categories_updated_at_idx" ON "payload"."portfolio_categories" USING btree ("updated_at");
  CREATE INDEX "portfolio_categories_created_at_idx" ON "payload"."portfolio_categories" USING btree ("created_at");
  CREATE INDEX "portfolio_items_tags_order_idx" ON "payload"."portfolio_items_tags" USING btree ("_order");
  CREATE INDEX "portfolio_items_tags_parent_id_idx" ON "payload"."portfolio_items_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "portfolio_items_slug_idx" ON "payload"."portfolio_items" USING btree ("slug");
  CREATE INDEX "portfolio_items_category_idx" ON "payload"."portfolio_items" USING btree ("category_id");
  CREATE INDEX "portfolio_items_image_idx" ON "payload"."portfolio_items" USING btree ("image_id");
  CREATE INDEX "portfolio_items_updated_at_idx" ON "payload"."portfolio_items" USING btree ("updated_at");
  CREATE INDEX "portfolio_items_created_at_idx" ON "payload"."portfolio_items" USING btree ("created_at");
  CREATE INDEX "portfolio_items__status_idx" ON "payload"."portfolio_items" USING btree ("_status");
  CREATE INDEX "_portfolio_items_v_version_tags_order_idx" ON "payload"."_portfolio_items_v_version_tags" USING btree ("_order");
  CREATE INDEX "_portfolio_items_v_version_tags_parent_id_idx" ON "payload"."_portfolio_items_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_portfolio_items_v_parent_idx" ON "payload"."_portfolio_items_v" USING btree ("parent_id");
  CREATE INDEX "_portfolio_items_v_version_version_slug_idx" ON "payload"."_portfolio_items_v" USING btree ("version_slug");
  CREATE INDEX "_portfolio_items_v_version_version_category_idx" ON "payload"."_portfolio_items_v" USING btree ("version_category_id");
  CREATE INDEX "_portfolio_items_v_version_version_image_idx" ON "payload"."_portfolio_items_v" USING btree ("version_image_id");
  CREATE INDEX "_portfolio_items_v_version_version_updated_at_idx" ON "payload"."_portfolio_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_portfolio_items_v_version_version_created_at_idx" ON "payload"."_portfolio_items_v" USING btree ("version_created_at");
  CREATE INDEX "_portfolio_items_v_version_version__status_idx" ON "payload"."_portfolio_items_v" USING btree ("version__status");
  CREATE INDEX "_portfolio_items_v_created_at_idx" ON "payload"."_portfolio_items_v" USING btree ("created_at");
  CREATE INDEX "_portfolio_items_v_updated_at_idx" ON "payload"."_portfolio_items_v" USING btree ("updated_at");
  CREATE INDEX "_portfolio_items_v_latest_idx" ON "payload"."_portfolio_items_v" USING btree ("latest");
  CREATE INDEX "pricing_plans_features_order_idx" ON "payload"."pricing_plans_features" USING btree ("_order");
  CREATE INDEX "pricing_plans_features_parent_id_idx" ON "payload"."pricing_plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pricing_plans_slug_idx" ON "payload"."pricing_plans" USING btree ("slug");
  CREATE INDEX "pricing_plans_updated_at_idx" ON "payload"."pricing_plans" USING btree ("updated_at");
  CREATE INDEX "pricing_plans_created_at_idx" ON "payload"."pricing_plans" USING btree ("created_at");
  CREATE INDEX "testimonials_updated_at_idx" ON "payload"."testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "payload"."testimonials" USING btree ("created_at");
  CREATE INDEX "faqs_updated_at_idx" ON "payload"."faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "payload"."faqs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload"."payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload"."payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload"."payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload"."payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload"."payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload"."payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload"."payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_categories_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_categories_id");
  CREATE INDEX "payload_locked_documents_rels_portfolio_items_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("portfolio_items_id");
  CREATE INDEX "payload_locked_documents_rels_pricing_plans_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pricing_plans_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload"."payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload"."payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload"."payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload"."payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload"."payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload"."payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload"."payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload"."payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload"."payload_migrations" USING btree ("created_at");
  CREATE INDEX "branding_logo_idx" ON "payload"."branding" USING btree ("logo_id");
  CREATE INDEX "branding_favicon_idx" ON "payload"."branding" USING btree ("favicon_id");
  CREATE INDEX "navigation_header_links_order_idx" ON "payload"."navigation_header_links" USING btree ("_order");
  CREATE INDEX "navigation_header_links_parent_id_idx" ON "payload"."navigation_header_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "payload"."navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "payload"."navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "owner_profile_social_profiles_order_idx" ON "payload"."owner_profile_social_profiles" USING btree ("_order");
  CREATE INDEX "owner_profile_social_profiles_parent_id_idx" ON "payload"."owner_profile_social_profiles" USING btree ("_parent_id");
  CREATE INDEX "owner_profile_avatar_idx" ON "payload"."owner_profile" USING btree ("avatar_id");
  CREATE INDEX "default_seo_open_graph_image_idx" ON "payload"."default_seo" USING btree ("open_graph_image_id");
  CREATE INDEX "homepage_hero_statistics_order_idx" ON "payload"."homepage_hero_statistics" USING btree ("_order");
  CREATE INDEX "homepage_hero_statistics_parent_id_idx" ON "payload"."homepage_hero_statistics" USING btree ("_parent_id");
  CREATE INDEX "homepage_testimonials_presentation_statistics_order_idx" ON "payload"."homepage_testimonials_presentation_statistics" USING btree ("_order");
  CREATE INDEX "homepage_testimonials_presentation_statistics_parent_id_idx" ON "payload"."homepage_testimonials_presentation_statistics" USING btree ("_parent_id");
  CREATE INDEX "homepage_seo_seo_open_graph_image_idx" ON "payload"."homepage" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "portfolio_page_sort_options_order_idx" ON "payload"."portfolio_page_sort_options" USING btree ("_order");
  CREATE INDEX "portfolio_page_sort_options_parent_id_idx" ON "payload"."portfolio_page_sort_options" USING btree ("_parent_id");
  CREATE INDEX "portfolio_page_seo_seo_open_graph_image_idx" ON "payload"."portfolio_page" USING btree ("seo_open_graph_image_id");
  CREATE INDEX "contact_page_actions_order_idx" ON "payload"."contact_page_actions" USING btree ("_order");
  CREATE INDEX "contact_page_actions_parent_id_idx" ON "payload"."contact_page_actions" USING btree ("_parent_id");
  CREATE INDEX "contact_page_seo_seo_open_graph_image_idx" ON "payload"."contact_page" USING btree ("seo_open_graph_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "payload"."users_sessions" CASCADE;
  DROP TABLE "payload"."users" CASCADE;
  DROP TABLE "payload"."media" CASCADE;
  DROP TABLE "payload"."portfolio_categories" CASCADE;
  DROP TABLE "payload"."portfolio_items_tags" CASCADE;
  DROP TABLE "payload"."portfolio_items" CASCADE;
  DROP TABLE "payload"."_portfolio_items_v_version_tags" CASCADE;
  DROP TABLE "payload"."_portfolio_items_v" CASCADE;
  DROP TABLE "payload"."pricing_plans_features" CASCADE;
  DROP TABLE "payload"."pricing_plans" CASCADE;
  DROP TABLE "payload"."testimonials" CASCADE;
  DROP TABLE "payload"."faqs" CASCADE;
  DROP TABLE "payload"."payload_kv" CASCADE;
  DROP TABLE "payload"."payload_locked_documents" CASCADE;
  DROP TABLE "payload"."payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload"."payload_preferences" CASCADE;
  DROP TABLE "payload"."payload_preferences_rels" CASCADE;
  DROP TABLE "payload"."payload_migrations" CASCADE;
  DROP TABLE "payload"."branding" CASCADE;
  DROP TABLE "payload"."navigation_header_links" CASCADE;
  DROP TABLE "payload"."navigation_footer_links" CASCADE;
  DROP TABLE "payload"."navigation" CASCADE;
  DROP TABLE "payload"."footer" CASCADE;
  DROP TABLE "payload"."owner_profile_social_profiles" CASCADE;
  DROP TABLE "payload"."owner_profile" CASCADE;
  DROP TABLE "payload"."default_seo" CASCADE;
  DROP TABLE "payload"."theme_settings" CASCADE;
  DROP TABLE "payload"."homepage_hero_statistics" CASCADE;
  DROP TABLE "payload"."homepage_testimonials_presentation_statistics" CASCADE;
  DROP TABLE "payload"."homepage" CASCADE;
  DROP TABLE "payload"."portfolio_page_sort_options" CASCADE;
  DROP TABLE "payload"."portfolio_page" CASCADE;
  DROP TABLE "payload"."contact_page_actions" CASCADE;
  DROP TABLE "payload"."contact_page" CASCADE;
  DROP TYPE "payload"."enum_users_role";
  DROP TYPE "payload"."enum_portfolio_categories_status";
  DROP TYPE "payload"."enum_portfolio_items_status";
  DROP TYPE "payload"."enum__portfolio_items_v_version_status";
  DROP TYPE "payload"."enum_pricing_plans_currency";
  DROP TYPE "payload"."enum_pricing_plans_status";
  DROP TYPE "payload"."enum_testimonials_status";
  DROP TYPE "payload"."enum_faqs_status";
  DROP TYPE "payload"."enum_owner_profile_social_profiles_kind";
  DROP TYPE "payload"."enum_theme_settings_preset";
  DROP TYPE "payload"."enum_theme_settings_radius_preset";
  DROP TYPE "payload"."enum_theme_settings_shadow_intensity";
  DROP TYPE "payload"."enum_theme_settings_glow_intensity";`)
}
