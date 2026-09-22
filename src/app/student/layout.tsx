"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Home, User, FileText, FolderGit2, Briefcase, BookOpen, Globe, Info, LogOut } from "lucide-react";

const navItems = [
  { name: "Home", href: "/student/dashboard", icon: Home },
  { name: "Skills", href: "/student/skills", icon: User },
  { name: "Documents", href: "/student/documents", icon: FileText },
  { name: "Projects", href: "/student/projects", icon: FolderGit2 },
  { name: "Opportunities", href: "/student/opportunities", icon: Briefcase },
  { name: "Learning", href: "/student/learning", icon: BookOpen },
  { name: "Portfolio", href: "/student/portfolio", icon: Globe },
  { name: "Communities", href: "/student/communities", icon: Globe },
  { name: "About", href: "/student/about", icon: Info },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600">Platform</h2>
          <p className="text-sm text-gray-500 mt-1">Student Portal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 rounded-lg hover:bg-red-50 transition-colors"
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
