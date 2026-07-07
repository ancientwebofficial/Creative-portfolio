import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import {
  deleteHomepageBlock,
  updateHomepageBlock,
} from "@/lib/cms/repositories";
import { homepageBlockUpdateSchema, idSchema } from "@/lib/cms/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    const payload = homepageBlockUpdateSchema.parse(await readJson(request));
    const block = await updateHomepageBlock(supabase, idSchema.parse(id), payload);
    return jsonOk(block);
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
    await deleteHomepageBlock(supabase, idSchema.parse(id));
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
