# 🚀 Agentic AI — Job Application Copilot

> Multi-Agent Career Assistant built with FastAPI, LangGraph, PyMuPDF, React, Vite, and Tailwind CSS.

For full project documentation, architecture, and setup instructions, see [job-application-copilot/README.md](job-application-copilot/README.md).

---

## Quick Start

### 1. Backend
```powershell
cd job-application-copilot/backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
$env:PYTHONPATH=".."
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend
```powershell
cd job-application-copilot/frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).
