import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.resume import router as resume_router
from backend.api.analysis import router as analysis_router
from backend.api.interview import router as interview_router
from backend.services.ai_service import ai_service

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("copilot.main")

app = FastAPI(
    title="Job Application Copilot API",
    description="Agentic AI Career Assistant Backend powered by LangGraph",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routers
app.include_router(resume_router)
app.include_router(analysis_router)
app.include_router(interview_router)


@app.get("/")
async def root():
    return {
        "message": "Job Application Copilot API is running",
        "demo_mode": not ai_service.is_configured(),
        "model": ai_service.model if ai_service.is_configured() else "Deterministic Agent Logic (Demo Mode)"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "llm_configured": ai_service.is_configured()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
