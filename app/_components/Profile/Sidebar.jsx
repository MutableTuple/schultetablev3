"use client";
import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";

export default function Sidebar({ menuItems, activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-30">
      {/* Mobile Toggle Button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn btn-sm btn-primary flex items-center gap-2"
        >
          <HiMenu className="text-lg" />
          {isOpen ? "Close Menu" : "Open Menu"}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-base-100 border border-base-300 rounded-sm p-4 space-y-2 
        ${isOpen ? "absolute top-12 left-0 w-64 shadow-lg" : "hidden"} 
        md:static md:block md:w-full`}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setIsOpen(false); // Close menu on mobile
            }}
            className={`flex items-center w-full text-left gap-3 px-3 py-2 rounded transition
              ${
                activeTab === item.id
                  ? "bg-base-300 text-base font-medium"
                  : "hover:bg-base-300 hover:text-base text-base-content/80"
              }`}
          >
            <item.icon className="text-lg" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
