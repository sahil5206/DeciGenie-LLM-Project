# semantic_search.py

import faiss
import pickle
import numpy as np
from sentence_transformers import SentenceTransformer

# Paths
INDEX_PATH = "./faiss_index/clause_index.faiss"
META_PATH = "./faiss_index/metadata.pkl"

# Load FAISS index + metadata
index = faiss.read_index(INDEX_PATH)
with open(META_PATH, "rb") as f:
    metadata = pickle.load(f)

# Load embedding model
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

def search(query, top_k=5):
    # Embed the query
    query_vector = embedding_model.encode([query])
    query_vector = np.array(query_vector).astype('float32')

    # Perform search
    distances, indices = index.search(query_vector, top_k)

    results = []
    for idx in indices[0]:
        results.append(metadata[idx])

    return results

# Example use
if __name__ == "__main__":
    query = "46-year-old male, knee surgery in Pune, 3-month-old insurance policy"
    results = search(query)
    
    print("\nTop Matching Clauses:")
    for i, res in enumerate(results, 1):
        print(f"\nResult {i}:")
        print(f"Source File: {res['source']}")
        print(f"Page No:     {res['page']}")
        print(f"Text:        {res['text'][:300]}...")