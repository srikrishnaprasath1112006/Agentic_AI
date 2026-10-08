# 🚀 Job Application Copilot

> **An Agentic AI Multi-Agent Career Assistant** built for job seekers and students. Orchestrates specialized AI agents via LangGraph to parse resumes, analyze target job descriptions, compute deterministic match scores, identify skill gaps, polish resume bullet points, compose custom cover letters, and run interactive mock interviews.

---

## 📌 Table of Contents

1. [Overview & Main Goal](#overview--main-goal)
2. [Agentic Architecture & Workflow](#agentic-architecture--workflow)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Installation & Setup](#installation--setup)
7. [Environment Variables](#environment-variables)
8. [Running the Application](#running-the-application)
9. [Workshop Demo Experience (5-Minute Walkthrough)](#workshop-demo-experience-5-minute-walkthrough)
10. [API Endpoints](#api-endpoints)
11. [Testing & Quality Assurance](#testing--quality-assurance)
12. [Responsible AI & Human-in-the-Loop Safety](#responsible-ai--human-in-the-loop-safety)
13. [Future Enhancements](#future-enhancements)

---

## 1. Overview & Main Goal

Preparing high-impact job applications is often stressful, opaque, and time-consuming. **Job Application Copilot** is designed as a clean, polished, and lightweight workshop project that demonstrates modern Agentic AI design patterns in HR/Careers without unnecessary enterprise complexity.

### The Complete User Flow:
```text
Resume Upload (PDF / PyMuPDF)
    │
    ▼
Resume Analysis Agent (Extraction & Skills)
    │
    ▼
Job Description Analysis Agent (Requirements & Qualifications)
    │
    ▼
Match Agent (Deterministic Weighted Scoring)
    │
    ▼
Match Score (Animated Radial) & Skill Gap Analysis
    │
    ▼
Career Coach Agent (Application Kit)
    ├── Resume Improvement Suggestions
    ├── Personalized Cover Letter & Recruiter Pitch
    └── Interview Questions
    │
    ▼
Interactive Mock Interview Coach (Real-time Evaluation & Scoring)
```

---

## 2. Agentic Architecture & Workflow

The system is coordinated by **LangGraph** through a single directed workflow with a unified typed state (`CopilotState`).

```
       ┌───────────────────────┐
       │         START         │
       └───────────┬───────────┘
                   │
                   ▼
       ┌───────────────────────┐
       │   1. Resume Agent     │  Extracts structured profile: name, skills,
       └───────────┬───────────┘  experience, education, projects, achievements.
                   │
                   ▼
       ┌───────────────────────┐
       │    2. Job Agent       │  Extracts job title, company, location,
       └───────────┬───────────┘  required skills, preferred skills, keywords.
                   │
                   ▼
       ┌───────────────────────┐
       │   3. Match Agent      │  Computes deterministic multi-factor match score
       └───────────┬───────────┘  (Skill 40%, Exp 20%, Edu 15%, Proj 15%, KW 10%).
                   │
                   ▼
       ┌───────────────────────┐
       │  4. Career Coach      │  Generates metric-focused resume bullets,
       └───────────┬───────────┘  personalized cover letter, and interview questions.
                   │
                   ▼
       ┌───────────────────────┐
       │          END          │
       └───────────────────────┘
```

### The 4 Specialized Agents:

1. **Resume Agent (`resume_agent.py`)**:
   - Parses raw resume text or extracted PDF pages.
   - Extracts candidate profile strictly from provided text. Never hallucinates details.
2. **Job Analysis Agent (`job_agent.py`)**:
   - Deconstructs job postings into required vs. preferred skills, responsibilities, and key terminology.
3. **Match Agent (`match_agent.py`)**:
   - Calculates a deterministic weighted match score:
     - **Skill Match (40%)**
     - **Experience Match (20%)**
     - **Education Match (15%)**
     - **Project Relevance (15%)**
     - **Keyword Match (10%)**
   - Categorizes fit: *Strong Match (80–100%)*, *Good Match (60–79%)*, *Moderate Match (40–59%)*, *Weak Match (0–39%)*.
   - Identifies exact matched skills vs. actionable skill gaps with AI learning advice.
4. **Career Coach Agent (`career_agent.py`)**:
   - **Resume Improvements**: Reframes weak bullet points using action verbs and measurable impact without inventing facts.
   - **Cover Letter**: Composes a concise, professional cover letter tailored to the job.
   - **Recruiter Message**: Writes a targeted pitch for LinkedIn or email.
   - **Interview Prep**: Synthesizes 3 technical, 2 project, and 2 behavioral questions.

---

## 3. Key Features

- **PyMuPDF PDF Processing**: Safe validation, file type inspection, 10MB limit enforcement, and clean text extraction.
- **Visual Agent Activity Tracker**: Displays real-time status (`pending` → `running` → `completed`) for each agent node.
- **Deterministic Fit Scoring**: Prevents LLM score hallucination by using mathematical weighted scoring.
- **Application Acceleration Kit**: Tabbed interface for resume revisions, cover letter, recruiter message, and questions with 1-click clipboard copy.
- **Interactive AI Mock Interview**: Chat-style interface with immediate multi-dimensional scoring (Communication, Technical, Relevance) and actionable tips.
- **Zero-Config Demo Mode**: Works out of the box without any paid API key! If `LLM_API_KEY` is not provided, the application runs deterministic agent logic and clearly indicates "Demo Mode".

---

## 4. Technology Stack

### Frontend
- **React 19** + **Vite**
- **Tailwind CSS** (v3.4) with glassmorphism styling
- **Lucide React** (modern icons)
- **Framer Motion** (radial score animations, status transitions, card entrances)

### Backend
- **Python 3.13 / 3.10+**
- **FastAPI** (asynchronous REST API)
- **Uvicorn** (ASGI server)
- **Pydantic v2** (schema validation)
- **PyMuPDF (fitz)** (robust PDF text extraction)
- **LangGraph** (multi-agent graph orchestration)
- **httpx** (asynchronous AI service layer)
- **pytest & pytest-asyncio** (automated backend testing)

---

## 5. Project Structure

```text
job-application-copilot/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentActivity.jsx
│   │   │   ├── AnalyzeButton.jsx
│   │   │   ├── CoverLetter.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── InterviewQuestions.jsx
│   │   │   ├── JobInput.jsx
│   │   │   ├── MatchScore.jsx
│   │   │   ├── MockInterview.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── ResumeSuggestions.jsx
│   │   │   ├── ResumeUploader.jsx
│   │   │   ├── SkillGap.jsx
│   │   │   └── SkillMatch.jsx
│   │   ├── data/
│   │   │   └── sampleData.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── backend/
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── resume_agent.py
│   │   ├── job_agent.py
│   │   ├── match_agent.py
│   │   └── career_agent.py
│   │
│   ├── graph/
│   │   ├── __init__.py
│   │   ├── state.py
│   │   └── workflow.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── ai_service.py
│   │   └── pdf_service.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── resume.py
│   │   ├── analysis.py
│   │   └── interview.py
│   │
│   ├── main.py
│   ├── requirements.txt
│   └── .env.example
│
├── data/
│   └── sample_resume.pdf
├── tests/
│   └── test_backend.py
├── README.md
└── .gitignore
```

---

## 6. Installation & Setup

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.13)
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Setup Backend
Open a terminal in `job-application-copilot/backend`:

```powershell
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1    # On Windows
# source venv/bin/activate     # On macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 2. Setup Frontend
Open a terminal in `job-application-copilot/frontend`:

```powershell
npm install
```

---

## 7. Environment Variables

### Backend Configuration (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:

```env
# Optional: Set your OpenAI, Gemini, or OpenRouter API key.
# If left blank, the app will automatically run in Demo Mode.
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
# LLM_BASE_URL=https://api.openai.com/v1
```

### Frontend Configuration (`frontend/.env`)
Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

---

## 8. Running the Application

### Start the Backend
From `job-application-copilot`:
```powershell
.\backend\venv\Scripts\python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI documentation is available at [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

### Start the Frontend
From `job-application-copilot/frontend`:
```powershell
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 9. Workshop Demo Experience (5-Minute Walkthrough)

To present this workshop project in 5 minutes without setup hurdles:

1. **Launch App**: Open `http://localhost:5173`.
2. **One-Click Demo**: Click the **"✨ Try Demo"** button in the navbar.
   - Automatically loads a realistic fictional AI/ML Engineer resume for *Alex Morgan*.
   - Automatically populates the target job description.
3. **Trigger Workflow**: Click **"🚀 Analyze My Job"**.
4. **Agent Workflow Visualization**: Watch the animated **COPILOT WORKING** progress card:
   - `Resume Agent` analyzes candidate background.
   - `Job Agent` extracts role requirements.
   - `Match Agent` calculates deterministic fit.
   - `Career Coach` produces application assets.
5. **Inspect Fit Score**:
   - View the animated radial gauge (~85% **Strong Match**).
   - Review dimensional breakdown: Skills, Experience, Education, Projects, Keywords.
6. **Examine Skills & Gaps**:
   - See green **YOU HAVE** badges (Python, PyTorch, FastAPI, etc.).
   - Review **SKILL GAPS** with specific advice (e.g. AWS concepts).
7. **Explore Application Kit**:
   - Switch between **Resume Improvements**, **Cover Letter**, and **Interview Prep**.
   - Copy any snippet with one click.
8. **Test Mock Interview**:
   - Click the **Mock Interview** tab and click **"Start Interview"**.
   - Type a response to an interview question and submit.
   - Observe instantaneous scoring (Communication, Technical, Relevance) with personalized feedback.

---

## 10. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and active LLM / Demo Mode indicator |
| `GET` | `/health` | Healthcheck and configuration status |
| `POST` | `/api/resume/upload` | Uploads PDF, validates size, extracts text & profile |
| `POST` | `/api/analyze` | Executes LangGraph multi-agent workflow |
| `POST` | `/api/interview/evaluate` | Evaluates candidate answer and provides coaching |

---

## 11. Testing & Quality Assurance

### Run Backend Automated Tests
From `job-application-copilot`:
```powershell
$env:PYTHONPATH="."
.\backend\venv\Scripts\pytest -v tests/test_backend.py
```

Included tests:
- `test_root_endpoint`: Verifies root welcome message.
- `test_health_endpoint`: Verifies API health reporting.
- `test_pdf_extraction`: Generates in-memory PDF and tests PyMuPDF extraction.
- `test_resume_parsing`: Validates Resume Agent structured extraction.
- `test_job_parsing`: Validates Job Agent requirement extraction.
- `test_match_score_calculation`: Verifies deterministic scoring ranges and categories.
- `test_langgraph_workflow_execution`: Runs the full multi-agent state graph pipeline.

### Build Frontend
From `job-application-copilot/frontend`:
```powershell
npm run build
```

---

## 12. Responsible AI & Human-in-the-Loop Safety

- **No Hallucinated Credentials**: The Resume and Career Agents never invent degrees, employers, or skills that are absent from candidate input.
- **No Automatic Applications**: The system deliberately **does not** automatically submit applications or contact employers. All materials require human review and submission.
- **Strictly Non-Discriminatory**: Candidate evaluation is strictly confined to professional and technical qualifications. Demographics, age, gender, race, religion, and other sensitive personal attributes are never extracted or evaluated.
- **Clear Advisory Notice**: All match calculations and career suggestions are presented with an explicit advisory disclaimer.

---

## 13. Future Enhancements

- Audio input for spoken mock interview responses via Web Speech API.
- Support for multi-lingual resume and job description parsing.
- Integration with external ATS resume formatting guidelines (LaTeX / Docx export).
- Graph persistence via LangGraph checkpoints for long-term career progress tracking.

---

*Crafted for the Agentic AI Workshop • Pair Programmed with Antigravity*
