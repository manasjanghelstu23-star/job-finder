export interface MockIndustryQuestion {
  id: string;
  industryId: string;
  text: string;
  type: string;
  difficulty: string;
  evaluationMethod?: string;
  status: string;
  options: {
    id: string;
    questionId: string;
    text: string;
    isCorrect: boolean;
    weight: number;
  }[];
  skills?: {
    id: string;
    questionId: string;
    skillId: string;
    weight: number;
    skill: {
      id: string;
      name: string;
    };
  }[];
}

export interface MockAssessment {
  id: string;
  studentId: string;
  targetRole: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  questions: {
    id: string;
    assessmentId: string;
    industryQuestionId: string;
    order: number;
    industryQuestion: MockIndustryQuestion;
  }[];
}

export const initialIndustryQuestions: MockIndustryQuestion[] = [
  {
    id: "q-1",
    industryId: "comp-1",
    text: "What is the primary benefit of React Server Components (RSC) in Next.js App Router?",
    type: "MCQ",
    difficulty: "Intermediate",
    evaluationMethod: "AUTOMATED_EXACT",
    status: "PUBLISHED",
    options: [
      { id: "opt-1", questionId: "q-1", text: "They execute exclusively on the client browser to reduce server load", isCorrect: false, weight: 0 },
      { id: "opt-2", questionId: "q-1", text: "They render on the server, reducing client bundle size and enabling direct backend access", isCorrect: true, weight: 1.0 },
      { id: "opt-3", questionId: "q-1", text: "They replace traditional REST endpoints entirely with GraphQL schema", isCorrect: false, weight: 0 },
      { id: "opt-4", questionId: "q-1", text: "They auto-convert CSS-in-JS into Tailwind classes at compile time", isCorrect: false, weight: 0 },
    ],
    skills: [
      { id: "qs-1", questionId: "q-1", skillId: "sk-3", weight: 1.0, skill: { id: "sk-3", name: "React" } },
      { id: "qs-2", questionId: "q-1", skillId: "sk-4", weight: 1.0, skill: { id: "sk-4", name: "Next.js" } },
    ],
  },
  {
    id: "q-2",
    industryId: "comp-1",
    text: "Which TypeScript utility type converts all properties of a type T to optional?",
    type: "MCQ",
    difficulty: "Beginner",
    evaluationMethod: "AUTOMATED_EXACT",
    status: "PUBLISHED",
    options: [
      { id: "opt-5", questionId: "q-2", text: "Required<T>", isCorrect: false, weight: 0 },
      { id: "opt-6", questionId: "q-2", text: "Readonly<T>", isCorrect: false, weight: 0 },
      { id: "opt-7", questionId: "q-2", text: "Partial<T>", isCorrect: true, weight: 1.0 },
      { id: "opt-8", questionId: "q-2", text: "Record<T, any>", isCorrect: false, weight: 0 },
    ],
    skills: [
      { id: "qs-3", questionId: "q-2", skillId: "sk-2", weight: 1.0, skill: { id: "sk-2", name: "TypeScript" } },
    ],
  },
  {
    id: "q-3",
    industryId: "comp-1",
    text: "In Node.js event loop, which phase executes callbacks scheduled by process.nextTick()?",
    type: "MCQ",
    difficulty: "Advanced",
    evaluationMethod: "AUTOMATED_EXACT",
    status: "PUBLISHED",
    options: [
      { id: "opt-9", questionId: "q-3", text: "Timers Phase", isCorrect: false, weight: 0 },
      { id: "opt-10", questionId: "q-3", text: "Immediately before moving to the next phase (Microtask Queue)", isCorrect: true, weight: 1.0 },
      { id: "opt-11", questionId: "q-3", text: "Poll Phase after setImmediate()", isCorrect: false, weight: 0 },
      { id: "opt-12", questionId: "q-3", text: "Check Phase", isCorrect: false, weight: 0 },
    ],
    skills: [
      { id: "qs-4", questionId: "q-3", skillId: "sk-5", weight: 1.0, skill: { id: "sk-5", name: "Node.js" } },
    ],
  },
];

export const initialAssessments: MockAssessment[] = [
  {
    id: "ass-1",
    studentId: "sprof-student-1",
    targetRole: "Full Stack Engineer",
    status: "COMPLETED",
    startedAt: "2026-02-15T14:00:00.000Z",
    completedAt: "2026-02-15T14:25:00.000Z",
    questions: [
      { id: "aq-1", assessmentId: "ass-1", industryQuestionId: "q-1", order: 1, industryQuestion: initialIndustryQuestions[0] },
      { id: "aq-2", assessmentId: "ass-1", industryQuestionId: "q-2", order: 2, industryQuestion: initialIndustryQuestions[1] },
      { id: "aq-3", assessmentId: "ass-1", industryQuestionId: "q-3", order: 3, industryQuestion: initialIndustryQuestions[2] },
    ],
  },
];
