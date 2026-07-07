import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import { deleteCategory, updateCategory } from "@/lib/cms/repositories";
import { categoryUpdateSchema, idSchema } from "@/lib/cms/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    const payload = categoryUpdateSchema.parse(await readJson(request));
    const category = await updateCategory(supabase, idSchema.parse(id), payload);
    return jsonOk(category);
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
    await deleteCategory(supabase, idSchema.parse(id));
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
