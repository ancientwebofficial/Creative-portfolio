import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonOk, readJson } from "@/lib/cms/api";
import {
  createHomepageBlock,
  listHomepageBlocks,
} from "@/lib/cms/repositories";
import { homepageBlockInputSchema } from "@/lib/cms/schemas";

export async function GET() {
  try {
    const { supabase } = await getCmsAdminContext();
    const blocks = await listHomepageBlocks(supabase, { includePrivate: true });
    return jsonOk(blocks);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase } = await getCmsAdminContext();
    const payload = homepageBlockInputSchema.parse(await readJson(request));
    const block = await createHomepageBlock(supabase, payload);
    return jsonCreated(block);
  } catch (error) {
    return handleRouteError(error);
  }
}
