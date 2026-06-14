"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Coffee,
  LayoutDashboard,
  Sparkles,
  Megaphone,
  Users,
  Menu,
  X,
  LogOut,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { IS_MOCK } from "@/lib/api";
import { getUser, isAuthed, logout } from "@/lib/auth";

const NAV: { href: string; label: string; Icon: LucideIcon; hint: string }[] = [
  { href: "/dashboard", label: "Dashboard", Icon: LayoutDashboard, hint: "Overview & metrics" },
  { href: "/", label: "Campaign Agent", Icon: Sparkles, hint: "Build by chatting" },
  { href: "/campaigns", label: "Campaigns", Icon: Megaphone, hint: "Funnels & sends" },
  { href: "/customers", label: "Customers", Icon: Users, hint: "Audience records" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const isLoginRoute = pathname === "/login";

  // Route guard: redirect unauthenticated users to /login (the login route and
  // MOCK mode are always allowed through).
  useEffect(() => {
    if (isLoginRoute) {
      setReady(true);
      return;
    }
    if (!isAuthed()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [pathname, isLoginRoute, router]);

  // The login page renders without the workspace chrome.
  if (isLoginRoute) return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center">
        <Loader2 size={22} className="animate-spin text-crema-300/40" />
      </div>
    );
  }

  const user = getUser();
  const initials = user
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "AD";

  return (
    <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1600px]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-crema-200/8 bg-espresso-950/95 px-3 py-5 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link
          href="/dashboard"
          onClick={() => setOpen(false)}
          className="mb-6 flex items-center gap-2.5 px-2"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-caramel-400 to-clay-500 text-espresso-975 shadow-sm">
            <Coffee size={18} strokeWidth={2.25} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-semibold tracking-tight text-crema-50">
              Crema CRM
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-crema-300/40">
              Coffee Co.
            </span>
          </span>
        </Link>

        <span className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-crema-300/30">
          Workspace
        </span>
        <nav className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.Icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 transition ${
                  active
                    ? "bg-caramel-400/10 text-crema-50"
                    : "text-crema-200/65 hover:bg-crema-200/[0.04] hover:text-crema-100"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-caramel-400" />
                )}
                <Icon
                  size={17}
                  strokeWidth={2.1}
                  className={active ? "text-caramel-300" : "text-crema-300/50 group-hover:text-caramel-300"}
                />
                <span className="flex flex-col">
                  <span className="text-[13.5px] font-medium leading-tight">{item.label}</span>
                  <span className="text-[10.5px] text-crema-300/35">{item.hint}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-2.5 px-1">
          <div className="surface rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${IS_MOCK ? "bg-caramel-400 animate-pulse-soft" : "bg-leaf-500"}`} />
              <span className="text-[11.5px] font-semibold text-crema-100">
                {IS_MOCK ? "Demo data" : "Live API"}
              </span>
            </div>
            <p className="mt-1 text-[10.5px] leading-relaxed text-crema-300/40">
              {IS_MOCK
                ? "Seed dataset. Set NEXT_PUBLIC_API_BASE_URL to connect the CRM API."
                : "Connected to the deployed CRM API."}
            </p>
          </div>
          <div className="flex items-center gap-2.5 px-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-crema-200/8 text-[11px] font-semibold text-caramel-300">
              {initials}
            </span>
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[11.5px] font-medium text-crema-100">
                {user?.name ?? "Admin"}
              </span>
              <span className="truncate text-[10.5px] text-crema-300/40">
                {user?.email ?? "Crema Co."}
              </span>
            </span>
            {!IS_MOCK && (
              <button
                onClick={logout}
                title="Sign out"
                aria-label="Sign out"
                className="ml-auto grid h-7 w-7 place-items-center rounded-lg text-crema-300/45 transition hover:bg-crema-200/[0.06] hover:text-clay-400"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-crema-200/8 bg-espresso-950/95 px-4 py-2.5 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-crema-200/10 text-crema-100"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
        <span className="font-display text-base font-semibold text-crema-50">Crema CRM</span>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-caramel-400 to-clay-500 text-espresso-975">
          <Coffee size={16} strokeWidth={2.25} />
        </span>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-espresso-975/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <main className="flex min-h-dvh w-full flex-1 flex-col pt-12 lg:pt-0">{children}</main>
    </div>
  );
}
