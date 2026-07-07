import type { NextRequest } from "next/server";
import { getCmsAdminContext } from "@/lib/cms/admin";
import { handleRouteError, jsonCreated, jsonOk, readJson } from "@/lib/cms/api";
import { createMediaRecord, listMedia } from "@/lib/cms/repositories";
import { listQuerySchema, mediaRecordInputSchema } from "@/lib/cms/schemas";

export async function GET(request: NextRequest) {
  try {
    const query = listQuerySchema.parse(
      Object.fromEntries(request.nextUrl.searchParams)
    );
    const { supabase } = await getCmsAdminContext();
    const media = await listMedia(supabase, query);
    return jsonOk(media);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, profile } = await getCmsAdminContext();
    const payload = mediaRecordInputSchema.parse({
      ...(await readJson(request)),
      uploaded_by: profile.id,
    });
    const media = await createMediaRecord(supabase, payload);
    return jsonCreated(media);
  } catch (error) {
    return handleRouteError(error);
  }
}
