import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonOk, readJson } from "@/lib/cms/api";
import { createTestimonial, listTestimonials } from "@/lib/cms/repositories";
import { testimonialInputSchema } from "@/lib/cms/schemas";

export async function GET() {
  try {
    const { supabase } = await getCmsAdminContext();
    const testimonials = await listTestimonials(supabase, {
      includeUnapproved: true,
    });
    return jsonOk(testimonials);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await getCmsAdminContext();
    const payload = testimonialInputSchema.parse(await readJson(request));
    const testimonial = await createTestimonial(supabase, payload);
    return jsonCreated(testimonial);
  } catch (error) {
    return handleRouteError(error);
  }
}
