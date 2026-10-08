import React, { useState } from 'react';
import { HelpCircle, Code, FolderGit2, Users, ChevronRight, MessageSquareQuote } from 'lucide-react';

export default function InterviewQuestions({ interviewQuestions, onPracticeQuestion }) {
  const [activeCategory, setActiveCategory] = useState('technical');

  if (!interviewQuestions) return null;

  const categories = [
    { key: 'technical', label: 'Technical Depth', count: interviewQuestions.technical?.length || 0, icon: Code, color: 'text-indigo-400' },
    { key: 'project', label: 'Project Architecture', count: interviewQuestions.project?.length || 0, icon: FolderGit2, count: interviewQuestions.project?.length || 0, color: 'text-purple-400' },
    { key: 'hr', label: 'Behavioral & Culture', count: interviewQuestions.hr?.length || 0, icon: Users, color: 'text-cyan-400' },
  ];

  const currentQuestions = interviewQuestions[activeCategory] || [];

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Targeted Interview Questions</span>
          </h3>
          <p className="text-xs text-slate-400">
            Synthesized specifically for this candidate profile and target job description
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeCategory === cat.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <cat.icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/80">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-3">
        {currentQuestions.map((q, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex items-start justify-between gap-4 group"
          >
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-indigo-400 flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-slate-200 font-medium leading-relaxed">
                {q}
              </p>
            </div>

            {onPracticeQuestion && (
              <button
                onClick={() => onPracticeQuestion(q)}
                className="opacity-80 group-hover:opacity-100 flex-shrink-0 text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 flex items-center gap-1 transition-all"
                title="Practice answering this question in Mock Interview"
              >
                <span>Practice</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
