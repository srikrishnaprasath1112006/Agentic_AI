import logging
from typing import Dict, Any, List

logger = logging.getLogger("copilot.match_agent")


def normalize_skill(skill: str) -> str:
    """Normalize skill name for fuzzy matching."""
    s = skill.lower().strip()
    replacements = {
        "react.js": "react",
        "reactjs": "react",
        "node": "node.js",
        "nodejs": "node.js",
        "ml": "machine learning",
        "dl": "deep learning",
        "tf": "tensorflow",
        "k8s": "kubernetes",
        "js": "javascript",
        "ts": "typescript",
        "postgres": "postgresql"
    }
    return replacements.get(s, s)


def calculate_match(candidate_profile: Dict[str, Any], job_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate deterministic scores between candidate and job profile."""
    candidate_skills = candidate_profile.get("skills", [])
    required_skills = job_profile.get("required_skills", [])
    preferred_skills = job_profile.get("preferred_skills", [])
    all_job_skills = required_skills + [s for s in preferred_skills if s not in required_skills]

    cand_skills_norm = {normalize_skill(s): s for s in candidate_skills}

    matched_skills: List[str] = []
    missing_skills: List[str] = []

    for req in all_job_skills:
        req_norm = normalize_skill(req)
        # Check direct or substring match
        matched = False
        for c_norm, orig in cand_skills_norm.items():
            if req_norm == c_norm or req_norm in c_norm or c_norm in req_norm:
                matched_skills.append(orig)
                matched = True
                break
        if not matched:
            missing_skills.append(req)

    # 1. Skill Match (40% weight)
    if not all_job_skills:
        skill_score = 80
    else:
        req_matched_count = sum(
            1 for req in required_skills
            if any(normalize_skill(req) in normalize_skill(c) or normalize_skill(c) in normalize_skill(req) for c in candidate_skills)
        )
        base_ratio = req_matched_count / max(len(required_skills), 1)
        skill_score = min(100, max(25, int(base_ratio * 95) + (5 if any(p in matched_skills for p in preferred_skills) else 0)))

    # 2. Experience Match (20% weight)
    cand_exp = candidate_profile.get("experience", [])
    if len(cand_exp) >= 3:
        exp_score = 90
    elif len(cand_exp) == 2:
        exp_score = 80
    elif len(cand_exp) == 1:
        exp_score = 70
    else:
        exp_score = 45

    # 3. Education Match (15% weight)
    cand_edu = candidate_profile.get("education", [])
    job_edu = job_profile.get("education", [])
    if cand_edu:
        edu_score = 95 if any("master" in str(e).lower() or "ph.d" in str(e).lower() or "bachelor" in str(e).lower() for e in cand_edu) else 85
    else:
        edu_score = 60

    # 4. Project Relevance (15% weight)
    cand_proj = candidate_profile.get("projects", [])
    proj_text = " ".join([str(p).lower() for p in cand_proj])
    overlap_proj = sum(1 for s in all_job_skills if s.lower() in proj_text)
    if len(cand_proj) >= 2 and overlap_proj >= 1:
        proj_score = min(95, 75 + overlap_proj * 8)
    elif len(cand_proj) >= 1:
        proj_score = 70
    else:
        proj_score = 50

    # 5. Keyword Match (10% weight)
    keywords = job_profile.get("keywords", [])
    all_cand_text = " ".join([
        " ".join(candidate_skills),
        " ".join(candidate_profile.get("projects", [])),
        " ".join(candidate_profile.get("experience", []))
    ]).lower()

    if keywords:
        matched_kw_count = sum(1 for kw in keywords if kw.lower() in all_cand_text)
        keyword_score = min(100, max(30, int((matched_kw_count / len(keywords)) * 100)))
    else:
        keyword_score = 75

    # Weighted Overall Score
    # Skill (40%), Experience (20%), Education (15%), Projects (15%), Keyword (10%)
    overall = int(
        (skill_score * 0.40) +
        (exp_score * 0.20) +
        (edu_score * 0.15) +
        (proj_score * 0.15) +
        (keyword_score * 0.10)
    )
    overall = min(100, max(10, overall))

    # Recommendation category
    if overall >= 80:
        recommendation = "Strong Match"
    elif overall >= 60:
        recommendation = "Good Match"
    elif overall >= 40:
        recommendation = "Moderate Match"
    else:
        recommendation = "Weak Match"

    # Identify strengths
    strengths = []
    if skill_score >= 75:
        strengths.append(f"Strong alignment in core technologies: {', '.join(matched_skills[:3]) if matched_skills else 'essential skills'}")
    if edu_score >= 85 and cand_edu:
        strengths.append(f"Educational background ({cand_edu[0]}) directly satisfies criteria")
    if cand_proj:
        strengths.append(f"Demonstrated practical hands-on projects ({cand_proj[0][:45]}...)")
    if not strengths:
        strengths.append("Foundational software engineering aptitude and relevant learning curve")

    # Construct actionable gaps
    gaps = []
    gap_suggestions = {
        "aws": "Learn core AWS deployment concepts (ECS, Lambda, S3) to improve cloud readiness.",
        "docker": "Familiarize with containerization and Dockerfile best practices.",
        "kubernetes": "Review Kubernetes pod architecture and Helm chart deployments.",
        "kafka": "Explore real-time streaming architectures and Kafka consumers/producers.",
        "fastapi": "Build a sample asynchronous REST API service using FastAPI.",
        "ci/cd": "Set up a sample GitHub Actions pipeline for testing and build verification."
    }
    for m in missing_skills[:4]:
        m_lower = m.lower()
        matched_sugg = None
        for k, v in gap_suggestions.items():
            if k in m_lower:
                matched_sugg = f"⚠ {m}: {v}"
                break
        if not matched_sugg:
            matched_sugg = f"⚠ {m}: Review basic concepts and documentation to bridge this requirement."
        gaps.append(matched_sugg)

    if not gaps:
        gaps.append("No critical skill deficiencies detected. Focus on interview readiness and system design depth.")

    return {
        "overall_score": overall,
        "skill_match": skill_score,
        "experience_match": exp_score,
        "education_match": edu_score,
        "project_match": proj_score,
        "keyword_match": keyword_score,
        "matched_skills": list(dict.fromkeys(matched_skills)),
        "missing_skills": list(dict.fromkeys(missing_skills)),
        "strengths": strengths,
        "gaps": gaps,
        "recommendation": recommendation
    }


async def compare_profiles(candidate_profile: Dict[str, Any], job_profile: Dict[str, Any]) -> Dict[str, Any]:
    """Match Agent: compares candidate and job profiles with deterministic scoring."""
    # Deterministic scoring is calculated directly to prevent arbitrary score invention
    return calculate_match(candidate_profile, job_profile)
