import { redirect } from "next/navigation";
import { getCurrentCmsUser } from "@/lib/auth/guards";
import { loginAction } from "./actions";

const errorMessages: Record<string, string> = {
  invalid: "Check your admin email and password.",
  forbidden: "This account is not allowed to access the CMS.",
  config: "Supabase environment variables are not configured.",
};

function safeRedirect(value?: string) {
  return value?.startsWith("/admin") ? value : "/admin";
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const params = await searchParams;
  const profile = await getCurrentCmsUser();

  if (profile?.role === "admin") {
    redirect(safeRedirect(params.redirect));
  }

  return (
    <main className="admin-shell flex min-h-screen items-center justify-center px-4 py-20">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.15fr,0.85fr]">
        <section className="surface-panel-strong rounded-[2rem] p-8 sm:p-10 lg:p-12">
          <p className="section-kicker mb-4">CMS Access</p>
          <h1 className="section-title text-4xl sm:text-5xl">Admin Login</h1>
          <p className="mt-4 max-w-lg text-sm leading-7 text-[#9aa7b9]">
            Sign in with your Supabase admin account to manage the portfolio,
            services, media, testimonials, and homepage content.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["Live CMS", "Connected"],
              ["Protected", "Role-based access"],
              ["Workflow", "Production-ready"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#9aa7b9]">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <form action={loginAction} className="surface-panel-strong rounded-[2rem] p-8 sm:p-10">
        <input type="hidden" name="redirectTo" value={params.redirect || "/admin"} />

        <div className="mb-8">
          <p className="section-kicker mb-4">Secure sign in</p>
          <h2 className="text-2xl font-semibold text-white">Enter your credentials</h2>
          <p className="mt-2 text-sm text-[#9aa7b9]">
            Sign in with your Supabase admin account.
          </p>
        </div>

        {params.error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorMessages[params.error] || errorMessages.invalid}
          </div>
        )}

        <label className="mb-2 block font-semibold text-white" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mb-5 w-full px-4 py-3"
        />

        <label
          className="mb-2 block font-semibold text-white"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          className="mb-8 w-full px-4 py-3"
        />

        <button
          type="submit"
          className="glass-button w-full py-3"
        >
          Sign In
        </button>
        </form>
      </div>
    </main>
  );
}
