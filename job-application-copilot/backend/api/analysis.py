import logging
from fastapi import APIRouter, HTTPException
from backend.models.schemas import AnalyzeRequest, AnalyzeResponse
from backend.graph.workflow import copilot_app
from backend.services.ai_service import ai_service

logger = logging.getLogger("copilot.analysis")
router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_job(payload: AnalyzeRequest):
    """Run full LangGraph workflow orchestrating Resume, Job, Match, and Career Coach agents."""
    resume_text = payload.resume_text.strip()
    job_description = payload.job_description.strip()

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Resume text is required. Please upload a resume PDF or enter resume details."
        )

    if not job_description:
        raise HTTPException(
            status_code=400,
            detail="Job description is required. Please paste the job description."
        )

    initial_state = {
        "resume_text": resume_text,
        "job_description": job_description,
        "candidate_profile": {},
        "job_profile": {},
        "match_result": {},
        "career_result": {},
        "is_demo_mode": not ai_service.is_configured()
    }

    try:
        final_state = await copilot_app.ainvoke(initial_state)

        return AnalyzeResponse(
            candidate_profile=final_state.get("candidate_profile", {}),
            job_profile=final_state.get("job_profile", {}),
            match_result=final_state.get("match_result", {}),
            career_result=final_state.get("career_result", {}),
            is_demo_mode=not ai_service.is_configured()
        )
    except Exception as e:
        logger.error(f"Error in LangGraph workflow execution: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while analyzing the job opportunity: {str(e)}"
        )
