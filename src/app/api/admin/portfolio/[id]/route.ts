import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonOk, readJson } from "@/lib/cms/api";
import { deletePortfolioItem, updatePortfolioItem } from "@/lib/cms/repositories";
import { idSchema, portfolioUpdateSchema } from "@/lib/cms/schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = await getCmsAdminContext();
    const payload = portfolioUpdateSchema.parse(await readJson(request));
    const item = await updatePortfolioItem(supabase, idSchema.parse(id), payload);
    return jsonOk(item);
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
    await deletePortfolioItem(supabase, idSchema.parse(id));
    return jsonOk({ deleted: true });
  } catch (error) {
    return handleRouteError(error);
  }
}
