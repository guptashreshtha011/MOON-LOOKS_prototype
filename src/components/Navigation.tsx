import React, { useState } from "react";
import { User } from "../types";
import { Moon, Compass, Calendar, FolderHeart, ShieldCheck, LogOut, User as UserIcon, Menu, X, Landmark, Compass as ProjectsIcon, Layers, FileText } from "lucide-react";

interface NavigationProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Navigation({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tabId: string, elementId?: string) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    if (elementId) {
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/60 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Identity / Logo */}
        <div 
          onClick={() => handleNavClick("portfolio")} 
          className="group flex cursor-pointer items-center space-x-2.5 select-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#6B2737] shadow-sm">
            <Moon className="h-5 w-5 text-[#FFFAE1] transition-transform duration-500 group-hover:rotate-180" />
            <div className="absolute inset-0 rounded-full border border-white/20 scale-90 animate-pulse" />
          </div>
          <div className="text-left">
            <h1 className="font-sans text-lg font-bold tracking-[0.25em] text-[#6B2737] leading-none mb-1">
              MOON LOOKS
            </h1>
            <p className="font-mono text-[7.5px] tracking-[0.3em] text-gray-500 uppercase font-bold">
              MODERN INTERIOR & ARCHITECTURE
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-1">
          <button
            onClick={() => handleNavClick("portfolio")}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "portfolio"
                ? "text-[#6B2737] bg-[#6B2737]/5"
                : "text-gray-600 hover:text-[#6B2737]"
            }`}
          >
            Home
          </button>

          <button
            onClick={() => handleNavClick("portfolio", "projects-section")}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg text-gray-600 hover:text-[#6B2737] transition-all"
          >
            Projects
          </button>

          <button
            onClick={() => handleNavClick("portfolio", "services-section")}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg text-gray-600 hover:text-[#6B2737] transition-all"
          >
            Services
          </button>

          <button
            onClick={() => handleNavClick("ai-assistant")}
            className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "ai-assistant"
                ? "text-[#6B2737] bg-[#6B2737]/5"
                : "text-gray-600 hover:text-[#6B2737]"
            }`}
          >
            Floor Plans
          </button>

          <button
            onClick={() => handleNavClick("portfolio", "about-section")}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg text-gray-600 hover:text-[#6B2737] transition-all"
          >
            About
          </button>

          <button
            onClick={() => handleNavClick("portfolio", "contact-section")}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg text-gray-600 hover:text-[#6B2737] transition-all"
          >
            Contact
          </button>

          {/* Direct Access to active workspace (Dashboard) */}
          <button
            onClick={() => handleNavClick("dashboard")}
            className={`flex items-center space-x-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === "dashboard"
                ? "text-[#6B2737] bg-[#6B2737]/5 font-bold"
                : "text-gray-600 hover:text-[#6B2737]"
            }`}
          >
            {currentUser?.role === "admin" ? (
              <ShieldCheck className="h-3.5 w-3.5 text-[#6B2737] shrink-0" />
            ) : (
              <FolderHeart className="h-3.5 w-3.5 text-[#6B2737] shrink-0" />
            )}
            <span>
              {currentUser?.role === "admin" ? "Studio Control" : "Client Portal"}
            </span>
          </button>
        </nav>

        {/* Actions panel right */}
        <div className="hidden xl:flex items-center space-x-4">
          <button
            onClick={() => handleNavClick("booking")}
            className={`rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all border shrink-0 ${
              activeTab === "booking"
                ? "bg-[#6B2737] border-[#6B2737] text-[#FFFAE1] shadow-md shadow-[#6B2737]/10"
                : "border-[#6B2737] bg-white text-[#6B2737] hover:bg-[#6B2737]/5"
            }`}
          >
            Book Consultation
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-4">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full pl-3 pr-2 py-1 select-none">
                <div className="text-right">
                  <div className="text-xs font-semibold text-gray-800 line-clamp-1 max-w-[100px]">{currentUser.name}</div>
                  <div className="font-mono text-[8px] tracking-wider text-amber-800 uppercase font-bold">
                    {currentUser.role}
                  </div>
                </div>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full border border-gray-200 object-cover"
                />
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="rounded-full border border-gray-200 p-2 text-gray-500 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1.5 rounded-full border border-[#6B2737] bg-[#6B2737] px-5 py-2.5 text-xs font-semibold tracking-wider text-[#FFFAE1] hover:bg-[#6B2737]/90 active:scale-95 transition-all cursor-pointer"
            >
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>LOG IN</span>
            </button>
          )}
        </div>

        {/* Tablet and Mobile Hamburger & Simple Account Links Menu */}
        <div className="flex xl:hidden items-center space-x-3">
          {currentUser && (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              onClick={() => handleNavClick("dashboard")}
              className="h-8 w-8 rounded-full border border-gray-200 object-cover cursor-pointer"
            />
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Slide-out Mobile Menu overlay */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200 px-6 py-6 space-y-4 animate-fade-in text-left">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick("portfolio")}
              className="w-full text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("portfolio", "projects-section")}
              className="w-full text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              Projects
            </button>
            <button
              onClick={() => handleNavClick("portfolio", "services-section")}
              className="w-full text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              Services
            </button>
            <button
              onClick={() => handleNavClick("ai-assistant")}
              className="w-full text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              Floor Plans
            </button>
            <button
              onClick={() => handleNavClick("portfolio", "about-section")}
              className="w-full text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              About Studio
            </button>
            <button
              onClick={() => handleNavClick("portfolio", "contact-section")}
              className="w-full text-left px-4 py-3 text-xs font-semibold uppercase text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100"
            >
              Contact Us
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <button
              onClick={() => handleNavClick("dashboard")}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase text-[#6B2737] bg-[#6B2737]/5 rounded-xl"
            >
              <span>{currentUser?.role === "admin" ? "Studio Control Console" : "Client Portal Dashboard"}</span>
              <FolderHeart className="h-4 w-4" />
            </button>

            <button
              onClick={() => handleNavClick("booking")}
              className="w-full text-center px-4 py-3.5 text-xs font-bold uppercase bg-[#6B2737] text-white rounded-xl shadow-sm"
            >
              Book Consultation
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <img src={currentUser.avatar} className="h-8 w-8 rounded-full object-cover" />
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-800">{currentUser.name}</div>
                    <div className="text-[9px] text-gray-400 font-mono font-bold uppercase">{currentUser.role}</div>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 uppercase"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full text-center px-4 py-3 text-xs font-bold uppercase border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Sign In / Login
              </button>
            )}
          </div>
        </div>
      )}

    </header>
  );
}
