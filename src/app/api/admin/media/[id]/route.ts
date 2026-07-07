import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import { deleteMediaRecord, updateMediaRecord } from "@/lib/cms/repositories";
import { idSchema, mediaRecordUpdateSchema } from "@/lib/cms/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    const payload = mediaRecordUpdateSchema.parse(await readJson(request));
    const media = await updateMediaRecord(supabase, idSchema.parse(id), payload);
    return jsonOk(media);
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
    const media = await deleteMediaRecord(supabase, idSchema.parse(id));
    return jsonOk({ deleted: true, media });
  } catch (error) {
    return handleRouteError(error);
  }
}
