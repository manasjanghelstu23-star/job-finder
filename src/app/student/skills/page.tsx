"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  CheckCircle2, 
  Activity, 
  Brain, 
  BookOpen, 
  Briefcase, 
  Globe, 
  ChevronRight, 
  Code2, 
  X, 
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  Lock,
  ChevronLeft,
  Layout,
  Laptop,
  Database,
  Layers,
  Atom,
  CheckSquare,
  Infinity,
  FileCode,
  Clock,
  PenTool,
  MousePointer,
  User,
  Building
} from "lucide-react";

interface SkillScore {
  id: string;
  score: number;
  coverage: number;
  status: string;
  skill: { name: string, category: { name: string } };
  verification?: string;
}

const codingCategories: Record<string, string[]> = {
  "FRONT END DEVELOPMENT": [
    "HTML", "CSS", "Javascript", "Bootstrap", "AJAX", "jQuery", 
    "Winforms", "Angular JS", "React JS", "Vue JS", "Popper.JS", 
    "Knockout JS", "Ionic framework", "Express JS", "Flutter", 
    "Svelte", "Web Assembly", "Typescript", "Backbone JS", 
    "Redux JS", "Chai JS", "Mocha JS", "Sinon JS", "Ext JS"
  ],
  "BACK END DEVELOPMENT": [
    "Java Core", "Python 3", "Go", "Node.js", "Ruby", "C sharp", 
    ".NET", "PHP", "C", "C++", "Apache Maven", "Swing", 
    "ADO NET", "Delphi", "Unix Shell", "Linux Shell", "Java Spring", 
    "Java Hibernate", "Python Django", "Go Revel", "Express JS", 
    "Socket JS", "Ruby on rails", "Python Flask", "Scala", 
    "Kotlin", "Perl", "Laravel", "Java Grail", "Java Play", 
    "Python Pyramid", "Go Bugsnag", "Go Beego", "Hapi", "Sails", 
    "Sinatra", "Padrino"
  ],
  "FULL STACK DEVELOPMENT": [
    "Java full stack", "PHP full stack", "C# full stack", "MEAN Stack", 
    "MERN Stack", "Django Stack", "Rails or Ruby on Rails", "LAMP Stack", 
    "LEMP Stack"
  ],
  "DATABASE DEVELOPMENT": [
    "Java MySQL", "PHP MySQL", "Python MySQL", "Microsoft Access", 
    "Oracle", "MS SQL Server", "Redis", "Teradata", "PL SQL", 
    "Amazon RDS", "MongoDB", "Cassandra", "Oracle No SQL", 
    "Hbase", "Hadoop", "SQOOP", "Talend", "Amazon Aurora", 
    "IBM cloud database", "Amazon Dynamo", "Couchbase", "Clustrix", 
    "Nuo", "Cockroach", "Pivotal Gemfire", "Volt", "Citus", 
    "Vitees"
  ],
  "DATA SCIENCE": [
    "Python", "R", "Pandas", "NumPy", "Scikit-learn", "TensorFlow", 
    "PyTorch", "SQL for Data Science", "Data Visualization", 
    "Tableau", "Power BI", "NLP", "Computer Vision", "Apache Spark"
  ],
  "DEVOPS": [
    "Chef", "Puppet", "Ubuntu", "Jenkins", "Unix Shell", 
    "Linux Shell", "Teamcity", "Travis", "TestNG", "JUnit", 
    "Network/Cyber security", "Docker", "Ansible", "AWS", 
    "Google cloud", "MS Azure", "Splunk", "ELK Stack", "Git", 
    "SVN", "Vagrant", "Nagios", "Mercurial", "CVS"
  ],
  "QUALITY ASSURANCE": [
    "Selenium", "Test complete", "Javascript Testing Tool - Jasmine", 
    "PHP Unit", "Junit", "Jira", "JMeter", "HP UFT", "Pyunit", 
    "SoapUI", "Automation Testing", "Loadrunner", "Agile Testing", 
    "Security Testing", "ELT Testing", "Performance Testing", 
    "Regression Testing", "Pytest", "Unit Testing", 
    "Javascript Testing Tool - Mocha", "Mockito", "Neoload", "Cucumber", 
    "Ranorex", "Catalon Studio", "Kualitee", 
    "Javascript Testing Tool - Ava", "Javascript Testing Tool - Jest", 
    "Javascript Testing Tool - Tape", "Javascript Testing Tool - Puppeteer", 
    "Javascript Testing Tool - Qunit", "PHP Spec", "Codeseption", 
    "Mockery", "Nose", "DocTest", "Rspec", "IBM RIT", 
    "SOASTA", "Cloudtest", "IBM RPT"
  ]
};

export default function SkillsPage() {
  const router = useRouter();
  
  const [skillScores, setSkillScores] = useState<SkillScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState("Backend Developer");
  
  // State for the Online Assessment Tools Flyout / Modal
  const [showAssessmentTools, setShowAssessmentTools] = useState(false);
  const flyoutRef = useRef<HTMLDivElement>(null);

  // State for the Coding Assessments Question Library Sub-Folder
  const [showCodingSection, setShowCodingSection] = useState(false);
  const [activeCodingTab, setActiveCodingTab] = useState("FRONT END DEVELOPMENT");
  const codingSectionRef = useRef<HTMLDivElement>(null);

  // State for the "Test For All Roles With A Wide Range of Simulators" (Coding Skill Tests Interface)
  const [showCodingSkillTests, setShowCodingSkillTests] = useState(false);
  const [expandedRoleKey, setExpandedRoleKey] = useState<string | null>(null);
  const simulatorsSectionRef = useRef<HTMLDivElement>(null);

  // State for the specific Skill Details Landing Page (from user's latest screenshot)
  const [selectedSkillDetail, setSelectedSkillDetail] = useState<{
    skillName: string;
    roleTitle: string;
  } | null>(null);
  const skillDetailSectionRef = useRef<HTMLDivElement>(null);

  // State for Registration / Sign-Up Modal before taking test (From User Screenshot)
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [pendingTestRole, setPendingTestRole] = useState<string | null>(null);
  const [signUpData, setSignUpData] = useState({
    email: "",
    name: "",
    phone: "",
    company: "",
    acceptedTerms: false
  });

  const handleSelectSkillForOverview = (skillName: string, roleTitle: string) => {
    setSelectedSkillDetail({ skillName, roleTitle });
    setTimeout(() => {
      skillDetailSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleTriggerTakeTest = (roleString?: string) => {
    setPendingTestRole(roleString || (selectedSkillDetail ? `${selectedSkillDetail.roleTitle}: ${selectedSkillDetail.skillName}` : targetRole));
    setShowSignUpModal(true);
  };

  const handleAcceptAndProceed = async () => {
    if (!signUpData.acceptedTerms) {
      alert("Please accept the Terms of Services, License Agreement, and Privacy Notice to proceed.");
      return;
    }
    setShowSignUpModal(false);
    await handleGenerateAssessment(pendingTestRole || undefined);
  };

  useEffect(() => {
    fetch("/api/students/me/skills")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSkillScores(data);
        }
        setLoading(false);
      });

    const handleClickOutside = (event: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(event.target as Node)) {
        // can close if desired
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleGenerateAssessment = async (selectedRole?: string) => {
    const roleToUse = selectedRole || targetRole;
    setIsGenerating(true);
    setShowAssessmentTools(false);
    
    try {
      const res = await fetch("/api/assessments/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: roleToUse })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/student/assessments/${data.id}`);
      } else {
        const error = await res.json();
        alert(`Failed to generate assessment: ${error.error || "Unknown error"}`);
        setIsGenerating(false);
      }
    } catch (err) {
      alert("Error starting assessment. Please ensure dev server is running.");
      setIsGenerating(false);
    }
  };

  const handleOpenCodingSection = (tabName?: string) => {
    if (tabName && codingCategories[tabName]) {
      setActiveCodingTab(tabName);
    }
    setShowAssessmentTools(false);
    setShowCodingSkillTests(false);
    setShowCodingSection(true);
    setTimeout(() => {
      codingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleOpenCodingSkillTests = () => {
    setShowAssessmentTools(false);
    setShowCodingSection(false);
    setShowCodingSkillTests(true);
    setTimeout(() => {
      simulatorsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleClearProfile = async () => {
    if (!confirm("Are you sure you want to delete ALL your skills and resumes? This cannot be undone.")) return;
    const res = await fetch("/api/students/me/skills", { method: "DELETE" });
    if (res.ok) {
      setSkillScores([]);
      alert("Profile cleared successfully.");
    } else {
      alert("Failed to clear profile.");
    }
  };

  const simulatorRolesList = [
    {
      key: "FRONT END DEVELOPMENT",
      title: "Front-End Developer",
      icon: (
        <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center text-teal-600">
          <Layout className="w-5 h-5 text-teal-600" />
        </div>
      ),
      skills: codingCategories["FRONT END DEVELOPMENT"]
    },
    {
      key: "BACK END DEVELOPMENT",
      title: "Back-End Developer",
      icon: (
        <div className="w-9 h-9 rounded bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
          <Laptop className="w-5 h-5 text-cyan-600" />
        </div>
      ),
      skills: codingCategories["BACK END DEVELOPMENT"]
    },
    {
      key: "DATABASE DEVELOPMENT",
      title: "Database Developer",
      icon: (
        <div className="w-9 h-9 rounded bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
          <Database className="w-5 h-5 text-blue-600" />
        </div>
      ),
      skills: codingCategories["DATABASE DEVELOPMENT"]
    },
    {
      key: "FULL STACK DEVELOPMENT",
      title: "Full-Stack Developer",
      icon: (
        <div className="w-9 h-9 rounded bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
          <Layers className="w-5 h-5 text-green-600" />
        </div>
      ),
      skills: codingCategories["FULL STACK DEVELOPMENT"]
    },
    {
      key: "DATA SCIENCE",
      title: "Data Scientist",
      icon: (
        <div className="w-9 h-9 rounded bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
          <Atom className="w-5 h-5 text-sky-600" />
        </div>
      ),
      skills: codingCategories["DATA SCIENCE"]
    },
    {
      key: "QUALITY ASSURANCE",
      title: "QA Engineer",
      icon: (
        <div className="w-9 h-9 rounded bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
          <CheckSquare className="w-5 h-5 text-teal-600" />
        </div>
      ),
      skills: codingCategories["QUALITY ASSURANCE"]
    },
    {
      key: "DEVOPS",
      title: "DevOps Engineer",
      icon: (
        <div className="w-9 h-9 rounded bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
          <Infinity className="w-5 h-5 text-cyan-600" />
        </div>
      ),
      skills: codingCategories["DEVOPS"]
    }
  ];

  return (
    <div className="w-full bg-white min-h-screen relative font-sans text-gray-800">
      
      {/* Online Assessment Tools Flyout / Mega Dropdown View */}
      {showAssessmentTools && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex justify-start items-start pt-24 pl-4 md:pl-24">
          <div 
            ref={flyoutRef}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-sm p-7 animate-in fade-in slide-in-from-top-4 duration-200 relative"
          >
            <button 
              onClick={() => setShowAssessmentTools(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Green Underline */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-[#0c2340] tracking-wider uppercase pb-1.5 border-b-2 border-[#27AE60] inline-block">
                Online Assessment Tools
              </h3>
            </div>

            {/* 1. Talent Assessments Section */}
            <div className="mb-8">
              <div className="flex items-start space-x-3 mb-2">
                <div className="w-7 h-7 rounded bg-teal-50 flex items-center justify-center text-teal-600 shrink-0 mt-0.5">
                  <Brain className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0c2340]">Talent Assessments</h4>
                  <p className="text-xs text-gray-500">Assess your talent holistically</p>
                </div>
              </div>

              <div className="ml-10 space-y-2.5 mt-3 text-sm text-gray-600">
                <div 
                  onClick={() => handleGenerateAssessment("Psychometric & Behavioral Specialist")}
                  className="cursor-pointer hover:text-green-600 hover:font-medium transition-all"
                >
                  Psychometric Tests
                </div>
                <div 
                  onClick={() => handleGenerateAssessment("Behavioral & Leadership Specialist")}
                  className="cursor-pointer hover:text-green-600 hover:font-medium transition-all"
                >
                  Behavioral Tests
                </div>
                <div 
                  onClick={() => handleGenerateAssessment("General Aptitude & Reasoning")}
                  className="cursor-pointer hover:text-green-600 hover:font-medium transition-all"
                >
                  Aptitude Tests
                </div>
                <div 
                  onClick={() => handleGenerateAssessment(targetRole)}
                  className="cursor-pointer hover:text-green-600 hover:font-medium transition-all"
                >
                  Technical Tests
                </div>
                <div 
                  onClick={() => handleGenerateAssessment("Communication & Business Communication")}
                  className="cursor-pointer hover:text-green-600 hover:font-medium transition-all"
                >
                  Communication Skills Tests
                </div>
              </div>

              <div className="ml-10 mt-4">
                <button 
                  onClick={() => handleGenerateAssessment(targetRole)}
                  className="text-xs font-bold text-[#27AE60] hover:text-[#219653] flex items-center space-x-1 tracking-wider uppercase group"
                >
                  <span>Find The Right Talent</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* 2. Coding Assessments Section */}
            <div className="p-3 -m-3 rounded-lg hover:bg-gray-50 transition-colors group/coding">
              <div className="flex items-start space-x-3 mb-2">
                <div className="w-7 h-7 rounded bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 group-hover/coding:bg-blue-600 group-hover/coding:text-white transition-colors">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0c2340] group-hover/coding:text-blue-600 transition-colors">Coding Assessments</h4>
                  <p className="text-xs text-gray-500">Find the best coders efficiently</p>
                </div>
              </div>

              <div className="ml-10 space-y-2.5 mt-3 text-sm text-gray-600 mb-5">
                <div 
                  onClick={() => handleOpenCodingSkillTests()}
                  className="hover:text-green-600 hover:font-medium transition-all cursor-pointer"
                >
                  Coding Skills Tests
                </div>
                <div 
                  onClick={() => handleOpenCodingSection("BACK END DEVELOPMENT")}
                  className="hover:text-green-600 hover:font-medium transition-all cursor-pointer"
                >
                  Advanced Coding Simulators
                </div>
              </div>

              <div className="ml-10">
                <button 
                  onClick={() => handleOpenCodingSkillTests()}
                  className="bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold px-6 py-2.5 rounded tracking-wider uppercase transition-colors shadow-sm w-full text-center"
                >
                  Test Library
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Skill Assessment Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="bg-gradient-to-r from-[#0c2340] via-[#1a365d] to-[#0f172a] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-sm">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-3">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Skill Verification & Testing Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Skill Assessments & Certifications
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Validate your technical capabilities with structured coding challenges, domain quizzes, and industry-benchmark skill assessments.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
              <select 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              >
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Data Scientist">Data Scientist</option>
                <option value="Product Manager">Product Manager</option>
              </select>
              <button 
                onClick={() => handleGenerateAssessment()}
                disabled={isGenerating}
                className="bg-[#27AE60] hover:bg-[#219653] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 tracking-wider uppercase"
              >
                <Brain className="w-4 h-4" />
                <span>{isGenerating ? "Preparing Assessment..." : "Launch Skill Test"}</span>
              </button>
              <button 
                onClick={() => handleOpenCodingSkillTests()}
                className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Test Library</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Sub-sections */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* 1. Skill Assessment Tool */}
          <div 
            className="bg-white border-2 border-green-500/30 hover:border-green-500 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group relative flex flex-col justify-between"
          >
            <div>
              <div className="bg-teal-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#27AE60] transition-colors">
                <Brain className="w-7 h-7 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Skill Assessment</h3>
              <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                Explore Talent Assessments, Psychometric, Aptitude, and Coding Simulators in our comprehensive library.
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleOpenCodingSkillTests()}
                className="w-full text-left text-xs font-bold text-[#0091DA] hover:text-[#0077B6] py-1.5 flex items-center justify-between group/sub cursor-pointer"
              >
                <span>📁 Coding Skills Tests</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/sub:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => setShowAssessmentTools(true)}
                className="w-full text-left text-xs font-bold text-[#27AE60] hover:text-[#219653] py-1.5 flex items-center justify-between group/sub cursor-pointer"
              >
                <span>Talent Assessment Tools</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/sub:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. Learning */}
          <div className="bg-white border-2 border-emerald-500/30 hover:border-emerald-500 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group relative flex flex-col justify-between">
            <div>
              <div className="bg-green-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <BookOpen className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Learning</h3>
              <p className="text-gray-500 mb-4 text-sm leading-relaxed">
                Bridge your skill gaps with personalized learning paths and curated course material.
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100">
              <Link 
                href="/student/learning"
                className="w-full text-left text-xs font-bold text-[#27AE60] hover:text-[#219653] py-1.5 flex items-center justify-between group/sub cursor-pointer"
              >
                <span>🎯 Learn the Gap</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/sub:translate-x-0.5 transition-transform" />
              </Link>
              <Link 
                href="/student/learning"
                className="w-full text-left text-xs font-bold text-[#0091DA] hover:text-[#0077B6] py-1.5 flex items-center justify-between group/sub cursor-pointer"
              >
                <span>Browse All Courses</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/sub:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 3. Portfolio */}
          <Link href="/student/portfolio" className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="bg-purple-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
              <Globe className="w-7 h-7 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Portfolio</h3>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed">
              Showcase your verified skills, projects, and achievements to potential employers.
            </p>
            <div className="text-purple-600 font-medium text-sm flex items-center">
              Build Portfolio <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* 4. Career Guidance */}
          <Link href="/student/opportunities" className="bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="bg-orange-50 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors">
              <Briefcase className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4. Career Guidance</h3>
            <p className="text-gray-500 mb-4 text-sm leading-relaxed">
              Discover opportunities, receive AI-driven gap analysis, and land your dream job.
            </p>
            <div className="text-orange-600 font-medium text-sm flex items-center">
              Find Opportunities <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* SKILL TEST OVERVIEW VIEW (From User Screenshots)                          */}
      {/* ========================================================================= */}
      {selectedSkillDetail && (
        <div ref={skillDetailSectionRef} className="bg-white py-20 border-y border-gray-200 animate-in fade-in duration-300 relative overflow-hidden">
          
          {/* Subtle background decorative dots & curves */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-48 h-48 border border-dashed border-gray-400 rounded-full" />
            <div className="absolute bottom-10 right-10 w-72 h-72 border border-dotted border-gray-400 rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 relative z-10">
            
            {/* Breadcrumb & Close Button */}
            <div className="flex justify-between items-center pb-6 mb-10 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span>Skill Assessments</span>
                <span>/</span>
                <span>{selectedSkillDetail.roleTitle}</span>
                <span>/</span>
                <span className="text-[#0c2340] font-bold">{selectedSkillDetail.skillName}</span>
              </div>

              <button
                onClick={() => setSelectedSkillDetail(null)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-gray-50 border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Skills</span>
              </button>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#0c2340] text-center max-w-5xl mx-auto mb-5 tracking-tight leading-snug">
              {selectedSkillDetail.skillName} Programming Skills Test for evaluating applied {selectedSkillDetail.roleTitle.toLowerCase()} and coding capability
            </h1>

            {/* Description Paragraph */}
            <p className="text-gray-600 text-xs md:text-sm text-center max-w-4xl mx-auto mb-14 leading-relaxed">
              {selectedSkillDetail.skillName} roles demand more than conceptual understanding. Candidates need to demonstrate how they translate logic into working, interactive applications. The {selectedSkillDetail.skillName} Programming Skills Test is a structured assessment that evaluates coding proficiency, problem-solving approach, and the ability to build dynamic web functionality. It covers core {selectedSkillDetail.skillName} concepts, {selectedSkillDetail.roleTitle.toLowerCase()} implementation, and real-world coding scenarios. By offering a simulated environment, the assessment provides a clear view of how candidates perform in development-focused roles.
            </p>

            {/* 6 Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-14">
              
              {/* Card 1: Availability */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full border border-emerald-300 bg-emerald-50/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#27AE60]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#0c2340]">Availability</div>
                  <div className="text-[11px] text-gray-500 font-medium">Ready to Use</div>
                </div>
              </div>

              {/* Card 2: Test Type */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full border border-emerald-300 bg-emerald-50/50 flex items-center justify-center shrink-0">
                  <FileCode className="w-5 h-5 text-[#27AE60]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#0c2340]">Test Type</div>
                  <div className="text-[11px] text-gray-500 font-medium">Coding</div>
                </div>
              </div>

              {/* Card 3: Experience Level */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full border border-emerald-300 bg-emerald-50/50 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#27AE60]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#0c2340]">Experience Level</div>
                  <div className="text-[11px] text-gray-500 font-medium">0.5-2 years</div>
                </div>
              </div>

              {/* Card 4: Difficulty Level */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full border border-cyan-300 bg-cyan-50/50 flex items-center justify-center shrink-0">
                  <PenTool className="w-5 h-5 text-[#0091DA]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#0c2340]">Difficulty Level</div>
                  <div className="text-[11px] text-gray-500 font-medium">Moderate</div>
                </div>
              </div>

              {/* Card 5: Test Duration */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full border border-emerald-300 bg-emerald-50/50 flex items-center justify-center shrink-0">
                  <MousePointer className="w-5 h-5 text-[#27AE60]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#0c2340]">Test Duration</div>
                  <div className="text-[11px] text-gray-500 font-medium">60 Minutes</div>
                </div>
              </div>

              {/* Card 6: Total Questions */}
              <div className="bg-white p-4.5 rounded-xl border border-gray-200/90 shadow-xs hover:shadow-md transition-shadow flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-full border border-cyan-300 bg-cyan-50/50 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5 text-[#0091DA]" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#0c2340]">Total Questions</div>
                  <div className="text-[11px] text-gray-500 font-medium">18 MCQ + 2 Coding</div>
                </div>
              </div>

            </div>

            {/* Primary Action Button (Without the removed Relevant Job Roles section) */}
            <div className="text-center pt-2">
              <button
                onClick={() => handleTriggerTakeTest(`${selectedSkillDetail.roleTitle}: ${selectedSkillDetail.skillName}`)}
                disabled={isGenerating}
                className="bg-[#27AE60] hover:bg-[#219653] active:scale-[0.98] text-white font-bold text-xs tracking-wider uppercase px-12 py-4 rounded shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? "Preparing Assessment..." : "Start Using This Test"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. CODING SKILL TESTS: ROLE SIMULATORS INTERFACE FROM USER'S SCREENSHOT  */}
      {/* ========================================================================= */}
      {showCodingSkillTests && (
        <div ref={simulatorsSectionRef} className="bg-gray-50/70 py-16 border-y border-gray-200/90 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Header & Return Bar */}
            <div className="flex justify-between items-center pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span>Skill Assessments</span>
                <span>/</span>
                <span className="text-[#0c2340] font-bold">Coding Skills Tests</span>
              </div>

              <button
                onClick={() => setShowCodingSkillTests(false)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Close Simulators</span>
              </button>
            </div>

            {/* Title */}
            <div className="text-center mb-14">
              <h2 className="text-2xl md:text-3xl font-normal text-[#0c2340] tracking-tight">
                Test For All Roles With A Wide Range of Simulators for Coding Skills Assessments
              </h2>
            </div>

            {/* Row 1: 4 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {simulatorRolesList.slice(0, 4).map((role) => {
                const isExpanded = expandedRoleKey === role.key;
                return (
                  <div key={role.key} className="flex flex-col">
                    <button
                      onClick={() => setExpandedRoleKey(isExpanded ? null : role.key)}
                      className="bg-white p-5 rounded-lg border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3.5">
                        {role.icon}
                        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {role.title}
                        </span>
                      </div>
                      <div className="text-[#27AE60]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Accordion Pill Dropdown */}
                    {isExpanded && (
                      <div className="bg-white/95 p-4 mt-2 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-2 animate-in fade-in duration-200">
                        {role.skills.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSelectSkillForOverview(s, role.title)}
                            className="bg-[#0091DA] hover:bg-[#0077B6] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer"
                            title={`Select ${s}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Row 2: 3 Centered Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              {simulatorRolesList.slice(4, 7).map((role) => {
                const isExpanded = expandedRoleKey === role.key;
                return (
                  <div key={role.key} className="flex flex-col">
                    <button
                      onClick={() => setExpandedRoleKey(isExpanded ? null : role.key)}
                      className="bg-white p-5 rounded-lg border border-gray-200/90 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3.5">
                        {role.icon}
                        <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {role.title}
                        </span>
                      </div>
                      <div className="text-[#27AE60]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Accordion Pill Dropdown */}
                    {isExpanded && (
                      <div className="bg-white/95 p-4 mt-2 rounded-lg border border-gray-200 shadow-sm flex flex-wrap gap-2 animate-in fade-in duration-200">
                        {role.skills.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleSelectSkillForOverview(s, role.title)}
                            className="bg-[#0091DA] hover:bg-[#0077B6] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer"
                            title={`Select ${s}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Button */}
            <div className="text-center">
              <button
                onClick={() => handleOpenCodingSection("FRONT END DEVELOPMENT")}
                className="bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold px-8 py-3.5 rounded tracking-wider uppercase transition-all shadow-md cursor-pointer"
              >
                Explore About Simulators
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. QUESTION LIBRARY SUB-FOLDER VIEW                                       */}
      {/* ========================================================================= */}
      {showCodingSection && (
        <div ref={codingSectionRef} className="bg-sky-50/40 py-16 border-y border-gray-200/80 animate-in fade-in duration-300">
          <div className="max-w-7xl mx-auto px-4">
            
            {/* Sub-Folder Breadcrumb & Return Bar */}
            <div className="flex justify-between items-center pb-6 mb-8 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <span>Skill Assessments</span>
                <span>/</span>
                <span className="text-[#0c2340] font-bold">📁 Question Library & Simulators</span>
              </div>

              <button
                onClick={() => setShowCodingSection(false)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-white border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Close Library</span>
              </button>
            </div>

            {/* Section Heading & Subtitle */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-normal text-[#0c2340] mb-3 tracking-tight">
                Unmatched Quality and Depth of Technical Assessment Questions
              </h2>
              <p className="text-gray-600 text-sm max-w-4xl mx-auto">
                Our test library of more than 100,000 technical questions ensures that there is a question for every possible job-role that you are looking to hire for.
              </p>
            </div>

            {/* 3-Column Interactive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Vertical Role Navigation Tabs */}
              <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200/90 overflow-hidden divide-y divide-gray-100">
                {Object.keys(codingCategories).map((categoryName) => {
                  const isActive = activeCodingTab === categoryName;
                  return (
                    <button
                      key={categoryName}
                      onClick={() => setActiveCodingTab(categoryName)}
                      className={`w-full text-left px-5 py-4 text-xs font-bold tracking-wider transition-all relative ${
                        isActive 
                          ? "text-[#0c2340] bg-white font-extrabold" 
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 bottom-0 top-0 w-1.5 bg-[#0c2340]" />
                      )}
                      <span>{categoryName}</span>
                      {isActive && (
                        <div className="w-16 h-0.5 bg-[#0c2340] mt-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Center Column: Interactive Blue Skill Pills Cloud */}
              <div className="lg:col-span-6 bg-white/70 p-6 rounded-xl border border-gray-100 min-h-[340px] flex flex-wrap content-start gap-2.5">
                {codingCategories[activeCodingTab]?.map((skillName) => (
                  <button
                    key={skillName}
                    onClick={() => handleSelectSkillForOverview(skillName, activeCodingTab)}
                    className="bg-[#0091DA] hover:bg-[#0077B6] active:scale-95 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all shadow-xs hover:shadow-md cursor-pointer"
                    title={`Click to view test overview for ${skillName}`}
                  >
                    {skillName}
                  </button>
                ))}
              </div>

              {/* Right Column: Statistics & Action Buttons */}
              <div className="lg:col-span-3 flex flex-col items-center lg:items-start space-y-6 pt-4">
                <div className="text-center lg:text-left">
                  <div className="text-4xl md:text-5xl font-black text-[#0091DA] tracking-tight mb-1">
                    20,000+
                  </div>
                  <div className="text-sm font-medium text-gray-600 tracking-wide">
                    Technical Questions
                  </div>
                </div>

                <div className="w-full space-y-3 pt-2">
                  <button
                    onClick={() => handleGenerateAssessment(activeCodingTab)}
                    className="w-full bg-[#27AE60] hover:bg-[#219653] active:scale-[0.98] text-white text-xs font-bold py-3.5 px-4 rounded shadow-sm hover:shadow transition-all uppercase tracking-wider text-center"
                  >
                    Explore Advanced Simulator
                  </button>

                  <button
                    onClick={() => handleGenerateAssessment(activeCodingTab)}
                    className="w-full bg-[#27AE60] hover:bg-[#219653] active:scale-[0.98] text-white text-xs font-bold py-3.5 px-4 rounded shadow-sm hover:shadow transition-all uppercase tracking-wider text-center"
                  >
                    Explore Our Coding Skills Tests
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Skill Profile List */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Skill Profile</h2>
            <p className="text-gray-500 mt-1 text-sm">Your verified and claimed skills.</p>
          </div>
          <button 
            onClick={handleClearProfile}
            className="text-red-600 px-4 py-2 text-sm font-medium hover:bg-red-50 rounded transition-colors"
          >
            Clear Profile
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="relative w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills..." 
                className="pl-9 pr-4 py-2 border border-gray-300 rounded w-full text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Showing {skillScores.filter(s => s.skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.skill.category?.name.toLowerCase().includes(searchQuery.toLowerCase())).length} Verified Skills
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-10 text-center text-gray-500 font-medium">Loading your skill profile...</div>
            ) : skillScores.length > 0 ? (
              skillScores
                .filter(s => s.skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.skill.category?.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(scoreObj => {
                  const score = Math.round(scoreObj.score || 0);
                  
                  // Automatic Level Calculation based on score percentage
                  let level = "Beginner";
                  let levelBadge = "bg-amber-50 text-amber-800 border-amber-300";
                  let barColor = "bg-amber-500";

                  if (score >= 75) {
                    level = "Experienced";
                    levelBadge = "bg-emerald-50 text-emerald-800 border-emerald-300";
                    barColor = "bg-[#27AE60]";
                  } else if (score >= 50) {
                    level = "Intermediate";
                    levelBadge = "bg-blue-50 text-blue-800 border-blue-300";
                    barColor = "bg-[#0091DA]";
                  }

                  return (
                    <div key={scoreObj.id} className="p-6 hover:bg-gray-50/70 transition-colors space-y-4">
                      
                      {/* Top Header: Skill Name, Badges & Overall Score */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                            <h3 className="text-lg font-bold text-gray-900">{scoreObj.skill.name}</h3>
                            
                            {/* Verified Badge */}
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Verified Skill
                            </span>

                            {/* Automatic Level Badge */}
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${levelBadge}`}>
                              {level} Level
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span className="bg-gray-100 px-2 py-0.5 rounded font-medium text-gray-600">
                              {scoreObj.skill.category?.name || "Software Engineering"}
                            </span>
                            {scoreObj.assessedAt && (
                              <span>• Verified on {new Date(scoreObj.assessedAt).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>

                        {/* Big Score Callout */}
                        <div className="text-right sm:min-w-[120px]">
                          <div className="text-3xl font-black text-[#0c2340]">
                            {score}%
                          </div>
                          <div className={`text-[11px] font-bold uppercase tracking-wider ${score >= 75 ? 'text-[#27AE60]' : score >= 50 ? 'text-[#0091DA]' : 'text-amber-600'}`}>
                            {level} Level
                          </div>
                        </div>
                      </div>

                      {/* Visual Percentage Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                          <span>Proficiency Level</span>
                          <span className="font-bold text-gray-800">{score}% / 100%</span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden p-0.5 border border-gray-200">
                          <div 
                            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                            style={{ width: `${Math.min(100, Math.max(5, score))}%` }}
                          />
                        </div>

                        {/* Level Scale Indicators */}
                        <div className="flex justify-between text-[10px] text-gray-400 font-semibold uppercase tracking-wider pt-0.5">
                          <span className={score < 50 ? "text-amber-600 font-bold" : ""}>Beginner (0-49%)</span>
                          <span className={score >= 50 && score < 75 ? "text-[#0091DA] font-bold" : ""}>Intermediate (50-74%)</span>
                          <span className={score >= 75 ? "text-[#27AE60] font-bold" : ""}>Experienced (75-100%)</span>
                        </div>
                      </div>

                    </div>
                  );
                })
            ) : (
              <div className="p-16 text-center flex flex-col items-center">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                  <Brain className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Verified Skills Yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Take an assessment above to start building your verified skill profile.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SIGN UP & GET STARTED MODAL (Exact from User Screenshot)                 */}
      {/* ========================================================================= */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#008ba3] via-[#009688] to-[#27ae60] bg-opacity-95 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 max-w-lg w-full relative my-8 animate-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setShowSignUpModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0c2340] mb-2 tracking-tight">
              Sign up and get started today
            </h2>

            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Already got an account?{" "}
              <Link href="/login" className="text-[#0091DA] hover:underline font-medium">
                Log In
              </Link>{" "}
              to your student account now
            </p>

            {/* Form Fields */}
            <div className="space-y-4 mb-5">
              
              {/* Official Email */}
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  placeholder="YOUR OFFICIAL EMAIL *"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#27AE60] focus:ring-1 focus:ring-[#27AE60] uppercase"
                />
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="text"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    placeholder="YOUR NAME *"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#27AE60] focus:ring-1 focus:ring-[#27AE60] uppercase"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    placeholder="YOUR PHONE NO. *"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:border-[#27AE60] focus:ring-1 focus:ring-[#27AE60] uppercase"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="relative">
                <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  value={signUpData.company}
                  onChange={(e) => setSignUpData({ ...signUpData, company: e.target.value })}
                  placeholder="YOUR COMPANY *"
                  className="w-full pl-10 pr-4 py-3 border border-[#27AE60] rounded-lg text-xs placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#27AE60] uppercase shadow-xs"
                />
              </div>

            </div>

            {/* Checkbox & Terms */}
            <div className="flex items-start space-x-3 mb-7">
              <input 
                type="checkbox"
                id="modal_terms_agree"
                checked={signUpData.acceptedTerms}
                onChange={(e) => setSignUpData({ ...signUpData, acceptedTerms: e.target.checked })}
                className="w-4 h-4 mt-0.5 text-[#27AE60] border-gray-300 rounded focus:ring-[#27AE60] cursor-pointer"
              />
              <label htmlFor="modal_terms_agree" className="text-[11px] text-gray-600 leading-relaxed cursor-pointer select-none">
                By clicking on &quot;I Accept&quot;, you hereby accept and acknowledge the{" "}
                <span className="text-[#0091DA] underline">Terms of Services</span>,{" "}
                <span className="text-[#0091DA] underline">License Agreement</span> and{" "}
                <span className="text-[#0091DA] underline">Privacy Notice</span>{" "}
                and agree to be bound by the same. You declare that you are competent/authorized to accept the aforesaid as per applicable law and policies of your organization and territory.
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAcceptAndProceed}
              disabled={!signUpData.acceptedTerms || isGenerating}
              className={`w-full py-3.5 rounded text-xs font-bold uppercase tracking-wider transition-all ${
                signUpData.acceptedTerms && !isGenerating
                  ? "bg-[#27AE60] hover:bg-[#219653] text-white shadow-md cursor-pointer active:scale-[0.99]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isGenerating ? "Preparing Assessment Room..." : "I ACCEPT AND PROCEED"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
