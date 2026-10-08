import logging
from typing import Dict, Any, List
from backend.services.ai_service import ai_service

logger = logging.getLogger("copilot.career_agent")


def fallback_career_coaching(candidate_profile: Dict[str, Any], job_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Deterministic fallback for Career Coach when LLM API key is unconfigured."""
    name = candidate_profile.get("name", "Applicant")
    title = job_profile.get("title", "Software Engineer")
    company = job_profile.get("company", "the hiring team")
    top_skills = candidate_profile.get("skills", ["Python", "Machine Learning", "System Design"])
    skills_str = ", ".join(top_skills[:3])

    resume_improvements = [
        {
            "weak_bullet": "Worked on machine learning models and backend APIs for data processing.",
            "improved_bullet": f"Engineered and deployed scalable ML inference pipelines using {skills_str}, improving data throughput by 35% and reducing request latency.",
            "reason": "Replaced vague task description with quantifiable impact, specific technical stack, and active verb framing."
        },
        {
            "weak_bullet": "Assisted team with bug fixes, code reviews, and database queries.",
            "improved_bullet": "Collaborated across cross-functional engineering teams to conduct thorough peer code reviews and optimize high-frequency SQL queries.",
            "reason": "Demonstrates collaborative initiative, software quality ownership, and specific engineering practices."
        },
        {
            "weak_bullet": "Built personal projects using modern open-source frameworks.",
            "improved_bullet": f"Architected end-to-end full-stack applications integrating {top_skills[0] if top_skills else 'Python'} services with automated CI/CD deployment.",
            "reason": "Highlights system architecture capabilities, independence, and production-readiness of projects."
        }
    ]

    cover_letter = f"""Dear Hiring Team at {company},

I am writing to express my strong enthusiasm for the {title} position. With a solid foundation in {skills_str} and a track record of building reliable, data-driven applications, I am eager to contribute to your engineering initiatives.

Throughout my experience and technical projects, I have focused on delivering robust code, optimizing system performance, and applying modern machine learning methodologies to solve real-world problems. Your mission at {company} strongly aligns with my passion for high-impact software development.

I would welcome the opportunity to discuss how my technical skills and enthusiasm for innovation can support your team's goals. Thank you for your time and consideration.

Sincerely,
{name}"""

    recruiter_message = f"Hi [Recruiter Name], I noticed the {title} opening at {company} and would love to connect. I bring hands-on experience in {skills_str} and have built production-grade systems aligning closely with your tech stack. Would love to share my portfolio if you have a brief moment. Thanks!"

    interview_questions = {
        "technical": [
            f"How would you optimize an inference pipeline or API built with {top_skills[0] if top_skills else 'Python'} under high concurrent traffic?",
            "Explain the trade-offs between precision and recall when evaluating classification models on imbalanced datasets.",
            f"How do you design database schema and indexing strategies for high-volume transactions in {company}?"
        ],
        "project": [
            f"Walk us through the architecture of your {candidate_profile.get('projects', ['primary project'])[0] if candidate_profile.get('projects') else 'flagship project'}. What was the most challenging technical roadblock?",
            "Describe a time when you had to refactor a codebase or modify a system design based on production bottlenecks."
        ],
        "hr": [
            f"What attracts you specifically to {company} and the {title} role?",
            "Can you describe a scenario where you disagreed with a teammate on technical implementation and how you resolved it?"
        ]
    }

    return {
        "resume_improvements": resume_improvements,
        "cover_letter": cover_letter.strip(),
        "recruiter_message": recruiter_message.strip(),
        "interview_questions": interview_questions
    }


async def generate_career_guidance(candidate_profile: Dict[str, Any], job_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Career Coach Agent: generates resume improvements, cover letter, recruiter message, and interview questions."""
    if not ai_service.is_configured():
        logger.info("Using deterministic career coaching (Demo Mode)")
        return fallback_career_coaching(candidate_profile, job_profile)

    prompt = f"""You are the Career Coach Agent.
Based solely on the verified candidate profile and job requirements below, generate:
1. Three resume improvement bullet points (only polish existing facts, NEVER invent experience/numbers).
2. A professional, concise cover letter.
3. A short LinkedIn/email recruiter outreach message.
4. Interview questions: exactly 3 technical, 2 project-focused, and 2 HR/behavioral questions.

Candidate Profile:
{candidate_profile}

Job Profile:
{job_profile}

Return a valid JSON object matching this schema:
{{
  "resume_improvements": [
    {{
      "weak_bullet": "...",
      "improved_bullet": "...",
      "reason": "..."
    }}
  ],
  "cover_letter": "...",
  "recruiter_message": "...",
  "interview_questions": {{
    "technical": ["...", "...", "..."],
    "project": ["...", "..."],
    "hr": ["...", "..."]
  }}
}}
"""
    system_prompt = "You are an elite career coach. Provide impactful, concise, and realistic application materials without hallucinating claims."

    try:
        data = await ai_service.generate_json(prompt, system_prompt=system_prompt)
        # Ensure schema structure
        if "resume_improvements" not in data or "cover_letter" not in data or "interview_questions" not in data:
            raise ValueError("Incomplete career coaching payload from LLM")
        return data
    except Exception as e:
        logger.warning(f"Career Agent LLM call failed: {e}. Falling back to deterministic guidance.")
        return fallback_career_coaching(candidate_profile, job_profile)
