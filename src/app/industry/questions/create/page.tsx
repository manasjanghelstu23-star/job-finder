"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Save, Send } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: { id: string, name: string };
}

export default function CreateQuestionPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MCQ");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [evaluationCriteria, setEvaluationCriteria] = useState("");
  
  // MCQ Options
  const [options, setOptions] = useState([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  // Skill Mapping (e.g. Java 60%, Problem Solving 40%)
  const [mappedSkills, setMappedSkills] = useState<{skillId: string, weight: number}[]>([]);

  useEffect(() => {
    fetch("/api/skills")
      .then(res => res.json())
      .then(data => {
        setSkills(data);
        setLoading(false);
      });
  }, []);

  const handleAddOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleAddSkillMapping = () => {
    if (skills.length > 0) {
      setMappedSkills([...mappedSkills, { skillId: skills[0].id, weight: 100 }]);
    }
  };

  const handleRemoveSkillMapping = (index: number) => {
    setMappedSkills(mappedSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: "DRAFT" | "PUBLISHED") => {
    const payload = {
      text: questionText,
      type: questionType,
      difficulty,
      evaluationMethod: evaluationCriteria,
      status,
      options: questionType === "MCQ" ? options : [],
      skills: mappedSkills
    };

    const res = await fetch("/api/industry/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      alert(`Question ${status === "DRAFT" ? "saved as draft" : "published"} successfully!`);
      // Reset form
      setQuestionText("");
      setOptions([{ text: "", isCorrect: false }, { text: "", isCorrect: false }]);
      setMappedSkills([]);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Assessment Question</h1>
        <p className="text-gray-500 mt-2">Questions are evidence used to measure skills. Map them carefully to the taxonomy.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Core Question Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <textarea 
              rows={4}
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              placeholder="e.g. Your teammate introduces a bug before a deadline. What do you do?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
              <select 
                value={questionType}
                onChange={e => setQuestionType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="MCQ">Multiple Choice (MCQ)</option>
                <option value="MultipleSelect">Multiple Select</option>
                <option value="TrueFalse">True/False</option>
                <option value="CodeOutput">Code Output / Debugging</option>
                <option value="Situational">Situational Judgment Test (SJT)</option>
                <option value="Written">Written Response</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select 
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Options for MCQ */}
        {questionType === "MCQ" && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-800">Answer Options</h3>
              <button onClick={handleAddOption} className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center">
                <PlusCircle className="w-4 h-4 mr-1" /> Add Option
              </button>
            </div>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input 
                    type="radio" 
                    name="correct_option"
                    checked={opt.isCorrect}
                    onChange={() => {
                      const newOpts = [...options];
                      newOpts.forEach(o => o.isCorrect = false);
                      newOpts[idx].isCorrect = true;
                      setOptions(newOpts);
                    }}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <input 
                    type="text" 
                    value={opt.text}
                    onChange={e => {
                      const newOpts = [...options];
                      newOpts[idx].text = e.target.value;
                      setOptions(newOpts);
                    }}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button onClick={() => handleRemoveOption(idx)} className="p-2 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skill Mapping */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-800">Skill Mapping (Evidence)</h3>
            <button onClick={handleAddSkillMapping} className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center">
              <PlusCircle className="w-4 h-4 mr-1" /> Add Skill
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-4">Map this question to one or more skills. For example, a situational question might test Communication (40%), Teamwork (30%), and Problem Solving (30%).</p>
          
          <div className="space-y-3">
            {mappedSkills.map((mapped, idx) => (
              <div key={idx} className="flex items-center space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <select 
                  value={mapped.skillId}
                  onChange={e => {
                    const newMap = [...mappedSkills];
                    newMap[idx].skillId = e.target.value;
                    setMappedSkills(newMap);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category.name})</option>
                  ))}
                </select>
                <div className="w-32 flex items-center">
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    value={mapped.weight}
                    onChange={e => {
                      const newMap = [...mappedSkills];
                      newMap[idx].weight = Number(e.target.value);
                      setMappedSkills(newMap);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <span className="ml-2 text-gray-500">%</span>
                </div>
                <button onClick={() => handleRemoveSkillMapping(idx)} className="p-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {mappedSkills.length === 0 && (
              <div className="text-sm text-gray-500 italic text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No skills mapped yet. Add a skill to make this question measurable.
              </div>
            )}
          </div>
        </div>

        {/* Explanation / Criteria */}
        <div className="pt-4 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-1">Evaluation Criteria / Explanation (Optional)</label>
          <textarea 
            rows={2}
            value={evaluationCriteria}
            onChange={e => setEvaluationCriteria(e.target.value)}
            placeholder="Explain why the correct answer is correct, or provide grading rubrics for written responses."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex justify-end space-x-3">
          <button 
            onClick={() => handleSubmit("DRAFT")}
            className="flex items-center px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </button>
          <button 
            onClick={() => handleSubmit("PUBLISHED")}
            className="flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4 mr-2" />
            Publish Question
          </button>
        </div>

      </div>
    </div>
  );
}
