"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, Database, PlusCircle, BarChart, FileText, LogOut } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/industry/dashboard", icon: Home },
  { name: "Question Bank", href: "/industry/questions", icon: Database },
  { name: "Create Question", href: "/industry/questions/create", icon: PlusCircle },
  { name: "Assessments", href: "/industry/assessments", icon: FileText },
  { name: "Analytics", href: "/industry/analytics", icon: BarChart },
];

export default function IndustryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Platform</h2>
          <p className="text-sm text-slate-400 mt-1">Industry Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
