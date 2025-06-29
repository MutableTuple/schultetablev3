"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LogoutBtn from "./Auth/LogoutBtn";
import { FiLogIn } from "react-icons/fi";
import { getCurrentUser } from "../_utils/getCurrentUser";

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await getCurrentUser();
      setCurrentUser(res.user);
    };
    fetchUser();
  }, []);

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 max-w-screen-2xl mx-auto">
      {/* Start */}
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-60"
          >
            <li>
              <Link href="/my-profile">My Profile</Link>
            </li>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/how-to-play-schulte-table">How to Play?</Link>
            </li>
            <li>
              <Link href="/blogs">Blogs</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="flex items-center gap-2 ml-2">
          <img
            src="https://www.schultetable.com/_next/image?url=https%3A%2F%2Fhflzumrbjzkzofgzeyao.supabase.co%2Fstorage%2Fv1%2Fobject%2Fpublic%2Fmedia%2F%2FLogo.png&w=128&q=75"
            alt="SchulteTable"
            className="h-9 w-9"
          />
        </Link>
      </div>

      {/* Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-sm">
          <li>
            <Link href="/my-profile">My Profile</Link>
          </li>
          <li>
            <Link href="/about">About Us</Link>
          </li>
          <li>
            <Link href="/how-to-play-schulte-table">How to Play?</Link>
          </li>
          <li>
            <Link href="/blogs">Blogs</Link>
          </li>
        </ul>
      </div>

      {/* End */}
      <div className="navbar-end">
        {currentUser ? (
          <LogoutBtn />
        ) : (
          <Link href="/auth/login" className="btn btn-ghost text-xl">
            <FiLogIn className="text-2xl" />
          </Link>
        )}
      </div>
    </div>
  );
}
