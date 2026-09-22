"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  Building, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  Download, 
  Share2, 
  Code2, 
  UserCheck, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  FileBadge,
  FileCheck
} from "lucide-react";

export default function StudentPortfolioPage() {
  const [activeInternship, setActiveInternship] = useState<any | null>(null);
  const [verifiedSkills, setVerifiedSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // 1. Fetch Active / Completed Internship
    fetch("/api/internships/active")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.internship) {
          setActiveInternship(data.internship);
        }
      })
      .catch(() => {});

    // 2. Fetch Student Verified Skills
    fetch("/api/students/me/skills")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVerifiedSkills(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      
      {/* Top Banner / Verification Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-start space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0c2340] to-blue-700 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              AS
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#0c2340]">Arjun Sharma</h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  Verified Portfolio
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-600">
                Software Development Intern & Systems Engineer • Final Year CSE, IIT Bombay
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1 font-medium">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  Bangalore / Mumbai, India
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <GraduationCap className="w-3.5 h-3.5 mr-1 text-gray-400" />
                  Batch of 2026 (CGPA: 9.1)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleCopyLink}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center shadow-xs cursor-pointer"
            >
              <Share2 className="w-4 h-4 mr-1.5" />
              <span>{copiedLink ? "Link Copied!" : "Share Profile"}</span>
            </button>
            <Link
              href="/student/opportunities"
              className="bg-[#0c2340] hover:bg-[#1a365d] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center shadow-sm cursor-pointer"
            >
              <span>Explore Roles</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        {/* The Verified Skill Equation Formula */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2">
            Skill Trust Architecture
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-200/60">
            <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">1. Coding Assessments</span>
            <span className="text-gray-400">+</span>
            <span className="bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md">2. Resume Analysis</span>
            <span className="text-gray-400">+</span>
            <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md">3. Code Projects</span>
            <span className="text-gray-400">+</span>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">4. Industry Internship</span>
            <span className="text-gray-400">=</span>
            <span className="bg-emerald-600 text-white px-3 py-1 rounded-md shadow-xs">
              Verified Student Skill Profile
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Main Portfolio Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left (8 cols): Verified Internship Experience & Completion Certificate */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Section 1: Verified Internship Experience */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                  <Briefcase className="w-4 h-4" />
                  <span>Work Experience</span>
                </div>
                <h3 className="text-xl font-black text-[#0c2340]">Verified Industry Internships</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Company Authenticated
              </span>
            </div>

            {activeInternship ? (
              <div className="p-6 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-5 hover:border-gray-300 transition-all">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{activeInternship.roleTitle}</h4>
                    <div className="text-xs font-bold text-blue-700 mt-0.5 flex items-center space-x-2">
                      <span>{activeInternship.company}</span>
                      <span>•</span>
                      <span>{activeInternship.location}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-lg">
                    {activeInternship.duration || "8 Weeks"}
                  </span>
                </div>

                {/* Progress or Completion Metric */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-200/70 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Overall Deliverables</span>
                    <span className="text-base font-extrabold text-[#0c2340]">{Math.round(activeInternship.overallProgress)}% Complete</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Mentor Rating</span>
                    <span className="text-base font-extrabold text-emerald-600">
                      {activeInternship.completionRecord?.finalRating || "4.3"} / 5.0
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Assigned Mentor</span>
                    <span className="text-xs font-bold text-gray-800 truncate block mt-0.5">{activeInternship.mentorName}</span>
                  </div>
                </div>

                {/* Mentor Endorsement Quote */}
                {activeInternship.mentorFeedbacks?.[0] && (
                  <div className="bg-purple-50/70 border border-purple-200 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-900 tracking-wider flex items-center">
                      <Award className="w-3.5 h-3.5 mr-1 text-purple-700" />
                      Official Mentor Endorsement
                    </span>
                    <p className="text-xs text-purple-950 italic leading-relaxed">
                      "{activeInternship.mentorFeedbacks[0].generalFeedback}"
                    </p>
                  </div>
                )}

                {/* Certificate Banner */}
                {activeInternship.completionRecord ? (
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div>
                      <span className="text-xs font-black text-emerald-900 block">
                        Verified Certificate #{activeInternship.completionRecord.certificateNumber}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700">
                        Hash: {activeInternship.completionRecord.verificationHash.substring(0, 24)}...
                      </span>
                    </div>

                    <Link
                      href="/student/opportunities"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center shrink-0 cursor-pointer shadow-xs"
                    >
                      <FileBadge className="w-4 h-4 mr-1.5" />
                      <span>View Full Certificate</span>
                    </Link>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                    <span>Active Sprint Deliverables in progress</span>
                    <Link href="/student/opportunities" className="text-blue-600 font-bold hover:underline">
                      Track Milestones →
                    </Link>
                  </div>
                )}

              </div>
            ) : (
              <p className="text-xs text-gray-500">No internship records found.</p>
            )}

          </div>

          {/* Section 2: Flagship Software Engineering Projects */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                  <Code2 className="w-4 h-4" />
                  <span>Practical Codebase Artifacts</span>
                </div>
                <h3 className="text-xl font-black text-[#0c2340]">Verified Engineering Projects</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 text-sm">Distributed E-Commerce Microservices</h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Production
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  High-throughput order execution engine supporting 2,500 req/sec with Redis caching, Kafka event streaming, and PostgreSQL partition indexing.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">Node.js</span>
                  <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">Kafka</span>
                  <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">PostgreSQL</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-900 text-sm">Real-Time Collaborative Code Editor</h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    WebSockets
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Conflict-free Replicated Data Type (CRDT) engine with WebRTC mesh peers, syntax highlighting, and sandboxed Docker code execution workers.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">React</span>
                  <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">WebSockets</span>
                  <span className="text-[10px] font-bold bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700">Docker</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right (4 cols): Verified Skill Matrix & Trust Credentials */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Verified Skills Breakdown */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-black text-[#0c2340]">Verified Competency Matrix</h3>
                <p className="text-[11px] text-gray-500">Benchmark tests & mentor evaluated</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="space-y-3">
              {verifiedSkills.length > 0 ? (
                verifiedSkills.map((sk: any) => (
                  <div key={sk.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-900">{sk.skill.name}</span>
                      <span className="text-xs font-black text-emerald-600">{Math.round(sk.score)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-1.5 bg-emerald-500 rounded-full" 
                        style={{ width: `${sk.score}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 pt-0.5 font-medium">
                      <span>{sk.verification || "Verified"}</span>
                      <span>Assessed Score</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-gray-50 text-center rounded-xl text-xs text-gray-500">
                  Take a skill test to populate verified skills.
                </div>
              )}
            </div>

            <Link
              href="/student/skills"
              className="block text-center text-xs font-bold text-blue-600 hover:text-blue-700 pt-2"
            >
              Take More Skill Assessments →
            </Link>
          </div>

          {/* Academic Verification Card */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">
              Academic Accreditation
            </h4>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                IIT
              </div>
              <div>
                <h5 className="text-sm font-bold text-gray-900">Indian Institute of Technology, Bombay</h5>
                <p className="text-xs text-gray-500">Bachelor of Technology (B.Tech) in CSE</p>
                <span className="text-[11px] font-bold text-emerald-700 block mt-1">Enrollment Verified</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
