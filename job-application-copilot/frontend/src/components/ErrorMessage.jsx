import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ErrorMessage({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="max-w-2xl mx-auto my-4 p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start justify-between gap-3 text-rose-200 text-xs shadow-lg animate-fadeIn">
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        <span className="leading-relaxed">{message}</span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-white p-1 rounded transition-colors"
          title="Dismiss error"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
