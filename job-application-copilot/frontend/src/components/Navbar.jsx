import React from 'react';
import { Sparkles, Bot, ShieldCheck, FileCheck } from 'lucide-react';

export default function Navbar({ isDemoMode, onTryDemo, backendOnline }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#090d16]/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#0b1120] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Job Application <span className="gradient-text">Copilot</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Multi-Agent Career Assistant</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
            <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
            <span className="text-slate-300">
              {backendOnline ? (isDemoMode ? 'Demo Mode (Offline Agents)' : 'Live AI Connected') : 'Connecting...'}
            </span>
          </div>

          {/* Try Demo Button */}
          <button
            onClick={onTryDemo}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/30 text-indigo-200 text-xs font-medium transition-all shadow-sm active:scale-95"
            title="Load sample resume & job description"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>✨ Try Demo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
