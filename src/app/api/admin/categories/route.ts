import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonOk, readJson } from "@/lib/cms/api";
import { createCategory, listCategories } from "@/lib/cms/repositories";
import { categoryInputSchema } from "@/lib/cms/schemas";

export async function GET() {
  try {
    const { supabase } = await getCmsAdminContext();
    const categories = await listCategories(supabase, { includePrivate: true });
    return jsonOk(categories);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await getCmsAdminContext();
    const payload = categoryInputSchema.parse(await readJson(request));
    const category = await createCategory(supabase, payload);
    return jsonCreated(category);
  } catch (error) {
    return handleRouteError(error);
  }
}
