"use client";

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/app/_lib/supabase";
import { MdClose, MdChat } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow, formatDistanceToNowStrict } from "date-fns";
import { formatMicroTime } from "@/app/_utils/formatMicroTime";

export default function ChatBox({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const chatUsers = Array.from(
    new Map(
      messages.map((msg) => [
        msg.user,
        { id: msg.user, username: msg.username },
      ])
    ).values()
  );

  // Check screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch and subscribe to messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (data) setMessages(data);
    };

    fetchMessages();

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          setShowTooltip(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Click outside to close chat
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && chatRef.current && !chatRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || !user?.[0]) return;

    await supabase.from("messages").insert({
      user: user[0].id,
      username: user[0]?.username || user[0]?.email || "Anonymous",
      content: input.trim(),
    });

    setInput("");
  };

  const latestMessage = messages[messages.length - 1];

  return (
    <>
      {/* Floating Tooltip + Button */}
      {!isOpen && (
        <div
          className={`fixed z-50 ${
            isMobile
              ? "bottom-4 left-1/2 -translate-x-1/2 flex items-center "
              : "top-72 flex gap-2 left-4 flex-row-reverse"
          }`}
        >
          {/* Tooltip pill */}
          <AnimatePresence>
            {latestMessage && showTooltip && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsOpen(true)}
                className="cursor-pointer border border-base-300  shadow-md rounded-full px-4 py-2 flex items-center max-w-xs overflow-hidden"
              >
                <div className="truncate max-w-[180px] text-sm">
                  <span className="font-bold text-primary">
                    {latestMessage.username}
                  </span>
                  {": "}
                  <span className="truncate">{latestMessage.content}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTooltip(false);
                  }}
                  className="ml-2 text-xs text-error font-bold hover:text-red-500"
                >
                  ×
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chat open button */}
          <button
            className="btn btn-primary btn-circle btn-sm shadow-xl"
            onClick={() => setIsOpen(true)}
            aria-label="Open Chat"
          >
            <MdChat size={20} />
          </button>
        </div>
      )}

      {/* Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-box"
            initial={{
              y: isMobile ? "100%" : 0,
              x: isMobile ? "-50%" : "-100%",
            }}
            animate={{ y: 0, x: 0 }}
            exit={{ y: isMobile ? "100%" : 0, x: isMobile ? "-50%" : "-100%" }}
            transition={{ duration: 0.3 }}
            ref={chatRef}
            className={`fixed z-[500] ${
              isMobile
                ? "left-1/2 bottom-0 w-full max-w-sm translate-x-[-50%] h-[60%] rounded-t-xl border-t"
                : "top-0 left-0 bottom-0 w-full sm:w-[22rem] border-r"
            } bg-base-100 shadow-xl border-base-300 flex flex-col`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <h2 className="text-lg font-bold">Global Chat</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
                aria-label="Close"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-sm">
              {messages.map((msg, idx) => {
                const contentWithMentions = msg.content
                  .split(/(@\w+)/g)
                  .map((part, i) =>
                    part.startsWith("@") ? (
                      <span key={i} className="text-accent font-semibold">
                        {part}
                      </span>
                    ) : (
                      part
                    )
                  );

                return (
                  <div
                    key={idx}
                    className="break-words flex items-center gap-1"
                  >
                    <span className="font-semibold text-primary flex items-center gap-0.5">
                      {msg.username}:
                    </span>{" "}
                    {contentWithMentions}
                    <div className="text-xs opacity-40">
                      {formatMicroTime(new Date(msg.created_at))}
                    </div>
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="border-t border-base-100 bg-base-200 p-3 flex flex-col gap-2 relative"
            >
              {" "}
              {suggestions.length > 0 && (
                <ul className="absolute bottom-full mb-2 bg-base-100 border border-base-300 shadow-md rounded-box w-full z-50 max-h-48 overflow-y-auto">
                  {suggestions.map((user) => (
                    <li
                      key={user.id}
                      className="p-2 cursor-pointer hover:bg-base-200"
                      onClick={() => {
                        const updated = input.replace(
                          /@(\w*)$/,
                          `@${user.username} `
                        );
                        setInput(updated);
                        setSuggestions([]);
                        setMentionQuery("");
                      }}
                    >
                      @{user.username}
                    </li>
                  ))}
                </ul>
              )}
              <input
                value={input}
                onChange={(e) => {
                  const val = e.target.value;
                  setInput(val);

                  const atMatch = val.match(/@(\w*)$/);
                  if (atMatch) {
                    const search = atMatch[1].toLowerCase();
                    const filtered = chatUsers.filter((u) =>
                      u.username.toLowerCase().startsWith(search)
                    );
                    setSuggestions(filtered.slice(0, 5)); // Limit results
                    setMentionQuery(search);
                  } else {
                    setSuggestions([]);
                    setMentionQuery("");
                  }
                }}
                placeholder={user ? "Type your message..." : "Login to chat"}
                className="input input-sm input-bordered w-full"
                disabled={!user}
              />
              <button
                type="submit"
                className="btn btn-sm btn-primary"
                disabled={!user || !input.trim()}
              >
                Send
              </button>
            </form>

            {!user && (
              <div className="p-3 text-center text-sm text-gray-500">
                <Link href="/auth/login" className="text-blue-500 ">
                  Login to chat
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
