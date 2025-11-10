"use client";
import Link from "next/link";
import React from "react";
import { IoMdLogIn } from "react-icons/io";

export default function UserAvatar({ user }) {
  return (
    <div className="fixed top-4 left-4 z-10">
      {user ? (
        <Link href={"/my-profile"}>
          <div className="avatar tooltip tooltip-right" data-tip="My profile ">
            <div className="relative w-8 h-8 hover:scale-105 duration-200 outline  outline-primary outline-offset-2 rounded-full ">
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full  border-t-transparent z-0" />

              {/* Avatar image */}
              <img
                src={user[0]?.image}
                alt="User Avatar"
                className="rounded-full z-10 relative  "
              />
            </div>
          </div>
        </Link>
      ) : (
        <Link href={"/auth/login"}>
          <button
            className="btn btn-primary btn-circle w-8 h-8 tooltip tooltip-right hover:btn-secondary"
            data-tip="Click to log in"
          >
            <IoMdLogIn className="text-xl" />
          </button>
        </Link>
      )}
    </div>
  );
}
