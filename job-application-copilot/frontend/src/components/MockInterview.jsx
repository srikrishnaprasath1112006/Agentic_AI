import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, Bot, CheckCircle, ArrowRight, RotateCcw, Sparkles, User, Award, Lightbulb } from 'lucide-react';
import { evaluateInterviewAnswer } from '../services/api';

const DEFAULT_QUESTIONS = [
  "Tell me about yourself and why your background aligns with this role.",
  "Can you describe the most technically challenging project you have worked on and how you resolved its bottleneck?",
  "How do you approach designing scalable machine learning pipelines or backend APIs under heavy latency constraints?",
  "Tell me about a time you had a technical disagreement with a colleague or lead. How did you handle it?",
  "Where do you see yourself contributing most to our engineering team in the first 90 days?"
];

export default function MockInterview({
  questions = [],
  jobDescription = '',
  candidateProfile = {}
}) {
  const interviewQuestions = questions && questions.length > 0 ? questions.slice(0, 5) : DEFAULT_QUESTIONS;

  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const currentQuestion = interviewQuestions[currentIndex];

  const handleStart = () => {
    setHasStarted(true);
    setCurrentIndex(0);
    setUserAnswer('');
    setEvaluation(null);
    setHistory([]);
    setErrorMessage('');
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) {
      setErrorMessage('Please type an answer before submitting.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await evaluateInterviewAnswer(
        currentQuestion,
        userAnswer,
        jobDescription,
        candidateProfile
      );
      setEvaluation(res);
      setHistory(prev => [...prev, {
        question: currentQuestion,
        answer: userAnswer,
        evaluation: res
      }]);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to evaluate answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < interviewQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
      setEvaluation(null);
    } else {
      // Completed all 5 questions
      setCurrentIndex(interviewQuestions.length);
    }
  };

  const isCompleted = currentIndex >= interviewQuestions.length;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <span>AI MOCK INTERVIEW</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Interactive Coach
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Practice real-time questions with instantaneous AI scoring and constructive tips
            </p>
          </div>
        </div>

        {hasStarted && !isCompleted && (
          <div className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
            Question {currentIndex + 1} of {interviewQuestions.length}
          </div>
        )}
      </div>

      {/* Screen 1: Not Started */}
      {!hasStarted && (
        <div className="py-12 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-[1px] mb-4">
            <div className="w-full h-full bg-slate-950 rounded-[15px] flex items-center justify-center">
              <Bot className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h4 className="text-xl font-bold text-white mb-2">Ready to test yourself?</h4>
          <p className="text-sm text-slate-400 max-w-md mb-8">
            Experience a simulated interview tailored to your uploaded background and the target role. You'll receive instant dimensional scores and actionable coaching.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95"
          >
            <Mic className="w-4 h-4" />
            <span>Start Interview</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Screen 2: Active Question */}
      {hasStarted && !isCompleted && (
        <div className="space-y-6">
          {/* Question Box */}
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-indigo-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
              <Bot className="w-4 h-4" />
              <span>INTERVIEWER</span>
            </div>
            <p className="text-base text-white font-semibold leading-relaxed">
              "{currentQuestion}"
            </p>
          </div>

          {/* User Answer Box (if not evaluated yet) */}
          {!evaluation ? (
            <div className="space-y-3">
              <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Your Response:</span>
              </label>
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer... (e.g., Use the STAR method: Situation, Task, Action, Result)"
                rows={5}
                className="w-full p-4 text-sm bg-slate-950/90 border border-slate-800 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none font-sans"
              />

              {errorMessage && (
                <p className="text-xs text-rose-400">{errorMessage}</p>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {userAnswer.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>{isSubmitting ? 'Evaluating...' : 'Submit Answer'}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Evaluation Results Screen */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-5"
            >
              {/* Score Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-950/60">
                <div>
                  <span className="text-xs uppercase font-bold text-slate-400">Overall Answer Score</span>
                  <div className="text-3xl font-black text-white flex items-baseline gap-1 mt-0.5">
                    <span>{evaluation.score}</span>
                    <span className="text-base text-slate-400 font-normal">/ 100</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Communication</span>
                    <span className="text-sm font-bold text-cyan-300 font-mono">{evaluation.communication_score}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Technical</span>
                    <span className="text-sm font-bold text-indigo-300 font-mono">{evaluation.technical_score}%</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Relevance</span>
                    <span className="text-sm font-bold text-emerald-300 font-mono">{evaluation.relevance_score}%</span>
                  </div>
                </div>
              </div>

              {/* Feedback */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>AI Feedback & Suggestions:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {evaluation.feedback}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {evaluation.strengths && evaluation.strengths.length > 0 && (
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <span className="font-semibold text-emerald-300">Strengths:</span>
                    {evaluation.strengths.map((s, idx) => (
                      <p key={idx} className="text-slate-300">• {s}</p>
                    ))}
                  </div>
                )}
                {evaluation.improvements && evaluation.improvements.length > 0 && (
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                    <span className="font-semibold text-rose-300">Areas for Polish:</span>
                    {evaluation.improvements.map((imp, idx) => (
                      <p key={idx} className="text-slate-300">• {imp}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Next Question Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <span>{currentIndex < interviewQuestions.length - 1 ? 'Next Question →' : 'View Summary →'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Screen 3: Completed All Questions */}
      {isCompleted && (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-white mb-1">Interview Session Complete!</h4>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            You've practiced {history.length} questions. You're ready to communicate your value effectively to hiring managers.
          </p>

          <div className="w-full text-left space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {history.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <div className="font-medium text-slate-200 mb-1">Q{idx + 1}: {item.question}</div>
                <div className="text-slate-400 flex items-center justify-between">
                  <span>Score: <strong className="text-indigo-400">{item.evaluation?.score}/100</strong></span>
                  <span className="text-[11px] text-slate-400 truncate max-w-[280px]">{item.evaluation?.feedback}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Again</span>
          </button>
        </div>
      )}
    </div>
  );
}
