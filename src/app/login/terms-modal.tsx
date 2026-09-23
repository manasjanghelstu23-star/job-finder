"use client";

import React, { useState } from "react";
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  portalType?: "student" | "institute" | "company";
}

export function TermsModal({ isOpen, onClose, portalType = "student" }: TermsModalProps) {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy" | "security">("terms");

  if (!isOpen) return null;

  const titles = {
    student: {
      name: "Student Learning & Career Platform",
      role: "Student & Learner Terms",
    },
    institute: {
      name: "MyCampusDays Institutional Governance",
      role: "College & University Administration Terms",
    },
    company: {
      name: "TalentRecruit Corporate Hiring Portal",
      role: "Employer & Recruiter Enterprise Terms",
    },
  };

  const portalInfo = titles[portalType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-[#181126] border border-purple-500/30 rounded-3xl max-w-xl w-full shadow-2xl z-50 text-white overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-purple-500/20 flex items-center justify-between bg-gradient-to-r from-purple-950/60 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/25 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Terms of Service & Privacy</h3>
              <p className="text-xs text-purple-300/80 font-medium">{portalInfo.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-purple-900/30 text-purple-300 hover:text-white hover:bg-purple-800/40 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-2 flex space-x-2 border-b border-purple-500/10 text-xs font-semibold bg-black/20">
          <button
            onClick={() => setActiveTab("terms")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "terms"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-300/70 hover:text-white hover:bg-purple-500/10"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Terms of Use</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "privacy"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-300/70 hover:text-white hover:bg-purple-500/10"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
              activeTab === "security"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-purple-300/70 hover:text-white hover:bg-purple-500/10"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Data Security</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-normal">
          {activeTab === "terms" && (
            <div className="space-y-3.5">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">1. Acceptance of Terms</h4>
                <p>
                  By accessing or registering with {portalInfo.name}, you confirm that you are authorized to use this portal and agree to abide by all platform conduct policies and institutional guidelines.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">2. Role-Based Verification</h4>
                <p>
                  {portalType === "student" &&
                    "Student accounts are linked to accredited academic curricula and partner institutions. Verified credentials and skill scores are securely shared with vetted corporate employers for internship opportunities."}
                  {portalType === "institute" &&
                    "Institutional accounts allow authorized faculty and placement officers to review academic cohorts, track verified skills, manage student enrollment, and access placement analytics."}
                  {portalType === "company" &&
                    "Corporate accounts must comply with fair hiring standards, verified internship listings, and non-discriminatory recruitment guidelines when interacting with registered students."}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">3. Account Integrity & Security</h4>
                <p>
                  You are responsible for maintaining the confidentiality of your authentication credentials. Unauthorized sharing of credentials or credential scraping is strictly prohibited.
                </p>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-3.5">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">1. Information We Collect</h4>
                <p>
                  We store identity information (full name, email, authentication tokens) and academic or corporate metadata necessary for platform services, role verification, and secure access control.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">2. Third-Party OAuth Sign-In</h4>
                <p>
                  When utilizing Google, Facebook, or Twitter Single Sign-On, we authenticate identity securely through cryptographic tokens without storing external provider passwords.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">3. Candidate & Placement Privacy</h4>
                <p>
                  Student resumes and skill evaluations are only accessible to accredited campus administrators and verified partner companies. We never sell personal data to external advertisers.
                </p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-3.5">
              <div>
                <h4 className="font-bold text-white text-sm mb-1">1. Cryptographic Authentication</h4>
                <p>
                  All sessions are secured with JSON Web Tokens (JWT) signed using SHA-256 and stored in HTTP-Only, SameSite cookies to protect against Cross-Site Scripting (XSS).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-sm mb-1">2. Data Encryption</h4>
                <p>
                  User passwords are encrypted with bcrypt salt hashing. All API data communication is encrypted using TLS 1.3 in production environments.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/20 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-purple-200">
                  FERPA and GDPR compliant data governance practices are enforced across all student records and institutional benchmarks.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-purple-500/20 bg-black/40 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">Last updated: September 2026</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
}
