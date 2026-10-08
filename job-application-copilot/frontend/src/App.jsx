import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Mail,
  Mic,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  ChevronDown
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ResumeUploader from './components/ResumeUploader';
import JobInput from './components/JobInput';
import AnalyzeButton from './components/AnalyzeButton';
import AgentActivity from './components/AgentActivity';
import MatchScore from './components/MatchScore';
import SkillMatch from './components/SkillMatch';
import SkillGap from './components/SkillGap';
import RecommendationCard from './components/RecommendationCard';
import ResumeSuggestions from './components/ResumeSuggestions';
import CoverLetter from './components/CoverLetter';
import InterviewQuestions from './components/InterviewQuestions';
import MockInterview from './components/MockInterview';
import ErrorMessage from './components/ErrorMessage';
import Footer from './components/Footer';

import { analyzeJob, checkBackendStatus } from './services/api';
import { SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTION } from './data/sampleData';

export default function App() {
  // Input states
  const [resumeText, setResumeText] = useState('');
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  // Status & system states
  const [backendOnline, setBackendOnline] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Multi-agent progress tracking
  const [agentStatuses, setAgentStatuses] = useState({
    resume_agent: 'pending',
    job_agent: 'pending',
    match_agent: 'pending',
    career_agent: 'pending',
  });

  // Analysis Result
  const [analysisResult, setAnalysisResult] = useState(null);

  // Application Kit Tabs
  const [activeKitTab, setActiveKitTab] = useState('resume'); // 'resume' | 'cover' | 'questions' | 'interview'

  // Practice question passed to Mock Interview
  const [mockPracticeQuestion, setMockPracticeQuestion] = useState(null);

  const resultsRef = useRef(null);
  const formRef = useRef(null);

  // Check health on mount
  useEffect(() => {
    async function verifyBackend() {
      const status = await checkBackendStatus();
      setBackendOnline(status.healthy);
      if (status.healthy) {
        setIsDemoMode(status.demo_mode ?? !status.llm_configured);
      }
    }
    verifyBackend();
  }, []);

  // Demo loader action
  const handleTryDemo = () => {
    setResumeText(SAMPLE_RESUME_TEXT);
    setCandidateProfile({
      name: 'Alex Morgan',
      skills: ['Python', 'PyTorch', 'FastAPI', 'Docker', 'SQL', 'Git', 'Machine Learning', 'NLP', 'Computer Vision'],
      experience: ['Machine Learning Engineer at Apex AI Systems (2022 - Present)'],
      education: ['B.S. in Computer Science - UC Berkeley'],
      projects: ['Autonomous Multi-Agent Workflow Engine', 'Neural Document Retrieval System']
    });
    setJobDescription(SAMPLE_JOB_DESCRIPTION);
    setErrorMessage('');
  };

  // Run LangGraph analysis
  const handleAnalyze = async () => {
    let effectiveResume = resumeText.trim();
    let effectiveJob = jobDescription.trim();

    // If neither is present, run full demo
    if (!effectiveResume && !effectiveJob) {
      handleTryDemo();
      effectiveResume = SAMPLE_RESUME_TEXT;
      effectiveJob = SAMPLE_JOB_DESCRIPTION;
    } else if (!effectiveResume) {
      setErrorMessage('Please upload a resume first, or click "✨ Try Demo".');
      return;
    }

    // If resume is present but job description is empty, auto-populate target role
    if (!effectiveJob) {
      effectiveJob = SAMPLE_JOB_DESCRIPTION;
      setJobDescription(SAMPLE_JOB_DESCRIPTION);
    }

    setErrorMessage('');
    setIsLoading(true);
    setAnalysisResult(null);


    // Initial agent states
    setAgentStatuses({
      resume_agent: 'running',
      job_agent: 'pending',
      match_agent: 'pending',
      career_agent: 'pending',
    });

    // Animate agent steps for visible agentic presentation
    const timer1 = setTimeout(() => {
      setAgentStatuses(prev => ({ ...prev, resume_agent: 'completed', job_agent: 'running' }));
    }, 600);

    const timer2 = setTimeout(() => {
      setAgentStatuses(prev => ({ ...prev, job_agent: 'completed', match_agent: 'running' }));
    }, 1300);

    const timer3 = setTimeout(() => {
      setAgentStatuses(prev => ({ ...prev, match_agent: 'completed', career_agent: 'running' }));
    }, 2000);

    try {
      const data = await analyzeJob(effectiveResume, effectiveJob);

      // Finish agent sequence
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      setAgentStatuses({
        resume_agent: 'completed',
        job_agent: 'completed',
        match_agent: 'completed',
        career_agent: 'completed',
      });

      // Brief delay to let user see all completed agents
      setTimeout(() => {
        setAnalysisResult(data);
        setIsLoading(false);
        setIsDemoMode(data.is_demo_mode);
        // Smooth scroll to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }, 500);

    } catch (err) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setAgentStatuses({
        resume_agent: 'failed',
        job_agent: 'failed',
        match_agent: 'failed',
        career_agent: 'failed',
      });
      setIsLoading(false);
      setErrorMessage(err.message || 'An unexpected error occurred during analysis.');
    }
  };

  const handlePracticeQuestionFromList = (q) => {
    setMockPracticeQuestion(q);
    setActiveKitTab('interview');
    setTimeout(() => {
      document.getElementById('application-kit')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      <Navbar
        isDemoMode={isDemoMode}
        onTryDemo={handleTryDemo}
        backendOnline={backendOnline}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        <Hero onScrollToForm={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} />

        {/* Global Error Banner */}
        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage('')}
        />

        {/* Inputs Section */}
        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
          <ResumeUploader
            resumeText={resumeText}
            setResumeText={setResumeText}
            candidateProfile={candidateProfile}
            setCandidateProfile={setCandidateProfile}
            onError={(msg) => setErrorMessage(msg)}
          />

          <JobInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
          />
        </div>

        {/* Analyze CTA */}
        <AnalyzeButton
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          hasResume={!!resumeText.trim()}
          hasJob={!!jobDescription.trim()}
        />


        {/* Agent Activity Live Workflow */}
        {isLoading && (
          <AgentActivity agentStatuses={agentStatuses} />
        )}

        {/* Results Page */}
        <AnimatePresence>
          {analysisResult && !isLoading && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-14 space-y-10"
            >
              {/* Section Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Agent Analysis Synthesized</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Career Match & Strategic Breakdown
                </h2>
                <p className="text-sm text-slate-400 max-w-xl mx-auto">
                  Evaluated target fit for{' '}
                  <strong className="text-slate-200">
                    {analysisResult.job_profile?.title || 'Target Role'}
                  </strong>{' '}
                  at{' '}
                  <strong className="text-slate-200">
                    {analysisResult.job_profile?.company || 'Target Company'}
                  </strong>
                </p>
              </div>

              {/* Match Score & Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Radial Score card */}
                <div className="lg:col-span-1">
                  <MatchScore matchResult={analysisResult.match_result} />
                </div>

                {/* Right columns: Skills & Gaps + Recommendation */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                    <SkillMatch
                      matchedSkills={analysisResult.match_result?.matched_skills || []}
                    />
                    <SkillGap
                      gaps={analysisResult.match_result?.gaps || []}
                      missingSkills={analysisResult.match_result?.missing_skills || []}
                    />
                  </div>

                  <RecommendationCard
                    recommendation={analysisResult.match_result?.recommendation}
                    strengths={analysisResult.match_result?.strengths}
                  />
                </div>
              </div>

              {/* Application Kit Section */}
              <div id="application-kit" className="pt-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-indigo-400" />
                      <span>Application Acceleration Kit</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Coached application assets ready to copy, customize, and practice
                    </p>
                  </div>

                  {/* Tabs */}
                  <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
                    <button
                      onClick={() => setActiveKitTab('resume')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeKitTab === 'resume'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Resume Improvements</span>
                    </button>

                    <button
                      onClick={() => setActiveKitTab('cover')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeKitTab === 'cover'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Cover Letter</span>
                    </button>

                    <button
                      onClick={() => setActiveKitTab('questions')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeKitTab === 'questions'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Interview Prep</span>
                    </button>

                    <button
                      onClick={() => setActiveKitTab('interview')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        activeKitTab === 'interview'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                      }`}
                    >
                      <Mic className="w-3.5 h-3.5" />
                      <span>Mock Interview</span>
                    </button>
                  </div>
                </div>

                {/* Tab Contents */}
                <div>
                  {activeKitTab === 'resume' && (
                    <ResumeSuggestions
                      improvements={analysisResult.career_result?.resume_improvements || []}
                    />
                  )}

                  {activeKitTab === 'cover' && (
                    <CoverLetter
                      coverLetter={analysisResult.career_result?.cover_letter}
                      recruiterMessage={analysisResult.career_result?.recruiter_message}
                    />
                  )}

                  {activeKitTab === 'questions' && (
                    <InterviewQuestions
                      interviewQuestions={analysisResult.career_result?.interview_questions}
                      onPracticeQuestion={handlePracticeQuestionFromList}
                    />
                  )}

                  {activeKitTab === 'interview' && (
                    <MockInterview
                      questions={[
                        ...(mockPracticeQuestion ? [mockPracticeQuestion] : []),
                        ...(analysisResult.career_result?.interview_questions?.technical || []),
                        ...(analysisResult.career_result?.interview_questions?.project || []),
                        ...(analysisResult.career_result?.interview_questions?.hr || []),
                      ]}
                      jobDescription={jobDescription}
                      candidateProfile={analysisResult.candidate_profile}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
