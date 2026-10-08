const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Upload resume PDF file and extract structured candidate profile.
 */
export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/resume/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload failed (${response.status})`);
  }

  return response.json();
}

/**
 * Run LangGraph workflow orchestrating Resume, Job, Match, and Career Coach agents.
 */
export async function analyzeJob(resumeText, jobDescription) {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Analysis failed (${response.status})`);
  }

  return response.json();
}

/**
 * Evaluate user's mock interview response with actionable AI coaching feedback.
 */
export async function evaluateInterviewAnswer(question, answer, jobDescription = '', candidateProfile = {}) {
  const response = await fetch(`${API_BASE_URL}/api/interview/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question,
      answer,
      job_description: jobDescription,
      candidate_profile: candidateProfile,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Evaluation failed (${response.status})`);
  }

  return response.json();
}

/**
 * Check backend health and demo mode status.
 */
export async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) return { healthy: false };
    const data = await response.json();
    return { healthy: true, ...data };
  } catch (err) {
    return { healthy: false, error: err.message };
  }
}
