"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BookOpen, 
  ExternalLink, 
  PlayCircle,
  Award, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight,
  Clock,
  Sparkles,
  RotateCcw,
  Layers,
  ChevronRight
} from "lucide-react";
import { getGapsForSkill } from "@/lib/skillGapsData";

interface SkillScoreItem {
  id: string;
  score: number;
  verification: string;
  status: string;
  assessedAt: string;
  skill: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
    };
  };
}

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState<"gaps" | "catalog">("gaps");
  const [skillScores, setSkillScores] = useState<SkillScoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);

  // Fetch verified skill assessments
  useEffect(() => {
    fetch("/api/students/me/skills")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSkillScores(data);
          if (data.length > 0) {
            setSelectedSkillId(data[0].skill.id);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Selected assessed skill
  const currentSkillScore = skillScores.find(s => s.skill.id === selectedSkillId) || skillScores[0];
  const currentScore = currentSkillScore ? Math.round(currentSkillScore.score || 0) : 0;
  const currentSkillName = currentSkillScore ? currentSkillScore.skill.name : "";
  
  // Calculate gaps for currently selected skill
  const gapData = currentSkillName ? getGapsForSkill(currentSkillName, currentScore) : null;
  const benchmarkScore = gapData?.benchmarkScore || 85;
  const scoreDiff = benchmarkScore - currentScore;

  // Level determination
  let currentLevel = "Beginner";
  let levelColor = "text-amber-700 bg-amber-50 border-amber-300";
  let barColor = "bg-amber-500";
  if (currentScore >= 75) {
    currentLevel = "Experienced";
    levelColor = "text-emerald-700 bg-emerald-50 border-emerald-300";
    barColor = "bg-[#27AE60]";
  } else if (currentScore >= 50) {
    currentLevel = "Intermediate";
    levelColor = "text-blue-700 bg-blue-50 border-blue-300";
    barColor = "bg-[#0091DA]";
  }

  // Catalog Courses (Fallback for General Learning Tab)
  const generalCatalog = [
    {
      id: 101,
      title: "Full-Stack Web Architecture & Performance Optimization",
      provider: "Coursera",
      type: "Specialization",
      duration: "6 Weeks",
      focus: "Full-Stack Development",
      rating: "4.9",
      cert: "Meta Professional Certificate"
    },
    {
      id: 102,
      title: "Advanced Data Structures & Algorithms for Technical Interviews",
      provider: "Educative",
      type: "Interactive Track",
      duration: "4 Weeks",
      focus: "Computer Science",
      rating: "4.8",
      cert: "Algorithmic Problem Solving Award"
    },
    {
      id: 103,
      title: "Cloud Native Microservices Architecture & DevOps",
      provider: "Pluralsight",
      type: "Masterclass",
      duration: "18 Hours",
      focus: "DevOps & Cloud",
      rating: "4.9",
      cert: "Linux Foundation Cloud Specialist"
    },
    {
      id: 104,
      title: "Modern Database Scaling & High Availability Systems",
      provider: "Udemy",
      type: "Video Course",
      duration: "14 Hours",
      focus: "Database Engineering",
      rating: "4.7",
      cert: "Database Administrator Certificate"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Personalized Learning & Skill Bridging</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0c2340]">Learning & Skill Gaps</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Identify specific gaps from your test results and bridge them with accredited courses & certifications.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("gaps")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === "gaps"
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Learn the Gap</span>
            {skillScores.length > 0 && (
              <span className="ml-1 bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                {skillScores.length} Assessed
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("catalog")}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === "catalog"
                ? "bg-white text-[#0c2340] shadow-sm font-extrabold"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>All Programs & Catalog</span>
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* 1. "LEARN THE GAP" SUB-SECTION                                          */}
      {/* ======================================================================= */}
      {activeTab === "gaps" && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {loading ? (
            <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-semibold text-sm">Analyzing test results and generating skill gap diagnostics...</p>
            </div>
          ) : skillScores.length === 0 ? (
            /* Empty State when no test has been taken yet */
            <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 text-center max-w-2xl mx-auto space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">No Assessment Results Found Yet</h2>
              <p className="text-gray-500 text-sm leading-relaxed max-w-md mx-auto">
                Take a skill test in the <strong>Skill Assessment</strong> section. As soon as you complete the test, our engine will automatically analyze your answers, isolate exact knowledge gaps, and recommend tailor-made courses and certifications.
              </p>
              <div className="pt-2">
                <Link
                  href="/student/skills"
                  className="inline-flex items-center space-x-2 bg-[#27AE60] hover:bg-[#219653] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                >
                  <span>Go to Coding Skill Tests</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* Active Test Result & Skill Gap Diagnostic */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (3 cols): Assessed Skills Switcher */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                    <h2 className="text-sm font-bold text-[#0c2340] uppercase tracking-wider flex items-center">
                      <Layers className="w-4 h-4 mr-1.5 text-blue-600" />
                      Assessed Skills
                    </h2>
                    <span className="text-[11px] font-semibold text-gray-500">
                      {skillScores.length} Tested
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">
                    Select a skill below to inspect gaps identified in your assessment:
                  </p>

                  <div className="space-y-2">
                    {skillScores.map((scoreItem) => {
                      const isSelected = (currentSkillScore?.skill.id === scoreItem.skill.id);
                      const sc = Math.round(scoreItem.score || 0);

                      return (
                        <button
                          key={scoreItem.id}
                          onClick={() => setSelectedSkillId(scoreItem.skill.id)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/70 border-blue-400 shadow-xs ring-1 ring-blue-400"
                              : "bg-gray-50 hover:bg-white border-gray-200"
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm text-[#0c2340]">
                              {scoreItem.skill.name}
                            </div>
                            <div className="text-[11px] text-gray-500">
                              {scoreItem.skill.category?.name || "Software Engineering"}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-black text-[#0c2340]">
                              {sc}%
                            </div>
                            <div className={`text-[10px] font-bold uppercase tracking-wider ${sc >= 75 ? 'text-emerald-600' : sc >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
                              {sc >= 75 ? 'Experienced' : sc >= 50 ? 'Intermediate' : 'Beginner'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 text-center">
                    <Link
                      href="/student/skills"
                      className="text-xs font-bold text-[#0091DA] hover:text-[#0077B6] flex items-center justify-center space-x-1"
                    >
                      <span>Take Another Skill Assessment</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Retake Callout */}
                <div className="bg-gradient-to-br from-[#0c2340] to-[#1e3a8a] text-white p-6 rounded-xl shadow-sm">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <RotateCcw className="w-4 h-4" />
                    <span>Bridge & Re-evaluate</span>
                  </div>
                  <h3 className="text-base font-bold mb-1.5">Completed a course?</h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4">
                    Once you finish a recommended module, retake the timed test to elevate your score from <strong>{currentScore}%</strong> to <strong>85%+</strong> and earn an Experienced badge.
                  </p>
                  <Link
                    href="/student/skills"
                    className="inline-block w-full text-center bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold py-2.5 px-4 rounded-lg uppercase tracking-wider transition-all shadow-xs"
                  >
                    Retake {currentSkillName} Test
                  </Link>
                </div>
              </div>

              {/* Right Column (8 cols): Diagnostic Breakdown & Gaps */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Score & Gap Diagnostic Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Test Result Analysis
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Verified
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${levelColor}`}>
                          {currentLevel} Level
                        </span>
                      </div>
                      <h2 className="text-2xl font-black text-[#0c2340]">
                        {currentSkillName}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                        {gapData?.overview}
                      </p>
                    </div>

                    {/* Score Comparison Badge */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center sm:text-right min-w-[170px] shrink-0">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">
                        Your Test Score
                      </div>
                      <div className="text-3xl font-black text-[#0c2340]">
                        {currentScore}%
                      </div>
                      <div className="text-[11px] font-medium text-gray-500 mt-0.5">
                        Industry Benchmark: <strong>{benchmarkScore}%</strong>
                      </div>
                    </div>
                  </div>

                  {/* Visual Gap Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-700">Proficiency Gap Analysis</span>
                      <span className={scoreDiff > 0 ? "text-orange-600 font-bold" : "text-emerald-600 font-bold"}>
                        {scoreDiff > 0 ? `-${scoreDiff}% Gap to Industry Benchmark` : `Benchmark Exceeded (+${Math.abs(scoreDiff)}%)`}
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-gray-200 relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                        style={{ width: `${Math.min(100, Math.max(8, currentScore))}%` }}
                      />
                      {/* Benchmark marker at 85% */}
                      <div 
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" 
                        style={{ left: `${benchmarkScore}%` }}
                        title="Industry Benchmark (85%)"
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      <span>Beginner (0%)</span>
                      <span>Intermediate (50%)</span>
                      <span className="text-red-500 font-bold">Benchmark ({benchmarkScore}%)</span>
                      <span>Mastery (100%)</span>
                    </div>
                  </div>
                </div>

                {/* Identified Gaps in this Skill Header */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-[#0c2340]">
                      Identified Gaps in {currentSkillName}
                    </h3>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {gapData?.gaps.length || 0} Knowledge Gaps Identified
                  </span>
                </div>

                {/* Loop Through Each Gap: Details, Course, & Certification */}
                <div className="space-y-6">
                  {gapData?.gaps.map((gap, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden"
                    >
                      {/* Gap Title & Severity Bar */}
                      <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                gap.severity === "High" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                              }`}>
                                {gap.severity} Priority Gap
                              </span>
                              <span className="text-xs text-gray-400 font-medium">• Tested Concept</span>
                            </div>
                            <h4 className="text-base font-bold text-gray-900">
                              {gap.gapTitle}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {gap.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Course and Certification Grid for this Gap */}
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                        
                        {/* 1. Recommended Course to Bridge the Gap */}
                        <div className="border border-blue-100 rounded-xl p-5 bg-blue-50/30 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                                <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                                Recommended Course
                              </span>
                              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                                {gap.course.level}
                              </span>
                            </div>

                            <h5 className="text-sm font-bold text-gray-900 leading-snug">
                              {gap.course.title}
                            </h5>

                            <div className="mt-3 flex items-center space-x-3 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">{gap.course.provider}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1 text-gray-400" />
                                {gap.course.duration}
                              </span>
                            </div>
                          </div>

                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(gap.course.title + ' ' + gap.course.provider)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-1.5 w-full bg-[#0091DA] hover:bg-[#0077B6] text-white text-xs font-bold py-2.5 px-4 rounded-lg uppercase tracking-wider transition-all shadow-xs"
                          >
                            <span>Enroll in Course</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* 2. Accredited Certification Program */}
                        <div className="border border-emerald-100 rounded-xl p-5 bg-emerald-50/30 flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                                <Award className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                                Industry Certification
                              </span>
                              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                                {gap.certification.validity}
                              </span>
                            </div>

                            <h5 className="text-sm font-bold text-gray-900 leading-snug">
                              {gap.certification.title}
                            </h5>

                            <div className="mt-3 flex items-center space-x-3 text-xs text-gray-500">
                              <span className="font-semibold text-gray-700">Issued by {gap.certification.issuer}</span>
                            </div>
                          </div>

                          <a 
                            href={`https://www.google.com/search?q=${encodeURIComponent(gap.certification.title + ' certification')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center space-x-1.5 w-full bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold py-2.5 px-4 rounded-lg uppercase tracking-wider transition-all shadow-xs"
                          >
                            <span>View Certification Program</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. GENERAL COURSE & CERTIFICATION CATALOG TAB                           */}
      {/* ======================================================================= */}
      {activeTab === "catalog" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-[#0c2340] mb-2">Comprehensive Learning Library</h3>
            <p className="text-xs text-gray-500 mb-6">
              Browse all accredited curriculum paths, interview tracks, and certification credentials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {generalCatalog.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span className="font-bold text-blue-600 uppercase">{item.focus}</span>
                      <span>{item.duration}</span>
                    </div>
                    <h4 className="text-base font-bold text-gray-900">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Provided by <strong className="text-gray-700">{item.provider}</strong></p>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center space-x-2 text-xs text-gray-700">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Leads to: <strong>{item.cert}</strong></span>
                    </div>
                  </div>

                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-1.5 w-full bg-[#0c2340] hover:bg-[#1e3a8a] text-white text-xs font-bold py-2.5 rounded-lg uppercase tracking-wider transition-colors"
                  >
                    <span>Explore Track</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
