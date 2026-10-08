import logging
from langgraph.graph import StateGraph, START, END
from backend.graph.state import CopilotState
from backend.agents.resume_agent import parse_resume
from backend.agents.job_agent import parse_job_description
from backend.agents.match_agent import compare_profiles
from backend.agents.career_agent import generate_career_guidance
from backend.services.ai_service import ai_service

logger = logging.getLogger("copilot.workflow")


async def resume_agent_node(state: CopilotState) -> dict:
    """Analyze resume text and extract candidate profile."""
    logger.info("Executing Resume Agent Node...")
    # If candidate_profile already present, we can reuse it
    if state.get("candidate_profile") and state["candidate_profile"].get("skills"):
        return {"candidate_profile": state["candidate_profile"]}
    profile = await parse_resume(state.get("resume_text", ""))
    return {"candidate_profile": profile}


async def job_agent_node(state: CopilotState) -> dict:
    """Analyze job description and extract requirements."""
    logger.info("Executing Job Agent Node...")
    if state.get("job_profile") and state["job_profile"].get("required_skills"):
        return {"job_profile": state["job_profile"]}
    profile = await parse_job_description(state.get("job_description", ""))
    return {"job_profile": profile}


async def match_agent_node(state: CopilotState) -> dict:
    """Compare candidate profile with job profile and calculate match scores."""
    logger.info("Executing Match Agent Node...")
    match_result = await compare_profiles(
        state.get("candidate_profile", {}),
        state.get("job_profile", {})
    )
    return {"match_result": match_result}


async def career_agent_node(state: CopilotState) -> dict:
    """Generate resume improvements, cover letter, and interview prep questions."""
    logger.info("Executing Career Coach Node...")
    career_result = await generate_career_guidance(
        state.get("candidate_profile", {}),
        state.get("job_profile", {})
    )
    return {
        "career_result": career_result,
        "is_demo_mode": not ai_service.is_configured()
    }


def build_copilot_graph():
    """Build and compile the multi-agent LangGraph workflow."""
    builder = StateGraph(CopilotState)

    builder.add_node("resume_agent", resume_agent_node)
    builder.add_node("job_agent", job_agent_node)
    builder.add_node("match_agent", match_agent_node)
    builder.add_node("career_coach", career_agent_node)

    builder.add_edge(START, "resume_agent")
    builder.add_edge("resume_agent", "job_agent")
    builder.add_edge("job_agent", "match_agent")
    builder.add_edge("match_agent", "career_coach")
    builder.add_edge("career_coach", END)

    return builder.compile()


copilot_app = build_copilot_graph()
