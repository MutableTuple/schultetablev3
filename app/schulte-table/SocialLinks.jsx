import Link from "next/link";
import React from "react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function SocialLinks() {
  return (
    <div className="flex gap-4 text-xl mt-2">
      <Link
        href="https://twitter.com/yourhandle"
        target="_blank"
        className="link link-hover"
      >
        <FaTwitter />
      </Link>
      <Link
        href="https://instagram.com/yourhandle"
        target="_blank"
        className="link link-hover"
      >
        <FaInstagram />
      </Link>
      <Link
        href="https://youtube.com/yourhandle"
        target="_blank"
        className="link link-hover"
      >
        <FaYoutube />
      </Link>
    </div>
  );
}
