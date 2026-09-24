"use client";

import { useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";

function AssessmentContent({ params }: { params: Promise<{ id: string }> }) {
  // Use React.use() to unwrap params if needed in Next 15+ (App Router)
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const skillName = searchParams.get("name") || "Skill";

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Mock Assessment Data provided by "Industry"
  const assessmentData = {
    provider: "Tech Mahindra & Google Cloud (Industry Consortium)",
    duration: "15 Mins",
    totalQuestions: 3,
    questions: [
      {
        id: 1,
        text: `Which of the following is a core principle related to ${skillName}?`,
        options: [
          "Always use global variables for state management.",
          "Write modular, reusable, and testable code.",
          "Ignore error handling to improve execution speed.",
          "Hardcode credentials directly into the source code."
        ],
        correct: 1
      },
      {
        id: 2,
        text: `In an enterprise environment, how should you secure a ${skillName} application?`,
        options: [
          "By implementing proper Authentication and Authorization checks.",
          "By leaving all endpoints public for easier debugging.",
          "By storing passwords in plain text.",
          "Security is not required for internal tools."
        ],
        correct: 0
      },
      {
        id: 3,
        text: `When optimizing the performance of ${skillName}, what is the best practice?`,
        options: [
          "Load all resources synchronously on startup.",
          "Duplicate code to avoid function calls.",
          "Implement lazy loading, caching, and efficient algorithms.",
          "Increase the server size instead of refactoring code."
        ],
        correct: 2
      }
    ]
  };

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = () => {
    let currentScore = 0;
    assessmentData.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct) {
        currentScore += 1;
      }
    });
    
    // Calculate percentage
    const finalScore = Math.round((currentScore / assessmentData.totalQuestions) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const handleReturn = () => {
    // In a real app, you would make an API call here to update the user's skill status in DB
    router.push("/student/skills");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{skillName} - Industry Assessment</h1>
            <p className="text-gray-500 mt-1">Designed by: <span className="font-medium text-gray-800">{assessmentData.provider}</span></p>
          </div>
          <div className="flex items-center space-x-2 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg border border-orange-200">
            <Clock className="w-4 h-4" />
            <span className="font-medium text-sm">{assessmentData.duration}</span>
          </div>
        </div>
      </div>

      {!isSubmitted ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6 flex justify-between items-center text-sm font-medium text-gray-500">
            <span>Question {currentQuestion + 1} of {assessmentData.totalQuestions}</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">Proctoring Active</span>
          </div>

          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {assessmentData.questions[currentQuestion].text}
            </h2>

            <div className="space-y-3">
              {assessmentData.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                    selectedAnswers[currentQuestion] === index 
                    ? "border-blue-600 bg-blue-50 text-blue-800 font-medium" 
                    : "border-gray-200 hover:border-blue-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentQuestion === assessmentData.totalQuestions - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < assessmentData.totalQuestions}
                className="px-5 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(assessmentData.totalQuestions - 1, prev + 1))}
                className="px-5 py-2.5 rounded-lg font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Section */
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-2">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Assessment Completed!</h2>
          <p className="text-gray-500">Your answers have been submitted for evaluation.</p>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-sm mx-auto my-6">
            <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-1">Final Score</p>
            <p className="text-5xl font-black text-gray-900">{score}%</p>
            <p className="text-sm font-medium mt-3 text-green-600">
              {score >= 70 ? "Passed - Skill will be marked as Verified" : "Did not pass. Try again in 7 days."}
            </p>
          </div>

          <button
            onClick={handleReturn}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Skills Dashboard
          </button>
        </div>
      )}

    </div>
  );
}

export default function AssessmentPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading Assessment...</div>}>
      <AssessmentContent params={params} />
    </Suspense>
  );
}
