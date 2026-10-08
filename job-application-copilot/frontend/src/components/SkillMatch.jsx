import React from 'react';
import { CheckCircle2, Check } from 'lucide-react';

export default function SkillMatch({ matchedSkills = [] }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-emerald-500/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-emerald-400">
            YOU HAVE
          </h3>
          <p className="text-xs text-slate-400">
            {matchedSkills.length} skills directly match target job requirements
          </p>
        </div>
      </div>

      {matchedSkills.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No direct matching skills detected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {matchedSkills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50 transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
