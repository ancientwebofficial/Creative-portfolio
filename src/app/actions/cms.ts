"use server";

import { revalidatePath } from "next/cache";
import { getCmsAdminContext, getSiteSettingsAdminContext } from "@/lib/cms/admin";
import {
  createCategory,
  createHomepageBlock,
  createPortfolioItem,
  createService,
  createTestimonial,
  deleteCategory,
  deleteHomepageBlock,
  deleteMediaRecord,
  deletePortfolioItem,
  deleteService,
  deleteTestimonial,
  listCategories,
  listHomepageBlocks,
  listMedia,
  listPortfolioItems,
  listServices,
  listTestimonials,
  updateCategory,
  updateHomepageBlock,
  updateMediaRecord,
  updatePortfolioItem,
  updateService,
  updateSiteSettings,
  updateTestimonial,
} from "@/lib/cms/repositories";
import {
  categoryInputSchema,
  categoryUpdateSchema,
  homepageBlockInputSchema,
  homepageBlockUpdateSchema,
  idSchema,
  mediaRecordUpdateSchema,
  portfolioInputSchema,
  portfolioQuerySchema,
  portfolioUpdateSchema,
  serviceInputSchema,
  serviceUpdateSchema,
  testimonialInputSchema,
  testimonialUpdateSchema,
  siteSettingsUpdateSchema,
  listQuerySchema,
} from "@/lib/cms/schemas";
import { uploadImage } from "@/lib/cms/uploads";

function revalidateCms() {
  revalidatePath("/");
  revalidatePath("/portfolio");
  revalidatePath("/admin");
}

export async function listAdminPortfolioAction(query: unknown = {}) {
  const parsed = portfolioQuerySchema.parse(query);
  const { supabase } = await getCmsAdminContext();
  return listPortfolioItems(supabase, { ...parsed, includePrivate: true });
}

export async function createPortfolioItemAction(input: unknown) {
  const payload = portfolioInputSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const item = await createPortfolioItem(supabase, payload);
  revalidateCms();
  return item;
}

export async function updatePortfolioItemAction(id: string, input: unknown) {
  const payload = portfolioUpdateSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const item = await updatePortfolioItem(supabase, idSchema.parse(id), payload);
  revalidateCms();
  return item;
}

export async function deletePortfolioItemAction(id: string) {
  const { supabase } = await getCmsAdminContext();
  await deletePortfolioItem(supabase, idSchema.parse(id));
  revalidateCms();
  return { deleted: true };
}

export async function listAdminCategoriesAction() {
  const { supabase } = await getCmsAdminContext();
  return listCategories(supabase, { includePrivate: true });
}

export async function createCategoryAction(input: unknown) {
  const payload = categoryInputSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const category = await createCategory(supabase, payload);
  revalidateCms();
  return category;
}

export async function updateCategoryAction(id: string, input: unknown) {
  const payload = categoryUpdateSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const category = await updateCategory(supabase, idSchema.parse(id), payload);
  revalidateCms();
  return category;
}

export async function deleteCategoryAction(id: string) {
  const { supabase } = await getCmsAdminContext();
  await deleteCategory(supabase, idSchema.parse(id));
  revalidateCms();
  return { deleted: true };
}

export async function listAdminServicesAction() {
  const { supabase } = await getCmsAdminContext();
  return listServices(supabase, { includeInactive: true });
}

export async function createServiceAction(input: unknown) {
  const payload = serviceInputSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const service = await createService(supabase, payload);
  revalidateCms();
  return service;
}

export async function updateServiceAction(id: string, input: unknown) {
  const payload = serviceUpdateSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const service = await updateService(supabase, idSchema.parse(id), payload);
  revalidateCms();
  return service;
}

export async function deleteServiceAction(id: string) {
  const { supabase } = await getCmsAdminContext();
  await deleteService(supabase, idSchema.parse(id));
  revalidateCms();
  return { deleted: true };
}

export async function listAdminTestimonialsAction() {
  const { supabase } = await getCmsAdminContext();
  return listTestimonials(supabase, { includeUnapproved: true });
}

export async function createTestimonialAction(input: unknown) {
  const payload = testimonialInputSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const testimonial = await createTestimonial(supabase, payload);
  revalidateCms();
  return testimonial;
}

export async function updateTestimonialAction(id: string, input: unknown) {
  const payload = testimonialUpdateSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const testimonial = await updateTestimonial(supabase, idSchema.parse(id), payload);
  revalidateCms();
  return testimonial;
}

export async function deleteTestimonialAction(id: string) {
  const { supabase } = await getCmsAdminContext();
  await deleteTestimonial(supabase, idSchema.parse(id));
  revalidateCms();
  return { deleted: true };
}

export async function listAdminHomepageBlocksAction() {
  const { supabase } = await getCmsAdminContext();
  return listHomepageBlocks(supabase, { includePrivate: true });
}

export async function createHomepageBlockAction(input: unknown) {
  const payload = homepageBlockInputSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const block = await createHomepageBlock(supabase, payload);
  revalidateCms();
  return block;
}

export async function updateHomepageBlockAction(id: string, input: unknown) {
  const payload = homepageBlockUpdateSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const block = await updateHomepageBlock(supabase, idSchema.parse(id), payload);
  revalidateCms();
  return block;
}

export async function deleteHomepageBlockAction(id: string) {
  const { supabase } = await getCmsAdminContext();
  await deleteHomepageBlock(supabase, idSchema.parse(id));
  revalidateCms();
  return { deleted: true };
}

export async function updateSiteSettingsAction(input: unknown) {
  const payload = siteSettingsUpdateSchema.parse(input);
  const { supabase } = await getSiteSettingsAdminContext();
  const settings = await updateSiteSettings(supabase, payload);
  revalidateCms();
  return settings;
}

export async function listAdminMediaAction(query: unknown = {}) {
  const parsed = listQuerySchema.parse(query);
  const { supabase } = await getCmsAdminContext();
  return listMedia(supabase, parsed);
}

export async function uploadMediaAction(formData: FormData) {
  const { supabase, profile } = await getCmsAdminContext();
  const files = formData
    .getAll("files")
    .filter((value): value is File => value instanceof File);
  const singleFile = formData.get("file");

  if (singleFile instanceof File) {
    files.push(singleFile);
  }

  const altText = formData.get("alt_text");
  const folder = formData.get("folder");
  const uploads = await Promise.all(
    files.map((file) =>
      uploadImage(supabase, file, profile, {
        altText: typeof altText === "string" ? altText : null,
        folder: typeof folder === "string" && folder ? folder : undefined,
      })
    )
  );

  revalidateCms();
  return uploads;
}

export async function updateMediaAction(id: string, input: unknown) {
  const payload = mediaRecordUpdateSchema.parse(input);
  const { supabase } = await getCmsAdminContext();
  const media = await updateMediaRecord(supabase, idSchema.parse(id), payload);
  revalidateCms();
  return media;
}

export async function deleteMediaAction(id: string) {
  const { supabase } = await getCmsAdminContext();
  const media = await deleteMediaRecord(supabase, idSchema.parse(id));
  revalidateCms();
  return { deleted: true, media };
}
