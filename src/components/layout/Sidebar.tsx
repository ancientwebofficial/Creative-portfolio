"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  href: string;
  label: string;
  icon: string;
}

const menuItems: SidebarItem[] = [
  { href: "/admin", label: "Overview", icon: "#" },
  { href: "/admin/portfolio", label: "Portfolio Manager", icon: "P" },
  { href: "/admin/plans", label: "Plans Manager", icon: "$" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "*" },
  { href: "/admin/media", label: "Media Manager", icon: "M" },
  { href: "/admin/text", label: "Site Text Editor", icon: "T" },
  { href: "/admin/homepage", label: "Homepage Arrangement", icon: "H" },
  { href: "/admin/settings", label: "Settings", icon: "S" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="lg:hidden fixed right-4 top-20 z-40 rounded-full border border-white/10 bg-[#10161d]/90 px-4 py-2 text-sm font-semibold text-white backdrop-blur-xl"
      >
        Menu
      </button>

      <aside
        className={`fixed left-0 top-0 h-screen border-r border-white/10 bg-[#090d12]/88 backdrop-blur-2xl transition-all duration-300 ${
          collapsed ? "w-0 -translate-x-full lg:w-24" : "w-72 lg:w-72"
        }`}
      >
        <div className="flex h-full flex-col px-4 py-5">
          <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9aa7b9]">CMS</p>
            <p className={`mt-2 font-heading text-lg font-semibold text-white ${collapsed ? "lg:hidden" : ""}`}>
              Admin Studio
            </p>
            <p className={`text-sm text-[#9aa7b9] ${collapsed ? "lg:hidden" : ""}`}>
              Manage live content and assets.
            </p>
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-white/10 text-white shadow-[0_18px_50px_-28px_rgba(125,211,199,0.55)]"
                    : "text-[#9aa7b9] hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-[#edf3fb]">
                  {item.icon}
                </span>
                <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          </nav>

          <div className="pt-4">
            <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 px-4 py-3 text-[#9aa7b9] hover:bg-white/5 hover:text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-[#edf3fb]">⎋</span>
              <span className={`text-sm font-medium ${collapsed ? "hidden" : ""}`}>
                Logout
              </span>
            </button>
            </form>
          </div>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-24" : "lg:pl-72"}`} />
    </>
  );
}
