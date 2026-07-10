import { getPayload } from "payload";
import configPromise from "@payload-config";
import { categories, portfolioItems } from "@/data/portfolioItems";
import { faqItems } from "@/data/faqItems";
import { plans } from "@/data/plans";
import { testimonials } from "@/data/testimonials";
import { defaultPayloadGlobals } from "@/lib/payload/public-data";

type PayloadClient = Awaited<ReturnType<typeof getPayload>>;
type CollectionSlug =
  | "portfolio-categories"
  | "portfolio-items"
  | "pricing-plans"
  | "testimonials"
  | "faqs";

async function upsertBySlug<T extends Record<string, unknown>>(
  payload: PayloadClient,
  collection: CollectionSlug,
  slug: string,
  data: T
) {
  const existing = await payload.find({
    collection,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (existing.docs[0]) {
    return payload.update({
      collection,
      id: existing.docs[0].id,
      data,
    });
  }

  return payload.create({
    collection,
    data: data as never,
    draft: false,
  });
}

async function upsertQuestion<T extends Record<string, unknown>>(
  payload: PayloadClient,
  question: string,
  data: T
) {
  const existing = await payload.find({
    collection: "faqs",
    limit: 1,
    where: {
      question: {
        equals: question,
      },
    },
  });

  if (existing.docs[0]) {
    return payload.update({
      collection: "faqs",
      id: existing.docs[0].id,
      data,
    });
  }

  return payload.create({
    collection: "faqs",
    data: data as never,
    draft: false,
  });
}

async function upsertTestimonial<T extends Record<string, unknown>>(
  payload: PayloadClient,
  clientName: string,
  data: T
) {
  const existing = await payload.find({
    collection: "testimonials",
    limit: 1,
    where: {
      clientName: {
        equals: clientName,
      },
    },
  });

  if (existing.docs[0]) {
    return payload.update({
      collection: "testimonials",
      id: existing.docs[0].id,
      data,
    });
  }

  return payload.create({
    collection: "testimonials",
    data: data as never,
    draft: false,
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function seed() {
  if (!process.env.PAYLOAD_DATABASE_URI && !process.env.DATABASE_URL) {
    throw new Error("Set PAYLOAD_DATABASE_URI or DATABASE_URL before running npm run payload:seed.");
  }

  const payload = await getPayload({ config: configPromise });

  await Promise.all([
    payload.updateGlobal({ slug: "branding", data: defaultPayloadGlobals.branding }),
    payload.updateGlobal({ slug: "navigation", data: defaultPayloadGlobals.navigation }),
    payload.updateGlobal({ slug: "footer", data: defaultPayloadGlobals.footer }),
    payload.updateGlobal({ slug: "owner-profile", data: defaultPayloadGlobals.ownerProfile }),
    payload.updateGlobal({ slug: "default-seo", data: defaultPayloadGlobals.defaultSeo }),
    payload.updateGlobal({ slug: "theme-settings", data: defaultPayloadGlobals.themeSettings as never }),
    payload.updateGlobal({ slug: "homepage", data: defaultPayloadGlobals.homepage }),
    payload.updateGlobal({ slug: "portfolio-page", data: defaultPayloadGlobals.portfolioPage }),
    payload.updateGlobal({ slug: "contact-page", data: defaultPayloadGlobals.contactPage }),
  ]);

  const categoryBySlug = new Map<string, string | number>();

  for (const [index, category] of categories.entries()) {
    const doc = await upsertBySlug(payload, "portfolio-categories", category.id, {
      name: category.label,
      slug: category.id,
      description:
        category.id === "thumbnails"
          ? "Eye-catching thumbnails designed to maximize click-through rates and engagement."
          : category.id === "logos"
            ? "Custom logo designs that represent your brand identity in Minecraft."
            : category.id === "texture-packs"
              ? "Complete texture pack designs for immersive gameplay experiences."
              : "Banner artwork for YouTube, Twitch, and other platforms.",
      displayOrder: index,
      status: "published",
    });

    categoryBySlug.set(category.id, doc.id);
  }

  for (const [index, item] of portfolioItems.entries()) {
    const category = categoryBySlug.get(item.category);

    if (!category) {
      continue;
    }

    await upsertBySlug(payload, "portfolio-items", item.slug || slugify(item.title), {
      title: item.title,
      slug: item.slug || slugify(item.title),
      category,
      externalImageUrl: item.thumbnail_url || item.image,
      shortDescription: item.short_description || item.description,
      fullDescription: item.full_description || item.description,
      tags: item.tags.map((tag) => ({ tag })),
      featured: item.featured,
      popularityScore: item.popularity_score || 0,
      clientName: item.client_name,
      clientPermission: item.client_permission || false,
      externalLink: item.external_link,
      orderLink: item.discord_order_link || "/contact",
      displayOrder: index,
      status: "published",
    });
  }

  for (const [index, plan] of plans.entries()) {
    await upsertBySlug(payload, "pricing-plans", plan.id, {
      name: plan.name,
      slug: plan.id,
      description: plan.description,
      fullDescription: plan.description,
      price: plan.price,
      currency: "USD",
      features: plan.features.map((feature) => ({ feature })),
      highlighted: Boolean(plan.highlighted),
      orderUrl: plan.orderUrl || "/contact",
      displayOrder: index,
      status: "published",
    });
  }

  for (const [index, testimonial] of testimonials.entries()) {
    await upsertTestimonial(payload, testimonial.author, {
      clientName: testimonial.author,
      clientRole: testimonial.role,
      quote: testimonial.content,
      rating: testimonial.rating,
      featured: true,
      displayOrder: index,
      status: "published",
    });
  }

  for (const [index, faq] of faqItems.entries()) {
    await upsertQuestion(payload, faq.question, {
      question: faq.question,
      answer: faq.answer,
      displayOrder: index,
      status: "published",
    });
  }

  payload.logger.info("Payload seed completed without creating duplicates.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
