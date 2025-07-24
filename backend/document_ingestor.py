import os
import fitz  # PyMuPDF
import numpy as np
import faiss
import pickle
from sentence_transformers import SentenceTransformer
from docx import Document
import email
from email import policy
from email.parser import BytesParser

# Initialize model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# Where your documents are located
DOC_DIR = "./data/"
FAISS_DIR = "./faiss_index/"
os.makedirs(FAISS_DIR, exist_ok=True)

# To store embeddings and metadata
embeddings = []
metadata = []

def chunk_text(text, max_chunk_size=300):
    # Basic chunking by newlines
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

def extract_text_from_docx(docx_path):
    doc = Document(docx_path)
    full_text = []
    for para in doc.paragraphs:
        full_text.append(para.text)
    return "\n".join(full_text)

def extract_text_from_eml(eml_path):
    with open(eml_path, 'rb') as f:
        msg = BytesParser(policy=policy.default).parse(f)
    # Get the email body (plain text)
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                return part.get_content()
    else:
        return msg.get_content()
    return ""

def ingest_documents():
    for filename in os.listdir(DOC_DIR):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(DOC_DIR, filename)
            doc = fitz.open(pdf_path)
            for page_num, page in enumerate(doc):
                text = page.get_text()
                chunks = chunk_text(text)
                for chunk in chunks:
                    vector = embedding_model.encode(chunk)
                    embeddings.append(vector)
                    metadata.append({
                        "source": filename,
                        "page": page_num + 1,
                        "text": chunk
                    })
        elif filename.endswith(".docx"):
            docx_path = os.path.join(DOC_DIR, filename)
            text = extract_text_from_docx(docx_path)
            chunks = chunk_text(text)
            for idx, chunk in enumerate(chunks):
                vector = embedding_model.encode(chunk)
                embeddings.append(vector)
                metadata.append({
                    "source": filename,
                    "section": idx + 1,
                    "text": chunk
                })
        elif filename.endswith(".eml"):
            eml_path = os.path.join(DOC_DIR, filename)
            text = extract_text_from_eml(eml_path)
            chunks = chunk_text(text)
            for idx, chunk in enumerate(chunks):
                vector = embedding_model.encode(chunk)
                embeddings.append(vector)
                metadata.append({
                    "source": filename,
                    "section": idx + 1,
                    "text": chunk
                })

    print(f"Ingested {len(embeddings)} chunks from documents")

    # Save FAISS index
    if embeddings:
        dim = len(embeddings[0])
        index = faiss.IndexFlatL2(dim)
        index.add(np.array(embeddings).astype('float32'))
        faiss.write_index(index, os.path.join(FAISS_DIR, "clause_index.faiss"))
        # Save metadata alongside FAISS
        with open(os.path.join(FAISS_DIR, "metadata.pkl"), "wb") as f:
            pickle.dump(metadata, f)
    else:
        print("No embeddings found. No index created.")

if __name__ == "__main__":
    ingest_documents()