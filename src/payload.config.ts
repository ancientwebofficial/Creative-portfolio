import path from "path";
import { fileURLToPath } from "url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";

import { FAQs } from "./payload/collections/FAQs.ts";
import { Media } from "./payload/collections/Media.ts";
import { PortfolioCategories } from "./payload/collections/PortfolioCategories.ts";
import { PortfolioItems } from "./payload/collections/PortfolioItems.ts";
import { PricingPlans } from "./payload/collections/PricingPlans.ts";
import { Testimonials } from "./payload/collections/Testimonials.ts";
import { Users } from "./payload/collections/Users.ts";
import { Branding } from "./payload/globals/Branding.ts";
import { ContactPage } from "./payload/globals/ContactPage.ts";
import { DefaultSEO } from "./payload/globals/DefaultSEO.ts";
import { Footer } from "./payload/globals/Footer.ts";
import { Homepage } from "./payload/globals/Homepage.ts";
import { Navigation } from "./payload/globals/Navigation.ts";
import { OwnerProfile } from "./payload/globals/OwnerProfile.ts";
import { PortfolioPage } from "./payload/globals/PortfolioPage.ts";
import { ThemeSettings } from "./payload/globals/ThemeSettings.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const payloadDatabaseUri =
  process.env.PAYLOAD_DATABASE_URI || process.env.DATABASE_URL || "";

const hasS3Storage =
  Boolean(process.env.PAYLOAD_S3_BUCKET) &&
  Boolean(process.env.PAYLOAD_S3_REGION) &&
  Boolean(process.env.PAYLOAD_S3_ACCESS_KEY_ID) &&
  Boolean(process.env.PAYLOAD_S3_SECRET_ACCESS_KEY);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " - Cosmic Flare CMS",
    },
  },
  collections: [
    Users,
    Media,
    PortfolioCategories,
    PortfolioItems,
    PricingPlans,
    Testimonials,
    FAQs,
  ],
  cors: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"],
  db: postgresAdapter({
    pool: {
  connectionString: payloadDatabaseUri,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
},
    schemaName: process.env.PAYLOAD_DATABASE_SCHEMA || "payload",
  }),
  globals: [
    Branding,
    Navigation,
    Footer,
    OwnerProfile,
    DefaultSEO,
    ThemeSettings,
    Homepage,
    PortfolioPage,
    ContactPage,
  ],
  plugins: [
    s3Storage({
      enabled: hasS3Storage,
      bucket: process.env.PAYLOAD_S3_BUCKET || "payload-media",
      collections: {
        media: true,
      },
      config: {
        region: process.env.PAYLOAD_S3_REGION || "auto",
        endpoint: process.env.PAYLOAD_S3_ENDPOINT,
        forcePathStyle: process.env.PAYLOAD_S3_FORCE_PATH_STYLE === "true",
        credentials: {
          accessKeyId: process.env.PAYLOAD_S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.PAYLOAD_S3_SECRET_ACCESS_KEY || "",
        },
      },
    }),
  ],
  routes: {
    admin: "/cms",
    api: "/api/payload",
    graphQL: "/api/payload/graphql",
    graphQLPlayground: "/api/payload/graphql",
  },
  secret: process.env.PAYLOAD_SECRET || "development-payload-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
});
