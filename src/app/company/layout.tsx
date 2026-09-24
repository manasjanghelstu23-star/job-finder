"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
  FileText,
  ExternalLink,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Sparkles,
  Award,
} from "lucide-react";
import { CampusBridgeLogo } from "../login/page";

const navItems = [
  { name: "Home Overview", tab: "home", href: "/company/dashboard?tab=home", icon: Building2 },
  { name: "Employees", tab: "employees", href: "/company/dashboard?tab=employees", icon: Users },
  { name: "Job Postings", tab: "job_postings", href: "/company/dashboard?tab=job_postings", icon: Briefcase },
  { name: "Applications", tab: "applications", href: "/company/dashboard?tab=applications", icon: FileText },
];

function CompanyHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    router.push("/login");
  };

  return (
    <header className="h-16 px-4 md:px-8 bg-white border-b border-slate-200/80 sticky top-0 z-40 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center space-x-3">
        <Link href="/company/dashboard" className="flex items-center">
          <CampusBridgeLogo className="w-7 h-7" />
        </Link>
      </div>

      {/* Center: Preview Role Switcher */}
      <div className="hidden lg:flex items-center space-x-2 bg-slate-100/80 p-1 rounded-full text-xs font-medium">
        <span className="text-slate-400 font-mono text-[11px] px-3">Preview as</span>
        <Link
          href="/student/dashboard"
          className="px-3 py-1 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
        >
          Student
        </Link>
        <Link
          href="/company/dashboard"
          className="px-3 py-1 rounded-full bg-white text-[#13664d] font-semibold shadow-2xs"
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

      {/* Right User & Notifications */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="w-2 h-2 rounded-full bg-[#13664d] absolute top-1.5 right-1.5" />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer"
          >
            <span className="text-xs font-semibold text-slate-800">Company Portal</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">Infosys Labs</p>
                <p className="text-slate-500 text-[11px]">recruiter@infosys.com</p>
              </div>
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
  );
}

function CompanySidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";

  return (
    <aside className="w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 shrink-0 min-h-[calc(100vh-64px)]">
      <div>
        <p className="font-mono text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase mb-4 px-2">
          COMPANY WORKSPACE
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === "/company/dashboard" && currentTab === item.tab;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[#e8f5f1] text-[#13664d]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#13664d]" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Verified Callout Card */}
      <div className="bg-[#e8f5f1] rounded-2xl p-4 border border-[#13664d]/20">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#13664d] mb-1">
          <ShieldCheck className="w-4 h-4 text-[#13664d]" />
          <span>Verified Partner</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed">
          Access direct campus hiring drives and verified skill scores.
        </p>
      </div>
    </aside>
  );
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f5] text-[#14231E] font-sans flex flex-col selection:bg-[#e8f5f1] selection:text-[#13664d]">
      <CompanyHeader />
      <div className="flex-1 flex">
        <Suspense fallback={<aside className="w-60 bg-white border-r border-slate-200/80" />}>
          <CompanySidebar />
        </Suspense>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading company workspace...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
