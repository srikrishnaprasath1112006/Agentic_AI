from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class CandidateProfile(BaseModel):
    name: str = "Candidate Name"
    education: List[str] = Field(default_factory=list)
    skills: List[str] = Field(default_factory=list)
    projects: List[str] = Field(default_factory=list)
    experience: List[str] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)


class JobProfile(BaseModel):
    title: str = "Job Title"
    company: str = "Hiring Company"
    location: str = ""
    experience: str = ""
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    education: List[str] = Field(default_factory=list)
    responsibilities: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)


class MatchResult(BaseModel):
    overall_score: int
    skill_match: int
    experience_match: int
    education_match: int
    project_match: int
    keyword_match: int
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    strengths: List[str] = Field(default_factory=list)
    gaps: List[str] = Field(default_factory=list)
    recommendation: str  # "Strong Match", "Good Match", "Moderate Match", "Weak Match"


class ResumeImprovement(BaseModel):
    weak_bullet: str
    improved_bullet: str
    reason: str


class InterviewQuestions(BaseModel):
    technical: List[str] = Field(default_factory=list)
    project: List[str] = Field(default_factory=list)
    hr: List[str] = Field(default_factory=list)


class CareerResult(BaseModel):
    resume_improvements: List[ResumeImprovement] = Field(default_factory=list)
    cover_letter: str
    recruiter_message: str
    interview_questions: InterviewQuestions


class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str


class AnalyzeResponse(BaseModel):
    candidate_profile: Dict[str, Any]
    job_profile: Dict[str, Any]
    match_result: Dict[str, Any]
    career_result: Dict[str, Any]
    is_demo_mode: bool = False


class InterviewEvaluateRequest(BaseModel):
    question: str
    answer: str
    job_description: Optional[str] = ""
    candidate_profile: Optional[Dict[str, Any]] = None


class InterviewEvaluateResponse(BaseModel):
    score: int
    communication_score: int = 80
    technical_score: int = 85
    relevance_score: int = 85
    strengths: List[str] = Field(default_factory=list)
    improvements: List[str] = Field(default_factory=list)
    feedback: str
    is_demo_mode: bool = False


class ResumeUploadResponse(BaseModel):
    filename: str
    text_length: int
    extracted_text: str
    candidate_profile: Dict[str, Any]
    is_demo_mode: bool = False
