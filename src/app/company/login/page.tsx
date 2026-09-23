"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  X,
  Sparkles,
  ArrowLeft,
  Building2,
  Check,
} from "lucide-react";
import { CompanyMeetingIllustration } from "./company-meeting-illustration";
import { GoogleIcon, FacebookIcon, TwitterIcon, EmailBadgeIcon } from "@/app/login/auth-icons";
import { TermsModal } from "@/app/login/terms-modal";

export default function CompanyLoginPage() {
  const router = useRouter();

  // Mode: "social" (matching screenshot), "signup", "signin"
  const [formMode, setFormMode] = useState<"social" | "signup" | "signin">("social");

  // Signin States
  const [username, setUsername] = useState("company@demo.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  // Signup States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  // Common UX States
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Real OAuth Sign-In Handler (Google, Facebook, Twitter)
  const handleSocialAuth = async (provider: string) => {
    setError("");
    setOauthLoading(provider);
    const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
    showToast(`Redirecting to corporate Single Sign-On via ${providerName}...`);

    try {
      const res = await fetch(`/api/auth/oauth/${provider.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: "company" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Authenticated as ${data.user.name || "Company"}! Redirecting...`);
        setTimeout(() => {
          router.push(data.redirectUrl || "/company/dashboard");
        }, 500);
      } else {
        setError(data.error || `Failed to sign in with ${providerName}`);
        setOauthLoading(null);
      }
    } catch {
      setError("Network error connecting to corporate authentication.");
      setOauthLoading(null);
    }
  };

  // Real Email Signup Handler
  const handleCompanySignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (signupPassword !== signupConfirmPassword) {
      setError("Passwords do not match. Please verify.");
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
          role: "COMPANY",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Company recruiter account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/company/dashboard");
        }, 600);
      } else {
        setError(data.error || "Failed to create company account.");
        setLoading(false);
      }
    } catch {
      setError("Network error occurred during registration. Please try again.");
      setLoading(false);
    }
  };

  // Real Email Login Handler
  const handleLogin = async (e: React.FormEvent) => {
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
        showToast(`Welcome back, ${data.user.name || "Recruiter"}!`);
        setTimeout(() => {
          router.push(`/${role}/dashboard`);
        }, 500);
      } else {
        const data = await res.json();
        setError(data.error || "Invalid company login credentials");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  // Real 1-Click Demo Autofill
  const handleAutofill = async () => {
    setUsername("company@demo.com");
    setPassword("password123");
    setError("");
    setLoading(true);
    showToast("Signing in with demo corporate account...");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "company@demo.com", password: "password123" }),
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

  return (
    <div className="relative min-h-screen w-full bg-[#1b082c] font-sans flex flex-col justify-between overflow-x-hidden text-white">
      {/* Background Illustration & Ambient Scene */}
      <div className="absolute inset-0 z-0">
        <CompanyMeetingIllustration className="w-full h-full object-cover object-left" />
      </div>

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#250a3b]/40 to-[#190729]/80 pointer-events-none" />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2d1247] text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center space-x-2.5 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Corporate branding & Portal switcher */}
      <header className="relative z-20 px-6 sm:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-white text-sm font-bold tracking-tight">TalentRecruit</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase">
            Company
          </span>
        </div>

        {/* Back to Portal Gateway */}
        <Link
          href="/login"
          className="flex items-center space-x-1.5 bg-black/40 hover:bg-black/60 backdrop-blur-md text-white/90 hover:text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/20 transition-all shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Portals</span>
        </Link>
      </header>

      {/* MAIN BODY: Glassmorphic Welcome Card on Right Side */}
      <main className="relative z-20 px-6 sm:px-12 lg:px-20 py-6 flex-1 flex items-center justify-end">
        <div className="w-full max-w-sm sm:max-w-md bg-white/20 backdrop-blur-2xl border border-white/30 rounded-[32px] p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] text-center text-white relative overflow-hidden">
          {/* Subtle Top Ambient Glow matching screenshot */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-64 h-32 bg-purple-500/25 rounded-full blur-2xl pointer-events-none" />

          {/* Headline */}
          <h1 className="relative z-10 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome
          </h1>

          {/* Subtitle / Description */}
          <p className="relative z-10 text-xs text-white/80 font-normal leading-relaxed mt-2.5 mb-6 px-1">
            Access your corporate recruiting workspace to discover verified candidates, evaluate skill benchmarks, and hire top student talent.
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-2.5 rounded-xl bg-red-500/25 border border-red-500/40 text-white text-xs flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-white/80 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* MODE 1: SIGNUP FORM */}
          {formMode === "signup" && (
            <form onSubmit={handleCompanySignup} className="space-y-3.5 text-left relative z-10">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Company Name / Recruiter Name
                </label>
                <div className="flex items-center bg-[#240e36]/70 border border-white/30 rounded-xl px-3 py-2 text-xs">
                  <Building2 className="w-4 h-4 text-purple-300 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Corp or Jane Doe (Talent Lead)"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">
                  Corporate Work Email
                </label>
                <div className="flex items-center bg-[#240e36]/70 border border-white/30 rounded-xl px-3 py-2 text-xs">
                  <Mail className="w-4 h-4 text-purple-300 mr-2 flex-shrink-0" />
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">Password</label>
                <div className="flex items-center bg-[#240e36]/70 border border-white/30 rounded-xl px-3 py-2 text-xs relative">
                  <Lock className="w-4 h-4 text-purple-300 mr-2 flex-shrink-0" />
                  <input
                    type={showSignupPassword ? "text" : "password"}
                    required
                    placeholder="Min 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs pr-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="text-white/70 hover:text-white"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={signupConfirmPassword}
                  onChange={(e) => setSignupConfirmPassword(e.target.value)}
                  className="w-full bg-[#240e36]/70 border border-white/30 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#2e1248] hover:bg-[#3d185f] text-white font-bold text-xs shadow-xl border border-white/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>CREATE COMPANY ACCOUNT</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setFormMode("social")}
                  className="text-white/80 hover:text-white underline cursor-pointer"
                >
                  ← Back to options
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode("signin")}
                  className="text-white font-semibold hover:underline cursor-pointer"
                >
                  Already registered? Sign in
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: SIGNIN FORM */}
          {formMode === "signin" && (
            <form onSubmit={handleLogin} className="space-y-4 text-left relative z-10">
              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">Work Email</label>
                <div className="flex items-center bg-[#240e36]/70 border border-white/30 rounded-xl px-3 py-2 text-xs">
                  <Mail className="w-4 h-4 text-purple-300 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    required
                    placeholder="company@demo.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/90 mb-1">Password</label>
                <div className="flex items-center bg-[#240e36]/70 border border-white/30 rounded-xl px-3 py-2 text-xs relative">
                  <Lock className="w-4 h-4 text-purple-300 mr-2 flex-shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-xs pr-6"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-white/70 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#2e1248] hover:bg-[#3d185f] text-white font-bold text-xs shadow-xl border border-white/20 transition-all flex items-center justify-center space-x-2 active:scale-[0.99] cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>SIGN IN WITH EMAIL</span>
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-white/80 hover:text-white cursor-pointer"
                >
                  Forgot Password ?
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode("social")}
                  className="text-white/80 hover:text-white underline cursor-pointer"
                >
                  ← Other options
                </button>
              </div>
            </form>
          )}

          {/* MODE 3: SOCIAL SIGN-IN BUTTONS (Default matching screenshot) */}
          {formMode === "social" && (
            <div className="space-y-3 relative z-10">
              {/* 1. Google */}
              <button
                onClick={() => handleSocialAuth("google")}
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
                onClick={() => handleSocialAuth("facebook")}
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
                onClick={() => handleSocialAuth("twitter")}
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

          {/* Quick Demo Autofill helper */}
          <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70 relative z-10">
            <span>Demo: company@demo.com</span>
            <button
              type="button"
              onClick={handleAutofill}
              disabled={loading}
              className="text-white underline font-semibold hover:text-purple-200 cursor-pointer disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Autofill"}
            </button>
          </div>

          {/* Bottom Card Footer: No account? Create account / Terms of service */}
          <div className="mt-5 pt-3 border-t border-white/15 relative z-10">
            <div className="flex items-center justify-between text-xs text-white/80">
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
              className="text-[11px] text-white/60 hover:text-white underline mt-3 block mx-auto transition-colors cursor-pointer"
            >
              Terms of service
            </button>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 px-6 sm:px-12 py-3 text-center text-xs text-white/50">
        © 2026 TalentRecruit Corporate Hiring Platform.
      </footer>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setShowForgotModal(false)} />
          <div className="relative bg-[#250a3b] border border-white/20 rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl z-50 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-base font-bold text-white">Reset Company Password</h4>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSubmitted(false);
                }}
                className="p-1 rounded-lg text-white/60 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-white">Reset Link Dispatched</p>
                <p className="text-xs text-white/70">
                  Password recovery instructions have been sent to <span className="text-purple-300 font-semibold">{forgotEmail}</span>.
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
                <p className="text-white/70">
                  Enter your corporate recruiter email to receive password reset instructions.
                </p>
                <div>
                  <input
                    type="email"
                    required
                    placeholder="recruiter@company.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 rounded-xl text-white/70 hover:text-white font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold transition-colors"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE & PRIVACY MODAL */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        portalType="company"
      />
    </div>
  );
}
