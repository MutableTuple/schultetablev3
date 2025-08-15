"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiMenu, HiHome, HiUser, HiCog } from "react-icons/hi";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { id: 1, label: "Profile", icon: HiHome, link: "/my-profile" },
    { id: 2, label: "All Games", icon: HiUser, link: "/my-profile/my-games" },
    {
      id: 3,
      label: "Personalize",
      icon: HiCog,
      link: "/my-profile/personalize",
    },
    {
      id: 4,
      label: "Security & Passwords",
      icon: HiCog,
      link: "/my-profile/security",
    },
  ];

  const isActive = (link, isRoot) => {
    if (isRoot) {
      return pathname === link; // Only exact match for root
    }
    return pathname.startsWith(link);
  };

  return (
    <div className="relative z-30">
      {/* Sidebar Menu */}
      <div className="bg-base-100 border border-base-300 rounded-sm p-4 space-y-2">
        {menuItems.map((item) => {
          const active = isActive(item.link, item.link === "/my-profile");
          return (
            <Link
              key={item.id}
              href={item.link}
              className={`flex items-center w-full gap-3 px-3 py-2 rounded transition-all duration-300
                ${
                  active
                    ? "bg-base-300 text-base font-medium"
                    : "hover:bg-base-300 hover:text-base text-base-content/80"
                }`}
            >
              <item.icon className="text-lg" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
