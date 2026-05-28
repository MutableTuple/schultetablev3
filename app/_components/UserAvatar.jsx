"use client";

import Link from "next/link";
import React from "react";

import { BiLogIn, BiRocket, BiTrophy } from "react-icons/bi";

import { FiBarChart2, FiUser, FiLogOut } from "react-icons/fi";

export default function UserAvatar({ user }) {
  /* ───────────────── NO USER ───────────────── */
  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="
        btn
        btn-info
        gap-2
        shadow-lg
        hover:scale-105
        transition-all
        duration-200
        rounded-none
      "
      >
        <BiLogIn className="text-xl" />
        Login & Track your progress
      </Link>
    );
  }

  return (
    <>
      {/* ───────────────── MOBILE FLOATING AVATAR ───────────────── */}
      <div
        className="
          dropdown
          dropdown-bottom
          fixed
          top-4
          left-4
          z-[120]
          md:hidden
        "
      >
        {/* BUTTON */}
        <label
          tabIndex={0}
          className="
            btn
            btn-circle
            h-12
            w-12
            overflow-hidden
            border-2
            border-primary
            bg-base-100
            p-0
            shadow-xl
          "
        >
          <img
            src={user?.image}
            alt="User Avatar"
            className="
              h-full
              w-full
              object-cover
            "
          />
        </label>

        {/* MOBILE DROPDOWN */}
        <ul
          tabIndex={0}
          className="
            dropdown-content
            z-[200]
            mt-3
            w-[280px]
            border
            border-base-300
            bg-base-100
            p-2
            shadow-2xl
          "
        >
          {/* PROFILE */}
          <li>
            <Link
              href="/my-profile"
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                transition-all
                hover:bg-base-200
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-base-300
                  bg-base-100
                  text-primary
                "
              >
                <FiUser size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">My Profile</p>

                <p className="text-xs text-base-content/50">
                  View your public profile
                </p>
              </div>
            </Link>
          </li>

          {/* ANALYTICS */}
          <li>
            <Link
              href="/my-profile/analytics"
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                transition-all
                hover:bg-base-200
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-base-300
                  bg-base-100
                  text-secondary
                "
              >
                <FiBarChart2 size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold">Analytics</p>

                <p className="text-xs text-base-content/50">
                  Track your performance
                </p>
              </div>
            </Link>
          </li>

          {/* DIVIDER */}
          <div className="my-2 border-t border-base-300" />

          {/* LOGOUT */}
          <li>
            <button
              className="
                flex
                w-full
                items-center
                gap-3
                px-4
                py-3
                text-error
                transition-all
                hover:bg-error/10
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  border
                  border-error/20
                  bg-error/10
                "
              >
                <FiLogOut size={18} />
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold">Logout</p>

                <p className="text-xs text-error/70">Exit your account</p>
              </div>
            </button>
          </li>
        </ul>
      </div>

      {/* ───────────────── DESKTOP USER CARD ───────────────── */}
      <div
        className="
          hidden
          md:block
          w-full
        "
      >
        <div className="dropdown dropdown-bottom w-full">
          {/* CARD */}
          <label
            tabIndex={0}
            className="
              flex
              cursor-pointer
              items-center
              justify-between
              border
              border-base-300
              bg-base-100
              p-3
              transition-all
              duration-200
              hover:border-primary
              active:scale-[0.99]
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              {/* AVATAR */}
              <div className="avatar">
                <div
                  className="
                    w-14
                    border-2
                    border-primary
                    p-[2px]
                    bg-base-100
                  "
                >
                  <img src={user?.image} alt="User Avatar" />
                </div>
              </div>

              {/* INFO */}
              <div>
                <h2
                  className="
                    text-base
                    font-bold
                    leading-none
                    text-base-content
                  "
                >
                  {user?.name || "Player"}
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    font-medium
                    uppercase
                    tracking-wide
                    text-base-content/50
                  "
                >
                  Level 1
                </p>
              </div>
            </div>

            {/* ONLINE DOT */}
            <div
              className="
                h-3
                w-3
                bg-success
              "
            />
          </label>

          {/* DESKTOP DROPDOWN */}
          <ul
            tabIndex={0}
            className="
              dropdown-content
              z-[200]
              mt-3
              w-full
              border
              border-base-300
              bg-base-100
              p-2
              shadow-xl
            "
          >
            <li>
              <Link
                href="/my-profile"
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  transition-all
                  hover:bg-base-200
                "
              >
                <FiUser size={18} />

                <span className="font-medium">My Profile</span>
              </Link>
            </li>

            <li>
              <Link
                href="/my-profile/analytics"
                className="
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  transition-all
                  hover:bg-base-200
                "
              >
                <FiBarChart2 size={18} />

                <span className="font-medium">Analytics</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
