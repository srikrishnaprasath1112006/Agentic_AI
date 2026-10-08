import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Circle, AlertCircle, Bot, Cpu } from 'lucide-react';

const agentConfigs = [
  {
    key: 'resume_agent',
    name: 'Resume Agent',
    icon: '📄',
    runningDesc: 'Parsing skills, experience, and projects...',
    completedDesc: 'Candidate structure successfully extracted',
  },
  {
    key: 'job_agent',
    name: 'Job Analysis Agent',
    icon: '🎯',
    runningDesc: 'Analyzing responsibilities, required skills, and keywords...',
    completedDesc: 'Job requirements and qualifications identified',
  },
  {
    key: 'match_agent',
    name: 'Match Agent',
    icon: '⚖️',
    runningDesc: 'Calculating deterministic multi-factor fit score...',
    completedDesc: 'Skill gaps and alignment metrics evaluated',
  },
  {
    key: 'career_agent',
    name: 'Career Coach Agent',
    icon: '🚀',
    runningDesc: 'Formulating resume revisions, cover letter, and interview prep...',
    completedDesc: 'Application kit and interview questions generated',
  },
];

export default function AgentActivity({ agentStatuses }) {
  return (
    <div className="glass-panel-glow p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto my-8 border border-indigo-500/30">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Bot className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <span>🤖 COPILOT WORKING</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              LangGraph Orchestrator
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Coordinating specialized autonomous agents through shared state
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {agentConfigs.map((agent, index) => {
          const status = agentStatuses[agent.key] || 'pending';
          const isCompleted = status === 'completed';
          const isRunning = status === 'running';
          const isFailed = status === 'failed';
          const isPending = status === 'pending';

          return (
            <motion.div
              key={agent.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                isRunning
                  ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                  : isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : isFailed
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : 'bg-slate-900/30 border-slate-800/60 opacity-60'
              }`}
            >
              {/* Status Icon */}
              <div className="pt-0.5">
                {isCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-scale" />
                )}
                {isRunning && (
                  <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                )}
                {isFailed && (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                )}
                {isPending && (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{agent.icon}</span>
                    <span>{agent.name}</span>
                  </span>
                  <span
                    className={`text-[11px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
                        : isRunning
                        ? 'text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 animate-pulse'
                        : isFailed
                        ? 'text-rose-300 bg-rose-500/10 border border-rose-500/20'
                        : 'text-slate-500 bg-slate-800/40'
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {isRunning
                    ? agent.runningDesc
                    : isCompleted
                    ? agent.completedDesc
                    : isFailed
                    ? 'Step encountered an error'
                    : 'Waiting in LangGraph queue...'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
