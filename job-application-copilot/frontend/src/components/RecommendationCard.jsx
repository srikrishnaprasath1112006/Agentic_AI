import React from 'react';
import { Target, Compass, Info, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function RecommendationCard({ recommendation = 'Strong Match', strengths = [] }) {
  const isStrong = recommendation.toLowerCase().includes('strong');
  const isGood = recommendation.toLowerCase().includes('good');

  return (
    <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-indigo-500/30 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Target className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-indigo-300">
              🎯 AI RECOMMENDATION
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-500/40">
            {recommendation}
          </span>
        </div>

        <p className="text-sm text-slate-200 font-medium leading-relaxed mb-4">
          {isStrong
            ? 'Your profile aligns exceptionally well with the technical requirements, core competencies, and scope of this role.'
            : isGood
            ? 'Your background demonstrates solid coverage of essential requirements with a few secondary technologies worth revising.'
            : 'Your profile has transferable foundations, though addressing the highlighted technical gaps will strengthen your candidacy.'}
        </p>

        {strengths && strengths.length > 0 && (
          <div className="mb-4 space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Key Strengths Identified:
            </span>
            {strengths.map((s, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recommended Next Step:</span>
          </div>
          <p className="text-slate-300">
            {isStrong || isGood
              ? 'Customize your resume bullets using the AI suggestions below, generate your tailored cover letter, and run a mock interview.'
              : 'Review key fundamentals for missing skills before proceeding to submit your application.'}
          </p>
        </div>
      </div>

      {/* Advisory Disclaimer */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400 italic">
        <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
        <span>AI recommendations are advisory and do not constitute hiring decisions.</span>
      </div>
    </div>
  );
}
