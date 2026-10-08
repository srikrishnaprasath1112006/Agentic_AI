import React from 'react';
import { Rocket, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function AnalyzeButton({ onAnalyze, isLoading, hasResume, hasJob }) {
  const getSubtext = () => {
    if (isLoading) return 'Orchestrating multi-agent LangGraph workflow...';
    if (hasResume && hasJob) return 'Resume & Job Role ready • Click to run full analysis';
    if (hasResume && !hasJob) return '✨ Click to analyze your resume against target engineering role';
    return 'Click to load demo & test multi-agent analysis';
  };

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <button
        onClick={onAnalyze}
        disabled={isLoading}
        className={`relative group px-8 py-4 rounded-2xl font-bold text-base sm:text-lg flex items-center gap-3 transition-all duration-300 shadow-xl ${
          isLoading
            ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-500 hover:via-purple-500 hover:to-cyan-400 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-95 border border-white/20'
        }`}
      >
        <Rocket className={`w-5 h-5 ${isLoading ? 'animate-bounce text-yellow-300' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform'}`} />
        <span>{isLoading ? 'Analyzing Application...' : '🚀 Analyze My Job'}</span>
        {!isLoading && <ArrowRight className="w-5 h-5 opacity-80 group-hover:translate-x-1 transition-transform" />}
      </button>

      <p className="text-xs text-indigo-300/80 mt-2.5 flex items-center gap-1.5 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>{getSubtext()}</span>
      </p>
    </div>
  );
}
