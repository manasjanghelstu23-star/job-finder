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
import InstituteLoginPage from "../institute/login/page";
import CompanyLoginPage from "../company/login/page";

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
            className="flex items-center space-x-2 bg-black/50 hover:bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-full border border-white/20 transition-all shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Another Portal</span>
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
            className="flex items-center space-x-2 bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full border border-slate-700 transition-all shadow-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Select Another Portal</span>
          </button>
        </div>
        <CompanyLoginPage />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 3. IF STUDENT PORTAL SELECTED: RENDER PURPLE SPLIT-SCREEN STUDENT LOGIN
  // ---------------------------------------------------------------------------
  if (selectedPortal === "student") {
    return (
      <div className="min-h-screen w-full bg-[#0f0a1c] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans relative">
        {/* Toast Alert */}
        {studentToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#25103a] text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center space-x-2.5 text-xs animate-bounce">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span>{studentToast}</span>
          </div>
        )}

        {/* Top Header: Back to Portal Selection & Switcher */}
        <div className="absolute top-5 left-5 sm:left-10 z-30 flex items-center space-x-3">
          <button
            onClick={() => setSelectedPortal(null)}
            className="flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-800 px-3.5 py-2 rounded-full border border-slate-700/80 transition-all shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Portals</span>
          </button>
        </div>

        <div className="absolute top-5 right-5 sm:right-10 z-30 hidden sm:flex items-center space-x-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80 text-xs shadow-md">
          <span className="bg-purple-600 text-white font-bold px-2.5 py-1 rounded-full shadow-xs">
            Student
          </span>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => setSelectedPortal("institute")}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded-full transition-colors"
          >
            Institute
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => setSelectedPortal("company")}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded-full transition-colors"
          >
            Company
          </button>
        </div>

        {/* Main Split Login Card */}
        <div className="w-full max-w-5xl bg-[#18181c] rounded-[32px] sm:rounded-[40px] overflow-hidden shadow-[0_25px_70px_-15px_rgba(0,0,0,0.7)] border border-purple-900/30 flex flex-col md:flex-row min-h-[620px]">
          {/* Left Column: Social & Email Login Form matching design */}
          <div className="w-full md:w-1/2 p-7 sm:p-9 lg:p-10 flex flex-col justify-between z-10 bg-[#170e24] text-white relative overflow-hidden">
            {/* Subtle Top Ambient Glow matching screenshot */}
            <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/25 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {formMode === "signup" ? "Create Account" : formMode === "signin" ? "Sign In" : "Welcome"}
              </h1>
              <p className="text-xs text-slate-300 font-normal leading-relaxed mt-2.5 mb-6 px-1">
                {formMode === "signup"
                  ? "Enter your details to create your student account and access verified learning."
                  : formMode === "signin"
                  ? "Enter your student credentials to log into your workspace."
                  : "Access your student learning workspace to connect with peers, discover internship opportunities, and build your career portfolio."}
              </p>

              {error && (
                <div className="mb-4 p-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
                  <span>{error}</span>
                  <button onClick={() => setError("")} className="text-red-300 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* MODE 1: SIGNUP FORM */}
              {formMode === "signup" && (
                <form onSubmit={handleStudentSignup} className="space-y-3.5 text-left">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-[#25133c]/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@university.edu"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-[#25133c]/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        required
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="w-full bg-[#25133c]/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 pr-8"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat your password"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      className="w-full bg-[#25133c]/80 border border-purple-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-2xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        <span>CREATE ACCOUNT</span>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setFormMode("social")}
                      className="text-purple-300 hover:text-white underline cursor-pointer"
                    >
                      ← Back to all options
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode("signin")}
                      className="text-slate-300 hover:text-white font-semibold cursor-pointer"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Student Username / Email</label>
                    <div className="flex items-center bg-[#25133c]/80 border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs">
                      <input
                        type="text"
                        required
                        placeholder="student@demo.com or username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
                    <div className="flex items-center bg-[#25133c]/80 border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs pr-6"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold text-xs shadow-xl transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <span>LOGIN</span>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-slate-400 hover:text-purple-300 cursor-pointer"
                    >
                      Forgot Password ?
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormMode("social")}
                      className="text-purple-300 hover:text-white underline cursor-pointer"
                    >
                      ← Other options
                    </button>
                  </div>
                </form>
              )}

              {/* MODE 3: SOCIAL BUTTONS (Default UI matching screenshot) */}
              {formMode === "social" && (
                <div className="space-y-3">
                  {/* 1. Google */}
                  <button
                    onClick={() => handleStudentOAuth("google")}
                    disabled={Boolean(oauthLoading)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#2b1747] hover:bg-[#381e5c] text-white text-[13px] font-semibold border border-purple-500/20 shadow-md hover:shadow-purple-900/30 transition-all flex items-center justify-center space-x-3 active:scale-[0.99] group disabled:opacity-60 cursor-pointer"
                  >
                    {oauthLoading === "google" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <GoogleIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    )}
                    <span>{oauthLoading === "google" ? "Connecting Google..." : "Sign in with Google"}</span>
                  </button>

                  {/* 2. Facebook */}
                  <button
                    onClick={() => handleStudentOAuth("facebook")}
                    disabled={Boolean(oauthLoading)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#2b1747] hover:bg-[#381e5c] text-white text-[13px] font-semibold border border-purple-500/20 shadow-md hover:shadow-purple-900/30 transition-all flex items-center justify-center space-x-3 active:scale-[0.99] group disabled:opacity-60 cursor-pointer"
                  >
                    {oauthLoading === "facebook" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <FacebookIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    )}
                    <span>{oauthLoading === "facebook" ? "Connecting Facebook..." : "Sign in with Facebook"}</span>
                  </button>

                  {/* 3. Twitter */}
                  <button
                    onClick={() => handleStudentOAuth("twitter")}
                    disabled={Boolean(oauthLoading)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#2b1747] hover:bg-[#381e5c] text-white text-[13px] font-semibold border border-purple-500/20 shadow-md hover:shadow-purple-900/30 transition-all flex items-center justify-center space-x-3 active:scale-[0.99] group disabled:opacity-60 cursor-pointer"
                  >
                    {oauthLoading === "twitter" ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <TwitterIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    )}
                    <span>{oauthLoading === "twitter" ? "Connecting Twitter..." : "Sign in with Twitter"}</span>
                  </button>

                  {/* 4. Sign up with email */}
                  <button
                    onClick={() => {
                      setError("");
                      setFormMode("signup");
                    }}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#2b1747] hover:bg-[#381e5c] text-white text-[13px] font-semibold border border-purple-500/20 shadow-md hover:shadow-purple-900/30 transition-all flex items-center justify-center space-x-3 active:scale-[0.99] group cursor-pointer"
                  >
                    <EmailBadgeIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                    <span>Sign up with email</span>
                  </button>
                </div>
              )}
            </div>

            {/* Demo & Footer matching screenshot */}
            <div className="relative z-10">
              <div className="mt-5 pt-3.5 border-t border-purple-500/20 flex items-center justify-between text-xs text-slate-300">
                <span>Demo: student@demo.com</span>
                <button
                  type="button"
                  onClick={handleAutofill}
                  disabled={loading}
                  className="text-white underline font-semibold hover:text-purple-300 cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Autofill"}
                </button>
              </div>

              <div className="mt-4 pt-3.5 border-t border-purple-500/20">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>No account?</span>
                  <button
                    onClick={() => {
                      setError("");
                      setFormMode("signup");
                    }}
                    className="text-white font-bold hover:underline cursor-pointer"
                  >
                    Create account
                  </button>
                </div>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-[11px] text-slate-400 hover:text-white underline mt-3 block mx-auto transition-colors cursor-pointer"
                >
                  Terms of service
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Purple Welcome & Vector Illustration */}
          <div className="w-full md:w-1/2 bg-[#8657f6] p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome to<br />
                student portal
              </h2>
              <p className="text-xs sm:text-sm text-purple-100/90 mt-2.5 font-medium">
                Login to access your account
              </p>
            </div>

            <div className="relative z-10 w-full mt-4 flex items-end justify-center pointer-events-none select-none">
              <StudentLoginIllustration className="w-full max-h-[340px] object-contain drop-shadow-lg" />
            </div>
          </div>
        </div>


        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowForgotModal(false)} />
            <div className="relative bg-[#1c1c22] rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-slate-800 z-50 text-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-base font-bold text-white">Reset Password</h4>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSubmitted(false);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotSubmitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold text-white">Check Your Inbox</p>
                  <p className="text-xs text-slate-400">
                    Reset link has been dispatched to <span className="text-purple-400 font-semibold">{forgotEmail}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotModal(false);
                      setForgotSubmitted(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs mt-2"
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
                  <p className="text-slate-400">
                    Enter your student email address to receive password reset instructions.
                  </p>
                  <div>
                    <input
                      type="email"
                      required
                      placeholder="student@demo.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-3 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold transition-colors"
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
  // 4. DEFAULT: PORTAL SELECTION GATEWAY SCREEN (ASK STUDENT / INSTITUTE / COMPANY)
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen w-full bg-[#0d111c] text-slate-100 flex flex-col justify-between font-sans relative overflow-x-hidden p-4 sm:p-8 lg:p-12">
      {/* Decorative Background Lighting */}
      <div className="fixed -top-24 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-24 right-1/4 w-[500px] h-[500px] bg-emerald-600/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 -right-24 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="relative z-20 max-w-6xl w-full mx-auto flex items-center justify-between pb-6 sm:pb-10 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0d111c] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black tracking-tight text-white">Unified Platform Gateway</h3>
            <p className="text-xs text-slate-400">Education, Institutional Governance & Industry Placement</p>
          </div>
        </div>

        <Link
          href="/register"
          className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700/80 transition-all shadow-xs"
        >
          Create New Account
        </Link>
      </header>

      {/* CENTER GATEWAY: SELECT PORTAL */}
      <main className="relative z-20 max-w-6xl w-full mx-auto py-8 sm:py-12 my-auto">
        {/* Title & Prompt */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 mb-3">
            Authentication Gateway
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Select Your Portal
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-medium">
            Please select your role to proceed to your dedicated portal and customized login dashboard.
          </p>
        </div>

        {/* 3 PORTAL CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
          {/* =========================================
              CARD 1: STUDENT PORTAL (EduLearn)
             ========================================= */}
          <div
            onClick={() => setSelectedPortal("student")}
            className="group relative bg-[#131726]/90 hover:bg-[#181d30] border border-purple-500/30 hover:border-purple-500/70 rounded-3xl p-7 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)] flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
                  EduLearn
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
                Student Portal
              </h2>
              <p className="text-xs text-purple-300/80 font-semibold mt-1">For Students & Learners</p>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Access your learning courses, skill verifications, interactive friends connect, and internship applications.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 mt-5">
                {["EduLearn Dashboard", "Course Catalog", "Friends Connect", "Career Opportunities"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:text-white">
              <span>Enter Student Portal</span>
              <div className="w-8 h-8 rounded-full bg-purple-500/20 group-hover:bg-purple-600 text-purple-300 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* =========================================
              CARD 2: INSTITUTE PORTAL (MyCampusDays)
             ========================================= */}
          <div
            onClick={() => setSelectedPortal("institute")}
            className="group relative bg-[#131726]/90 hover:bg-[#181d30] border border-emerald-500/30 hover:border-emerald-500/70 rounded-3xl p-7 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <School className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  MyCampusDays
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                Institute Portal
              </h2>
              <p className="text-xs text-emerald-300/80 font-semibold mt-1">For Colleges & Universities</p>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Manage academic departments, benchmark student assessment performance, track cohorts, and oversee campus placement metrics.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 mt-5">
                {["Campus Hallway UI", "Student Benchmarks", "Cohort Analytics", "Accreditation"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-white">
              <span>Enter Institute Portal</span>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 group-hover:bg-emerald-600 text-emerald-300 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* =========================================
              CARD 3: COMPANY PORTAL (TalentRecruit)
             ========================================= */}
          <div
            onClick={() => setSelectedPortal("company")}
            className="group relative bg-[#131726]/90 hover:bg-[#181d30] border border-blue-500/30 hover:border-blue-500/70 rounded-3xl p-7 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] flex flex-col justify-between hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none" />

            <div>
              {/* Badge & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Briefcase className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                  TalentRecruit
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-blue-300 transition-colors">
                Company Portal
              </h2>
              <p className="text-xs text-blue-300/80 font-semibold mt-1">For Employers & Recruiters</p>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Publish internships & job postings, review skill-verified candidates, and hire top talent directly from partner institutions.
              </p>

              {/* Feature Tags */}
              <div className="flex flex-wrap gap-1.5 mt-5">
                {["Job Postings", "Skill Match Engine", "Candidate Review", "Internship Tracking"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-white">
              <span>Enter Company Portal</span>
              <div className="w-8 h-8 rounded-full bg-blue-500/20 group-hover:bg-blue-600 text-blue-300 group-hover:text-white flex items-center justify-center transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* DEMO ACCOUNTS QUICK-ACCESS BAR */}
        <div className="mt-12 bg-slate-900/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-slate-300">Quick Test Credentials (password: password123):</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedPortal("student");
                setUsername("student@demo.com");
                setPassword("password123");
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-colors font-medium"
            >
              🎓 Student (student@demo.com)
            </button>
            <button
              onClick={() => {
                setSelectedPortal("institute");
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-colors font-medium"
            >
              🏛️ Institute (institute@demo.com)
            </button>
            <button
              onClick={() => {
                setSelectedPortal("company");
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition-colors font-medium"
            >
              🏢 Company (company@demo.com)
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 max-w-6xl w-full mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <p>© 2026 Unified Education Platform. All portals interconnected.</p>
        <div className="flex items-center space-x-4">
          <span>Privacy Policy</span>
          <span>•</span>
          <span>Terms of Service</span>
          <span>•</span>
          <span>Support</span>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-[#0d111c] flex items-center justify-center text-white">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
