from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status, Response
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import shutil
import uuid
import models, schemas, crud, deps, auth
from database import engine
from datetime import timedelta
import asyncio

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DOCUMENTS_DIR = os.getenv("DOCUMENTS_DIR", "documents")
os.makedirs(DOCUMENTS_DIR, exist_ok=True)

# Optional Redis cache
try:
    import aioredis
    REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")
    redis = asyncio.get_event_loop().run_until_complete(aioredis.from_url(REDIS_URL, decode_responses=True))
except Exception:
    redis = None

@app.post("/signup", response_model=schemas.Token)
def signup(user: schemas.UserCreate, db: Session = Depends(deps.get_db)):
    # Check if username already exists
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Check if email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password strength (minimum 8 characters)
    if len(user.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )
    
    # Create new user
    db_user = crud.create_user(db=db, user=user)
    
    # Create access token
    access_token = auth.create_access_token(
        data={"user_id": db_user.id}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": db_user.id,
        "username": db_user.username
    }

@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(deps.get_db)):
    # Authenticate user
    user = auth.authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user account"
        )
    
    # Create access token
    access_token = auth.create_access_token(
        data={"user_id": user.id}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }

@app.post("/documents/upload", response_model=schemas.Document)
def upload_document(
    file: UploadFile = File(...),
    patient_id: str = Form(...),
    db: Session = Depends(deps.get_db),
    current_user=Depends(auth.get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files allowed.")
    contents = file.file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB).")
    file.file.seek(0)
    storage_key = str(uuid.uuid4()) + ".pdf"
    file_path = os.path.join(DOCUMENTS_DIR, storage_key)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    doc = crud.create_document(
        db,
        filename=file.filename,
        storage_key=storage_key,
        size=len(contents),
        patient_id=patient_id
    )
    # Invalidate cache for this patient
    if redis:
        asyncio.get_event_loop().run_until_complete(redis.delete(f"docs:{patient_id}"))
    return doc

@app.get("/documents", response_model=list[schemas.Document])
def list_documents(
    patient_id: str,
    db: Session = Depends(deps.get_db),
    current_user=Depends(auth.get_current_user)
):
    cache_key = f"docs:{patient_id}"
    if redis:
        cached = asyncio.get_event_loop().run_until_complete(redis.get(cache_key))
        if cached:
            import json
            return json.loads(cached)
    docs = crud.get_documents_by_patient(db, patient_id)
    if redis:
        import json
        asyncio.get_event_loop().run_until_complete(redis.set(cache_key, json.dumps([d.__dict__ for d in docs]), ex=60))
    return docs

@app.get("/documents/{doc_id}/download")
def download_document(
    doc_id: int,
    db: Session = Depends(deps.get_db),
    current_user=Depends(auth.get_current_user)
):
    cache_key = f"docfile:{doc_id}"
    doc = None
    if redis:
        cached = asyncio.get_event_loop().run_until_complete(redis.get(cache_key))
        if cached:
            import json
            doc = json.loads(cached)
    if not doc:
        db_doc = crud.get_document(db, doc_id)
        if not db_doc:
            raise HTTPException(status_code=404, detail="Document not found.")
        doc = {"filename": db_doc.filename, "storage_key": db_doc.storage_key}
        if redis:
            import json
            asyncio.get_event_loop().run_until_complete(redis.set(cache_key, json.dumps(doc), ex=60))
    file_path = os.path.join(DOCUMENTS_DIR, doc["storage_key"])
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing.")
    return FileResponse(file_path, media_type="application/pdf", filename=doc["filename"])

@app.delete("/documents/{doc_id}")
def delete_document(
    doc_id: int,
    db: Session = Depends(deps.get_db),
    current_user=Depends(auth.get_current_user)
):
    doc = crud.get_document(db, doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    file_path = os.path.join(DOCUMENTS_DIR, doc.storage_key)
    if os.path.exists(file_path):
        os.remove(file_path)
    crud.delete_document(db, doc_id)
    # Invalidate cache
    if redis:
        asyncio.get_event_loop().run_until_complete(redis.delete(f"docs:{doc.patient_id}"))
        asyncio.get_event_loop().run_until_complete(redis.delete(f"docfile:{doc_id}"))
    return {"success": True} 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True) 