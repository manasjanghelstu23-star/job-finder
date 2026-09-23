"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  PieChart,
  Lock,
  ChevronRight,
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  MessageCircle,
  Maximize,
  SlidersHorizontal,
  LogOut,
  X,
  UserCheck,
  CheckSquare,
  BookOpen,
  Award,
} from "lucide-react";
import { EduLearnLogo, SidebarStudentsGraphic } from "./dashboard/student-illustrations";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Continue to logout
    }
    router.push("/login");
  };

  const studentSections = [
    { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/student/documents", icon: FileText, badge: "3" },
    { name: "Opportunities", href: "/student/opportunities", icon: Briefcase },
    { name: "Communities", href: "/student/communities", icon: Users },
    { name: "Skill Assessment", href: "/student/skills", icon: CheckSquare },
    { name: "Learning", href: "/student/learning", icon: BookOpen },
    { name: "Portfolio Section", href: "/student/portfolio", icon: Award },
    { name: "Forms & Charts", href: "/student/assessments", icon: PieChart },
    { name: "Authentication", href: "/login", icon: Lock },
  ];

  return (
    <div className={`min-h-screen relative overflow-x-hidden font-sans transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-[#ebf4ef] text-slate-800"}`}>
      {/* Decorative Background Colorful Circles matching reference image */}
      <div className="fixed top-2 right-1/4 w-36 h-36 md:w-48 md:h-48 rounded-full bg-[#f8b825] opacity-90 -z-0 pointer-events-none transition-transform duration-700" />
      <div className="fixed -bottom-14 right-16 w-52 h-52 md:w-72 md:h-72 rounded-full bg-[#249658] opacity-90 -z-0 pointer-events-none" />
      <div className="fixed top-1/3 -left-16 w-32 h-32 md:w-44 md:h-44 rounded-full bg-[#e3683a] opacity-80 -z-0 pointer-events-none" />

      {/* Main EduLearn Card Frame */}
      <div className="relative z-10 m-2 sm:m-4 lg:m-6 rounded-[28px] md:rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row min-h-[94vh]">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <aside
          className={`fixed md:static top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
          }`}
        >
          {/* Logo Section & Navigation */}
          <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
            <div className="p-6 pb-4 flex items-center justify-between shrink-0">
              <Link href="/student/dashboard" className="flex items-center space-x-2.5 group">
                <EduLearnLogo className="w-8 h-8 transition-transform group-hover:scale-105" />
                <span className="text-2xl font-extrabold tracking-tight text-[#1e3a8a] dark:text-blue-400">
                  Edu<span className="text-[#0284c7]">Learn</span>
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Student Dashboard Navigation */}
            <div className="px-4 py-2 flex-1">
              <p className="px-3.5 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Student Dashboard
              </p>
              <div className="space-y-1">
                {studentSections.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/student/dashboard" && pathname.startsWith(item.href)) ||
                    (item.href === "/student/skills" && pathname.startsWith("/student/assessments"));
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-[#e8f1fd] text-[#1a73e8] font-semibold dark:bg-blue-950/60 dark:text-blue-400 shadow-xs"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-[#1a73e8] dark:text-blue-400"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                          }`}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shrink-0">
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight
                          className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                            isActive
                              ? "text-[#1a73e8] translate-x-0.5 opacity-100"
                              : "text-slate-300 dark:text-slate-600 opacity-60 group-hover:opacity-100"
                          }`}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Card: Best Education Admin Graphic */}
          <div className="p-4">
            <div className="bg-[#f0f7ff] dark:bg-slate-800/80 rounded-2xl p-3.5 text-center border border-blue-100/60 dark:border-slate-700/60">
              <div className="w-36 h-28 mx-auto flex items-center justify-center">
                <SidebarStudentsGraphic className="w-full h-full object-contain" />
              </div>
              <h5 className="text-xs font-bold text-[#1a73e8] dark:text-blue-400 mt-1">
                Best Education Admin
              </h5>
              <p className="text-[10px] text-slate-400 dark:text-slate-400 mt-0.5">
                Student & Mentor Portal
              </p>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="mt-2.5 flex items-center justify-center space-x-2 w-full py-2 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Right Main Body (Header + Content) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#fbfdfc] dark:bg-slate-900/60">
          {/* Top Header Bar */}
          <header className="h-16 px-4 md:px-8 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
            {/* Left: Hamburger & Search */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5 text-blue-600" />
              </button>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-44 sm:w-64 md:w-72 pl-4 pr-10 py-2 rounded-full text-xs bg-[#f4f7f9] dark:bg-slate-800 text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-transparent focus:border-blue-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Right: Actions & User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3.5">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-500" />}
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-blue-500" />
                  <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-3 z-50 text-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-100">Notifications</span>
                      <span className="text-[10px] text-blue-600 cursor-pointer">Mark all read</span>
                    </div>
                    <div className="py-2 space-y-2">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-slate-700/50 flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">New Course Alert</p>
                          <p className="text-slate-500 text-[11px]">UI/UX Design 2.0 module is now live.</p>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 flex items-start space-x-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">Study Session Invite</p>
                          <p className="text-slate-500 text-[11px]">Arjun invited you to Web Dev sprint.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Message Bubble */}
              <Link
                href="/student/communities"
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Messages"
              >
                <MessageCircle className="w-4 h-4 text-blue-500" />
              </Link>

              {/* Country Flag (US) */}
              <div className="hidden sm:flex items-center justify-center w-7 h-5 rounded-sm overflow-hidden shadow-2xs border border-slate-200/80" title="Language: English (US)">
                <svg viewBox="0 0 640 480" className="w-full h-full">
                  <path fill="#bd3d44" d="M0 0h640v480H0" />
                  <path stroke="#fff" strokeWidth="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 276.9h640M0 350.8h640M0 424.6h640" />
                  <path fill="#192f5d" d="M0 0h280v258.5H0z" />
                  <circle cx="140" cy="129" r="65" fill="#fff" opacity="0.3" />
                </svg>
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                className="hidden sm:flex p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4 text-blue-500" />
              </button>

              {/* User Profile Pill */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2.5 p-1 pl-2 sm:pl-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">Nil Yeager</p>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">ADMIN</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
                      <circle cx="20" cy="20" r="20" fill="#FEEBC8" />
                      <path d="M10 38C10 30 14 26 20 26C26 26 30 30 30 38Z" fill="#2B6CB0" />
                      <circle cx="20" cy="18" r="8" fill="#ED8936" />
                      <path d="M13 14C15 8 25 8 27 14Z" fill="#2D3748" />
                      <rect x="15" y="16" width="4" height="3" rx="1" stroke="#1A202C" strokeWidth="1.2" fill="none" />
                      <rect x="21" y="16" width="4" height="3" rx="1" stroke="#1A202C" strokeWidth="1.2" fill="none" />
                      <path d="M19 17.5H21" stroke="#1A202C" strokeWidth="1.2" />
                    </svg>
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Nil Yeager</p>
                      <p className="text-slate-400 text-[11px]">student@edulearn.org</p>
                    </div>
                    <Link
                      href="/student/portfolio"
                      className="flex items-center space-x-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Sliders / Filter icon */}
              <button
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Filters"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-500" />
              </button>
            </div>
          </header>

          {/* Child Page Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-7 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
