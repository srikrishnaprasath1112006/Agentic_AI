import pytest
import pymupdf as fitz
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.pdf_service import extract_text_from_pdf_bytes
from backend.agents.resume_agent import fallback_extract_resume, parse_resume
from backend.agents.job_agent import fallback_extract_job, parse_job_description
from backend.agents.match_agent import calculate_match
from backend.graph.workflow import copilot_app

client = TestClient(app)


def test_root_endpoint():
    """Test GET / endpoint returns running status."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Job Application Copilot API is running" in data["message"]


def test_health_endpoint():
    """Test GET /health returns healthy status."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_pdf_extraction():
    """Test PDF text extraction with PyMuPDF."""
    doc = fitz.open()
    page = doc.new_page()
    sample_text = (
        "Alex Morgan\n"
        "alex@example.com | San Francisco, CA\n\n"
        "EDUCATION\n"
        "B.S. in Computer Science - University of California, Berkeley\n\n"
        "SKILLS\n"
        "Python, PyTorch, FastAPI, Docker, SQL, Machine Learning\n\n"
        "EXPERIENCE\n"
        "Machine Learning Engineer at CloudScale AI (2022 - Present)\n"
        "- Developed and deployed computer vision models for automated defect inspection.\n\n"
        "PROJECTS\n"
        "Autonomous Agent Pipeline: Built an end-to-end multi-agent system using Python."
    )
    page.insert_text((50, 50), sample_text)
    pdf_bytes = doc.tobytes()
    doc.close()

    extracted = extract_text_from_pdf_bytes(pdf_bytes, filename="test_resume.pdf")
    assert "Alex Morgan" in extracted
    assert "Python" in extracted
    assert "Computer Science" in extracted


def test_resume_parsing():
    """Test Resume Agent extraction."""
    resume_text = """
    Jane Doe
    jane.doe@example.com
    
    Education:
    Master of Science in Artificial Intelligence - Stanford University
    
    Skills:
    Python, TensorFlow, PyTorch, Kubernetes, AWS, REST APIs
    
    Experience:
    Senior AI Engineer at NeuraTech (2021 - Present)
    
    Projects:
    Neural Search Engine with vector embeddings
    """
    profile = fallback_extract_resume(resume_text)
    assert profile["name"] is not None
    assert len(profile["skills"]) > 0
    assert "Python" in profile["skills"]
    assert len(profile["education"]) > 0


def test_job_parsing():
    """Test Job Agent extraction."""
    job_description = """
    AI/ML Engineer
    Company: Apex AI Labs
    Location: Remote
    Experience: 3+ years
    
    Requirements:
    - Strong proficiency in Python, PyTorch, and FastAPI
    - Experience deploying ML models to AWS using Docker and Kubernetes
    - Good knowledge of SQL and REST APIs
    
    Responsibilities:
    - Build scalable inference microservices
    - Maintain automated training pipelines
    """
    job_profile = fallback_extract_job(job_description)
    assert "AI/ML Engineer" in job_profile["title"]
    assert "Python" in job_profile["required_skills"] or "Python" in job_profile["preferred_skills"]
    assert len(job_profile["responsibilities"]) > 0


def test_match_score_calculation():
    """Test deterministic matching logic."""
    candidate = {
        "name": "Jane Doe",
        "skills": ["Python", "PyTorch", "FastAPI", "Docker", "SQL", "Git"],
        "education": ["Master of Science in Computer Science"],
        "experience": ["ML Engineer at TechCorp (2 years)"],
        "projects": ["Built real-time recommendation API using FastAPI and PyTorch"]
    }
    job = {
        "title": "Machine Learning Engineer",
        "required_skills": ["Python", "PyTorch", "FastAPI", "SQL"],
        "preferred_skills": ["Docker", "AWS", "Kubernetes"],
        "education": ["Bachelor's or Master's in Computer Science"],
        "experience": "2+ years",
        "keywords": ["Python", "PyTorch", "FastAPI", "Machine Learning"]
    }
    result = calculate_match(candidate, job)
    assert 0 <= result["overall_score"] <= 100
    assert result["overall_score"] >= 75  # Strong alignment
    assert "Strong Match" in result["recommendation"] or "Good Match" in result["recommendation"]
    assert len(result["matched_skills"]) > 0
    assert "Python" in result["matched_skills"]
    assert len(result["strengths"]) > 0
    assert len(result["gaps"]) > 0


@pytest.mark.asyncio
async def test_langgraph_workflow_execution():
    """Test complete LangGraph orchestrator."""
    resume_text = "Sarah Connor\nB.S. Computer Science\nSkills: Python, FastAPI, SQL\nExperience: Software Engineer at Cyberdyne"
    job_text = "Backend Developer at TechCo. Requirements: Python, FastAPI, Docker, SQL."

    initial_state = {
        "resume_text": resume_text,
        "job_description": job_text
    }
    final_state = await copilot_app.ainvoke(initial_state)
    assert "candidate_profile" in final_state
    assert "job_profile" in final_state
    assert "match_result" in final_state
    assert "career_result" in final_state
    assert final_state["match_result"]["overall_score"] > 0
