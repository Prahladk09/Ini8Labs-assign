import os
import tempfile
import shutil
from fastapi.testclient import TestClient
from main import app, DOCUMENTS_DIR
from database import engine
from models import Base
import pytest

client = TestClient(app)

def setup_module(module):
    # Setup temp dir and DB
    if os.path.exists(DOCUMENTS_DIR):
        shutil.rmtree(DOCUMENTS_DIR)
    os.makedirs(DOCUMENTS_DIR, exist_ok=True)
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    shutil.rmtree(DOCUMENTS_DIR)

@pytest.fixture
def token():
    resp = client.post("/token")
    return resp.json()["access_token"]

def test_upload_invalid_file(token):
    resp = client.post(
        "/documents/upload",
        files={"file": ("test.txt", b"not a pdf", "text/plain")},
        data={"patient_id": "p1"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 400
    assert "Only PDF files allowed" in resp.text

def test_upload_and_list(token):
    pdf_bytes = b"%PDF-1.4 test pdf file"
    resp = client.post(
        "/documents/upload",
        files={"file": ("test.pdf", pdf_bytes, "application/pdf")},
        data={"patient_id": "p1"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code == 200
    doc = resp.json()
    assert doc["filename"] == "test.pdf"
    # List
    resp = client.get("/documents", params={"patient_id": "p1"}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    docs = resp.json()
    assert len(docs) >= 1
    assert docs[0]["filename"] == "test.pdf"

def test_delete_document(token):
    pdf_bytes = b"%PDF-1.4 test pdf file"
    # Upload
    resp = client.post(
        "/documents/upload",
        files={"file": ("del.pdf", pdf_bytes, "application/pdf")},
        data={"patient_id": "p2"},
        headers={"Authorization": f"Bearer {token}"}
    )
    doc_id = resp.json()["id"]
    # Delete
    resp = client.delete(f"/documents/{doc_id}", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 200
    assert resp.json()["success"] == True 