import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Target, Mail, Mic, ArrowDown } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: '📄 Resume Intelligence',
    desc: 'Deep structural extraction of candidate skills, projects, and career milestones.',
    color: 'from-blue-500/20 to-indigo-500/20',
    border: 'border-blue-500/30'
  },
  {
    icon: Target,
    title: '🎯 Job Matching',
    desc: 'Deterministic multi-factor alignment: skills, experience, education, and keywords.',
    color: 'from-purple-500/20 to-pink-500/20',
    border: 'border-purple-500/30'
  },
  {
    icon: Mail,
    title: '✉️ Application Builder',
    desc: 'Bullet point rewrites, tailored cover letters, and recruiter outreach pitches.',
    color: 'from-cyan-500/20 to-teal-500/20',
    border: 'border-cyan-500/30'
  },
  {
    icon: Mic,
    title: '🎤 Interview Coach',
    desc: 'Curated technical questions and real-time interactive mock interview feedback.',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30'
  }
];

export default function Hero({ onScrollToForm }) {
  return (
    <div className="relative py-12 md:py-16 text-center overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[200px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
            <span>Multi-Agent LangGraph Workflow</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-4">
            JOB APPLICATION <span className="gradient-text">COPILOT</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal mb-8">
            Your AI teammate for getting hired. Upload your resume, paste a target job description, and watch our multi-agent team build your winning application.
          </p>
        </motion.div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 text-left">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className={`p-4 rounded-xl bg-[#0f172a]/70 border ${f.border} backdrop-blur-sm hover:border-indigo-400/50 transition-all group`}
            >
              <div className="text-base font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">
                {f.title}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
