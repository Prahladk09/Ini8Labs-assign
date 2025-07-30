# Healthcare Document Management PoC

## Overview
A secure portal for patients and clinicians to upload, view, download, and delete medical documents. Built as a full-stack PoC with Docker Compose orchestration.

## Features
- Upload PDF medical records (max 10MB)
- List, download, and delete documents
- Each file linked to a patient ID
- Secure APIs with mock JWT authentication
- File metadata stored in SQL database
- Local file storage (Docker volume)
- Optional Redis caching

## Tech Stack
- Frontend: React (Vite)
- Backend: FastAPI (Python)
- Database: PostgreSQL (or SQLite for dev)
- Cache: Redis (optional)
- Orchestration: Docker Compose

## Setup Instructions
1. Clone the repo
2. Build and run with Docker Compose:
   ```sh
   docker-compose up --build
   ```
3. Access frontend at http://localhost:3000
4. API available at http://localhost:8000/docs

## Directory Structure
- `frontend/` – React app
- `backend/` – FastAPI app
- `DESIGN.md` – System design document
- `docker-compose.yml`, `Dockerfile` – Orchestration

## Deliverables
- DESIGN.md (system design)
- All source code (frontend, backend)
- Dockerfiles and docker-compose.yml
- README.md (this file)

## API Examples
See DESIGN.md for full API spec and example requests.

## Assumptions
- Mock authentication only (not production secure)
- Local file storage for PoC; can migrate to S3
- No real patient data used

## Screenshots
*(Add screenshots here if desired)* 