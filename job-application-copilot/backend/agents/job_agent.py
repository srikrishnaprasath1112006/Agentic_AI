import re
import logging
from typing import Dict, Any
from backend.services.ai_service import ai_service

logger = logging.getLogger("copilot.job_agent")


def fallback_extract_job(job_text: str) -> Dict[str, Any]:
    """Deterministic, rule-based fallback extractor for job descriptions."""
    lines = [line.strip() for line in job_text.splitlines() if line.strip()]

    title = "AI/ML Engineer"
    company = "Tech Innovations Inc."
    location = "San Francisco, CA (Hybrid)"
    experience = "2+ years"

    # Extract title if near start
    for line in lines[:5]:
        if any(w in line.lower() for w in ["engineer", "developer", "scientist", "manager", "architect", "lead"]):
            title = line.strip("#: -")
            break

    # Extract company
    for line in lines[:8]:
        if "at " in line.lower() or "company:" in line.lower():
            comp_match = re.search(r"(?:at|company:)\s*([A-Za-z0-9\s]+)", line, re.IGNORECASE)
            if comp_match:
                company = comp_match.group(1).strip()
                break

    # Extract location
    for line in lines[:10]:
        if any(loc in line.lower() for loc in ["remote", "hybrid", "on-site", "location:", "san francisco", "new york", "london", "bangalore"]):
            location = line.strip("#: -")
            break

    # Extract experience
    exp_match = re.search(r"(\d+\+?\s*(?:to\s*\d+\+?)?\s*years(?:\s*of\s*experience)?)", job_text, re.IGNORECASE)
    if exp_match:
        experience = exp_match.group(1)

    skill_candidates = [
        "Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "Kubernetes",
        "AWS", "GCP", "SQL", "Git", "REST APIs", "Machine Learning", "Deep Learning",
        "LLMs", "LangChain", "NLP", "Pandas", "Scikit-Learn", "Computer Vision",
        "CI/CD", "Kafka", "PostgreSQL", "Redis"
    ]
    required_skills = []
    preferred_skills = []
    text_lower = job_text.lower()

    for s in skill_candidates:
        pattern = r"\b" + re.escape(s.lower()) + r"\b"
        if re.search(pattern, text_lower):
            if any(pref in text_lower for pref in ["nice to have", "plus", "preferred"]):
                # Simple split logic
                if s in ["Kubernetes", "AWS", "Kafka", "Redis"]:
                    preferred_skills.append(s)
                else:
                    required_skills.append(s)
            else:
                required_skills.append(s)

    if not required_skills:
        required_skills = ["Python", "Machine Learning", "FastAPI", "SQL", "Git"]
    if not preferred_skills:
        preferred_skills = ["AWS", "Docker", "Kubernetes"]

    # Responsibilities
    responsibilities = []
    for line in lines:
        if line.startswith(("-", "•", "*")) and len(line) > 15:
            responsibilities.append(line.lstrip("-•* "))
            if len(responsibilities) >= 4:
                break

    if not responsibilities:
        responsibilities = [
            "Design and deploy production-grade machine learning models and pipelines",
            "Collaborate with cross-functional teams to integrate AI capabilities into backend services",
            "Optimize inference latency and model scalability in cloud environments",
            "Maintain code quality, automated testing, and CI/CD workflows"
        ]

    keywords = list(set([title, "Machine Learning", "Scalability", "Production", "Pipelines"] + required_skills[:4]))

    return {
        "title": title,
        "company": company,
        "location": location,
        "experience": experience,
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "education": ["Bachelor's degree or equivalent in Computer Science or related STEM field"],
        "responsibilities": responsibilities,
        "keywords": keywords
    }


async def parse_job_description(job_description: str) -> Dict[str, Any]:
    """Job Agent: extracts structured specifications from job description."""
    if not ai_service.is_configured():
        logger.info("Using deterministic job description parsing (Demo Mode)")
        return fallback_extract_job(job_description)

    prompt = f"""You are the Job Analysis Agent. Analyze the pasted job description.
Do not hallucinate missing information. If information is not present, return empty lists or empty strings.

Job Description:
\"\"\"
{job_description}
\"\"\"

Return a valid JSON object matching this schema:
{{
  "title": "AI/ML Engineer",
  "company": "Company Name",
  "location": "Location or Remote status",
  "experience": "e.g. 2+ years",
  "required_skills": ["Skill 1", "Skill 2", ...],
  "preferred_skills": ["Skill 1", ...],
  "education": ["Education requirement", ...],
  "responsibilities": ["Responsibility 1", ...],
  "keywords": ["Key term 1", "Key term 2", ...]
}}
"""
    system_prompt = "You are a professional HR Job Analyst. Extract precise, factual job requirements without embellishment."

    try:
        data = await ai_service.generate_json(prompt, system_prompt=system_prompt)
        # Ensure default keys
        for key in ["title", "company", "location", "experience", "required_skills", "preferred_skills", "education", "responsibilities", "keywords"]:
            if key not in data or data[key] is None:
                data[key] = [] if "skills" in key or "responsibilities" in key or "keywords" in key or "education" in key else ""
        return data
    except Exception as e:
        logger.warning(f"Job Agent LLM extraction failed: {e}. Falling back to deterministic extractor.")
        return fallback_extract_job(job_description)
