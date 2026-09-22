"use client";

import { useState } from "react";
import { DownloadCloud, CheckCircle2, AlertTriangle, Cpu } from "lucide-react";

export default function JobIngestionDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runIngestion = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/jobs/ingest", { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("Ingestion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Job Ingestion Engine</h1>
        <p className="text-slate-500 mt-2">Phases 3, 4 & 5: Fetch, Normalize, and Extract Skills from external sources.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-indigo-600" />
            External API Pipeline
          </h2>
          <p className="text-slate-500 mt-1">Connects to mock external job feeds, normalizes the schema, and runs the Skill Extraction NLP layer.</p>
        </div>
        <button 
          onClick={runIngestion}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
        >
          <DownloadCloud className="w-5 h-5 mr-2" />
          {loading ? "Running Ingestion Pipeline..." : "Run Ingestion Now"}
        </button>
      </div>

      {result && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">{result.message}</h3>
          
          <div className="space-y-4">
            {result.ingestedJobs?.map((job: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow-sm border border-slate-200">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">{job.title}</h4>
                    <p className="text-sm text-slate-500">{job.company} • Normalized from: {job.source}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                    Ingested
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 italic border-l-4 border-indigo-200 pl-3">
                  "{job.description}"
                </p>

                <div className="border-t border-slate-100 pt-3">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Extracted Skills (Mapped to Taxonomy ID)</h5>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((req: any, j: number) => (
                      <span key={j} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${req.requirementType === 'REQUIRED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                        {req.skill.name} ({req.requirementType})
                      </span>
                    ))}
                    {job.skills.length === 0 && <span className="text-sm text-slate-400">No skills extracted.</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
