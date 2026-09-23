"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudentAssessmentsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student/skills");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-12 text-slate-500">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Redirecting to Skill Assessment Portal...
        </p>
      </div>
    </div>
  );
}
