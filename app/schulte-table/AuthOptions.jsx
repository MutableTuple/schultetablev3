import Link from "next/link";
import React from "react";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function AuthOptions({ user }) {
  return (
    <ul className="space-y-1 text-sm">
      {!user ? (
        <>
          <li>
            <Link
              href="/login"
              className="link link-hover flex items-center gap-1"
            >
              <FaSignInAlt /> Login
            </Link>
          </li>
          <li>
            <Link
              href="/register"
              className="link link-hover flex items-center gap-1"
            >
              <FaUserPlus /> Register
            </Link>
          </li>
        </>
      ) : (
        <>
          <li className="text-green-600 text-sm">Logged in as {user.email}</li>
          <li>
            <Link href="/dashboard" className="link link-hover">
              Dashboard
            </Link>
          </li>
        </>
      )}
    </ul>
  );
}
