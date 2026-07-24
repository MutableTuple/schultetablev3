"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiCog, HiUser } from "react-icons/hi";
import { IoMdColorPalette } from "react-icons/io";
import { VscGraph } from "react-icons/vsc";
import { MdOutlineAnalytics } from "react-icons/md";
import { LuBrain, LuGamepad2 } from "react-icons/lu";

const menuSections = [
  {
    title: "ACCOUNT",
    items: [
      { label: "Profile", icon: HiUser, link: "/my-profile", mobile: true },
      {
        label: "Analytics",
        icon: VscGraph,
        link: "/my-profile/analytics",
        mobile: true,
      },
      {
        label: "Brain Report",
        icon: LuBrain,
        link: "/my-profile/brain-report",
        mobile: true,
      },
    ],
  },
  {
    title: "PLAY",
    items: [
      {
        label: "All Games",
        icon: LuGamepad2,
        link: "/my-profile/my-games",
        mobile: true,
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        label: "Security",
        icon: HiCog,
        link: "/my-profile/security",
        mobile: true,
      },
    ],
  },
];

const mobileItems = menuSections
  .flatMap((s) => s.items)
  .filter((item) => item.mobile);

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (link) =>
    link === "/my-profile" ? pathname === link : pathname.startsWith(link);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 flex-col bg-background border-r border-border z-40">
        <div className="px-5 py-5 border-b border-border">
          <p className="text-[15px] font-bold text-foreground tracking-tight">
            My Profile
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Manage your account
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {menuSections.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.link);
                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                        ${
                          active
                            ? "bg-[var(--ink)] text-background"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                    >
                      <item.icon
                        className={`text-[17px] flex-shrink-0 transition-colors
                          ${
                            active
                              ? "text-background"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-background/60" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
        <div className="flex items-center justify-around px-1 py-1">
          {mobileItems.map((item) => {
            const active = isActive(item.link);
            return (
              <Link
                key={item.link}
                href={item.link}
                className="flex flex-col items-center gap-1 py-1.5 px-2 flex-1 min-w-0"
              >
                <div
                  className={`w-10 h-9 flex items-center justify-center rounded-xl transition-all
                    ${active ? "bg-[var(--ink)]" : "bg-transparent"}`}
                >
                  <item.icon
                    className={`text-xl transition-colors
                      ${active ? "text-background" : "text-muted-foreground"}`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium truncate max-w-full transition-colors
                    ${active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
