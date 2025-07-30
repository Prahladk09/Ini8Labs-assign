from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str

class TokenData(BaseModel):
    user_id: Optional[int] = None

# Document schemas
class DocumentBase(BaseModel):
    filename: str
    size: int
    upload_date: datetime
    patient_id: str

class DocumentCreate(BaseModel):
    patient_id: str

class Document(DocumentBase):
    id: int
    class Config:
        from_attributes = True 