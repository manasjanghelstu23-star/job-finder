"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Edit3, Trash2, Globe, FileText, CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  type: string;
  difficulty: string;
  status: string;
  createdAt: string;
  skills: { weight: number, skill: { name: string } }[];
}

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/industry/questions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setQuestions(data);
        }
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "PUBLISHED") return "bg-green-100 text-green-800 border-green-200";
    return "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Beginner": return "text-green-600";
      case "Intermediate": return "text-orange-600";
      case "Advanced": return "text-red-600";
      default: return "text-slate-600";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Question Bank</h1>
          <p className="text-slate-500 mt-2">Manage your assessment questions and skill mappings.</p>
        </div>
        <Link 
          href="/industry/questions/create"
          className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Question</span>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-indigo-50 p-3 rounded-lg"><DatabaseIcon className="w-6 h-6 text-indigo-600" /></div>
          <div><p className="text-sm font-medium text-slate-500">Total Questions</p><p className="text-2xl font-bold text-slate-900">{questions.length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-green-50 p-3 rounded-lg"><Globe className="w-6 h-6 text-green-600" /></div>
          <div><p className="text-sm font-medium text-slate-500">Published</p><p className="text-2xl font-bold text-slate-900">{questions.filter(q => q.status === "PUBLISHED").length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-slate-50 p-3 rounded-lg"><FileText className="w-6 h-6 text-slate-600" /></div>
          <div><p className="text-sm font-medium text-slate-500">Drafts</p><p className="text-2xl font-bold text-slate-900">{questions.filter(q => q.status === "DRAFT").length}</p></div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="bg-blue-50 p-3 rounded-lg"><CheckCircle2 className="w-6 h-6 text-blue-600" /></div>
          <div><p className="text-sm font-medium text-slate-500">Assessed Students</p><p className="text-2xl font-bold text-slate-900">0</p></div>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading questions...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
              <DatabaseIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">No questions yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm">Create your first question to start building assessments and measuring student skills.</p>
            <Link href="/industry/questions/create" className="text-indigo-600 font-medium hover:text-indigo-700">Create Question →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Question Text</th>
                  <th className="px-6 py-4 font-semibold">Mapped Skills (Weights)</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Difficulty</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 line-clamp-2">{q.text}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {q.skills.map((s, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            {s.skill.name} ({s.weight}%)
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">{q.type}</td>
                    <td className={`px-6 py-4 font-medium ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(q.status)}`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors rounded-lg hover:bg-indigo-50">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple icon for the dashboard cards
function DatabaseIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
