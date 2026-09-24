"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  School,
  Users,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Check,
  CheckCircle2,
  X,
  BookOpen,
  LayoutGrid,
} from "lucide-react";
import { GoogleIcon } from "./auth-icons";
import { TermsModal } from "./terms-modal";

// CampusBridge Brand Logo
export function CampusBridgeLogo({
  className = "w-7 h-7",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-center space-x-2.5">
      <div
        className={`${className} rounded-lg ${
          dark ? "bg-white text-[#13664d]" : "bg-[#13664d] text-white"
        } flex items-center justify-center font-bold text-sm shadow-xs select-none tracking-tight`}
      >
        C
      </div>
      <div className="flex items-center text-[19px] tracking-tight">
        <span className={`font-extrabold ${dark ? "text-white" : "text-[#14231E]"}`}>
          Campus
        </span>
        <span className={`font-semibold ${dark ? "text-[#a7f3d0]" : "text-[#13664d]"}`}>
          Bridge
        </span>
      </div>
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalParam = searchParams.get("portal") as "student" | "institute" | "company" | null;

  // Selected role tab: "student" | "company" | "institute" | "academician"
  const [selectedRole, setSelectedRole] = useState<"student" | "company" | "institute" | "academician">(
    portalParam === "company" ? "company" : portalParam === "institute" ? "institute" : "student"
  );

  useEffect(() => {
    if (portalParam === "company") setSelectedRole("company");
    else if (portalParam === "institute") setSelectedRole("institute");
    else if (portalParam) setSelectedRole("student");
  }, [portalParam]);

  // Auth form states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("aarav@northfield.edu");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [fullName, setFullName] = useState("");

  // States
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const showNotification = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRoleSelect = (role: "student" | "company" | "institute" | "academician") => {
    setSelectedRole(role);
    if (role === "company") {
      setEmail("company@demo.com");
    } else if (role === "institute" || role === "academician") {
      setEmail("institute@demo.com");
    } else {
      setEmail("aarav@northfield.edu");
    }
  };

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setError("");
    setOauthLoading(true);
    showNotification("Connecting to Google Single Sign-On...");

    const targetDashboard =
      selectedRole === "company"
        ? "/company/dashboard"
        : selectedRole === "institute" || selectedRole === "academician"
        ? "/institute/dashboard"
        : "/student/dashboard";

    try {
      const res = await fetch(`/api/auth/oauth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: selectedRole }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showNotification(`Authenticated as ${data.user.name || "User"}! Redirecting...`);
        setTimeout(() => {
          router.push(targetDashboard);
        }, 500);
      } else {
        // Fallback for prototype preview
        showNotification(`Logged in as ${selectedRole}! Redirecting...`);
        setTimeout(() => {
          router.push(targetDashboard);
        }, 500);
      }
    } catch {
      setTimeout(() => {
        router.push(targetDashboard);
      }, 500);
    }
  };

  // Form Submit Handler (Email & Password)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loginEmail = email.trim() || (selectedRole === "company" ? "company@demo.com" : selectedRole === "institute" ? "institute@demo.com" : "student@demo.com");
    const loginPassword = password || "password123";
    const loginRole = selectedRole === "academician" ? "INSTITUTE" : selectedRole.toUpperCase();

    const target =
      selectedRole === "company"
        ? "/company/dashboard"
        : selectedRole === "institute" || selectedRole === "academician"
        ? "/institute/dashboard"
        : "/student/dashboard";

    if (isSignUp) {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fullName || "Aarav Sharma",
            email: loginEmail,
            password: loginPassword,
            role: loginRole,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showNotification("Account created successfully! Redirecting...");
          setTimeout(() => router.push(target), 500);
        } else {
          showNotification(`Account registered! Redirecting to ${selectedRole} workspace...`);
          setTimeout(() => router.push(target), 500);
        }
      } catch {
        setTimeout(() => router.push(target), 500);
      }
    } else {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: loginEmail, password: loginPassword, role: loginRole }),
        });

        if (res.ok) {
          const data = await res.json();
          showNotification(`Welcome back, ${data.user.name || "User"}!`);
          setTimeout(() => router.push(target), 400);
        } else {
          showNotification(`Logging into ${selectedRole} workspace...`);
          setTimeout(() => router.push(target), 400);
        }
      } catch {
        showNotification(`Logging into ${selectedRole} workspace...`);
        setTimeout(() => router.push(target), 400);
      }
    }
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case "company":
        return "Continue as Company";
      case "institute":
        return "Continue as Institution";
      case "academician":
        return "Continue as Academician";
      default:
        return "Continue as Student";
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row font-sans text-[#14231E]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#14231E] text-white px-5 py-3 rounded-xl shadow-xl border border-emerald-700/40 flex items-center space-x-2.5 text-xs animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#a7f3d0]" />
          <span>{toast}</span>
        </div>
      )}

      {/* LEFT COLUMN: BRAND & HERO (CampusBridge Green Background) */}
      <div className="w-full md:w-1/2 bg-[#13664d] text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden min-h-[420px] md:min-h-screen">
        {/* Subtle Background Decorative Concentric Arcs */}
        <div className="absolute -bottom-24 -right-24 w-[480px] h-[480px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[640px] h-[640px] rounded-full border border-white/10 pointer-events-none" />
        <div className="absolute -bottom-60 -right-60 w-[800px] h-[800px] rounded-full border border-white/5 pointer-events-none" />

        {/* Brand Header */}
        <div className="z-10">
          <CampusBridgeLogo className="w-8 h-8" dark />
        </div>

        {/* Hero Copy */}
        <div className="z-10 my-auto py-10 max-w-lg">
          {/* Sparkle Icon */}
          <div className="w-10 h-10 rounded-xl bg-[#1e7e62] flex items-center justify-center mb-6 text-[#a7f3d0]">
            <Sparkles className="w-5 h-5 fill-current" />
          </div>

          <p className="font-mono text-[11px] tracking-[0.25em] text-[#a7f3d0]/90 uppercase font-semibold mb-4">
            ACADEMIA × INDUSTRY
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-white tracking-tight mb-6">
            Shape your career with clarity.
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 font-light leading-relaxed max-w-md">
            Assess your skills, discover relevant opportunities, and build a verified portfolio.
          </p>
        </div>

        {/* Footer Tagline */}
        <div className="z-10 pt-6 border-t border-emerald-600/40 font-mono text-xs text-emerald-200/80 flex items-center space-x-2">
          <span>Industry demand</span>
          <span className="text-[#a7f3d0]">➔</span>
          <span>Skill growth</span>
          <span className="text-[#a7f3d0]">➔</span>
          <span>Real opportunity</span>
        </div>
      </div>

      {/* RIGHT COLUMN: WORKSPACE SIGN IN FORM (Clean Light Background) */}
      <div className="w-full md:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-between z-10 text-[#14231E]">
        <div className="max-w-md w-full mx-auto my-auto">
          {/* Section Eyebrow & Title */}
          <p className="font-mono text-[11px] tracking-[0.22em] text-slate-400 uppercase font-semibold mb-2">
            WELCOME TO CAMPUSBRIDGE
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#14231E] tracking-tight">
            {isSignUp ? "Create your workspace account" : "Sign in to your workspace"}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 mb-7 font-normal">
            Choose a role to preview the platform experience.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ROLE SELECTOR GRID (2x2) */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* 1. Student */}
            <button
              type="button"
              onClick={() => handleRoleSelect("student")}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[76px] cursor-pointer ${
                selectedRole === "student"
                  ? "bg-[#e8f5f1] border-[#13664d] ring-1 ring-[#13664d]/30"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-[#14231E] flex items-center space-x-1.5">
                  <Sparkles
                    className={`w-3.5 h-3.5 ${
                      selectedRole === "student" ? "text-[#13664d]" : "text-slate-400"
                    }`}
                  />
                  <span>Student</span>
                </span>
                {selectedRole === "student" && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#13664d] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 leading-tight">
                Learn and get matched
              </span>
            </button>

            {/* 2. Company */}
            <button
              type="button"
              onClick={() => handleRoleSelect("company")}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[76px] cursor-pointer ${
                selectedRole === "company"
                  ? "bg-[#e8f5f1] border-[#13664d] ring-1 ring-[#13664d]/30"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-[#14231E] flex items-center space-x-1.5">
                  <Building2
                    className={`w-3.5 h-3.5 ${
                      selectedRole === "company" ? "text-[#13664d]" : "text-slate-400"
                    }`}
                  />
                  <span>Company</span>
                </span>
                {selectedRole === "company" && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#13664d] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 leading-tight">
                Discover talent
              </span>
            </button>

            {/* 3. Institution */}
            <button
              type="button"
              onClick={() => handleRoleSelect("institute")}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[76px] cursor-pointer ${
                selectedRole === "institute"
                  ? "bg-[#e8f5f1] border-[#13664d] ring-1 ring-[#13664d]/30"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-[#14231E] flex items-center space-x-1.5">
                  <LayoutGrid
                    className={`w-3.5 h-3.5 ${
                      selectedRole === "institute" ? "text-[#13664d]" : "text-slate-400"
                    }`}
                  />
                  <span>Institution</span>
                </span>
                {selectedRole === "institute" && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#13664d] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 leading-tight">
                Track outcomes
              </span>
            </button>

            {/* 4. Academician */}
            <button
              type="button"
              onClick={() => handleRoleSelect("academician")}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[76px] cursor-pointer ${
                selectedRole === "academician"
                  ? "bg-[#e8f5f1] border-[#13664d] ring-1 ring-[#13664d]/30"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-xs font-semibold text-[#14231E] flex items-center space-x-1.5">
                  <BookOpen
                    className={`w-3.5 h-3.5 ${
                      selectedRole === "academician" ? "text-[#13664d]" : "text-slate-400"
                    }`}
                  />
                  <span>Academician</span>
                </span>
                {selectedRole === "academician" && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#13664d] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 leading-tight">
                Collaborate with industry
              </span>
            </button>
          </div>

          {/* SIGN IN FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#14231E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13664d] focus:border-[#13664d]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                placeholder="aarav@northfield.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#14231E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13664d] focus:border-[#13664d]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-[#14231E] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#13664d] focus:border-[#13664d] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center space-x-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-[#13664d] focus:ring-[#13664d]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => showNotification("Reset instructions sent to your email!")}
                  className="text-xs font-semibold text-[#13664d] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#13664d] hover:bg-[#0b4534] text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 active:scale-[0.99] shadow-sm disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>{isSignUp ? "Create Account" : `${getRoleTitle()} →`}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] text-slate-400 font-normal">
              or
            </span>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={oauthLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 transition-colors flex items-center justify-center space-x-2.5 disabled:opacity-60 cursor-pointer"
          >
            {oauthLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#13664d]" />
            ) : (
              <GoogleIcon className="w-4 h-4" />
            )}
            <span>Continue with Google</span>
          </button>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-6 text-center text-xs text-slate-600">
            <span>
              {isSignUp ? "Already have an account?" : "New to CampusBridge?"}{" "}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-[#13664d] hover:underline cursor-pointer"
            >
              {isSignUp ? "Sign in to your account" : "Create an account"}
            </button>
          </div>

          <p className="font-mono text-[11px] text-slate-400 text-center mt-3">
            Demo mode — no credentials are required.
          </p>
        </div>

        {/* Bottom corner logo pill mark */}
        <div className="pt-6 flex justify-start">
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-mono text-xs flex items-center justify-center font-bold">
            N
          </div>
        </div>
      </div>

      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        portalType="student"
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#13664d] flex items-center justify-center text-white font-sans text-sm">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading CampusBridge...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
