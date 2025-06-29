"use client";
import React, { useState } from "react";
import { FiUser, FiSettings, FiShield } from "react-icons/fi";
import { CiViewList } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { IoIosColorPalette } from "react-icons/io";
import Sidebar from "./Sidebar";
import ProfileInformation from "./ProfileInformation";
import PersonalizationPage from "./PersonalizationPage";
import SecurityPage from "./SecurityPage";
import AdvancedAnalyticsPage from "./AdvancedAnalyticsPage";
import { SiSimpleanalytics } from "react-icons/si";
import GamelistPage from "./GamelistPage";
import Compare from "./Compare";
export default function ProfilePage({
  fetched_user,
  products,
  user_enquires,
  user,
}) {
  const [activeTab, setActiveTab] = useState("profile");

  const menuItems = [
    { id: "profile", label: "Profile Information", icon: FiUser },
    {
      id: "analytics",
      label: `Game Analytics`,
      icon: SiSimpleanalytics,
    },
    {
      id: "personalization",
      label: "Personalization",
      icon: IoIosColorPalette,
    },
    { id: "security", label: "Security & passwords", icon: FiShield },
    // { id: "compare", label: "Compare Performance", icon: IoCartOutline },
    { id: "game_list", label: "All games", icon: CiViewList },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileInformation user={user} />;
      case "analytics":
        return <AdvancedAnalyticsPage user={user} />;
      case "security":
        return <SecurityPage />;
      case "personalization":
        return <PersonalizationPage user={user} />;
      // case "compare":
      //   return <Compare user={user} />;
      case "game_list":
        return <GamelistPage user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto md:p-6 p-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <Sidebar
            menuItems={menuItems}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-base-100 border border-base-300 rounded-sm p-4">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
