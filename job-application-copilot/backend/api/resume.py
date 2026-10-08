from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.services.pdf_service import process_pdf_upload
from backend.agents.resume_agent import parse_resume
from backend.services.ai_service import ai_service
from backend.models.schemas import ResumeUploadResponse

router = APIRouter(prefix="/api/resume", tags=["Resume"])


@router.post("/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...)):
    """Upload resume PDF, validate file, extract text, and extract structured candidate profile."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only PDF resumes are supported."
        )

    extracted_text = await process_pdf_upload(file)

    if not extracted_text or len(extracted_text.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract readable text from this PDF. Please upload a text-based resume."
        )

    candidate_profile = await parse_resume(extracted_text)

    return ResumeUploadResponse(
        filename=file.filename,
        text_length=len(extracted_text),
        extracted_text=extracted_text,
        candidate_profile=candidate_profile,
        is_demo_mode=not ai_service.is_configured()
    )
