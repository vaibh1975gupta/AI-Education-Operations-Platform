"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: "▦",
  },
  {
    name: "Students",
    href: "/students",
    icon: "♙",
  },
  {
    name: "Issues",
    href: "/issues",
    icon: "ⓘ",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: "☑",
  },
  {
    name: "AI Operations",
    href: "/ai-operations",
    icon: "✦",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: "♧",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[270px] flex-col bg-[#17213f] text-white">
      {/* Logo */}
      <div className="flex h-[152px] items-center border-b border-white/10 px-7">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-2xl text-cyan-400">
            🤖
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              EduOps AI
            </h1>

            <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
              Operations
              <br />
              Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-7">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-12 items-center gap-4 rounded-xl px-4 text-sm font-medium transition ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="flex w-5 justify-center text-lg">
                  {item.icon}
                </span>

                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom status */}
      <div className="border-t border-white/10 p-5">
        <div className="rounded-2xl bg-white/5 p-4">
          <p className="text-xs text-slate-400">
            AI System
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-sm font-medium text-white">
              Operational
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}