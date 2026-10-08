import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, Code, Briefcase, GraduationCap, FolderGit2, Hash } from 'lucide-react';

export default function MatchScore({ matchResult }) {
  if (!matchResult) return null;

  const {
    overall_score = 85,
    skill_match = 90,
    experience_match = 75,
    education_match = 100,
    project_match = 85,
    keyword_match = 80,
    recommendation = 'Strong Match'
  } = matchResult;

  // Determine badge colors based on recommendation
  const getBadgeStyle = (rec) => {
    if (rec.includes('Strong')) return 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40';
    if (rec.includes('Good')) return 'from-indigo-500/20 to-purple-500/20 text-indigo-300 border-indigo-500/40';
    if (rec.includes('Moderate')) return 'from-amber-500/20 to-yellow-500/20 text-amber-300 border-amber-500/40';
    return 'from-rose-500/20 to-red-500/20 text-rose-300 border-rose-500/40';
  };

  const circumference = 2 * Math.PI * 45; // radius 45
  const strokeDashoffset = circumference - (overall_score / 100) * circumference;

  const metrics = [
    { label: 'Skills', value: skill_match, icon: Code, color: 'bg-indigo-500' },
    { label: 'Experience', value: experience_match, icon: Briefcase, color: 'bg-purple-500' },
    { label: 'Education', value: education_match, icon: GraduationCap, color: 'bg-emerald-500' },
    { label: 'Projects', value: project_match, icon: FolderGit2, color: 'bg-cyan-500' },
    { label: 'Keywords', value: keyword_match, icon: Hash, color: 'bg-pink-500' },
  ];

  return (
    <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl border border-indigo-500/30">
      <div className="text-center mb-6">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          YOUR JOB MATCH
        </span>

        {/* Circular Animated Radial Score */}
        <div className="relative w-44 h-44 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="#1e293b"
              strokeWidth="7"
            />
            {/* Animated progress ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="transparent"
              stroke="url(#gradientScore)"
              strokeWidth="7"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score number inside */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl sm:text-5xl font-black text-white tracking-tight"
            >
              {overall_score}%
            </motion.span>
            <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Overall Fit</span>
          </div>
        </div>

        {/* Recommendation Tag */}
        <div className="inline-block mt-1">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border bg-gradient-to-r ${getBadgeStyle(recommendation)} shadow-lg`}>
            {recommendation.toUpperCase()} 🚀
          </span>
        </div>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="mt-8 space-y-3.5 pt-6 border-t border-slate-800/80">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Dimension Breakdown
        </h4>
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <m.icon className="w-3.5 h-3.5 text-slate-400" />
                {m.label}
              </span>
              <span className="font-bold text-white font-mono">{m.value}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className={`h-full rounded-full ${m.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
