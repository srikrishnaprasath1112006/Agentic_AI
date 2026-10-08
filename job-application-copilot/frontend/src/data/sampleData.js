export const SAMPLE_RESUME_TEXT = `Alex Morgan
alex.morgan@email.example | (555) 234-5678 | San Francisco, CA | github.com/alexmorgan-ai

PROFESSIONAL SUMMARY
Results-driven AI/ML Engineer with 3+ years of experience designing and deploying machine learning pipelines, deep learning models, and scalable backend services. Proven track record of improving inference throughput by 35% and deploying production LLM agents.

TECHNICAL SKILLS
- Languages: Python, SQL, C++, Bash
- ML & AI Frameworks: PyTorch, TensorFlow, Scikit-Learn, Hugging Face, LangChain
- Backend & Cloud: FastAPI, Docker, REST APIs, PostgreSQL, Redis, Git
- Core Domains: Natural Language Processing, Computer Vision, MLOps, CI/CD

PROFESSIONAL EXPERIENCE
Machine Learning Engineer | Apex AI Systems, San Francisco, CA (2022 - Present)
- Engineered scalable ML inference pipelines utilizing Python, PyTorch, and FastAPI, serving 1.2M daily predictions with sub-80ms p95 latency.
- Containerized model training workloads with Docker and orchestrated continuous deployment using GitHub Actions.
- Optimized vector search queries and PostgreSQL data pipelines, improving batch ingestion speeds by 40%.

Associate Software Engineer | DataPulse Labs, San Jose, CA (2021 - 2022)
- Collaborated with engineering teams to develop automated data validation and feature engineering microservices.
- Implemented real-time anomaly detection pipelines using Scikit-Learn and Pandas.

EDUCATION
B.S. in Computer Science | University of California, Berkeley (2017 - 2021)
- Dean's Honors List, Relevant Coursework: Deep Learning, Distributed Systems, Algorithms.

PROJECTS
Autonomous Multi-Agent Workflow Engine
- Developed an open-source agentic workflow framework using Python, FastAPI, and LangChain for automated code generation and validation.
Neural Document Retrieval System
- Implemented semantic search engine using PyTorch and FAISS, achieving 94% retrieval accuracy across 500K documents.`;

export const JOB_ROLE_PRESETS = [
  {
    id: 'ai_engineer',
    title: 'AI / ML Engineer',
    company: 'Apex Innovations Inc.',
    description: `AI/ML Engineer
Company: Apex Innovations Inc.
Location: San Francisco, CA (Hybrid / Remote Option)
Experience Required: 2-4 years

About The Role:
We are looking for an exceptional AI/ML Engineer to join our Core Intelligence team. You will be responsible for building next-generation machine learning inference engines, autonomous agent workflows, and scalable API services that empower enterprise data products.

Key Responsibilities:
- Design, deploy, and monitor scalable machine learning models and LLM agent pipelines in production.
- Architect high-performance backend microservices using Python and FastAPI.
- Collaborate with cloud platform engineers to containerize systems using Docker and optimize deployments on AWS.
- Implement robust unit tests, continuous integration (CI/CD), and latency benchmarks.

Required Qualifications:
- Strong proficiency in Python, PyTorch, and FastAPI with proven experience in production systems.
- Experience with relational databases (PostgreSQL) and RESTful API architecture.
- Demonstrated hands-on experience building machine learning pipelines and deep learning applications.
- Strong problem-solving skills and clean code practices using Git and automated testing.

Preferred / Nice-to-Have:
- Hands-on experience with cloud infrastructure, particularly AWS (ECS, Lambda, S3).
- Knowledge of Docker containerization and Kubernetes cluster management.
- Experience with LangChain, LangGraph, or autonomous agent frameworks.
- Exposure to real-time streaming architectures (Kafka) or vector databases.`
  },
  {
    id: 'software_engineer',
    title: 'Software Developer / Engineer',
    company: 'Nexus Digital Systems',
    description: `Software Engineer / Full-Stack Developer
Company: Nexus Digital Systems
Location: Bangalore / Remote
Experience Required: 1-3 years

About The Role:
We are looking for an ambitious Software Engineer to help build and scale our web applications and backend APIs. You will work closely with engineering leads to develop reliable features, maintain database schemas, and optimize frontend & backend performance.

Key Responsibilities:
- Develop clean, maintainable backend services and REST APIs using Python / Node.js.
- Work with database models (SQL, PostgreSQL, MongoDB) and write efficient queries.
- Participate in agile code reviews, automated testing, and CI/CD deployment pipelines.
- Collaborate with UI engineers to integrate modern interfaces.

Required Qualifications:
- Solid programming foundation in Python, JavaScript, Java, or C++.
- Understanding of Database management (SQL, queries, relational schema design).
- Hands-on project experience with Git version control and RESTful architectures.
- Strong problem-solving mindset and eager curiosity to learn modern tech stacks.

Preferred / Nice-to-Have:
- Experience with Docker containers and cloud hosting.
- Experience building web applications or microservices.`
  },
  {
    id: 'data_analyst',
    title: 'Data Analyst / Scientist',
    company: 'Cortex Analytics',
    description: `Data Analyst / Junior Data Scientist
Company: Cortex Analytics
Location: Hybrid
Experience Required: 1-2 years

About The Role:
Join our analytics team to translate raw business data into actionable dashboards, statistical insights, and machine learning models.

Key Responsibilities:
- Perform exploratory data analysis (EDA) and data cleansing on complex datasets.
- Write advanced SQL queries and build automated data pipelines using Python and Pandas.
- Design interactive visualization dashboards for leadership and stakeholders.
- Build predictive machine learning models using Scikit-Learn.

Required Qualifications:
- Proficiency in Python (Pandas, NumPy, Matplotlib) and SQL.
- Strong analytical and statistical problem-solving abilities.
- Experience presenting insights with data visualization tools.`
  }
];

export const SAMPLE_JOB_DESCRIPTION = JOB_ROLE_PRESETS[0].description;
