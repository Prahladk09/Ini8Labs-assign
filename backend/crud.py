from sqlalchemy.orm import Session
import models
from datetime import datetime
from schemas import UserCreate
import auth

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Document CRUD operations
def create_document(db: Session, filename: str, storage_key: str, size: int, patient_id: str):
    doc = models.Document(
        filename=filename,
        storage_key=storage_key,
        size=size,
        upload_date=datetime.utcnow(),
        patient_id=patient_id
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    return doc

def get_documents_by_patient(db: Session, patient_id: str):
    return db.query(models.Document).filter(models.Document.patient_id == patient_id).all()

def get_document(db: Session, doc_id: int):
    return db.query(models.Document).filter(models.Document.id == doc_id).first()

def delete_document(db: Session, doc_id: int):
    doc = db.query(models.Document).filter(models.Document.id == doc_id).first()
    if doc:
        db.delete(doc)
        db.commit()
    return doc 