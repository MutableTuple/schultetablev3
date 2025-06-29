"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosPaper } from "react-icons/io";
import {
  MdMenu,
  MdClose,
  MdLeaderboard,
  MdArticle,
  MdHome,
} from "react-icons/md";
import { FaRegCircleQuestion, FaXTwitter } from "react-icons/fa6";
export default function FloatingMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const buttons = [
    { icon: <IoIosPaper size={18} />, href: "/blogs", label: "Blogs" },
    // {
    //   icon: <MdLeaderboard size={18} />,
    //   href: "/leaderboard",
    //   label: "Leaderboard",
    // },
    {
      icon: <FaRegCircleQuestion size={18} />,
      href: "/how-to-play-schulte-table",
      label: "How to play",
    },
    {
      icon: <FaXTwitter size={18} />,
      href: "https://x.com/schultetableofc",
      label: "follow us on X",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="fixed bottom-8 left-6 z-50">
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence>
          {open &&
            buttons.map((btn, i) => (
              <motion.div
                key={btn.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <div className="tooltip tooltip-right" data-tip={btn.label}>
                  <Link href={btn.href} passHref target="_blank">
                    <button
                      className="btn btn-sm btn-circle bg-base-100 shadow-md hover:scale-110 transition"
                      aria-label={btn.label}
                    >
                      {btn.icon}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.div
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          className="tooltip tooltip-right"
          data-tip="Menu"
        >
          <button
            className="btn btn-secondary btn-circle shadow-lg"
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
