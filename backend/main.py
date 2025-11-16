from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import openai
import os
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()


# Initialize FastAPI app
app = FastAPI(title="Enterprise Knowledge Assistant API")

# Configure CORS (allow your React frontend to connect)
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize OpenAI client
openai_api_key = os.environ.get("OPENAI_API_KEY")

# Create OpenAI client instance (v1.x API) - only if API key is available
client = None
if openai_api_key:
    try:
        client = openai.OpenAI(api_key=openai_api_key)
    except Exception as e:
        print(f"Warning: Failed to initialize OpenAI client: {e}")
        client = None
else:
    print("Warning: OPENAI_API_KEY not found. OpenAI features will not work.")

# In-memory storage (temporary; can be replaced by DB later)
documents_db = {}
analytics_db = {
    "total_queries": 0,
    "avg_response_time": 0,
    "top_questions": [],
    "documents_used": {}
}

# -----------------------------
# 📘 Pydantic Models
# -----------------------------
class QueryRequest(BaseModel):
    query: str
    language: str = "en"
    session_id: str

class QueryResponse(BaseModel):
    response: str
    sources: List[str]
    response_time: float

class SummaryRequest(BaseModel):
    document_id: str


# -----------------------------
# 🧠 Helper Functions
# -----------------------------
def chunk_text(text: str, chunk_size: int = 1000) -> List[str]:
    """Split text into manageable chunks."""
    sentences = text.replace('\n', ' ').split('. ')
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        if len(current_chunk) + len(sentence) > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            current_chunk += sentence + ". "
    
    if current_chunk:
        chunks.append(current_chunk.strip())
    
    return chunks


def semantic_search(query: str, documents: dict, top_k: int = 5) -> List[dict]:
    """Simple keyword-based search (replace with embeddings later)."""
    query_words = set(query.lower().split())
    all_chunks = []
    
    for doc_id, doc in documents.items():
        for chunk in doc["chunks"]:
            chunk_words = set(chunk.lower().split())
            score = len(query_words.intersection(chunk_words))
            if score > 0:
                all_chunks.append({
                    "chunk": chunk,
                    "doc_name": doc["name"],
                    "doc_id": doc_id,
                    "score": score
                })
    
    all_chunks.sort(key=lambda x: x["score"], reverse=True)
    return all_chunks[:top_k]


# -----------------------------
# 🚀 API Routes
# -----------------------------
@app.get("/api")
async def root():
    return {"message": "Enterprise Knowledge Assistant API (OpenAI)", "status": "running"}


@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload and process a document."""
    try:
        # Only allow text-based files
        if not file.filename.endswith((".txt", ".md", ".csv")):
            raise HTTPException(status_code=400, detail="Only text-based files (.txt, .md, .csv) are supported.")
        
        content = await file.read()
        text = content.decode('utf-8')

        # Save file locally (optional)
        os.makedirs("uploads", exist_ok=True)
        with open(f"uploads/{file.filename}", "w", encoding="utf-8") as f:
            f.write(text)
        
        doc_id = f"doc_{datetime.now().timestamp()}"
        chunks = chunk_text(text)
        
        documents_db[doc_id] = {
            "id": doc_id,
            "name": file.filename,
            "content": text,
            "chunks": chunks,
            "upload_date": datetime.now().isoformat(),
            "chunk_count": len(chunks)
        }
        
        return {
            "success": True,
            "document_id": doc_id,
            "chunk_count": len(chunks),
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/query", response_model=QueryResponse)
async def query_documents(request: QueryRequest):
    """Query the uploaded documents."""
    start_time = datetime.now()
    
    if not documents_db:
        raise HTTPException(status_code=400, detail="No documents uploaded.")
    
    try:
        # Search relevant chunks
        relevant_chunks = semantic_search(request.query, documents_db, top_k=5)
        
        if not relevant_chunks:
            return QueryResponse(
                response="I couldn't find relevant information in the documents.",
                sources=[],
                response_time=0
            )
        
        # Build context
        context = "\n\n---\n\n".join([
            f"[Source: {chunk['doc_name']}]\n{chunk['chunk']}"
            for chunk in relevant_chunks
        ])
        
        # Language instruction
        language_map = {
            "en": "English",
            "es": "Spanish",
            "fr": "French",
            "de": "German",
            "hi": "Hindi",
            "zh": "Chinese",
            "ja": "Japanese"
        }
        
        language_instruction = ""
        if request.language != "en":
            language_instruction = f"\n\nIMPORTANT: Respond in {language_map.get(request.language, 'English')}."
        
        system_prompt = f"""You are an Enterprise Knowledge Assistant. Answer questions based ONLY on the provided context from company documents. 
If the answer cannot be found in the context, say so clearly. Always cite which document your answer comes from.{language_instruction}
If no relevant information is found, politely inform the user that the information is not available in the uploaded documents."""
        
        # Check if OpenAI client is available
        if not client:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            )
        
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {request.query}"}
            ],
            temperature=0.7
        )
        
        response_text = response.choices[0].message.content
        sources = list(set([chunk["doc_name"] for chunk in relevant_chunks]))
        
        # Response time
        response_time = (datetime.now() - start_time).total_seconds()
        
        # Update analytics
        analytics_db["total_queries"] += 1
        analytics_db["avg_response_time"] = (
            (analytics_db["avg_response_time"] * (analytics_db["total_queries"] - 1) + response_time)
            / analytics_db["total_queries"]
        )
        analytics_db["top_questions"].append({
            "query": request.query,
            "timestamp": datetime.now().isoformat()
        })
        
        for source in sources:
            analytics_db["documents_used"][source] = analytics_db["documents_used"].get(source, 0) + 1
        
        return QueryResponse(
            response=response_text,
            sources=sources,
            response_time=response_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summarize")
async def summarize_document(request: SummaryRequest):
    """Generate a short summary of a document."""
    if request.document_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    try:
        # Check if OpenAI client is available
        if not client:
            raise HTTPException(
                status_code=500, 
                detail="OpenAI API key not configured. Please set OPENAI_API_KEY environment variable."
            )
        
        doc = documents_db[request.document_id]
        content = doc["content"][:8000]  # limit content length
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": f"Please summarize this document in 3-5 bullet points:\n\n{content}"}
            ],
            max_tokens=1000
        )
        
        summary = response.choices[0].message.content
        documents_db[request.document_id]["summary"] = summary
        
        return {"success": True, "summary": summary}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/documents")
async def list_documents():
    """List all uploaded documents."""
    return {"documents": list(documents_db.values())}


@app.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """Delete a document."""
    if document_id not in documents_db:
        raise HTTPException(status_code=404, detail="Document not found.")
    
    del documents_db[document_id]
    return {"success": True, "message": "Document deleted."}


@app.get("/analytics")
async def get_analytics():
    """Get usage analytics."""
    return analytics_db


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "documents_count": len(documents_db),
        "total_queries": analytics_db["total_queries"]
    }


# Serve static files (frontend) if build directory exists
static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "build")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=os.path.join(static_dir, "static")), name="static")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React frontend."""
        # API routes should not be caught here
        if full_path.startswith(("api", "upload", "query", "summarize", "documents", "analytics", "health")):
            raise HTTPException(status_code=404, detail="Not found")
        
        file_path = os.path.join(static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(static_dir, "index.html"))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
