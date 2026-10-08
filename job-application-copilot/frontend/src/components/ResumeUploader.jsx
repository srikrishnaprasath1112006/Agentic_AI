import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Edit3 } from 'lucide-react';
import { uploadResume } from '../services/api';

export default function ResumeUploader({
  resumeText,
  setResumeText,
  candidateProfile,
  setCandidateProfile,
  onError
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      onError('Please upload a valid PDF file (.pdf).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      onError('File size exceeds the 10 MB limit. Please upload a smaller PDF.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadSuccess(false);
      const res = await uploadResume(file);
      setFileName(file.name);
      setResumeText(res.extracted_text);
      if (res.candidate_profile) {
        setCandidateProfile(res.candidate_profile);
      }
      setUploadSuccess(true);
    } catch (err) {
      onError(err.message || 'Failed to process resume PDF.');
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-lg text-white">Candidate Resume</h2>
        </div>
        {resumeText && (
          <button
            onClick={() => setShowRawText(!showRawText)}
            className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {showRawText ? 'Hide Text' : 'View / Edit Text'}
          </button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[170px] ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
            : uploadSuccess || resumeText
            ? 'border-emerald-500/40 bg-emerald-950/10'
            : 'border-slate-700/80 hover:border-indigo-500/50 bg-slate-900/40 hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-sm font-medium text-slate-300">Extracting PDF text with PyMuPDF...</p>
          </div>
        ) : uploadSuccess || (resumeText && !showRawText) ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
            <div className="text-sm font-semibold text-emerald-300">
              ✓ Resume uploaded
            </div>
            <div className="text-xs text-slate-300">
              ✓ Resume analyzed: <span className="font-semibold text-white">{candidateProfile?.name || 'Candidate'}</span>
            </div>
            {candidateProfile?.skills && (
              <div className="text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 rounded-full mt-1">
                {candidateProfile.skills.length} skills detected
              </div>
            )}
            <p className="text-[11px] text-slate-400 mt-2">
              Click to replace PDF or upload new file
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-200">
              📄 Drop your resume here
            </p>
            <p className="text-xs text-slate-400">
              or <span className="text-indigo-400 underline">browse computer</span>
            </p>
            <span className="text-[11px] text-slate-500 mt-1">
              PDF only • Maximum 10 MB
            </span>
          </div>
        )}
      </div>

      {/* Raw Text preview/edit drawer */}
      {showRawText && (
        <div className="mt-4 flex-1 flex flex-col">
          <label className="text-xs text-slate-400 mb-1">Extracted Resume Text (Editable):</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={6}
            className="w-full text-xs font-mono bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none flex-1"
            placeholder="Paste or edit resume text here..."
          />
        </div>
      )}
    </div>
  );
}
