import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import { deleteTestimonial, updateTestimonial } from "@/lib/cms/repositories";
import { idSchema, testimonialUpdateSchema } from "@/lib/cms/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    const payload = testimonialUpdateSchema.parse(await readJson(request));
    const testimonial = await updateTestimonial(supabase, idSchema.parse(id), payload);
    return jsonOk(testimonial);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    await deleteTestimonial(supabase, idSchema.parse(id));
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
