import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { handleRouteError } from "@/lib/cms/api";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();

    return NextResponse.redirect(new URL("/admin-login", request.url), {
      status: 303,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
