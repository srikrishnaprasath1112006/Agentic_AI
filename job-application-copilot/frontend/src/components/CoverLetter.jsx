import React, { useState } from 'react';
import { Mail, Copy, Check, RefreshCw, Send, MessageSquare } from 'lucide-react';

export default function CoverLetter({ coverLetter, recruiterMessage, onRegenerate, isRegenerating }) {
  const [copiedCover, setCopiedCover] = useState(false);
  const [copiedRecruiter, setCopiedRecruiter] = useState(false);

  const handleCopyCover = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopiedCover(true);
    setTimeout(() => setCopiedCover(false), 2000);
  };

  const handleCopyRecruiter = () => {
    if (!recruiterMessage) return;
    navigator.clipboard.writeText(recruiterMessage);
    setCopiedRecruiter(true);
    setTimeout(() => setCopiedRecruiter(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Cover Letter Section */}
      <div className="glass-panel p-6 sm:p-7 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Personalized Cover Letter</h3>
          </div>
          <div className="flex items-center gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={isRegenerating}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
                title="Regenerate letter"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            )}
            <button
              onClick={handleCopyCover}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copiedCover ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Letter</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-xs sm:text-sm font-sans whitespace-pre-wrap leading-relaxed shadow-inner">
          {coverLetter || 'No cover letter generated yet.'}
        </div>

        <p className="text-[11px] text-slate-400 mt-3 italic">
          * Note: Generated exclusively from verified facts present in your resume. Review and edit before sending.
        </p>
      </div>

      {/* Recruiter Message Section */}
      {recruiterMessage && (
        <div className="glass-panel p-6 rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h4 className="font-bold text-sm text-purple-200">
                Direct Recruiter / Hiring Manager Message (LinkedIn / Email)
              </h4>
            </div>
            <button
              onClick={handleCopyRecruiter}
              className="px-3 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copiedRecruiter ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Pitch</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-purple-900/30 text-xs text-slate-300 leading-relaxed font-sans">
            {recruiterMessage}
          </div>
        </div>
      )}
    </div>
  );
}
