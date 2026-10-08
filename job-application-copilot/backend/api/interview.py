import logging
from fastapi import APIRouter, HTTPException
from backend.models.schemas import InterviewEvaluateRequest, InterviewEvaluateResponse
from backend.services.ai_service import ai_service

logger = logging.getLogger("copilot.interview")
router = APIRouter(prefix="/api/interview", tags=["Interview"])


def fallback_evaluate_answer(question: str, answer: str) -> dict:
    """Deterministic evaluation of interview answer based on length, structure, and keywords."""
    ans = answer.strip()
    words = ans.split()
    word_count = len(words)

    if word_count < 10:
        return {
            "score": 45,
            "communication_score": 45,
            "technical_score": 50,
            "relevance_score": 55,
            "strengths": ["Quick initial response"],
            "improvements": [
                "Your answer is too brief. Provide context, specific actions taken, and outcomes.",
                "Structure your reply using the STAR method (Situation, Task, Action, Result)."
            ],
            "feedback": "Your response is too concise for an interview setting. Expand on your technical role, tools used, and measurable results."
        }

    # Heuristic scoring based on response quality indicators
    comm_score = min(95, max(60, 65 + (15 if word_count > 30 else 5) + (10 if any(punct in ans for punct in [".", ",", ";"]) else 0)))
    relevance_score = min(96, max(65, 70 + (15 if any(kw in ans.lower() for kw in ["project", "team", "model", "pipeline", "challenge", "built", "implemented"]) else 5)))
    tech_score = min(95, max(60, 68 + (18 if any(t in ans.lower() for t in ["python", "api", "data", "system", "performance", "test", "scale", "optimize"]) else 0)))

    overall = int((comm_score * 0.3) + (tech_score * 0.35) + (relevance_score * 0.35))

    strengths = [
        "Clear and professional communication style.",
        "Demonstrated familiarity with engineering principles and problem-solving."
    ]
    if word_count > 40:
        strengths.append("Thorough depth and context provided in the response.")

    improvements = []
    if "metric" not in ans.lower() and "%" not in ans and "percent" not in ans:
        improvements.append("Incorporate quantifiable metrics or specific measurable outcomes to make your impact concrete.")
    if word_count < 35:
        improvements.append("Elaborate on trade-offs or technical decisions made during the project.")
    if not improvements:
        improvements.append("Consider touching upon how you validated edge cases or monitored the solution post-deployment.")

    feedback = f"Solid answer that effectively touches upon the core question. To make it stand out to hiring managers, highlight your specific individual contribution and back it with a measurable business or performance metric."

    return {
        "score": overall,
        "communication_score": comm_score,
        "technical_score": tech_score,
        "relevance_score": relevance_score,
        "strengths": strengths,
        "improvements": improvements,
        "feedback": feedback
    }


@router.post("/evaluate", response_model=InterviewEvaluateResponse)
async def evaluate_interview_answer(payload: InterviewEvaluateRequest):
    """Evaluate candidate interview response with constructive feedback and multidimensional scoring."""
    question = payload.question.strip()
    answer = payload.answer.strip()

    if not question:
        raise HTTPException(status_code=400, detail="Interview question cannot be empty.")
    if not answer:
        raise HTTPException(status_code=400, detail="Answer cannot be empty.")

    if not ai_service.is_configured():
        eval_result = fallback_evaluate_answer(question, answer)
        return InterviewEvaluateResponse(
            **eval_result,
            is_demo_mode=True
        )

    prompt = f"""You are an expert technical interviewer evaluating a job candidate's answer.

Question:
\"{question}\"

Candidate Answer:
\"{answer}\"

Job Context:
\"{payload.job_description[:400] if payload.job_description else 'Standard engineering role'}\"

Evaluate the answer thoroughly and return JSON matching this schema:
{{
  "score": 84,
  "communication_score": 82,
  "technical_score": 86,
  "relevance_score": 91,
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Improvement tip 1", "Improvement tip 2"],
  "feedback": "Concise 2-sentence actionable coaching advice."
}}
"""
    system_prompt = "You are an encouraging but rigorous technical hiring manager providing constructive feedback."

    try:
        data = await ai_service.generate_json(prompt, system_prompt=system_prompt)
        return InterviewEvaluateResponse(
            score=int(data.get("score", 80)),
            communication_score=int(data.get("communication_score", 80)),
            technical_score=int(data.get("technical_score", 82)),
            relevance_score=int(data.get("relevance_score", 85)),
            strengths=data.get("strengths", ["Clear explanation"]),
            improvements=data.get("improvements", ["Include specific metrics"]),
            feedback=data.get("feedback", "Good answer with clear potential."),
            is_demo_mode=False
        )
    except Exception as e:
        logger.warning(f"LLM interview evaluation failed: {e}. Falling back to deterministic rubric.")
        eval_result = fallback_evaluate_answer(question, answer)
        return InterviewEvaluateResponse(
            **eval_result,
            is_demo_mode=True
        )
