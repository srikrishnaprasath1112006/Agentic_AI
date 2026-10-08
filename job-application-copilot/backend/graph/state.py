from typing import TypedDict, Dict, Any, Optional


class CopilotState(TypedDict, total=False):
    resume_text: str
    job_description: str
    candidate_profile: Dict[str, Any]
    job_profile: Dict[str, Any]
    match_result: Dict[str, Any]
    career_result: Dict[str, Any]
    is_demo_mode: bool
