import AdminSidebar from "@/components/layout/Sidebar";
import { redirectIfNotCmsUser } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await redirectIfNotCmsUser();

  return (
    <div className="admin-shell flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 lg:ml-0">
        <div className="mx-auto w-full max-w-7xl p-6 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
