"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { 
  Building2, 
  Briefcase, 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  FileText, 
  Layers, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";

// The 4 Core Employer Management Sections requested:
// 1. Home
// 2. Employees
// 3. Job Postings
// 4. Applications
const navItems = [
  { name: "Home", tab: "home", href: "/company/dashboard?tab=home", icon: Building2 },
  { name: "Employees", tab: "employees", href: "/company/dashboard?tab=employees", icon: Users },
  { name: "Job Postings", tab: "job_postings", href: "/company/dashboard?tab=job_postings", icon: Briefcase },
  { name: "Applications", tab: "applications", href: "/company/dashboard?tab=applications", icon: FileText },
];

function CompanySidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "home";

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <aside className="w-64 bg-[#0a192f] text-slate-100 flex flex-col shadow-xl z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white leading-tight">Company Portal</h2>
            <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified Employer</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 mb-2">
          Employer Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === "/company/dashboard" && currentTab === item.tab;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" 
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-800/60">
          <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider px-3 mb-2">
            Cross Navigation
          </div>
          <Link
            href="/student/opportunities"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all"
          >
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-4 h-4 text-purple-400" />
              <span>Live Student Feed</span>
            </div>
            <span className="text-[9px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded font-mono">View</span>
          </Link>
        </div>
      </nav>

      {/* User / Sign Out Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3.5 py-2.5 w-full text-left text-xs font-bold text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Suspense fallback={<aside className="w-64 bg-[#0a192f] text-slate-100 flex flex-col shadow-xl z-20" />}>
        <CompanySidebar />
      </Suspense>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <Suspense fallback={<div className="p-8 text-center text-xs text-gray-500">Loading company module...</div>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
