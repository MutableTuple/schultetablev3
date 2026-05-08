"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiCog } from "react-icons/hi";
import { IoMdColorPalette } from "react-icons/io";
import { VscGraph } from "react-icons/vsc";
import { MdOutlineAnalytics } from "react-icons/md";
import { HiUser } from "react-icons/hi";
import { LuBrain } from "react-icons/lu";
const menuItems = [
  { id: 1, label: "Profile", icon: HiHome, link: "/my-profile" },
  { id: 2, label: "Analytics", icon: VscGraph, link: "/my-profile/analytics" },
  {
    id: 9,
    label: "Advanced Brain Report (NEW)",
    icon: LuBrain,
    link: "/my-profile/brain-report",
  },
  {
    id: 5,
    label: "Pro Analytics",
    icon: MdOutlineAnalytics,
    link: "/my-profile/pro-analytics",
  },
  { id: 3, label: "All Games", icon: HiUser, link: "/my-profile/my-games" },
  {
    id: 4,
    label: "Personalize",
    icon: IoMdColorPalette,
    link: "/my-profile/personalize",
  },
  { id: 6, label: "Security", icon: HiCog, link: "/my-profile/security" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (link) =>
    link === "/my-profile" ? pathname === link : pathname.startsWith(link);

  return (
    <>
      {/* ─────────────────────────────────────────
          DESKTOP SIDEBAR  (hidden on mobile)
      ───────────────────────────────────────── */}
      <aside className="hidden lg:block sticky top-6 self-start">
        <div className="card bg-base-100 border border-base-300  rounded-2xl overflow-hidden">
          <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-rose-500 to-emerald-500 opacity-60" />
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.link);
              return (
                <Link
                  key={item.id}
                  href={item.link}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-base-content/50 hover:bg-base-200 hover:text-base-content"
                    }`}
                >
                  {/* Active indicator bar */}
                  <span
                    className={`w-0.5 h-4 rounded-full transition-all duration-150 shrink-0 ${
                      active ? "bg-primary opacity-100" : "bg-transparent"
                    }`}
                  />
                  <item.icon
                    className={`text-lg shrink-0 transition-colors ${active ? "text-primary" : "text-base-content/40 group-hover:text-base-content"}`}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ─────────────────────────────────────────
          MOBILE BOTTOM NAV  (hidden on desktop)
      ───────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Frosted glass blur backdrop */}
        <div className="bg-base-100/80 backdrop-blur-xl border-t border-base-300 shadow-2xl">
          {/* Top accent line */}
          <div className="h-px w-full bg-gradient-to-r from-indigo-500 via-rose-500 to-emerald-500 opacity-50" />

          <div className="flex items-center justify-around px-2 py-2 pb-safe">
            {menuItems.map((item) => {
              const active = isActive(item.link);
              return (
                <Link
                  key={item.id}
                  href={item.link}
                  className="flex flex-col items-center gap-0.5 flex-1 py-1 px-1 relative"
                >
                  {/* Active pill background */}
                  {active && (
                    <span className="absolute inset-x-1 inset-y-0 rounded-xl bg-primary/10" />
                  )}

                  <span
                    className={`relative text-xl transition-all duration-150 ${
                      active ? "text-primary scale-110" : "text-base-content/35"
                    }`}
                  >
                    <item.icon />
                    {active && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </span>

                  <span
                    className={`relative text-[10px] font-medium leading-none transition-colors truncate max-w-[52px] text-center ${
                      active ? "text-primary" : "text-base-content/30"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Spacer so mobile content isn't hidden behind bottom nav */}
      {/* <div className="lg:hidden h-20" /> */}
    </>
  );
}
