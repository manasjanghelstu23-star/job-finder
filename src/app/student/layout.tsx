"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Award,
  Users,
  BookOpen,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  HelpCircle,
  FileText,
} from "lucide-react";
import { CampusBridgeLogo } from "../login/page";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue to logout
    }
    router.push("/login");
  };

  const navItems = [
    { name: "Overview", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Skill assessment", href: "/student/skills", icon: CheckSquare },
    { name: "Opportunities", href: "/student/opportunities", icon: Briefcase },
    { name: "My portfolio", href: "/student/portfolio", icon: Award },
    { name: "Communities", href: "/student/communities", icon: Users },
    { name: "Learning", href: "/student/learning", icon: BookOpen },
    { name: "Documents", href: "/student/documents", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6f5] text-[#14231E] font-sans flex flex-col selection:bg-[#e8f5f1] selection:text-[#13664d]">
      {/* TOP HEADER BAR */}
      <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between">
        {/* Left: Hamburger (mobile) + Brand Logo */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/student/dashboard" className="flex items-center">
            <CampusBridgeLogo className="w-7 h-7" />
          </Link>
        </div>

        {/* Center: Preview Role Switcher */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-full text-xs font-medium">
          <span className="text-slate-400 font-mono text-[11px] px-3">Preview as</span>
          <Link
            href="/student/dashboard"
            className="px-3 py-1 rounded-full bg-white text-[#13664d] font-semibold shadow-2xs"
          >
            Student
          </Link>
          <Link
            href="/company/dashboard"
            className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
          >
            Company
          </Link>
          <Link
            href="/institute/dashboard"
            className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
          >
            Institution
          </Link>
          <Link
            href="/institute/dashboard"
            className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
          >
            Academician
          </Link>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center space-x-3">
          {/* Bell Icon */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-700" />
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center absolute -top-0.5 -right-0.5 border-2 border-white">
                1
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span className="text-[10px] text-[#13664d] font-semibold cursor-pointer">
                    Clear all
                  </span>
                </div>
                <div className="py-2 space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#e8f5f1] flex items-start space-x-2.5">
                    <Sparkles className="w-4 h-4 text-[#13664d] shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Skill Assessment Ready</p>
                      <p className="text-slate-600 text-[11px] mt-0.5">
                        Frontend React assessment recommendation unlocked.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
            >
              <span className="text-xs font-semibold text-slate-800">Student</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">Aarav Sharma</p>
                  <p className="text-slate-500 text-[11px]">aarav@northfield.edu</p>
                </div>
                <Link
                  href="/student/portfolio"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 hover:bg-slate-50"
                >
                  <Award className="w-3.5 h-3.5 text-[#13664d]" />
                  <span>My Portfolio</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full text-left px-3.5 py-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT BODY: SIDEBAR + CONTENT */}
      <div className="flex-1 flex min-h-[calc(100vh-64px)]">
        {/* Sidebar Backdrop (Mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR */}
        <aside
          className={`fixed md:static top-16 bottom-0 left-0 z-40 w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase mb-4 px-2">
              STUDENT WORKSPACE
            </p>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/student/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#e8f5f1] text-[#13664d]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-[#13664d]" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Callout Card */}
          <div className="bg-[#f4f6f5] rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#14231E] mb-1">
              <div className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                N
              </div>
              <span>Need guidance?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
              Your career mentor is ready to review your profile.
            </p>
            <Link
              href="/student/communities"
              className="text-xs font-semibold text-[#13664d] hover:underline flex items-center space-x-1"
            >
              <span>Ask a mentor</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* RIGHT MAIN PAGE CONTENT */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
