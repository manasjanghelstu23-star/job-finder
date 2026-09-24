"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  Building2,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  Loader2,
  X,
  Sparkles,
  CheckCircle2,
  Users,
  ShieldCheck,
  School,
  ExternalLink,
} from "lucide-react";
import { StudentLoginIllustration } from "./student-login-illustration";
import { GoogleIcon, FacebookIcon, TwitterIcon, EmailBadgeIcon } from "./auth-icons";
import { TermsModal } from "./terms-modal";
import { EduLearnLogo } from "../student/dashboard/student-illustrations";
import InstituteLoginPage from "../institute/login/page";
import CompanyLoginPage from "../company/login/page";

// CampusBridge Editorial Brand Logo
export function CampusBridgeLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className="flex items-center space-x-2.5">
      <div className={`${className} rounded-lg bg-[#0F5132] flex items-center justify-center text-white font-bold text-sm shadow-xs select-none tracking-tight`}>
        C
      </div>
      <div className="flex items-center text-[18px] tracking-tight">
        <span className="font-extrabold text-[#14231E]">Campus</span>
        <span className="font-semibold text-[#52B788]">Bridge</span>
      </div>
    </div>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const portalParam = searchParams.get("portal") as "student" | "institute" | "company" | null;

  // Portal selection state: null = selection gateway screen, or 'student' | 'institute' | 'company'
  const [selectedPortal, setSelectedPortal] = useState<"student" | "institute" | "company" | null>(
    portalParam || null
  );

  useEffect(() => {
    if (portalParam) {
      setSelectedPortal(portalParam);
    }
  }, [portalParam]);

  // Student Login Form & View States
  const [formMode, setFormMode] = useState<"social" | "signup" | "signin">("social");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Signup States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Common UX States
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [studentToast, setStudentToast] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const showToast = (msg: string) => {
    setStudentToast(msg);
    setTimeout(() => setStudentToast(null), 3500);
  };

  // Real OAuth Sign-In Handler (Google, Facebook, Twitter)
  const handleStudentOAuth = async (provider: string) => {
    setError("");
    setOauthLoading(provider);
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    showToast(`Connecting to ${providerName} Single Sign-On...`);

    try {
      const res = await fetch(`/api/auth/oauth/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: "student" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Authenticated as ${data.user.name || "Student"}! Redirecting...`);
        setTimeout(() => {
          router.push(data.redirectUrl || "/student/dashboard");
        }, 500);
      } else {
        setError(data.error || `Failed to sign in with ${providerName}`);
        setOauthLoading(null);
      }
    } catch {
      setError("Network error while connecting to authentication service.");
      setOauthLoading(null);
    }
  };

  // Real Email Signup Handler
  const handleStudentSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: "STUDENT",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Student account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/student/dashboard");
        }, 600);
      } else {
        setError(data.error || "Failed to create account. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error occurred during registration. Please try again.");
      setLoading(false);
    }
  };

  // Real Email Login Handler
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const email = username.includes("@") ? username.trim() : `${username.trim()}@demo.com`;

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const role = data.user.role.toLowerCase();
        showToast(`Welcome back, ${data.user.name || "Student"}!`);
        setTimeout(() => {
          router.push(`/${role}/dashboard`);
        }, 500);
      } else {
        const data = await res.json();
        setError(data.error || "Invalid username or password");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Real 1-Click Demo Autofill
  const handleAutofill = async () => {
    setUsername("student@demo.com");
    setPassword("password123");
    setError("");
    setLoading(true);
    showToast("Signing in with demo student account...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "student@demo.com", password: "password123" }),
      });

      if (res.ok) {
        const data = await res.json();
        setTimeout(() => {
          router.push(`/${data.user.role.toLowerCase()}/dashboard`);
        }, 400);
      } else {
        const data = await res.json();
        setError(data.error || "Demo login failed");
        setLoading(false);
      }
    } catch {
      setError("An error occurred during demo login");
      setLoading(false);
    }
  };


  // ---------------------------------------------------------------------------
  // 1. IF INSTITUTE PORTAL SELECTED: RENDER INSTITUTE LOGIN (MYCAMPUSDAYS)
  // ---------------------------------------------------------------------------
  if (selectedPortal === "institute") {
    return (
      <div className="relative">
        {/* Floating return button to Portal Gateway */}
        <div className="absolute top-6 left-6 z-40">
          <button
            onClick={() => setSelectedPortal(null)}
            className="flex items-center space-x-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← All Portals</span>
          </button>
        </div>
        <InstituteLoginPage />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. IF COMPANY PORTAL SELECTED: RENDER COMPANY LOGIN
  // ---------------------------------------------------------------------------
  if (selectedPortal === "company") {
    return (
      <div className="relative">
        <div className="absolute top-6 right-6 sm:right-36 z-40">
          <button
            onClick={() => setSelectedPortal(null)}
            className="flex items-center space-x-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← All Portals</span>
          </button>
        </div>
        <CompanyLoginPage />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. IF STUDENT PORTAL SELECTED: RENDER CLEAN BASIC STUDENT LOGIN
  // ---------------------------------------------------------------------------
  if (selectedPortal === "student") {
    return (
      <div className="min-h-screen w-full bg-[#FAFAF7] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans relative text-slate-900">
        {/* Toast Alert */}
        {studentToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#14231E] text-white px-5 py-3 rounded-xl shadow-lg border border-[#0F5132]/40 flex items-center space-x-2.5 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{studentToast}</span>
          </div>
        )}

        {/* Top Header: Back to Portal Selection & Switcher */}
        <div className="absolute top-5 left-5 sm:left-10 z-30 flex items-center space-x-3">
          <button
            onClick={() => setSelectedPortal(null)}
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Portals</span>
          </button>
        </div>

        <div className="absolute top-5 right-5 sm:right-10 z-30 hidden sm:flex items-center space-x-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs shadow-xs">
          <span className="bg-[#0F5132] text-white font-semibold px-2.5 py-1 rounded-md">
            Student
          </span>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setSelectedPortal("institute")}
            className="text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            Institution
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setSelectedPortal("company")}
            className="text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            Company
          </button>
        </div>

        {/* Main Split Login Card */}
        <div className="w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col md:flex-row min-h-[600px]">
          {/* Left Column: Social & Email Login Form */}
          <div className="w-full md:w-1/2 p-7 sm:p-9 lg:p-10 flex flex-col justify-between z-10 bg-white text-slate-900">
            <div>
              {/* Branding */}
              <div className="mb-6">
                <CampusBridgeLogo className="w-7 h-7" />
              </div>

              <h1
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
              >
                {formMode === "signup" ? "Create an Account" : formMode === "signin" ? "Sign In to Workspace" : "Welcome to CampusBridge"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed mt-2 mb-6">
                {formMode === "signup"
                  ? "Enter your details below to create your student account and access courses."
                  : formMode === "signin"
                  ? "Enter your student credentials to log into your learning workspace."
                  : "Assess your skills, discover opportunities, and build a verified portfolio."}
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError("")} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* MODE 1: SIGNUP FORM */}
              {formMode === "signup" && (
                <form onSubmit={handleStudentSignup} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@university.edu"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        required
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat your password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-lg bg-[#0F5132] hover:bg-[#0A3622] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <span>Create Account</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setFormMode("social")}
                      className="text-[#0F5132] hover:underline cursor-pointer"
                    >
                      ← Back to all options
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode("signin")}
                      className="text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      Already have an account? Sign in
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 2: SIGNIN FORM */}
              {formMode === "signin" && (
                <form onSubmit={handleStudentLogin} className="space-y-4 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Student Username / Email</label>
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs focus-within:ring-2 focus-within:ring-[#0F5132] focus-within:border-[#0F5132]">
                      <input
                        type="text"
                        required
                        placeholder="student@demo.com or username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="flex items-center bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs relative focus-within:ring-2 focus-within:ring-[#0F5132] focus-within:border-[#0F5132]">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-xs pr-6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-lg bg-[#0F5132] hover:bg-[#0A3622] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-slate-500 hover:text-[#0F5132] cursor-pointer"
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode("social")}
                      className="text-[#0F5132] hover:underline cursor-pointer"
                    >
                      ← Other options
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 3: SOCIAL BUTTONS (Default UI) */}
              {formMode === "social" && (
                <div className="space-y-2.5">
                  {/* 1. Google */}
                  <button
                    onClick={() => handleStudentOAuth("google")}
                    disabled={Boolean(oauthLoading)}
                    className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 shadow-xs transition-colors flex items-center justify-center space-x-3 active:scale-[0.99] group disabled:opacity-60 cursor-pointer"
                  >
                    {oauthLoading === "google" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0F5132]" />
                    ) : (
                      <GoogleIcon className="w-4 h-4 transition-transform group-hover:scale-105" />
                    )}
                    <span>{oauthLoading === "google" ? "Connecting Google..." : "Continue with Google"}</span>
                  </button>

                  {/* 2. Facebook */}
                  <button
                    onClick={() => handleStudentOAuth("facebook")}
                    disabled={Boolean(oauthLoading)}
                    className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 shadow-xs transition-colors flex items-center justify-center space-x-3 active:scale-[0.99] group disabled:opacity-60 cursor-pointer"
                  >
                    {oauthLoading === "facebook" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0F5132]" />
                    ) : (
                      <FacebookIcon className="w-4 h-4 transition-transform group-hover:scale-105" />
                    )}
                    <span>{oauthLoading === "facebook" ? "Connecting Facebook..." : "Continue with Facebook"}</span>
                  </button>

                  {/* 3. Twitter */}
                  <button
                    onClick={() => handleStudentOAuth("twitter")}
                    disabled={Boolean(oauthLoading)}
                    className="w-full py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-300 shadow-xs transition-colors flex items-center justify-center space-x-3 active:scale-[0.99] group disabled:opacity-60 cursor-pointer"
                  >
                    {oauthLoading === "twitter" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#0F5132]" />
                    ) : (
                      <TwitterIcon className="w-4 h-4 transition-transform group-hover:scale-105" />
                    )}
                    <span>{oauthLoading === "twitter" ? "Connecting Twitter..." : "Continue with Twitter"}</span>
                  </button>

                  <div className="relative my-3 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <span className="relative bg-white px-2.5 text-[11px] text-slate-400 uppercase font-medium">Or</span>
                  </div>

                  {/* Sign in with Email & Password */}
                  <button
                    onClick={() => {
                      setError("");
                      setFormMode("signin");
                    }}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#14231E] hover:bg-black text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <EmailBadgeIcon className="w-4 h-4" />
                    <span>Sign in with Email & Password</span>
                  </button>

                  {/* Sign up */}
                  <button
                    onClick={() => {
                      setError("");
                      setFormMode("signup");
                    }}
                    className="w-full py-2 px-4 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Create a new student account</span>
                  </button>
                </div>
              )}
            </div>

            {/* Demo & Footer */}
            <div>
              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Demo: <strong className="text-slate-800 font-semibold">student@demo.com</strong></span>
                <button
                  type="button"
                  onClick={handleAutofill}
                  disabled={loading}
                  className="text-[#0F5132] underline font-semibold hover:text-[#0A3622] cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Auto-fill"}
                </button>
              </div>

              <div className="mt-3 pt-2 text-center">
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-[11px] text-slate-400 hover:text-slate-600 underline transition-colors cursor-pointer"
                >
                  Terms of Service & Privacy
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Light Product Highlights & Vector Illustration */}
          <div className="w-full md:w-1/2 bg-[#F6F7F3] border-t md:border-t-0 md:border-l border-slate-200 p-8 sm:p-10 lg:p-12 flex flex-col justify-between text-slate-900">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-[#E8F5E9] text-[#1B5E20] border border-[#0F5132]/20 text-xs font-semibold mb-3">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Learning Platform</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug"
                style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
              >
                Learn, assess skills & kickstart your career.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                Master verified skills, collaborate in Discord-style student communities, and unlock direct placement opportunities with top recruiters.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Verified skill assessments & benchmark scorecards</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Curated internship matches & campus hiring drives</span>
                </div>
                <div className="flex items-start space-x-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>Discord-style peer study channels & voice study rooms</span>
                </div>
              </div>
            </div>

            <div className="w-full mt-6 flex items-center justify-center">
              <StudentLoginIllustration className="w-full max-h-[260px] object-contain" />
            </div>
          </div>
        </div>

        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowForgotModal(false)} />
            <div className="relative bg-white rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-xl border border-slate-200 z-50 text-slate-900">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900">Reset Password</h4>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotSubmitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Check Your Inbox</p>
                  <p className="text-xs text-slate-600">
                    Password reset link has been dispatched to <span className="text-blue-600 font-semibold">{forgotEmail}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSubmitted(false);
                    }}
                    className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs mt-2 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSubmitted(true);
                  }}
                  className="mt-4 space-y-4 text-xs"
                >
                  <p className="text-slate-600">
                    Enter your student email address to receive password reset instructions.
                  </p>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="student@demo.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer transition-colors"
                    >
                      Send Link
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Terms of Service & Privacy Modal */}
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          portalType="student"
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 4. DEFAULT: CAMPUSBRIDGE PORTAL SELECTION (STUDENT, COMPANY, INSTITUTION)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#FAFAF7] text-slate-900 flex flex-col justify-between font-sans relative p-4 sm:p-8 lg:p-12 selection:bg-[#E8F5E9] selection:text-[#0F5132]">
      {/* TOP NAVBAR */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between pb-6 sm:pb-8">
        <CampusBridgeLogo className="w-8 h-8" />

        <div className="flex items-center text-xs text-slate-500 font-normal">
          <span>Already have access?</span>
          <button
            onClick={() => setSelectedPortal("student")}
            className="ml-1.5 font-semibold text-[#0F5132] hover:underline cursor-pointer transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* CENTER SECTION */}
      <main className="max-w-5xl w-full mx-auto py-6 sm:py-12 my-auto">
        {/* Eyebrow, Title & Subtitle */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#6C757D] uppercase font-semibold mb-3.5">
            ACADEMIA × INDUSTRY COLLABORATION
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-[58px] leading-[1.12] tracking-tight text-slate-900 font-normal"
            style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
          >
            Where do you belong <br />
            <span className="text-[#0F5132]" style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}>
              in the bridge?
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 font-normal max-w-md mx-auto">
            Choose your workspace to get a tailored CampusBridge experience.
          </p>
        </div>

        {/* 3 ROLE CARDS (Student, Company, Institution) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* 1. STUDENT */}
          <div
            onClick={() => setSelectedPortal("student")}
            className="bg-white rounded-[22px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5 text-[#2E7D32]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z" />
                  </svg>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>

              <p className="text-[10px] font-mono tracking-[0.2em] text-[#8C98A4] uppercase font-semibold mt-7 mb-2">
                LEARN · GROW · LAUNCH
              </p>
              <h2
                className="text-2xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
              >
                Student
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed min-h-[44px]">
                Assess your skills, discover opportunities, and build a verified portfolio.
              </p>
            </div>

            <div className="mt-8 pt-2 flex items-center text-xs font-semibold text-[#0F5132] group-hover:underline">
              <span>Enter as a student</span>
              <span className="ml-1 text-sm font-sans">→</span>
            </div>
          </div>

          {/* 2. COMPANY */}
          <div
            onClick={() => setSelectedPortal("company")}
            className="bg-white rounded-[22px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#EBF3FE] text-[#1A73E8] flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5 text-[#1A73E8]" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
              </div>

              <p className="text-[10px] font-mono tracking-[0.2em] text-[#8C98A4] uppercase font-semibold mt-7 mb-2">
                HIRE · TRAIN · COLLABORATE
              </p>
              <h2
                className="text-2xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
              >
                Company
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed min-h-[44px]">
                Find skill-matched talent and build meaningful campus connections.
              </p>
            </div>

            <div className="mt-8 pt-2 flex items-center text-xs font-semibold text-slate-600 group-hover:text-[#0F5132] group-hover:underline">
              <span>Enter as a company</span>
              <span className="ml-1 text-sm font-sans">→</span>
            </div>
          </div>

          {/* 3. INSTITUTION */}
          <div
            onClick={() => setSelectedPortal("institute")}
            className="bg-white rounded-[22px] p-6 sm:p-7 border border-[#0F5132]/35 shadow-[0_12px_36px_rgba(15,81,50,0.08)] ring-1 ring-[#0F5132]/25 hover:shadow-[0_16px_44px_rgba(15,81,50,0.13)] transition-all duration-300 flex flex-col justify-between group cursor-pointer min-h-[300px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#E8F5E9] text-[#1B5E20] flex items-center justify-center shadow-xs">
                  <svg className="w-5 h-5 text-[#2E7D32]" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="3" width="4.5" height="4.5" rx="1" />
                    <rect x="16.5" y="3" width="4.5" height="4.5" rx="1" />
                    <rect x="3" y="9.75" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="9.75" width="4.5" height="4.5" rx="1" />
                    <rect x="16.5" y="9.75" width="4.5" height="4.5" rx="1" />
                    <rect x="3" y="16.5" width="4.5" height="4.5" rx="1" />
                    <rect x="9.75" y="16.5" width="4.5" height="4.5" rx="1" />
                    <rect x="16.5" y="16.5" width="4.5" height="4.5" rx="1" />
                  </svg>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>

              <p className="text-[10px] font-mono tracking-[0.2em] text-[#8C98A4] uppercase font-semibold mt-7 mb-2">
                MEASURE · SUPPORT · PLACE
              </p>
              <h2
                className="text-2xl font-bold text-slate-900 mb-2"
                style={{ fontFamily: "'Newsreader', Georgia, 'Times New Roman', serif" }}
              >
                Institution
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed min-h-[44px]">
                Turn student skill and placement signals into better outcomes.
              </p>
            </div>

            <div className="mt-8 pt-2 flex items-center text-xs font-semibold text-[#0F5132] group-hover:underline">
              <span>Enter as an institution</span>
              <span className="ml-1 text-sm font-sans">→</span>
            </div>
          </div>
        </div>

        {/* QUICK TEST DEMO LOGINS BAR */}
        <div className="mt-8 pt-4 border-t border-slate-200/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[11px] font-mono text-slate-400">Quick Test Logins (password: password123):</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedPortal("student");
                setUsername("student@demo.com");
                setPassword("password123");
              }}
              className="px-2.5 py-1 rounded-md bg-[#E8F5E9] hover:bg-[#D4EDDA] text-[#1B5E20] text-[11px] font-medium transition-colors cursor-pointer"
            >
              🎓 Student (student@demo.com)
            </button>
            <button
              onClick={() => {
                setSelectedPortal("institute");
              }}
              className="px-2.5 py-1 rounded-md bg-[#E8F5E9] hover:bg-[#D4EDDA] text-[#1B5E20] text-[11px] font-medium transition-colors cursor-pointer"
            >
              🏛️ Institution (institute@demo.com)
            </button>
            <button
              onClick={() => {
                setSelectedPortal("company");
              }}
              className="px-2.5 py-1 rounded-md bg-[#EBF3FE] hover:bg-[#D9E7FD] text-[#1A73E8] text-[11px] font-medium transition-colors cursor-pointer"
            >
              🏢 Company (company@demo.com)
            </button>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="max-w-5xl w-full mx-auto pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#8C98A4]">
        <p>One connected ecosystem · Skills, opportunity and impact in one place</p>
        <p>Secure · Role-based · Built for collaboration</p>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600;6..72,700&display=swap"
      />
      <Suspense
        fallback={
          <div className="min-h-screen w-full bg-[#FAFAF7] flex items-center justify-center text-slate-600">
            <Loader2 className="w-8 h-8 animate-spin text-[#0F5132]" />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
    </>
  );
}
