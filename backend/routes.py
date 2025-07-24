
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from query_parser import parse_query
from semantic_search import search
from llm_reasoner import get_decision
import motor.motor_asyncio
import os
from dotenv import load_dotenv
import json
from typing import List, Optional
import fitz
from docx import Document
import email
from email import policy
from email.parser import BytesParser
from sentence_transformers import SentenceTransformer
import numpy as np
import uuid
from datetime import datetime
import base64

# Add import for db from mongodb.py
from mongodb import db

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

# MongoDB setup (keep for other async uses)
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db_async = client.insurance_llm
queries_col = db_async.queries

router = APIRouter()
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Helper functions for extracting text

def chunk_text(text, max_chunk_size=300):
    chunks = []
    current = ""
    for line in text.split("\n"):
        if len(current) + len(line) < max_chunk_size:
            current += " " + line
        else:
            chunks.append(current.strip())
            current = line
    if current:
        chunks.append(current.strip())
    return chunks

def extract_text_from_docx(docx_file):
    doc = Document(docx_file)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

def extract_text_from_eml(eml_file):
    msg = BytesParser(policy=policy.default).parse(eml_file)
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                return part.get_content()
    else:
        return msg.get_content()
    return ""

def embed_chunks(chunks):
    return [embedding_model.encode(chunk) for chunk in chunks]

@router.post("/analyze-query")
async def analyze_query(
    query: str = Form(...),
    files: Optional[List[UploadFile]] = File(None),
    user_id: Optional[str] = Form(None)
):
    try:
        # If files are uploaded, process them on the fly
        if files:
            all_chunks = []
            all_metadata = []
            for file in files:
                filename = file.filename
                ext = filename.lower().split('.')[-1]
                if ext == "pdf":
                    doc = fitz.open(stream=await file.read(), filetype="pdf")
                    for page_num, page in enumerate(doc):
                        text = page.get_text()
                        chunks = chunk_text(text)
                        for chunk in chunks:
                            all_chunks.append(chunk)
                            all_metadata.append({
                                "source": filename,
                                "page": page_num + 1,
                                "text": chunk
                            })
                elif ext == "docx":
                    text = extract_text_from_docx(file.file)
                    chunks = chunk_text(text)
                    for idx, chunk in enumerate(chunks):
                        all_chunks.append(chunk)
                        all_metadata.append({
                            "source": filename,
                            "section": idx + 1,
                            "text": chunk
                        })
                elif ext == "eml":
                    text = extract_text_from_eml(file.file)
                    chunks = chunk_text(text)
                    for idx, chunk in enumerate(chunks):
                        all_chunks.append(chunk)
                        all_metadata.append({
                            "source": filename,
                            "section": idx + 1,
                            "text": chunk
                        })
                else:
                    continue
            if not all_chunks:
                raise HTTPException(status_code=400, detail="No valid text found in uploaded files.")
            # Embed and search
            chunk_vectors = embed_chunks(all_chunks)
            query_vector = embedding_model.encode([query])[0]
            # Compute cosine similarity
            similarities = np.dot(chunk_vectors, query_vector) / (
                np.linalg.norm(chunk_vectors, axis=1) * np.linalg.norm(query_vector) + 1e-8)
            top_indices = np.argsort(similarities)[-5:][::-1]
            clauses = [all_metadata[i] for i in top_indices]
        else:
            # No files: use prebuilt index (insurance, legal, HR, etc.)
            clauses = search(query, top_k=5)

        parsed = parse_query(query)
        decision_json = get_decision(query, parsed, clauses)

        # Parse the LLM's response as JSON
        try:
            decision_data = json.loads(decision_json)
        except Exception:
            import re
            match = re.search(r'\{.*\}', decision_json, re.DOTALL)
            if match:
                decision_data = json.loads(match.group(0))
            else:
                raise HTTPException(status_code=500, detail="LLM did not return valid JSON.")

        justification = {
            "explanation": decision_data.get("justification", ""),
            "clauses": [
                {"clause": c["text"], "document": c["source"], "page": c.get("page", c.get("section", None))}
                for c in clauses
            ]
        }

        result = {
            "decision": decision_data.get("decision", ""),
            "amount": decision_data.get("amount", 0),
            "justification": justification
        }

        # Generate unique query_id and timestamp
        query_id = str(uuid.uuid4())
        timestamp = datetime.utcnow()
        
        # Insert document with query_id and timestamp (and user_id if provided)
        doc = {
            "query_id": query_id,
            "query": query,
            "timestamp": timestamp,
            **result
        }
        if user_id:
            doc["user_id"] = user_id
        await queries_col.insert_one(doc)
        return JSONResponse(content=result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


# --- User Profile Models and Endpoints ---
class UserProfile(BaseModel):
    name: str
    email: str

@router.put("/api/user/profile-picture")
def update_profile_picture(user_id: str = Query(...), file: UploadFile = File(...)):
    users_col = db["users"]
    user = users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Read and encode file as base64
    file_bytes = file.file.read()
    b64_str = base64.b64encode(file_bytes).decode("utf-8")
    users_col.update_one({"_id": user_id}, {"$set": {"profile_picture": b64_str}})
    return {"message": "Profile picture updated"}

class ChangePasswordRequest(BaseModel):
    user_id: str
    old_password: str
    new_password: str

@router.post("/api/user/change-password")
def change_password(data: ChangePasswordRequest):
    users_col = db["users"]
    user = users_col.find_one({"_id": data.user_id})
    if not user or user.get("password") != data.old_password:
        raise HTTPException(status_code=401, detail="Old password is incorrect")
    users_col.update_one({"_id": data.user_id}, {"$set": {"password": data.new_password}})
    return {"message": "Password changed successfully"}

# Update get and put profile endpoints to include profile_picture
@router.get("/api/user/profile", response_model=UserProfile)
def get_user_profile(user_id: str = Query(...)):
    users_col = db["users"]
    user = users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "profile_picture": user.get("profile_picture", ""),
        "queries_made": user.get("queries_made", 0),
        "last_login": user.get("last_login", ""),
        "created_at": user.get("created_at", "")
    }

@router.put("/api/user/profile", response_model=UserProfile)
def update_user_profile(data: UserProfile, user_id: str = Query(...)):
    users_col = db["users"]
    result = users_col.update_one({"_id": user_id}, {"$set": data.dict()}, upsert=True)
    user = users_col.find_one({"_id": user_id})
    return {
        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "profile_picture": user.get("profile_picture", ""),
        "queries_made": user.get("queries_made", 0),
        "last_login": user.get("last_login", ""),
        "created_at": user.get("created_at", "")
    }

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str

@router.post("/api/user/signup")
def signup_user(data: SignupRequest):
    users_col = db["users"]
    # Check if user already exists
    if users_col.find_one({"email": data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    import uuid
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    user_doc = {
        "_id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password": data.password,  # In production, hash this!
        "profile_picture": "",
        "queries_made": 0,
        "last_login": now,
        "created_at": now
    }
    users_col.insert_one(user_doc)
    return {"message": "Signup successful", "user_id": user_doc["_id"]}

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/api/user/login")
def login_user(data: LoginRequest):
    users_col = db["users"]
    user = users_col.find_one({"email": data.email})
    if not user or user.get("password") != data.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    now = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    users_col.update_one({"_id": user["_id"]}, {"$set": {"last_login": now}})
    return {"message": "Login successful", "user_id": user["_id"]}

@router.get("/api/user/chat-history")
def get_user_chat_history(user_id: str = Query(...), limit: int = 10):
    queries_col = db_async.queries
    # Find recent queries for this user_id, sorted by timestamp descending
    results = list(queries_col.find({"user_id": user_id}).sort("timestamp", -1).limit(limit))
    # Remove MongoDB _id and format timestamp
    for r in results:
        r.pop("_id", None)
        if "timestamp" in r:
            r["timestamp"] = str(r["timestamp"])
    return {"history": results}

