import React from 'react';
import { AlertTriangle, Lightbulb } from 'lucide-react';

export default function SkillGap({ gaps = [], missingSkills = [] }) {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-amber-500/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider text-amber-400">
            SKILL GAPS
          </h3>
          <p className="text-xs text-slate-400">
            Target areas to brush up for interviews and future qualification
          </p>
        </div>
      </div>

      {gaps.length === 0 && missingSkills.length === 0 ? (
        <p className="text-xs text-emerald-300">
          ✨ Excellent alignment! No critical skill gaps identified.
        </p>
      ) : (
        <div className="space-y-3">
          {gaps.map((gapText, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-200"
            >
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {gapText}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
