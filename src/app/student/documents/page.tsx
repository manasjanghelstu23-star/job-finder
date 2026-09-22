"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, Award, GraduationCap, Briefcase, UploadCloud, CheckCircle2, FileBadge, Clock, PlusCircle, PenTool, LayoutTemplate, Trash2, AlertCircle, Loader2 } from "lucide-react";

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState("resume");
  const certInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Resume State (Phase 1)
  const [resumes, setResumes] = useState<any[]>([]);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "error" | "success">("idle");
  const [uploadError, setUploadError] = useState("");

  // Certificates State (Mocked)
  const [verifiedCertificates] = useState([
    { id: 1, name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", date: "Aug 2025" },
    { id: 2, name: "Advanced React Patterns", issuer: "Frontend Masters", date: "Jan 2026" },
  ]);
  const [unverifiedCertificates, setUnverifiedCertificates] = useState([
    { id: 3, name: "Google Data Analytics", issuer: "Coursera", date: "Sep 2026", status: "Pending Verification" }
  ]);

  // Fetch Resumes
  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/student/resume");
      if (res.ok) {
        const data = await res.json();
        setResumes(data);
      }
    } catch (e) {
      console.error("Failed to fetch resumes", e);
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Upload Handlers
  const handleCertUploadClick = () => certInputRef.current?.click();
  const handleResumeUploadClick = () => resumeInputRef.current?.click();

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith('.pdf')) {
      setUploadStatus("error");
      setUploadError("Invalid file type. Only PDF resumes are supported.");
      if (e.target) e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadStatus("error");
      setUploadError("File is too large. Maximum size is 5MB.");
      return;
    }

    setUploadStatus("uploading");
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/student/resume", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploadStatus("success");
      fetchResumes(); // refresh list to show PENDING
      
      // Auto-trigger Phase 2 Extraction
      try {
        await fetch(`/api/student/resume/${data.resume.id}/extract`, { method: "POST" });
        fetchResumes(); // refresh list to show COMPLETED or FAILED
      } catch (extError) {
        console.error("Extraction triggered but failed:", extError);
      }
      
      // Reset input
      if (resumeInputRef.current) resumeInputRef.current.value = "";
      
      setTimeout(() => setUploadStatus("idle"), 3000);
    } catch (err: any) {
      setUploadStatus("error");
      setUploadError(err.message);
      if (resumeInputRef.current) resumeInputRef.current.value = "";
    }
  };

  const deleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    
    try {
      const res = await fetch(`/api/student/resume/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchResumes();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete");
      }
    } catch (e) {
      alert("Error deleting resume.");
    }
  };

  const [viewingResume, setViewingResume] = useState<any>(null);
  const [modalTab, setModalTab] = useState<"raw" | "structured" | "skills">("skills");

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Extracted Text Modal */}
      {viewingResume && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">Analysis Result: {viewingResume.originalFilename}</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setModalTab("skills")}
                  className={`px-3 py-1 text-xs font-bold rounded ${modalTab === "skills" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Phase 4: Mapped Skills
                </button>
                <button 
                  onClick={() => setModalTab("structured")}
                  className={`px-3 py-1 text-xs font-bold rounded ${modalTab === "structured" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Phase 3: Structured Data
                </button>
                <button 
                  onClick={() => setModalTab("raw")}
                  className={`px-3 py-1 text-xs font-bold rounded ${modalTab === "raw" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-600"}`}
                >
                  Phase 2: Raw Text
                </button>
              </div>
              <button onClick={() => setViewingResume(null)} className="text-gray-500 hover:text-gray-900">Close</button>
            </div>
            
            <div className="p-4 overflow-y-auto bg-gray-50 flex-1 font-mono text-xs">
              {modalTab === "raw" && (
                <div className="whitespace-pre-wrap">
                  {viewingResume.extractedText ? viewingResume.extractedText : "No text extracted."}
                </div>
              )}
              {modalTab === "structured" && (
                <div className="whitespace-pre-wrap text-blue-900">
                  {viewingResume.structuredData ? JSON.stringify(JSON.parse(viewingResume.structuredData), null, 2) : "No structured data available."}
                </div>
              )}
              {modalTab === "skills" && (
                <div className="space-y-4">
                  {(!viewingResume.skillEvidences || viewingResume.skillEvidences.length === 0) ? (
                    <p className="text-gray-500 italic">No skills mapped to the taxonomy yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {viewingResume.skillEvidences.map((ev: any) => (
                        <div key={ev.id} className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-sm text-indigo-700">{ev.skill?.name || ev.detectedName}</span>
                            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">ID: {ev.skillId.substring(0,8)}...</span>
                          </div>
                          <div className="text-[10px] text-gray-500 mb-2">
                            <strong>Source:</strong> {ev.evidenceSource} <br/>
                            <strong>Confidence:</strong> {(ev.confidence * 100).toFixed(0)}% <br/>
                            <strong>Method:</strong> {ev.extractionMethod}
                          </div>
                          <div className="bg-gray-100 p-2 text-gray-700 italic border-l-2 border-indigo-300">
                            "{ev.evidenceText.length > 100 ? ev.evidenceText.substring(0, 100) + '...' : ev.evidenceText}"
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {viewingResume.errorMessage && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded">
                  <strong>Error:</strong> {viewingResume.errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Documents</h1>
        <p className="text-gray-500 mt-2">Manage your resumes, academic records, and verified certificates.</p>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 inline-flex">
        <button
          onClick={() => setActiveTab("resume")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "resume" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <FileText className="w-4 h-4" />
          <span>Resume</span>
        </button>
        <button
          onClick={() => setActiveTab("certificates")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === "certificates" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100"}`}
        >
          <Award className="w-4 h-4" />
          <span>Certificates</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[400px]">
        
        {/* RESUME TAB (Phase 1) */}
        {activeTab === "resume" && (
          <div className="space-y-8">
            {/* Header / Actions */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">My Resumes</h2>
                <p className="text-gray-500 text-sm mt-1">Upload securely to parse and analyze your skills against job roles.</p>
              </div>
              <div className="flex flex-col items-end space-y-3">
                <input 
                  type="file" 
                  ref={resumeInputRef} 
                  onChange={handleResumeChange} 
                  className="hidden" 
                  accept=".pdf"
                />
                
                <button 
                  onClick={handleResumeUploadClick}
                  disabled={uploadStatus === "uploading"}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-400"
                >
                  {uploadStatus === "uploading" ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                  <span>{uploadStatus === "uploading" ? "Uploading..." : "Upload Resume (PDF)"}</span>
                </button>

                {uploadStatus === "error" && (
                  <div className="flex items-center text-sm text-red-600 font-medium">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {uploadError}
                  </div>
                )}
                
                {uploadStatus === "success" && (
                  <div className="flex items-center text-sm text-green-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Uploaded securely!
                  </div>
                )}
              </div>
            </div>

            {/* Saved Resumes */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Secure Storage</h3>
              
              {resumeLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-gray-100 rounded-lg w-full max-w-md"></div>
                </div>
              ) : resumes.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center flex flex-col items-center">
                  <FileText className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">No resumes uploaded yet.</p>
                  <p className="text-sm text-gray-400 mt-1">Upload a PDF to store it securely in your profile.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumes.map(resume => (
                    <div key={resume.id} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden group bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <FileText className="w-10 h-10 text-blue-600" />
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                          <button 
                            onClick={() => setViewingResume(resume)}
                            className="text-gray-400 hover:text-blue-600 bg-white p-2 rounded-full shadow-sm"
                            title="View Extracted Text"
                          >
                            <LayoutTemplate className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteResume(resume.id)}
                            className="text-gray-400 hover:text-red-600 bg-white p-2 rounded-full shadow-sm"
                            title="Delete Resume"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 leading-tight truncate" title={resume.originalFilename}>{resume.originalFilename}</h4>
                      
                      <div className="flex items-center space-x-2 mt-2 mb-4">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
                          {resume.fileType === "application/pdf" ? "PDF" : "DOC"}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {(resume.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-xs">
                        <span className="text-gray-500 font-medium">Analysis:</span>
                        <span className={`font-bold px-2 py-0.5 rounded-full ${
                          resume.analysisStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          resume.analysisStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {resume.analysisStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === "certificates" && (
          <div className="space-y-10">
            {/* Header / Upload Action */}
            <div className="flex justify-between items-center border-b pb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Certificates</h2>
                <p className="text-gray-500 text-sm mt-1">Upload new certificates for institutional verification.</p>
              </div>
              <div>
                <input 
                  type="file" 
                  ref={certInputRef} 
                  className="hidden" 
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                <button 
                  onClick={handleCertUploadClick}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <UploadCloud className="w-5 h-5" />
                  <span>Upload Certificate</span>
                </button>
              </div>
            </div>

            {/* Verified Certificates Section */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-medium text-gray-800">Verified Certificates</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {verifiedCertificates.map(cert => (
                  <div key={cert.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </div>
                    <FileBadge className="w-10 h-10 text-blue-500 mb-4" />
                    <h4 className="font-semibold text-gray-900 leading-tight">{cert.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{cert.issuer}</p>
                    <p className="text-xs text-gray-400 mt-4">Issued: {cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
