"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogIn, BarChart2, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function useClickOutside(ref, onOutside) {
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

function MenuItem({ href, icon, label, sub, onClick, danger }) {
  const content = (
    <>
      <div
        className={`flex h-9 w-9 items-center justify-center flex-shrink-0 ${
          danger
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold leading-none">{label}</p>
        {sub && <p className="text-xs mt-0.5 text-muted-foreground">{sub}</p>}
      </div>
    </>
  );

  const className = `w-full flex items-center gap-3 px-3 py-2.5 text-left ${
    danger ? "hover:bg-destructive/10" : "hover:bg-muted"
  }`;

  if (href)
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

function MenuPanel({ children, className = "" }) {
  return (
    <div
      className={`absolute z-50 mt-1.5 bg-popover text-popover-foreground shadow-lg p-1.5 ${className}`}
    >
      {children}
    </div>
  );
}

export default function UserAvatar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(false);
  const mobileRef = useRef(null);
  const desktopRef = useRef(null);

  useClickOutside(mobileRef, () => setMobileOpen(false));
  useClickOutside(desktopRef, () => setDesktopOpen(false));

  /* ── NO USER ── */
  if (!user) {
    return (
      <Button
        render={
          <Link
            href="/auth/login"
            className="flex items-center justify-center gap-2"
          />
        }
        className="w-full h-auto rounded-none px-4 py-2.5 text-sm font-semibold"
      >
        <LogIn size={18} />
        Login & Track Progress
      </Button>
    );
  }

  const menuActions = (close) => (
    <>
      <MenuItem
        href="/my-profile"
        icon={<User size={16} />}
        label="My Profile"
        sub="View your public profile"
        onClick={close}
      />
      <MenuItem
        href="/my-profile/analytics"
        icon={<BarChart2 size={16} />}
        label="Analytics"
        sub="Track your performance"
        onClick={close}
      />
      <div className="border-t border-dashed border-border my-1" />
      <MenuItem
        danger
        icon={<LogOut size={16} />}
        label="Logout"
        sub="Exit your account"
        onClick={close}
      />
    </>
  );

  const identityRow = (
    <>
      <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
        <img src={user?.image} alt="avatar" className="h-9 w-9 object-cover" />
        <div>
          <p className="text-sm font-bold leading-none">
            {user?.name || "Player"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">Level 1</p>
        </div>
        <div className="ml-auto h-2 w-2 bg-green-400" />
      </div>
      <div className="border-t border-dashed border-border my-1" />
    </>
  );

  return (
    <>
      {/* ── MOBILE FLOATING AVATAR ── */}
      <div ref={mobileRef} className="fixed top-4 left-4 z-[120] md:hidden">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="h-11 w-11 overflow-hidden bg-muted shadow-lg active:scale-95 transition-transform"
        >
          <img
            src={user?.image}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        </button>
        {mobileOpen && (
          <MenuPanel className="left-0 w-64">
            {identityRow}
            {menuActions(() => setMobileOpen(false))}
          </MenuPanel>
        )}
      </div>

      {/* ── DESKTOP USER CARD ── */}
      <div ref={desktopRef} className="hidden md:block w-full relative">
        <button
          onClick={() => setDesktopOpen((o) => !o)}
          className="flex items-center justify-between w-full bg-muted p-3 hover:shadow-sm active:scale-[0.99] transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <img
              src={user?.image}
              alt="avatar"
              className="h-11 w-11 object-cover"
            />
            <div className="text-left">
              <p className="text-sm font-bold leading-none">
                {user?.name || "Player"}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-1">
                Level 1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-400" />
            <ChevronDown
              size={14}
              className={`text-muted-foreground transition-transform duration-200 ${desktopOpen ? "rotate-180" : ""}`}
            />
          </div>
        </button>

        {desktopOpen && (
          <MenuPanel className="left-0 w-full">
            {menuActions(() => setDesktopOpen(false))}
          </MenuPanel>
        )}
      </div>
    </>
  );
}
