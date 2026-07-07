import { redirect } from "next/navigation";
import { hasSupabaseConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Tables, UserRole } from "@/lib/cms/database.types";

export type CmsUser = Tables<"users">;

export class AuthRequiredError extends Error {
  status = 401;

  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthRequiredError";
  }
}

export class ForbiddenError extends Error {
  status = 403;

  constructor(message = "You do not have permission to perform this action.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export async function getCurrentCmsUser() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  return profile;
}


export async function requireCmsUser(allowedRoles: UserRole[] = ["admin"]) {
  const profile = await getCurrentCmsUser();

  if (!profile) {
    throw new AuthRequiredError();
  }

  if (!allowedRoles.includes(profile.role)) {
    throw new ForbiddenError();
  }

  return profile;
}

export async function requireAdmin() {
  return requireCmsUser(["admin"]);
}

export async function redirectIfNotCmsUser() {
  const profile = await getCurrentCmsUser();

  if (profile?.role !== "admin") {
    redirect("/admin-login");
  }

  return profile;
}
