"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Circle,
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  Upload,
  Layers,
  Award,
  BookOpen,
  CheckSquare,
} from "lucide-react";

export default function StudentDashboardPage() {
  const [liveOpportunities, setLiveOpportunities] = useState<any[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(true);

  useEffect(() => {
    fetch("/api/opportunities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLiveOpportunities(data);
        }
        setLoadingOpportunities(false);
      })
      .catch(() => setLoadingOpportunities(false));
  }, []);

  const todayDateStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).toUpperCase();

  return (
    <div className="space-y-8 font-sans text-[#14231E]">
      {/* TOP EYEBROW & GREETING */}
      <div>
        <p className="font-mono text-[11px] tracking-[0.22em] text-slate-400 font-semibold uppercase mb-1">
          {todayDateStr}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#14231E] tracking-tight">
          Good morning, Aarav.
        </h1>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT & CENTER COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-8">
          {/* HERO READINESS BANNER CARD */}
          <div className="w-full rounded-[28px] bg-[#13664d] text-white p-7 sm:p-9 md:p-10 relative overflow-hidden shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Background Arc Lines */}
            <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -bottom-28 -right-28 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />

            {/* Hero Left Content */}
            <div className="relative z-10 max-w-md">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-[#a7f3d0]/30 text-[#a7f3d0] font-mono text-[11px] font-semibold mb-4">
                <span>+ Career readiness</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight text-white tracking-tight mb-3">
                Turn your learning into real opportunities.
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-light leading-relaxed mb-6">
                Your profile is 61% aligned with your frontend career goal. A few focused steps can unlock more matches.
              </p>

              <Link
                href="/student/skills"
                className="inline-flex items-center space-x-2 bg-[#d9f99d] hover:bg-[#bef264] text-[#0b4534] font-semibold text-xs px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer active:scale-98"
              >
                <span>Take skill assessment</span>
                <span>→</span>
              </Link>
            </div>

            {/* Hero Right: Circular Readiness Gauge Graphic */}
            <div className="relative z-10 flex-shrink-0 flex items-center justify-center">
              <div className="relative w-44 h-44 rounded-full border-4 border-[#a7f3d0]/20 flex items-center justify-center bg-[#0e523e]">
                {/* Gauge Circle */}
                <div className="w-36 h-36 rounded-full bg-[#f4f6f5] flex flex-col items-center justify-center text-center shadow-inner">
                  <span className="font-serif text-3xl font-bold text-[#13664d] leading-none">
                    61%
                  </span>
                  <span className="font-mono text-[10px] tracking-widest font-semibold text-slate-500 uppercase mt-1">
                    READY
                  </span>
                </div>

                {/* Satellite Skill Badges connected by arcs */}
                <div className="absolute -top-1 -left-2 bg-white text-[#13664d] font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-emerald-100">
                  React
                </div>
                <div className="absolute bottom-1 -left-2 bg-white text-[#13664d] font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-emerald-100">
                  API
                </div>
                <div className="absolute -bottom-1 -right-2 bg-white text-[#13664d] font-mono text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs border border-emerald-100">
                  Git
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: YOUR NEXT BEST MATCHES */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#14231E]">
                  Your next best matches
                </h3>
                <p className="text-xs text-slate-500 font-normal mt-0.5">
                  Opportunities ranked by your skills and preferences.
                </p>
              </div>

              <Link
                href="/student/opportunities"
                className="text-xs font-semibold text-[#13664d] hover:underline flex items-center space-x-1"
              >
                <span>View all opportunities</span>
                <span>→</span>
              </Link>
            </div>

            {/* MATCH CARDS LIST */}
            <div className="space-y-4">
              {/* Card 1: Frontend Developer Intern (Featured Match) */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-[#13664d]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs">
                    N
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Internship • Remote
                    </p>
                    <h4 className="text-base font-bold text-[#14231E] mt-0.5 truncate">
                      Frontend Developer Intern
                    </h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                      <span>Nexora Labs</span>
                      <span className="text-emerald-600 font-bold">✓</span>
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {["React", "JavaScript", "Git"].map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <p className="font-mono text-[11px] text-slate-400 mt-2">
                      Deadline: Oct 12
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="font-mono text-xs font-bold text-[#13664d] bg-[#e8f5f1] px-2.5 py-1 rounded-full self-start sm:self-end">
                    76% MATCH
                  </span>

                  <Link
                    href="/student/opportunities?applyJobId=opp-1"
                    className="mt-3 inline-flex items-center space-x-1.5 bg-[#13664d] hover:bg-[#0b4534] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs"
                  >
                    <span>Apply now</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Card 2: Full Stack Trainee */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-[#13664d]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs">
                    B
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                      Apprenticeship • Bengaluru • Hybrid
                    </p>
                    <h4 className="text-base font-bold text-[#14231E] mt-0.5 truncate">
                      Full Stack Trainee
                    </h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                      <span>BlueDeck Systems</span>
                      <span className="text-emerald-600 font-bold">✓</span>
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {["TypeScript", "Node.js", "SQL"].map((sk) => (
                        <span
                          key={sk}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>

                    <p className="font-mono text-[11px] text-slate-400 mt-2">
                      Deadline: Oct 18
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="font-mono text-xs font-bold text-[#13664d] bg-[#e8f5f1] px-2.5 py-1 rounded-full self-start sm:self-end">
                    62% MATCH
                  </span>

                  <Link
                    href="/student/opportunities?applyJobId=opp-2"
                    className="mt-3 inline-flex items-center space-x-1.5 bg-[#13664d] hover:bg-[#0b4534] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs"
                  >
                    <span>Apply now</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Dynamic Live Postings from API */}
              {liveOpportunities.length > 0 &&
                liveOpportunities.slice(0, 2).map((opp, idx) => (
                  <div
                    key={opp.job?.id || idx}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:border-[#13664d]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-2xs">
                        {opp.job?.company ? opp.job.company.slice(0, 1) : "C"}
                      </div>

                      <div className="min-w-0">
                        <p className="font-mono text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                          {opp.job?.workMode || "Remote"} • {opp.job?.location || "India"}
                        </p>
                        <h4 className="text-base font-bold text-[#14231E] mt-0.5 truncate">
                          {opp.job?.title}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center space-x-1 mt-0.5">
                          <span>{opp.job?.company}</span>
                          <span className="text-emerald-600 font-bold">✓</span>
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {(opp.job?.requiredSkills || []).slice(0, 3).map((sk: string) => (
                            <span
                              key={sk}
                              className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between self-stretch sm:self-auto">
                      <span className="font-mono text-xs font-bold text-[#13664d] bg-[#e8f5f1] px-2.5 py-1 rounded-full self-start sm:self-end">
                        {opp.matchResult?.matchScore || 85}% MATCH
                      </span>

                      <Link
                        href={`/student/opportunities?applyJobId=${opp.job?.id}`}
                        className="mt-3 inline-flex items-center space-x-1.5 bg-[#13664d] hover:bg-[#0b4534] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-2xs"
                      >
                        <span>Apply now</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (1/3 width): PROFILE COMPLETION & SKILL GAP INSIGHTS */}
        <div className="space-y-8">
          {/* CARD 1: PROFILE COMPLETION */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase">
                PROFILE COMPLETION
              </p>
              <span className="font-serif text-2xl font-bold text-[#13664d]">
                78%
              </span>
            </div>

            <h3 className="font-serif text-lg font-normal text-[#14231E]">
              Keep building momentum
            </h3>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#13664d] rounded-full w-[78%]" />
            </div>

            {/* Progress Checklist */}
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#13664d]" />
                  <span>Basic profile</span>
                </span>
                <span className="text-slate-400 font-medium">Complete</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#13664d]" />
                  <span>Add your projects</span>
                </span>
                <span className="text-slate-400 font-medium">Complete</span>
              </div>

              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center space-x-2 text-slate-900 font-semibold">
                  <Circle className="w-4 h-4 text-slate-300" />
                  <span>Upload latest resume</span>
                </span>
                <Link
                  href="/student/documents"
                  className="font-bold text-[#13664d] hover:underline"
                >
                  Upload
                </Link>
              </div>
            </div>
          </div>

          {/* CARD 2: SKILL GAP INSIGHTS */}
          <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.2em] font-semibold text-slate-400 uppercase">
                SKILL GAP INSIGHTS
              </p>
              <span className="text-slate-300 font-bold text-xs">•••</span>
            </div>

            <h3 className="font-serif text-lg font-normal text-[#14231E]">
              Focus areas
            </h3>

            {/* Skill Gaps List */}
            <div className="space-y-4">
              {/* Gap Item 1 */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#14231E]">System Design</p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                    35% today • 65% goal
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  30% gap
                </span>
              </div>

              {/* Gap Item 2 */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#14231E]">REST APIs</p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                    48% today • 75% goal
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  27% gap
                </span>
              </div>

              {/* Gap Item 3 */}
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#14231E]">SQL</p>
                  <p className="font-mono text-[10px] text-slate-400 mt-0.5">
                    55% today • 70% goal
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  15% gap
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Link
                href="/student/learning"
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>View learning plan</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
