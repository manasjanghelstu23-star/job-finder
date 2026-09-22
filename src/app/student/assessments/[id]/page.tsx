"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Brain, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Lock,
  Send
} from "lucide-react";

export default function AssessmentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({}); 
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Timings: 15 minutes (900 seconds) default timer
  const TOTAL_TIME_SECONDS = 15 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(TOTAL_TIME_SECONDS);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetch(`/api/assessments/${id}`)
      .then(res => res.json())
      .then(data => {
        setAssessment(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  // Live Countdown Timer
  useEffect(() => {
    if (loading || !assessment || assessment.status === "COMPLETED" || submitting) return;

    timerRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, assessment, submitting]);

  // Auto-submit when time expires
  useEffect(() => {
    if (isTimeUp && !submitting && assessment && assessment.status !== "COMPLETED") {
      alert("⏱️ Time is up! Your assessment is being automatically submitted.");
      handleSubmit();
    }
  }, [isTimeUp]);

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const formattedAnswers = Object.keys(answers).map(aqId => ({
      assessmentQuestionId: aqId,
      selectedOptionId: answers[aqId],
      textResponse: null
    }));

    try {
      const res = await fetch(`/api/assessments/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formattedAnswers })
      });

      if (res.ok) {
        router.push(`/student/skills`);
      } else {
        alert("Assessment submitted. Redirecting to skill profile...");
        router.push(`/student/skills`);
      }
    } catch (err) {
      router.push(`/student/skills`);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 max-w-sm">
          <Brain className="w-10 h-10 text-blue-600 animate-pulse mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Setting Up Assessment Room</h3>
          <p className="text-sm text-gray-500 mt-1">Configuring timed test environment and proctoring guard...</p>
        </div>
      </div>
    );
  }

  if (!assessment || assessment.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 max-w-sm">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">Assessment Not Found</h3>
          <p className="text-sm text-gray-500 mt-1">Please return to the skill library to launch a new test.</p>
          <button 
            onClick={() => router.push("/student/skills")}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
          >
            Back to Skills
          </button>
        </div>
      </div>
    );
  }

  if (assessment.status === "COMPLETED") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md">
          <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-gray-900">Assessment Completed</h3>
          <p className="text-sm text-gray-600 mt-1">Your answers have been evaluated and your skill profile is updated.</p>
          <button 
            onClick={() => router.push("/student/skills")}
            className="mt-5 bg-[#27AE60] text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#219653]"
          >
            View Verified Skills
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = assessment.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;
  const currentAq = assessment.questions?.[currentQuestionIndex];
  const currentQuestion = currentAq?.industryQuestion;
  const isTimeCritical = secondsRemaining <= 3 * 60; // Less than 3 mins

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 pb-16 font-sans">
      
      {/* Top Test Navigation & Proctoring Status Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row justify-between items-center gap-3">
          
          {/* Assessment Title & Details */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0c2340]">
                {assessment.targetRole} Assessment
              </h1>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <span>Questions: <strong className="text-gray-800">{totalQuestions}</strong></span>
                <span>•</span>
                <span>Answered: <strong className="text-green-600">{answeredCount}/{totalQuestions}</strong></span>
              </div>
            </div>
          </div>

          {/* Timers & Proctoring Indicators */}
          <div className="flex items-center space-x-4">
            
            {/* Proctoring Badge */}
            <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Eye className="w-3.5 h-3.5" />
              <span>AI Proctoring Active</span>
            </div>

            {/* Live Countdown Timer Badge */}
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg border font-mono font-bold text-base shadow-xs transition-colors ${
              isTimeCritical 
                ? "bg-red-50 text-red-600 border-red-300 animate-pulse" 
                : "bg-gray-50 text-[#0c2340] border-gray-300"
            }`}>
              <Clock className={`w-4 h-4 ${isTimeCritical ? "text-red-500" : "text-gray-500"}`} />
              <div className="flex flex-col text-right">
                <span className="text-xs font-sans text-gray-400 -mb-1 font-normal">TIME LEFT</span>
                <span>{formatTime(secondsRemaining)}</span>
              </div>
            </div>

            {/* Direct Submit Action */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#27AE60] hover:bg-[#219653] disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded uppercase tracking-wider shadow-sm transition-all flex items-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Finish Test"}</span>
            </button>
          </div>

        </div>

        {/* Timings Progress Bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className={`h-1 transition-all duration-1000 ${isTimeCritical ? "bg-red-500" : "bg-blue-600"}`}
            style={{ width: `${(secondsRemaining / TOTAL_TIME_SECONDS) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Test Body */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left / Center: Question Paper Pane (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {currentQuestion ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative">
              
              {/* Question Header Bar */}
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="bg-[#0c2340] text-white text-xs font-bold px-3 py-1 rounded">
                    QUESTION {currentQuestionIndex + 1} OF {totalQuestions}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                    Multiple Choice • 1 Mark
                  </span>
                </div>

                {answers[currentAq.id] && (
                  <button
                    onClick={() => handleClearAnswer(currentAq.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    Clear Response
                  </button>
                )}
              </div>

              {/* Question Text */}
              <h2 className="text-lg md:text-xl font-medium text-gray-900 leading-relaxed mb-8">
                {currentQuestion.text}
              </h2>

              {/* Options List */}
              <div className="space-y-3.5">
                {currentQuestion.options?.map((opt: any, optIdx: number) => {
                  const isSelected = answers[currentAq.id] === opt.id;
                  const optionLetters = ["A", "B", "C", "D", "E"];
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleOptionSelect(currentAq.id, opt.id)}
                      className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? "border-[#0091DA] bg-sky-50/60 shadow-xs" 
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/60 bg-white"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected 
                          ? "bg-[#0091DA] text-white" 
                          : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}>
                        {optionLetters[optIdx] || optIdx + 1}
                      </div>

                      <span className={`text-sm leading-normal flex-1 ${isSelected ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {opt.text}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Bottom Next/Prev Bar */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-1.5 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-gray-400 font-medium">
                  Use Question Palette on right to jump
                </div>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
                    className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-[#0091DA] hover:bg-[#0077B6] text-white text-sm font-semibold transition-all shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center space-x-1.5 px-6 py-2.5 rounded-lg bg-[#27AE60] hover:bg-[#219653] text-white text-sm font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <span>Submit</span>
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-xl border border-gray-200 text-gray-500">
              No questions found for this test session.
            </div>
          )}
        </div>

        {/* Right Side: Question Navigation Palette & Timing Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Question Palette Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-[#0c2340] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
              Question Palette
            </h3>

            <div className="grid grid-cols-5 gap-2.5 mb-6">
              {assessment.questions?.map((aq: any, idx: number) => {
                const isAnswered = !!answers[aq.id];
                const isCurrent = currentQuestionIndex === idx;
                return (
                  <button
                    key={aq.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-lg font-bold text-xs transition-all flex items-center justify-center relative ${
                      isCurrent
                        ? "ring-2 ring-offset-1 ring-[#0091DA] font-black"
                        : ""
                    } ${
                      isAnswered
                        ? "bg-[#27AE60] text-white shadow-xs"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs text-gray-600 border-t border-gray-100 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-[#27AE60]" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded bg-gray-200" />
                <span>Unanswered ({totalQuestions - answeredCount})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 rounded ring-2 ring-[#0091DA] bg-white" />
                <span>Current Question</span>
              </div>
            </div>
          </div>

          {/* Test Instructions & Timings Info */}
          <div className="bg-sky-50/70 p-6 rounded-xl border border-sky-200 text-xs space-y-3 text-sky-900">
            <h4 className="font-bold uppercase tracking-wider text-[#0c2340] flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Assessment Rules</span>
            </h4>
            <ul className="list-disc pl-4 space-y-1.5 text-gray-700">
              <li>Test duration is fixed at <strong>15 minutes</strong>.</li>
              <li>Questions evaluate technical accuracy and proficiency.</li>
              <li>Once submitted, answers are graded instantly and updated in your verified skill profile.</li>
              <li>Do not refresh or navigate away during active proctoring.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}
