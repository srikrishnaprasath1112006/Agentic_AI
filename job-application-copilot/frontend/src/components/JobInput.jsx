import React from 'react';
import { Briefcase, Sparkles, X, CheckCircle, FileText } from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTION, JOB_ROLE_PRESETS } from '../data/sampleData';

export default function JobInput({ jobDescription, setJobDescription }) {
  const handleUseDemo = (presetText = SAMPLE_JOB_DESCRIPTION) => {
    setJobDescription(presetText);
  };

  const handleClear = () => {
    setJobDescription('');
  };

  const isEmpty = !jobDescription.trim();

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-400" />
          <h2 className="font-semibold text-lg text-white">Target Job Description</h2>
        </div>
        <div className="flex items-center gap-2">
          {!isEmpty && (
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2.5 py-1 rounded bg-slate-900 border border-slate-800"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
          <button
            onClick={() => handleUseDemo(SAMPLE_JOB_DESCRIPTION)}
            className="text-xs text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-all font-medium active:scale-95 shadow-sm"
            title="Load sample AI/ML Engineer job description"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Use Demo Job</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 flex flex-col min-h-[200px]">
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description here, or choose a quick role below..."
          className="w-full flex-1 min-h-[170px] p-4 text-sm bg-slate-950/70 border border-slate-800 focus:border-purple-500/60 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 resize-none transition-all font-sans"
        />

        {/* When empty, show quick role selection buttons right inside/underneath */}
        {isEmpty && (
          <div className="mt-3 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-2">
            <div className="flex items-center justify-between text-xs text-purple-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                No job description to paste? Choose a quick target role:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {JOB_ROLE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleUseDemo(preset.description)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900/90 hover:bg-purple-900/40 text-slate-200 hover:text-purple-200 border border-slate-700/80 hover:border-purple-500/50 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Briefcase className="w-3 h-3 text-purple-400" />
                  <span>{preset.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Character Counter & Status */}
        <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
          <div>
            {!isEmpty && (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle className="w-3 h-3" />
                Target job description loaded
              </span>
            )}
          </div>
          <span>{jobDescription.length.toLocaleString()} characters</span>
        </div>
      </div>
    </div>
  );
}
