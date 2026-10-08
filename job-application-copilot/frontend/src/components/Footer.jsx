import React from 'react';
import { Bot, Heart, Sparkles, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-[#070b13] py-10 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Job Application Copilot</span>
          <span>• Agentic AI Workshop Architecture</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Human-in-the-Loop Controlled
          </span>
          <span>•</span>
          <span>Powered by LangGraph & PyMuPDF</span>
        </div>
      </div>
    </footer>
  );
}
