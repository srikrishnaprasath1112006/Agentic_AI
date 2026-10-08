import React, { useState } from 'react';
import { Copy, Check, Sparkles, ArrowRight, FileEdit } from 'lucide-react';

export default function ResumeSuggestions({ improvements = [] }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!improvements || improvements.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 glass-panel rounded-2xl">
        No resume suggestions available. Run analysis to see AI bullet point revisions.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <FileEdit className="w-5 h-5 text-indigo-400" />
            <span>Targeted Bullet Point Revisions</span>
          </h3>
          <p className="text-xs text-slate-400">
            Enhanced phrasing with active metrics and targeted keywords (strictly derived from your actual experience)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {improvements.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
          >
            {/* Current / Weak */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Current Wording:
              </span>
              <p className="text-xs text-slate-400 line-through">
                {item.weak_bullet}
              </p>
            </div>

            {/* Suggested / Improved */}
            <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 relative group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  Suggested AI Revision:
                </span>
                <button
                  onClick={() => handleCopy(item.improved_bullet, idx)}
                  className="px-2.5 py-1 rounded-md bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/30 text-indigo-200 text-xs flex items-center gap-1 transition-all active:scale-95"
                  title="Copy improved bullet"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-white font-medium leading-relaxed">
                {item.improved_bullet}
              </p>
            </div>

            {/* Reason */}
            <div className="text-[11px] text-slate-400 pl-1">
              <span className="font-semibold text-slate-300">Why this works: </span>
              {item.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
