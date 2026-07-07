import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import { deleteService, updateService } from "@/lib/cms/repositories";
import { idSchema, serviceUpdateSchema } from "@/lib/cms/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    const payload = serviceUpdateSchema.parse(await readJson(request));
    const service = await updateService(supabase, idSchema.parse(id), payload);
    return jsonOk(service);
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
    await deleteService(supabase, idSchema.parse(id));
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
